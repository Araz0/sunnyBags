import React from 'react'
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  Divider,
  Snackbar,
  Stack,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import { getConnections, useConnections } from '../connections'
import { bagThumb, getBag, isDue } from '../helpers'
import { buildAutoPlan } from '../planner'
import { automatedPlatforms, publishPost, refreshInstagramStats } from '../publish'
import { studioActions, useNow, useStudioData } from '../store'
import { makeStudioTheme } from './theme'
import { EditorRequest, StudioUiContext } from './context'
import { PostEditorDialog } from './PostEditorDialog'
import { PublishDialog } from './PublishDialog'

const NAV = [
  { to: '/studio', label: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="small" />, end: true },
  { to: '/studio/calendar', label: 'Calendar', icon: <CalendarMonthOutlinedIcon fontSize="small" /> },
  { to: '/studio/queue', label: 'Queue', icon: <ViewListOutlinedIcon fontSize="small" />, badge: true },
  { to: '/studio/library', label: 'Bag library', icon: <GridViewOutlinedIcon fontSize="small" /> },
  { to: '/studio/settings', label: 'Settings', icon: <TuneOutlinedIcon fontSize="small" /> },
  { to: '/studio/connections', label: 'Connections', icon: <HubOutlinedIcon fontSize="small" /> },
  { to: '/studio/guide', label: 'Guide', icon: <MenuBookOutlinedIcon fontSize="small" /> },
]

