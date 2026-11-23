import React from 'react'
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Link as RouterLink } from 'react-router-dom'
import { LANGUAGES, WEEKDAYS } from '../constants'
import { getConnections, useConnections } from '../connections'
import { categoryName, getBag, startOfDay } from '../helpers'
import { insightsError, refreshInstagramStats } from '../publish'
import { studioActions, useStudioData } from '../store'
import { ScheduledPost } from '../types'
import { BagThumb, PageHead, Panel, Stat } from '../ui/bits'
import { useStudioUi } from '../ui/context'

type Range = 30 | 90 | 0
type SortKey = 'date' | 'views' | 'reach' | 'likes' | 'comments' | 'saved' | 'shares' | 'eng'

const fmt = (n: number | undefined) =>
  n == null ? '–' : n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : Math.round(n).toLocaleString()
const pct = (n: number | undefined) => (n == null || !isFinite(n) ? '–' : `${(n * 100).toFixed(1)}%`)

/** Interactions per reach; falls back to likes+comments+saves+shares. */
const engagement = (p: ScheduledPost) => {
  const s = p.stats
  if (!s?.reach) return undefined
  const inter = s.interactions ?? s.likes + s.comments + (s.saved ?? 0) + (s.shares ?? 0)
  return inter / s.reach
}

/** The number posts are ranked by: views when available, otherwise likes + comments. */
const score = (p: ScheduledPost) => p.stats?.views ?? (p.stats ? p.stats.likes + p.stats.comments : 0)

