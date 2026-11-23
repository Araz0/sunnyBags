import React from 'react'
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { getConnections, useConnections } from '../connections'
import { bagThumb, getBag, isDue } from '../helpers'
import { buildAutoPlan } from '../planner'
import { automatedPlatforms, describeSync, lastInstagramSync, publishPost, refreshInstagramStats, syncFromInstagram } from '../publish'
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

const MOBILE_TABS = [
  { to: '/studio', label: 'Home', icon: <DashboardOutlinedIcon /> },
  { to: '/studio/queue', label: 'Queue', icon: <ViewListOutlinedIcon />, badge: true },
  { to: '/studio/calendar', label: 'Calendar', icon: <CalendarMonthOutlinedIcon /> },
  { to: '/studio/library', label: 'Bags', icon: <GridViewOutlinedIcon /> },
]

const Logo = () => (
  <Box sx={{ width: 32, height: 32, flexShrink: 0, borderRadius: 2, bgcolor: 'primary.main', color: '#fff', display: 'grid', placeItems: 'center' }}>
    <WbSunnyOutlinedIcon fontSize="small" />
  </Box>
)

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

  // Instagram auto-sync: on open and every 30 minutes while the studio is open.
  // Checks off planned posts that were posted by hand, records new feed posts,
  // and refreshes likes/comments.
  const syncing = React.useRef(false)
  React.useEffect(() => {
    const run = async () => {
      const c = getConnections()
      if (!c.autoSync || !c.meta.igUserId || !c.meta.pageToken || syncing.current) return
      if (Date.now() - lastInstagramSync() < 30 * 60000) return
      syncing.current = true
      try {
        const r = await syncFromInstagram(c, studioActions.exportData().posts)
        const msg = describeSync(r)
        if (msg) setToastMsg(msg)
        await refreshInstagramStats(c, studioActions.exportData().posts)
      } catch {
        /* offline or token issue — the Connections page shows details on Test */
      } finally {
        syncing.current = false
      }
    }
    run()
    const t = setInterval(run, 5 * 60000)
    const onFocus = () => document.visibilityState === 'visible' && run()
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      clearInterval(t)
      document.removeEventListener('visibilitychange', onFocus)
    }
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
  const [moreAnchor, setMoreAnchor] = React.useState<HTMLElement | null>(null)
  const mobileTab =
    MOBILE_TABS.find((t) => (t.to === '/studio' ? location.pathname === '/studio' : location.pathname.startsWith(t.to)))?.to ??
    (inEditor ? '/studio/library' : 'more')

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
          {/* ── Mobile top bar ──────────────────────────────────── */}
          <Box
            component="header"
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.25,
              pt: 'calc(10px + env(safe-area-inset-top))',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Logo />
            <Typography fontWeight={800} flex={1} noWrap>
              {inEditor ? 'Bag editor' : NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))?.label ?? 'Studio'}
            </Typography>
            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => ui.openEditor()}>
              Post
            </Button>
          </Box>

          {/* ── Desktop sidebar ─────────────────────────────────── */}
          <Box
            component="nav"
            sx={{
              display: { xs: 'none', md: 'flex' },
              width: 240,
              flexShrink: 0,
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'sticky',
              top: 0,
              height: '100vh',
              flexDirection: 'column',
              p: 2,
              zIndex: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1, mb: 3 }}>
              <Logo />
              <Box>
                <Typography fontWeight={800} lineHeight={1.1}>
                  SunnyBags
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Content Studio
                </Typography>
              </Box>
            </Stack>

            <Button variant="contained" startIcon={<AddIcon />} onClick={() => ui.openEditor()} sx={{ mb: 2 }}>
              New post
            </Button>

            <Stack spacing={0.5}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, borderRadius: 2, bgcolor: 'action.selected', fontWeight: 600, fontSize: '0.9rem' }}>
                  <BrushOutlinedIcon fontSize="small" /> Editor
                </Box>
              )}
            </Stack>

            <Box flex={1} />
            <Divider sx={{ my: 2 }} />
            <Button color="inherit" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
              Back to shop
            </Button>
          </Box>

          {/* ── Main ────────────────────────────────────────────── */}
          <Box
            component="main"
            sx={{
              flex: 1,
              minWidth: 0,
              px: { xs: 2, sm: 3, lg: 4 },
              pt: { xs: 2, sm: 3, lg: 4 },
              // room for the bottom tab bar on phones
              pb: { xs: 'calc(88px + env(safe-area-inset-bottom))', md: 4 },
            }}
          >
            <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
              <Outlet />
            </Box>
          </Box>

          {/* ── Mobile bottom tabs ──────────────────────────────── */}
          <Paper
            elevation={8}
            square
            sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 20, pb: 'env(safe-area-inset-bottom)' }}
          >
            <BottomNavigation
              showLabels
              value={mobileTab}
              onChange={(_, v: string) => (v === 'more' ? setMoreAnchor(document.getElementById('studio-more-tab')) : navigate(v))}
              sx={{ height: 64, bgcolor: 'background.paper' }}
            >
              {MOBILE_TABS.map((t) => (
                <BottomNavigationAction
                  key={t.to}
                  value={t.to}
                  label={t.label}
                  icon={
                    t.badge ? (
                      <Badge color="warning" badgeContent={due.length} max={9}>
                        {t.icon}
                      </Badge>
                    ) : (
                      t.icon
                    )
                  }
                  sx={{ minWidth: 0, px: 0.5, '& .MuiBottomNavigationAction-label': { fontSize: '0.7rem !important', mt: 0.25 } }}
                />
              ))}
              <BottomNavigationAction
                id="studio-more-tab"
                value="more"
                label="More"
                icon={<MoreHorizIcon />}
                sx={{ minWidth: 0, px: 0.5, '& .MuiBottomNavigationAction-label': { fontSize: '0.7rem !important', mt: 0.25 } }}
              />
            </BottomNavigation>
          </Paper>
          <Menu
            anchorEl={moreAnchor}
            open={!!moreAnchor}
            onClose={() => setMoreAnchor(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            {NAV.filter((n) => !MOBILE_TABS.some((t) => t.to === n.to)).map((n) => (
              <MenuItem
                key={n.to}
                selected={location.pathname.startsWith(n.to)}
                onClick={() => {
                  setMoreAnchor(null)
                  navigate(n.to)
                }}
                sx={{ py: 1.5, minWidth: 200 }}
              >
                <ListItemIcon>{n.icon}</ListItemIcon>
                {n.label}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={() => navigate('/')} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <ArrowBackIcon fontSize="small" />
              </ListItemIcon>
              Back to shop
            </MenuItem>
          </Menu>
        </Box>

        <PostEditorDialog request={editorReq} onClose={() => setEditorReq(null)} onSaved={ui.toast} />
        <PublishDialog postId={publishId} onClose={() => setPublishId(null)} onDone={ui.toast} />
        <Snackbar
          open={!!toastMsg}
          message={toastMsg}
          autoHideDuration={3500}
          onClose={() => setToastMsg(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ bottom: { xs: 'calc(80px + env(safe-area-inset-bottom)) !important', md: '24px !important' } }}
        />
      </StudioUiContext.Provider>
    </ThemeProvider>
  )
}
