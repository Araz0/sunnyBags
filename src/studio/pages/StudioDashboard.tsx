import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Grid, LinearProgress, Stack, Typography } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import { allBags } from '../../data'
import { bagImage, fmtDateTime, fmtRelative, getBag, isDue, postingStreak, startOfWeek } from '../helpers'
import { buildAutoPlan, pickBags } from '../planner'
import { studioActions, useNow, useStudioData } from '../store'
import { BagThumb, PageHead, Panel, PlatformDots, Stat } from '../ui/bits'
import { useStudioUi } from '../ui/context'
import { PostRow } from '../ui/PostRow'
import { SchedulerActions } from '../ui/SchedulerActions'

export const StudioDashboard: React.FC = () => {
  const { posts, settings } = useStudioData()
  const now = useNow()
  const ui = useStudioUi()
  const navigate = useNavigate()

  const weekStart = startOfWeek(new Date(now)).getTime()
  const weekEnd = weekStart + 7 * 86400000
  const postedThisWeek = posts.filter(
    (p) => p.status === 'posted' && !p.imported && p.postedAt && new Date(p.postedAt).getTime() >= weekStart,
  ).length
  const plannedThisWeek = posts.filter((p) => {
    const t = new Date(p.scheduledAt).getTime()
    return p.status === 'scheduled' && t >= now && t < weekEnd
  }).length
  const upcoming = posts
    .filter((p) => p.status === 'scheduled' && !isDue(p, now))
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
  const due = posts.filter((p) => isDue(p, now)).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
  const next = due[0] ?? upcoming[0]
  const nextBag = next ? getBag(next.bagId) : undefined
  const streak = postingStreak(posts, settings.weeklyGoal)
  const postedIds = new Set(posts.filter((p) => p.status === 'posted').map((p) => p.bagId))
  const unsold = allBags.all.filter((b) => b.available !== false)
  const neverPosted = unsold.filter((b) => !postedIds.has(b.id)).length
  const ideas = React.useMemo(() => pickBags(posts, 4, { includePosted: settings.includePosted }), [posts, settings.includePosted])
  const top = posts
    .filter((p) => p.status === 'posted' && p.stats)
    .sort((a, b) => b.stats!.likes + b.stats!.comments * 3 - (a.stats!.likes + a.stats!.comments * 3))
    .slice(0, 5)
  const goalPct = Math.min(100, (postedThisWeek / Math.max(1, settings.weeklyGoal)) * 100)

  const autoPlan = (weeks: number) => {
    const plan = buildAutoPlan(settings, posts, weeks)
    if (!plan.length) {
      ui.toast('Your schedule is already full for that period')
      return
    }
    studioActions.addPosts(plan)
    ui.toast(`Planned ${plan.length} post${plan.length > 1 ? 's' : ''} ✨`)
  }

  const hour = new Date(now).getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <PageHead
        title={`${greeting} ☀️`}
        subtitle={
          due.length
            ? `You have ${due.length} post${due.length > 1 ? 's' : ''} waiting to go out.`
            : upcoming.length
              ? `Next post ${fmtRelative(upcoming[0].scheduledAt, now)}. You're on track.`
              : 'Nothing scheduled yet — let the studio plan your week.'
        }
        actions={<SchedulerActions />}
      />

      {due.length > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 3, borderRadius: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => ui.openPublish(due[0].id)}>
              Post now
            </Button>
          }
        >
          Bag #{due[0].bagId} was planned for {fmtDateTime(due[0].scheduledAt)}. It takes about 2 minutes.
        </Alert>
      )}

      <Stack direction="row" gap={2} flexWrap="wrap" mb={3}>
        <Paper2 label="This week's goal">
          <Typography sx={{ fontSize: '1.9rem', fontWeight: 750, lineHeight: 1.2, mt: 0.5 }}>
            {postedThisWeek}
            <Typography component="span" color="text.secondary" fontWeight={600}>
              {' '}
              / {settings.weeklyGoal}
            </Typography>
          </Typography>
          <LinearProgress variant="determinate" value={goalPct} color={goalPct >= 100 ? 'success' : 'primary'} sx={{ mt: 1, height: 6, borderRadius: 3 }} />
        </Paper2>
        <Stat
          label="Streak"
          value={
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <span>{streak}</span>
              <LocalFireDepartmentIcon sx={{ color: streak ? '#f2a93b' : 'text.disabled' }} />
            </Stack>
          }
          hint={streak === 1 ? 'week hitting your goal' : 'weeks hitting your goal'}
        />
        <Stat label="Planned this week" value={plannedThisWeek} hint="still to go out" />
        <Stat label="Never posted" value={neverPosted} hint={`of ${unsold.length} available bags`} />
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Stack spacing={3}>
            <Panel title={due.length ? 'Up now' : 'Next up'}>
              {next && nextBag ? (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                  <Box
                    sx={{
                      width: { xs: '100%', sm: 180 },
                      aspectRatio: '4/5',
                      bgcolor: next.design.bgColor,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      border: 1,
                      borderColor: 'divider',
                      flexShrink: 0,
                    }}
                  >
                    <img src={bagImage(nextBag, next.design.side === 'B' ? 'B' : 'A')} alt="" style={{ maxWidth: '88%', maxHeight: '88%', objectFit: 'contain' }} />
                  </Box>
                  <Stack spacing={1} flex={1} minWidth={0}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h2">Bag #{next.bagId}</Typography>
                      <PlatformDots platforms={next.platforms} />
                    </Stack>
                    <Typography color="text.secondary" variant="body2">
                      {fmtDateTime(next.scheduledAt)} · {fmtRelative(next.scheduledAt, now)}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {next.caption}
                    </Typography>
                    <Stack direction="row" spacing={1} pt={1}>
                      <Button variant="contained" startIcon={<SendOutlinedIcon />} onClick={() => ui.openPublish(next.id)}>
                        Open publish assistant
                      </Button>
                      <Button color="inherit" onClick={() => ui.openEditor({ post: next })}>
                        Edit
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              ) : (
                <Stack alignItems="flex-start" spacing={1.5}>
                  <Typography color="text.secondary">
                    Your queue is empty. Pick your posting days in Settings, then let the studio fill the next weeks with varied bags and ready-made captions.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={<AutoAwesomeIcon />} onClick={() => autoPlan(2)}>
                      Plan my next 2 weeks
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/studio/settings')}>
                      Posting schedule
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Panel>

            <Panel
              title="Upcoming"
              action={
                <Button size="small" onClick={() => navigate('/studio/queue')}>
                  View queue
                </Button>
              }
            >
              <Stack spacing={1}>
                {[...due.slice(1), ...upcoming].slice(0, 6).map((p) => (
                  <PostRow key={p.id} post={p} now={now} compact />
                ))}
                {upcoming.length + due.length <= 1 && (
                  <Typography color="text.secondary" variant="body2">
                    No more posts planned.
                  </Typography>
                )}
              </Stack>
            </Panel>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Panel
            title="Bags to feature next"
            action={
              <Button size="small" onClick={() => navigate('/studio/library')}>
                Library
              </Button>
            }
          >
            <Typography variant="body2" color="text.secondary" mb={2}>
              Picked for variety: least recently posted first, rotating collections.
            </Typography>
            <Stack spacing={1.25}>
              {ideas.map((b) => (
                <Stack key={b.id} direction="row" spacing={1.5} alignItems="center">
                  <BagThumb bag={b} size={52} />
                  <Box flex={1} minWidth={0}>
                    <Typography fontWeight={700} fontSize="0.92rem">
                      Bag #{b.id} · {b.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {b.description}
                    </Typography>
                  </Box>
                  <Button size="small" variant="outlined" onClick={() => ui.openEditor({ bagId: b.id })}>
                    Schedule
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Panel>

          {top.length > 0 && (
            <Box mt={3}>
              <Panel title="Best performing">
                <Stack spacing={1.25}>
                  {top.map((p) => {
                    const b = getBag(p.bagId)
                    const url = p.publishLog?.find((l) => l.ok && l.platform === 'instagram' && l.url)?.url
                    return (
                      <Stack key={p.id} direction="row" spacing={1.5} alignItems="center">
                        <BagThumb bag={b} size={44} />
                        <Box flex={1} minWidth={0}>
                          <Typography fontWeight={700} fontSize="0.9rem">
                            Bag #{p.bagId}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ♥ {p.stats!.likes} · 💬 {p.stats!.comments} · {fmtRelative(p.postedAt ?? p.scheduledAt, now)}
                          </Typography>
                        </Box>
                        {url && (
                          <Button size="small" href={url} target="_blank" rel="noreferrer">
                            View
                          </Button>
                        )}
                      </Stack>
                    )
                  })}
                </Stack>
              </Panel>
            </Box>
          )}
        </Grid>
      </Grid>
    </>
  )
}

const Paper2: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <Box sx={{ p: 2.25, borderRadius: 3, flex: 1, minWidth: 150, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
    <Typography variant="body2" color="text.secondary" fontWeight={600}>
      {label}
    </Typography>
    {children}
  </Box>
)