/** Ranked single-series bars. One hue, values in text ink, hover for detail. */
const BarList: React.FC<{ rows: { label: string; value: number; n: number }[]; unit: string; empty: string }> = ({ rows, unit, empty }) => {
  const max = Math.max(1, ...rows.map((r) => r.value))
  if (!rows.length)
    return (
      <Typography variant="body2" color="text.secondary">
        {empty}
      </Typography>
    )
  return (
    <Stack spacing={0.75}>
      {rows.map((r) => (
        <Tooltip key={r.label} title={`${r.label}: ${fmt(r.value)} ${unit} on average · ${r.n} post${r.n === 1 ? '' : 's'}`} placement="top">
          <Box sx={{ display: 'grid', gridTemplateColumns: '92px 1fr 52px', alignItems: 'center', gap: 1, py: 0.5, cursor: 'default' }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {r.label}
            </Typography>
            <Box sx={{ height: 12, bgcolor: 'action.hover', borderRadius: '0 4px 4px 0' }}>
              <Box
                sx={{
                  height: '100%',
                  width: `${Math.max(2, (r.value / max) * 100)}%`,
                  bgcolor: 'primary.main',
                  borderRadius: '0 4px 4px 0',
                  transition: 'width .3s',
                }}
              />
            </Box>
            <Typography variant="body2" fontWeight={700} textAlign="right">
              {fmt(r.value)}
            </Typography>
          </Box>
        </Tooltip>
      ))}
    </Stack>
  )
}

const avgBy = (posts: ScheduledPost[], key: (p: ScheduledPost) => string, order?: string[]) => {
  const m = new Map<string, { sum: number; n: number }>()
  posts.forEach((p) => {
    const k = key(p)
    const e = m.get(k) ?? { sum: 0, n: 0 }
    e.sum += score(p)
    e.n++
    m.set(k, e)
  })
  const rows = [...m.entries()].map(([label, e]) => ({ label, value: e.sum / e.n, n: e.n }))
  return order ? order.filter((o) => m.has(o)).map((o) => rows.find((r) => r.label === o)!) : rows.sort((a, b) => b.value - a.value)
}

export const StudioInsights: React.FC = () => {
  const { posts } = useStudioData()
  const connections = useConnections()
  const ui = useStudioUi()
  const [range, setRange] = React.useState<Range>(90)
  const [sort, setSort] = React.useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'views', dir: 'desc' })
  const [busy, setBusy] = React.useState(false)
  const igReady = !!(connections.meta.igUserId && connections.meta.pageToken)
  const err = insightsError()

  const since = range ? startOfDay(new Date()).getTime() - range * 86400000 : 0
  const measured = posts.filter(
    (p) => p.status === 'posted' && p.stats && new Date(p.postedAt ?? p.scheduledAt).getTime() >= since,
  )
  const hasViews = measured.some((p) => p.stats?.views != null)
  const unit = hasViews ? 'views' : 'likes + comments'

  const sum = (f: (p: ScheduledPost) => number | undefined) => measured.reduce((a, p) => a + (f(p) ?? 0), 0)
  const totalViews = sum((p) => p.stats?.views)
  const totalReach = sum((p) => p.stats?.reach)
  const totalInter = sum((p) => p.stats?.interactions ?? (p.stats ? p.stats.likes + p.stats.comments + (p.stats.saved ?? 0) + (p.stats.shares ?? 0) : 0))
  const withReach = measured.filter((p) => p.stats?.reach)

  const byWeekday = avgBy(measured, (p) => WEEKDAYS[new Date(p.postedAt ?? p.scheduledAt).getDay()], [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ])
  const byHour = avgBy(
    measured,
    (p) => {
      const h = new Date(p.postedAt ?? p.scheduledAt).getHours()
      return h < 11 ? 'Morning' : h < 15 ? 'Midday' : h < 19 ? 'Afternoon' : 'Evening'
    },
    ['Morning', 'Midday', 'Afternoon', 'Evening'],
  )
  const byCollection = avgBy(measured, (p) => categoryName(getBag(p.bagId)?.category_id ?? -1)).slice(0, 8)
  const byLanguage = avgBy(
    measured.filter((p) => p.language),
    (p) => LANGUAGES.find((l) => l.id === p.language)?.label ?? 'English',
  )
  const bestDay = [...byWeekday].sort((a, b) => b.value - a.value)[0]
  const bestTime = [...byHour].sort((a, b) => b.value - a.value)[0]

  const value = (p: ScheduledPost, k: SortKey): number => {
    const s = p.stats
    switch (k) {
      case 'date':
        return new Date(p.postedAt ?? p.scheduledAt).getTime()
      case 'eng':
        return engagement(p) ?? -1
      case 'views':
        return s?.views ?? -1
      case 'reach':
        return s?.reach ?? -1
      case 'saved':
        return s?.saved ?? -1
      case 'shares':
        return s?.shares ?? -1
      default:
        return s?.[k] ?? -1
    }
  }
  const rows = [...measured].sort((a, b) => (value(a, sort.key) - value(b, sort.key)) * (sort.dir === 'asc' ? 1 : -1))

  const refresh = async () => {
    setBusy(true)
    try {
      const n = await refreshInstagramStats(getConnections(), studioActions.exportData().posts, { force: true })
      ui.toast(n ? `Updated ${n} post${n > 1 ? 's' : ''}` : 'No Instagram posts to update yet')
    } catch (e) {
      ui.toast((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const head = (k: SortKey, label: string) => (
    <TableCell align={k === 'date' ? 'left' : 'right'} sortDirection={sort.key === k ? sort.dir : false} sx={{ whiteSpace: 'nowrap', fontWeight: 700 }}>
      <TableSortLabel active={sort.key === k} direction={sort.key === k ? sort.dir : 'desc'} onClick={() => setSort({ key: k, dir: sort.key === k && sort.dir === 'desc' ? 'asc' : 'desc' })}>
        {label}
      </TableSortLabel>
    </TableCell>
  )

  return (
    <>
      <PageHead
        title="Insights"
        subtitle="How your Instagram posts perform. Updated automatically while the studio is open."
        actions={
          <>
            <ToggleButtonGroup size="small" exclusive value={range} onChange={(_, v: Range | null) => v !== null && setRange(v)}>
              <ToggleButton value={30}>30 days</ToggleButton>
              <ToggleButton value={90}>90 days</ToggleButton>
              <ToggleButton value={0}>All</ToggleButton>
            </ToggleButtonGroup>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={refresh} disabled={!igReady || busy}>
              {busy ? 'Refreshing…' : 'Refresh'}
            </Button>
          </>
        }
      />

      {!igReady && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
          Connect Instagram in{' '}
          <Link component={RouterLink} to="/studio/connections">
            Connections
          </Link>{' '}
          to see performance.
        </Alert>
      )}
      {igReady && err && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
          Likes and comments work, but views, reach, saves and shares need the <strong>instagram_manage_insights</strong> permission on your
          token. Add it and generate a new token (
          <Link component={RouterLink} to="/studio/guide#meta">
            Guide → Meta setup
          </Link>
          ).
        </Alert>
      )}

      <Stack direction="row" gap={2} flexWrap="wrap" mb={3}>
        <Stat label="Posts measured" value={measured.length} hint={range ? `last ${range} days` : 'all time'} />
        <Stat label="Views" value={hasViews ? fmt(totalViews) : '–'} hint={hasViews ? `${fmt(totalViews / Math.max(1, measured.length))} per post` : 'needs insights permission'} />
        <Stat label="Engagement rate" value={withReach.length ? pct(totalInter / Math.max(1, totalReach)) : '–'} hint="interactions ÷ reach" />
        <Stat label="Saves + shares" value={fmt(sum((p) => (p.stats?.saved ?? 0) + (p.stats?.shares ?? 0)))} hint="strongest signal of interest" />
        <Stat label="Follows from posts" value={fmt(sum((p) => p.stats?.follows))} hint={`${fmt(sum((p) => p.stats?.profileVisits))} profile visits`} />
      </Stack>

      {measured.length >= 3 && bestDay && bestTime && (
        <Alert severity="success" variant="outlined" sx={{ mb: 3, borderRadius: 3 }}>
          Your posts do best on <strong>{bestDay.label}</strong> in the <strong>{bestTime.label.toLowerCase()}</strong> ({fmt(bestDay.value)} {unit} on
          average). Consider making it a posting day in Settings.
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        <Panel title={`Average ${unit} by weekday`}>
          <BarList rows={byWeekday} unit={unit} empty="No measured posts yet." />
        </Panel>
        <Panel title={`Average ${unit} by time of day`}>
          <BarList rows={byHour} unit={unit} empty="No measured posts yet." />
        </Panel>
        <Panel title={`Average ${unit} by collection`}>
          <BarList rows={byCollection} unit={unit} empty="No measured posts yet." />
        </Panel>
        <Panel title={`Average ${unit} by caption language`}>
          <BarList rows={byLanguage} unit={unit} empty="Only posts made from the studio know their language." />
        </Panel>
      </Box>

      <Panel title="All posts" pad={0}>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Bag</TableCell>
                {head('date', 'Posted')}
                {head('views', 'Views')}
                {head('reach', 'Reach')}
                {head('likes', 'Likes')}
                {head('comments', 'Comments')}
                {head('saved', 'Saves')}
                {head('shares', 'Shares')}
                {head('eng', 'Engagement')}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((p) => {
                const bag = getBag(p.bagId)
                const url = p.publishLog?.find((l) => l.ok && l.platform === 'instagram' && l.url)?.url
                return (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <BagThumb bag={bag} size={32} radius={6} />
                        {url ? (
                          <Link href={url} target="_blank" rel="noreferrer" fontWeight={700} underline="hover" color="text.primary">
                            #{p.bagId}
                          </Link>
                        ) : (
                          <Typography fontWeight={700} variant="body2">
                            #{p.bagId}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {new Date(p.postedAt ?? p.scheduledAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: '2-digit' })}
                    </TableCell>
                    <TableCell align="right">{fmt(p.stats?.views)}</TableCell>
                    <TableCell align="right">{fmt(p.stats?.reach)}</TableCell>
                    <TableCell align="right">{fmt(p.stats?.likes)}</TableCell>
                    <TableCell align="right">{fmt(p.stats?.comments)}</TableCell>
                    <TableCell align="right">{fmt(p.stats?.saved)}</TableCell>
                    <TableCell align="right">{fmt(p.stats?.shares)}</TableCell>
                    <TableCell align="right">{pct(engagement(p))}</TableCell>
                  </TableRow>
                )
              })}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Typography variant="body2" color="text.secondary" py={2}>
                      No measured posts in this period. Stats appear after a post is published or synced from Instagram.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Panel>
      <Paper variant="outlined" sx={{ mt: 2, p: 1.5, borderRadius: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Views = times your post was seen (incl. repeats). Reach = unique accounts. Engagement = likes, comments, saves and shares divided by reach.
          Instagram only reports views/reach for business or creator accounts, and numbers can lag by up to 48 hours.
        </Typography>
      </Paper>
    </>
  )
}
