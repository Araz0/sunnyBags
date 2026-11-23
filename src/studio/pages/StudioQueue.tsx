import React from 'react'
import { Button, LinearProgress, Stack, Tab, Tabs, Typography } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import SyncIcon from '@mui/icons-material/Sync'
import InsightsIcon from '@mui/icons-material/Insights'
import { getConnections, useConnections } from '../connections'
import { describeSync, lastInstagramSync, refreshInstagramStats, syncFromInstagram } from '../publish'
import { fmtRelative } from '../helpers'
import { studioActions } from '../store'
import { buildIcs, downloadBlob } from '../ics'
import { isDue, startOfWeek } from '../helpers'
import { useNow, useStudioData } from '../store'
import { ScheduledPost } from '../types'
import { PageHead, Panel } from '../ui/bits'
import { useStudioUi } from '../ui/context'
import { PostRow } from '../ui/PostRow'
import { SchedulerActions } from '../ui/SchedulerActions'

type TabId = 'upcoming' | 'drafts' | 'history'
const WEEK = 7 * 86400000

export const StudioQueue: React.FC = () => {
  const { posts } = useStudioData()
  const now = useNow()
  const ui = useStudioUi()
  const [tab, setTab] = React.useState<TabId>('upcoming')
  const connections = useConnections()
  const igReady = !!(connections.meta.igUserId && connections.meta.pageToken)
  const [syncing, setSyncing] = React.useState<'sync' | 'stats' | null>(null)

  const sync = async () => {
    setSyncing('sync')
    try {
      const r = await syncFromInstagram(getConnections(), studioActions.exportData().posts, { full: true })
      ui.toast(describeSync(r) || `Instagram sync: ${r.scanned} posts checked, everything was already up to date`)
    } catch (e) {
      ui.toast(`Sync failed: ${(e as Error).message}`)
    } finally {
      setSyncing(null)
    }
  }

  const stats = async () => {
    setSyncing('stats')
    try {
      const n = await refreshInstagramStats(getConnections(), studioActions.exportData().posts, { force: true })
      ui.toast(n ? `Updated views, likes & comments for ${n} post${n > 1 ? 's' : ''}` : 'No Instagram posts published via the studio yet')
    } catch (e) {
      ui.toast(`Couldn't load stats: ${(e as Error).message}`)
    } finally {
      setSyncing(null)
    }
  }

  const byDate = (a: ScheduledPost, b: ScheduledPost) => a.scheduledAt.localeCompare(b.scheduledAt)
  const weekStart = startOfWeek(new Date(now)).getTime()
  const inThisWeek = (p: ScheduledPost) => {
    const t = new Date(p.scheduledAt).getTime()
    return t >= weekStart && t < weekStart + WEEK
  }

  const real = posts.filter((p) => !p.imported)
  // This week's checklist: everything planned for this week, done or not.
  const thisWeek = real.filter((p) => inThisWeek(p) && (p.status === 'scheduled' || p.status === 'posted')).sort(byDate)
  const weekDone = thisWeek.filter((p) => p.status === 'posted').length
  const overdue = real.filter((p) => isDue(p, now) && !inThisWeek(p)).sort(byDate)
  const later = real.filter((p) => p.status === 'scheduled' && !inThisWeek(p) && !isDue(p, now)).sort(byDate)
  const drafts = real.filter((p) => p.status === 'draft').sort(byDate)
  const history = posts
    .filter((p) => p.status === 'posted' || p.status === 'skipped')
    .sort((a, b) => (b.postedAt ?? b.scheduledAt).localeCompare(a.postedAt ?? a.scheduledAt))
  const scheduledCount = real.filter((p) => p.status === 'scheduled').length

  const exportIcs = () => {
    const list = real.filter((p) => p.status === 'scheduled').sort(byDate)
    if (!list.length) {
      ui.toast('Nothing scheduled to export')
      return
    }
    downloadBlob(buildIcs(list, window.location.origin), 'sunnybags-posting-plan.ics', 'text/calendar')
    ui.toast('Calendar file downloaded — open it to add reminders')
  }

  const section = (title: React.ReactNode, list: ScheduledPost[], empty: string) => (
    <Panel title={title}>
      <Stack spacing={1}>
        {list.map((p) => (
          <PostRow key={p.id} post={p} now={now} />
        ))}
        {!list.length && (
          <Typography variant="body2" color="text.secondary">
            {empty}
          </Typography>
        )}
      </Stack>
    </Panel>
  )

  return (
    <>
      <PageHead
        title="Queue"
        subtitle="Tick posts off as you go — progress is saved in this browser."
        actions={
          <>
            <SchedulerActions />
            <Button color="inherit" startIcon={<EventIcon />} onClick={exportIcs}>
              Calendar reminders
            </Button>
          </>
        }
      />
      <Tabs value={tab} onChange={(_, v: TabId) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }} variant="scrollable">
        <Tab value="upcoming" label={`Scheduled (${scheduledCount})`} />
        <Tab value="drafts" label={`Drafts (${drafts.length})`} />
        <Tab value="history" label={`History (${history.length})`} />
      </Tabs>

      <Stack spacing={3}>
        {tab === 'upcoming' && (
          <>
            {overdue.length > 0 && section(`Missed (${overdue.length})`, overdue, '')}
            {section(
              <Stack flex={1} spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h3">This week</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {weekDone} / {thisWeek.length} done
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={thisWeek.length ? (weekDone / thisWeek.length) * 100 : 0}
                  color={thisWeek.length && weekDone === thisWeek.length ? 'success' : 'primary'}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Stack>,
              thisWeek,
              'Nothing planned this week. Use Auto-schedule to fill it.',
            )}
            {section(`Later (${later.length})`, later, 'Nothing scheduled after this week.')}
          </>
        )}
        {tab === 'drafts' && section('Drafts', drafts, 'No drafts. Drafts are ideas that won’t remind you until scheduled.')}
        {tab === 'history' && (
          <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
            <Button variant="outlined" startIcon={<SyncIcon />} onClick={sync} disabled={!igReady || !!syncing}>
              {syncing === 'sync' ? 'Syncing…' : 'Sync from Instagram'}
            </Button>
            <Button variant="outlined" startIcon={<InsightsIcon />} onClick={stats} disabled={!igReady || !!syncing}>
              {syncing === 'stats' ? 'Loading…' : 'Refresh stats'}
            </Button>
            <Typography variant="caption" color="text.secondary">
              {igReady
                ? `Syncs automatically every 30 min while the studio is open${lastInstagramSync() ? ` · last sync ${fmtRelative(new Date(lastInstagramSync()).toISOString(), now)}` : ''}. This button re-reads the whole feed.`
                : 'Connect Instagram in Connections to sync your feed and load stats.'}
            </Typography>
          </Stack>
        )}
        {tab === 'history' && section('Posted & skipped', history, 'Nothing posted yet — your first one is the hardest!')}
      </Stack>
    </>
  )
}