export const StudioLayout: React.FC = () => {
  const dark = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = React.useMemo(() => makeStudioTheme(dark), [dark])
  const { posts, settings } = useStudioData()
  const now = useNow()
  const location = useLocation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const [editorReq, setEditorReq] = React.useState<EditorRequest | null>(null)
  const [publishId, setPublishId] = React.useState<string | null>(null)
  const [toastMsg, setToastMsg] = React.useState<string | null>(null)

  const due = posts.filter((p) => isDue(p, now))

  // Deep link from calendar reminders: /studio/queue?post=<id>
  React.useEffect(() => {
    const id = params.get('post')
    if (id && posts.some((p) => p.id === id)) {
      setPublishId(id)
      params.delete('post')
      setParams(params, { replace: true })
    }
  }, [params, posts, setParams])

  // Browser notifications while the studio is open
  const notified = React.useRef(new Set<string>())
  React.useEffect(() => {
    if (!settings.notifications || !('Notification' in window) || Notification.permission !== 'granted') return
    due
      .filter((p) => now - new Date(p.scheduledAt).getTime() < 6 * 3600000)
      .forEach((p) => {
        if (notified.current.has(p.id)) return
        notified.current.add(p.id)
        const bag = getBag(p.bagId)
        const n = new Notification(`Time to post Bag #${p.bagId} ☀️`, {
          body: bag?.description?.slice(0, 120),
          icon: bag ? bagThumb(bag) : undefined,
          tag: p.id,
        })
        n.onclick = () => {
          window.focus()
          setPublishId(p.id)
        }
      })
  }, [due, now, settings.notifications])

  // Auto scheduler: keep the queue filled N weeks ahead
  React.useEffect(() => {
    if (!settings.autoFillWeeks) return
    // Read the live store, not the render snapshot, so a re-run can't double-book slots.
    const plan = buildAutoPlan(settings, studioActions.exportData().posts, settings.autoFillWeeks)
    if (plan.length) {
      studioActions.addPosts(plan)
      setToastMsg(`Auto scheduler added ${plan.length} post${plan.length > 1 ? 's' : ''}`)
    }
    // posts.length is enough: re-run when posts are added/removed, not on every edit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.autoFillWeeks, settings.postingDays, settings.postingTime, posts.length])

  // Auto-publish: send due posts through connected APIs while the studio is open
  const connections = useConnections()
  const publishing = React.useRef(new Set<string>())
  React.useEffect(() => {
    if (!connections.autoPublish) return
    due
      .filter((p) => !p.autoAttemptedAt && !publishing.current.has(p.id))
      .filter((p) => automatedPlatforms(p, connections).length > 0)
      .forEach((p) => {
        publishing.current.add(p.id)
        publishPost(p, getConnections())
          .then((log) => {
            const failed = log.filter((l) => !l.ok)
            setToastMsg(
              failed.length
                ? `Auto-publish of Bag #${p.bagId} failed on ${failed.map((f) => f.platform).join(', ')}`
                : `Bag #${p.bagId} published automatically 🚀`,
            )
          })
          .catch((e: Error) => {
            studioActions.updatePost(p.id, { autoAttemptedAt: new Date().toISOString() })
            setToastMsg(`Auto-publish failed: ${e.message}`)
          })
          .finally(() => publishing.current.delete(p.id))
      })
  }, [due, connections])

  // Refresh Instagram likes/comments at most every 6 hours when the studio opens
  React.useEffect(() => {
    const c = getConnections()
    if (!c.meta.igUserId || !c.meta.pageToken) return
    const KEY = 'sunnybags_studio_stats_at'
    let last = 0
    try {
      last = Number(localStorage.getItem(KEY)) || 0
    } catch {
      /* ignore */
    }
    if (Date.now() - last < 6 * 3600000) return
    try {
      localStorage.setItem(KEY, String(Date.now()))
    } catch {
      /* ignore */
    }
    refreshInstagramStats(c, studioActions.exportData().posts).catch(() => undefined)
  }, [])

  // Tab title shows how many posts are waiting
  React.useEffect(() => {
    const prev = document.title
    document.title = due.length ? `(${due.length}) Studio · SunnyBags` : 'Studio · SunnyBags'
    return () => {
      document.title = prev
    }
  }, [due.length])

  const ui = React.useMemo(
    () => ({
      openEditor: (req: EditorRequest = {}) => setEditorReq(req),
      openPublish: (id: string) => setPublishId(id),
      toast: (m: string) => setToastMsg(m),
    }),
    [],
  )

  const inEditor = /^\/item\/\d+\/studio/.test(location.pathname)

  return (
    <ThemeProvider theme={theme}>
      <StudioUiContext.Provider value={ui}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: '100vh',
            width: '100%',
            bgcolor: 'background.default',
            color: 'text.primary',
            // tokens for the legacy editor panels
            '--bg': theme.palette.background.default,
            '--panel': theme.palette.background.paper,
            '--surface': theme.palette.background.paper,
            '--text': theme.palette.text.primary,
            '--border': theme.palette.divider,
            '--input-border': theme.palette.divider,
            '--accent': theme.palette.primary.main,
            '--accent-hover': theme.palette.primary.dark,
            '--ok': theme.palette.success.main,
            '--ok-hover': theme.palette.success.dark,
            '--muted': theme.palette.text.secondary,
          }}
        >
          {/* ── Sidebar ─────────────────────────────────────────── */}
          <Box
            component="nav"
            sx={{
              width: { md: 240 },
              flexShrink: 0,
              borderRight: { md: 1 },
              borderBottom: { xs: 1, md: 0 },
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: { md: 'sticky' },
              top: 0,
              height: { md: '100vh' },
              display: 'flex',
              flexDirection: 'column',
              p: { xs: 1.5, md: 2 },
              zIndex: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1, mb: { xs: 1, md: 3 } }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: 'primary.main', color: '#fff', display: 'grid', placeItems: 'center' }}>
                <WbSunnyOutlinedIcon fontSize="small" />
              </Box>
              <Box>
                <Typography fontWeight={800} lineHeight={1.1}>
                  SunnyBags
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Content Studio
                </Typography>
              </Box>
              <Box flex={1} />
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => ui.openEditor()}
                sx={{ display: { md: 'none' } }}
              >
                Post
              </Button>
            </Stack>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => ui.openEditor()}
              sx={{ mb: 2, display: { xs: 'none', md: 'flex' } }}
            >
              New post
            </Button>

            <Stack
              direction={{ xs: 'row', md: 'column' }}
              spacing={0.5}
              sx={{ overflowX: 'auto', mx: { xs: -0.5, md: 0 } }}
            >
              {NAV.map((n) => (
                <Box
                  key={n.to}
                  component={NavLink}
                  to={n.to}
                  end={n.end}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                    '&.active': { bgcolor: 'action.selected', color: 'text.primary' },
                  }}
                >
                  {n.badge ? (
                    <Badge color="warning" badgeContent={due.length} max={9}>
                      {n.icon}
                    </Badge>
                  ) : (
                    n.icon
                  )}
                  {n.label}
                </Box>
              ))}
              {inEditor && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: 'action.selected',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <BrushOutlinedIcon fontSize="small" /> Editor
                </Box>
              )}
            </Stack>

            <Box flex={1} />
            <Divider sx={{ my: 2, display: { xs: 'none', md: 'block' } }} />
            <Button
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{ justifyContent: 'flex-start', color: 'text.secondary', display: { xs: 'none', md: 'flex' } }}
            >
              Back to shop
            </Button>
          </Box>

          {/* ── Main ────────────────────────────────────────────── */}
          <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, sm: 3, lg: 4 } }}>
            <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
              <Outlet />
            </Box>
          </Box>
        </Box>

        <PostEditorDialog request={editorReq} onClose={() => setEditorReq(null)} onSaved={ui.toast} />
        <PublishDialog postId={publishId} onClose={() => setPublishId(null)} onDone={ui.toast} />
        <Snackbar
          open={!!toastMsg}
          message={toastMsg}
          autoHideDuration={2800}
          onClose={() => setToastMsg(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </StudioUiContext.Provider>
    </ThemeProvider>
  )
}
