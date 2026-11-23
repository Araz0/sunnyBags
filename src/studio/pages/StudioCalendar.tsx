import React from 'react'
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AddIcon from '@mui/icons-material/Add'
import { WEEKDAYS } from '../constants'
import { getBag, isDue, sameDay, startOfDay, startOfWeek } from '../helpers'
import { studioActions, useNow, useStudioData } from '../store'
import { ScheduledPost } from '../types'
import { BagThumb, PageHead } from '../ui/bits'
import { useStudioUi } from '../ui/context'

const MON_FIRST = [1, 2, 3, 4, 5, 6, 0]

const chipColor = (p: ScheduledPost, now: number) =>
  isDue(p, now)
    ? 'warning.main'
    : p.status === 'posted'
      ? 'success.main'
      : p.status === 'draft' || p.status === 'skipped'
        ? 'text.disabled'
        : 'primary.main'

export const StudioCalendar: React.FC = () => {
  const { posts, settings } = useStudioData()
  const now = useNow()
  const ui = useStudioUi()
  const [month, setMonth] = React.useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [dragOver, setDragOver] = React.useState<number | null>(null)

  const gridStart = startOfWeek(month)
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(d.getDate() + i)
    return d
  })
  // Drop the 6th row if it's entirely next month
  const visible = days[35].getMonth() !== month.getMonth() ? days.slice(0, 35) : days
  const today = startOfDay(new Date(now))

  const move = (postId: string, day: Date) => {
    const p = posts.find((x) => x.id === postId)
    if (!p) return
    const old = new Date(p.scheduledAt)
    const next = new Date(day)
    next.setHours(old.getHours(), old.getMinutes(), 0, 0)
    studioActions.updatePost(postId, { scheduledAt: next.toISOString() })
    ui.toast(`Moved Bag #${p.bagId} to ${next.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}`)
  }

  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1))

  return (
    <>
      <PageHead
        title="Calendar"
        subtitle="Drag posts between days to reschedule. Click a day to add a post."
        actions={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton onClick={() => shift(-1)} aria-label="Previous month">
              <ChevronLeftIcon />
            </IconButton>
            <Typography fontWeight={700} sx={{ minWidth: 150, textAlign: 'center' }}>
              {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton onClick={() => shift(1)} aria-label="Next month">
              <ChevronRightIcon />
            </IconButton>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                const d = new Date()
                setMonth(new Date(d.getFullYear(), d.getMonth(), 1))
              }}
            >
              Today
            </Button>
          </Stack>
        }
      />

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 720, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {MON_FIRST.map((d) => (
              <Box
                key={d}
                sx={{
                  px: 1.5,
                  py: 1,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: settings.postingDays.includes(d) ? 'primary.main' : 'text.secondary',
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                {WEEKDAYS[d]}
                {settings.postingDays.includes(d) && ' ·'}
              </Box>
            ))}
            {visible.map((day, i) => {
              const inMonth = day.getMonth() === month.getMonth()
              const isToday = sameDay(day, today)
              const past = day < today
              const dayPosts = posts
                .filter((p) => !p.imported && sameDay(new Date(p.scheduledAt), day))
                .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
              const isSlot = settings.postingDays.includes(day.getDay()) && !past && dayPosts.length === 0
              return (
                <Box
                  key={i}
                  onClick={() => !past && ui.openEditor({ date: day })}
                  onDragOver={(e) => {
                    if (past) return
                    e.preventDefault()
                    setDragOver(i)
                  }}
                  onDragLeave={() => setDragOver((v) => (v === i ? null : v))}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(null)
                    const id = e.dataTransfer.getData('text/plain')
                    if (id && !past) move(id, day)
                  }}
                  sx={{
                    minHeight: 118,
                    p: 1,
                    borderRight: (i + 1) % 7 ? 1 : 0,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: dragOver === i ? 'action.selected' : past ? 'action.hover' : 'background.paper',
                    opacity: inMonth ? 1 : 0.45,
                    cursor: past ? 'default' : 'pointer',
                    position: 'relative',
                    '&:hover .add': { opacity: 1 },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
                    <Box
                      sx={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: isToday ? 'primary.main' : 'transparent',
                        color: isToday ? '#fff' : 'text.primary',
                      }}
                    >
                      {day.getDate()}
                    </Box>
                    {!past && <AddIcon className="add" fontSize="small" sx={{ opacity: 0, color: 'text.secondary', transition: 'opacity .15s' }} />}
                  </Stack>
                  <Stack spacing={0.5}>
                    {dayPosts.map((p) => {
                      const bag = getBag(p.bagId)
                      return (
                        <Stack
                          key={p.id}
                          direction="row"
                          spacing={0.75}
                          alignItems="center"
                          draggable={p.status !== 'posted'}
                          onDragStart={(e) => e.dataTransfer.setData('text/plain', p.id)}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (p.status === 'scheduled' && isDue(p, now)) ui.openPublish(p.id)
                            else ui.openEditor({ post: p })
                          }}
                          sx={{
                            p: 0.5,
                            pr: 1,
                            borderRadius: 1.5,
                            bgcolor: 'background.default',
                            borderLeft: 3,
                            borderColor: chipColor(p, now),
                            cursor: p.status === 'posted' ? 'pointer' : 'grab',
                            textDecoration: p.status === 'skipped' ? 'line-through' : 'none',
                            '&:hover': { boxShadow: 2 },
                          }}
                        >
                          <BagThumb bag={bag} size={24} radius={4} />
                          <Typography fontSize="0.74rem" fontWeight={700} noWrap>
                            #{p.bagId}
                          </Typography>
                          <Typography fontSize="0.7rem" color="text.secondary" noWrap>
                            {new Date(p.scheduledAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Stack>
                      )
                    })}
                    {isSlot && (
                      <Typography fontSize="0.7rem" color="text.disabled" sx={{ border: 1, borderStyle: 'dashed', borderColor: 'divider', borderRadius: 1.5, px: 0.75, py: 0.25 }}>
                        Open slot · {settings.postingTime}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )
            })}
          </Box>
        </Box>
      </Paper>

      <Stack direction="row" spacing={2.5} mt={2} flexWrap="wrap" useFlexGap>
        {[
          ['primary.main', 'Scheduled'],
          ['warning.main', 'Due now'],
          ['success.main', 'Posted'],
          ['text.disabled', 'Draft / skipped'],
        ].map(([c, l]) => (
          <Stack key={l} direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: c }} />
            <Typography variant="caption" color="text.secondary">
              {l}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </>
  )
}
