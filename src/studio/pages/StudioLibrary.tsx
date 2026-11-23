import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Checkbox, Chip, Grid, MenuItem, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'
import { allBags, categories } from '../../data'
import { bagThumb, fmtRelative } from '../helpers'
import { setAlreadyPosted } from '../planner'
import { useNow, useStudioData } from '../store'
import { PageHead } from '../ui/bits'
import { useStudioUi } from '../ui/context'

type Filter = 'all' | 'never' | 'queued' | 'posted' | 'sold'

export const StudioLibrary: React.FC = () => {
  const { posts } = useStudioData()
  const now = useNow(60_000)
  const ui = useStudioUi()
  const navigate = useNavigate()
  const [filter, setFilter] = React.useState<Filter>('all')
  const [cat, setCat] = React.useState<number | 'all'>('all')
  const [q, setQ] = React.useState('')
  const [selected, setSelected] = React.useState<Set<number>>(new Set())

  const stats = React.useMemo(() => {
    const m = new Map<number, { posted: number; imported: boolean; last?: string; next?: string }>()
    posts.forEach((p) => {
      const s = m.get(p.bagId) ?? { posted: 0, imported: false }
      if (p.status === 'posted') {
        s.posted++
        if (p.imported) s.imported = true
        else {
          const t = p.postedAt ?? p.scheduledAt
          if (!s.last || t > s.last) s.last = t
        }
      }
      if ((p.status === 'scheduled' || p.status === 'draft') && (!s.next || p.scheduledAt < s.next)) s.next = p.scheduledAt
      m.set(p.bagId, s)
    })
    return m
  }, [posts])

  const list = allBags.all.filter((b) => {
    const s = stats.get(b.id)
    if (cat !== 'all' && b.category_id !== cat) return false
    if (q && !`#${b.id} ${b.description} ${b.fabric} ${b.category}`.toLowerCase().includes(q.toLowerCase())) return false
    switch (filter) {
      case 'never':
        return b.available !== false && !s?.posted && !s?.next
      case 'queued':
        return !!s?.next
      case 'posted':
        return !!s?.posted
      case 'sold':
        return b.available === false
      default:
        return true
    }
  })

  const toggle = (id: number) =>
    setSelected((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const mark = (ids: number[], posted: boolean) => {
    setAlreadyPosted(ids, posted, posts)
    setSelected(new Set())
    ui.toast(
      posted
        ? `Marked ${ids.length} bag${ids.length > 1 ? 's' : ''} as already posted — the scheduler will skip them`
        : `Unmarked ${ids.length} bag${ids.length > 1 ? 's' : ''}`,
    )
  }

  const allVisibleSelected = list.length > 0 && list.every((b) => selected.has(b.id))

  const FILTERS: [Filter, string][] = [
    ['all', 'All bags'],
    ['never', 'Never posted'],
    ['queued', 'In queue'],
    ['posted', 'Posted'],
    ['sold', 'Sold'],
  ]

  return (
    <>
      <PageHead
        title="Bag library"
        subtitle="Tick the bags you already posted before using the studio, so the scheduler doesn't repeat them."
      />

      <Stack direction={{ xs: 'column', md: 'row' }} gap={1.5} mb={2} alignItems={{ md: 'center' }}>
        <Stack direction="row" gap={1} flexWrap="wrap" flex={1}>
          {FILTERS.map(([id, label]) => (
            <Chip key={id} label={label} onClick={() => setFilter(id)} color={filter === id ? 'primary' : 'default'} variant={filter === id ? 'filled' : 'outlined'} />
          ))}
        </Stack>
        <TextField size="small" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ minWidth: 200 }} />
        <TextField size="small" select value={cat} onChange={(e) => setCat(e.target.value === 'all' ? 'all' : Number(e.target.value))} sx={{ minWidth: 200 }}>
          <MenuItem value="all">All collections</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Selection toolbar */}
      <Paper
        variant="outlined"
        sx={{
          position: 'sticky',
          top: { xs: 0, md: 8 },
          zIndex: 3,
          mb: 2,
          px: 1.5,
          py: 1,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          borderColor: selected.size ? 'primary.main' : 'divider',
        }}
      >
        <Checkbox
          size="small"
          checked={allVisibleSelected}
          indeterminate={selected.size > 0 && !allVisibleSelected}
          onChange={(e) => setSelected(e.target.checked ? new Set(list.map((b) => b.id)) : new Set())}
        />
        <Typography variant="body2" fontWeight={600} flex={1}>
          {selected.size ? `${selected.size} selected` : `${list.length} bag${list.length === 1 ? '' : 's'} — select to bulk-mark`}
        </Typography>
        <Button size="small" variant="contained" color="success" startIcon={<DoneAllIcon />} disabled={!selected.size} onClick={() => mark([...selected], true)}>
          Mark as already posted
        </Button>
        <Button size="small" color="inherit" startIcon={<RemoveDoneIcon />} disabled={!selected.size} onClick={() => mark([...selected], false)}>
          Unmark
        </Button>
      </Paper>

      <Grid container spacing={2}>
        {list.map((b) => {
          const s = stats.get(b.id)
          const sold = b.available === false
          const isSel = selected.has(b.id)
          return (
            <Grid item xs={6} sm={4} md={3} xl={2} key={b.id}>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: isSel ? 'primary.main' : 'divider',
                  boxShadow: isSel ? (t) => `0 0 0 1px ${t.palette.primary.main}` : 'none',
                }}
              >
                <Box
                  onClick={() => toggle(b.id)}
                  sx={{ aspectRatio: '1', bgcolor: b.backgroundColor || 'action.hover', display: 'grid', placeItems: 'center', position: 'relative', cursor: 'pointer' }}
                >
                  <img src={bagThumb(b)} alt={`Bag ${b.id}`} loading="lazy" style={{ maxWidth: '84%', maxHeight: '84%', objectFit: 'contain', opacity: sold ? 0.5 : 1 }} />
                  <Checkbox
                    checked={isSel}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggle(b.id)}
                    sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'background.paper', borderRadius: 1, p: 0.25, '&:hover': { bgcolor: 'background.paper' } }}
                  />
                  <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 8, left: 8 }}>
                    {sold && <Chip size="small" label="Sold" />}
                    {!sold && !s?.posted && !s?.next && <Chip size="small" color="secondary" label="Fresh" />}
                    {!!s?.posted && <Chip size="small" color="success" label="Posted" />}
                    {b.discount > 0 && <Chip size="small" color="primary" label={`-${b.discount}%`} />}
                  </Stack>
                </Box>
                <Stack p={1.5} spacing={0.5} flex={1}>
                  <Typography fontWeight={700} fontSize="0.9rem">
                    #{b.id} · {b.category}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s?.last
                      ? `Posted ${s.posted}× · last ${fmtRelative(s.last, now)}`
                      : s?.imported
                        ? 'Marked as already posted'
                        : 'Never posted'}
                    {s?.next && <><br />Next {fmtRelative(s.next, now)}</>}
                  </Typography>
                  <Box flex={1} />
                  <Stack direction="row" spacing={0.75} pt={1}>
                    <Button size="small" variant="contained" disabled={sold} onClick={() => ui.openEditor({ bagId: b.id })} sx={{ flex: 1 }}>
                      Schedule
                    </Button>
                    <Tooltip title={s?.imported ? 'Unmark “already posted”' : 'Mark as already posted'}>
                      <Button size="small" variant="outlined" color={s?.imported ? 'success' : 'inherit'} onClick={() => mark([b.id], !s?.imported)} sx={{ minWidth: 0, px: 1 }}>
                        {s?.imported ? <RemoveDoneIcon fontSize="small" /> : <DoneAllIcon fontSize="small" />}
                      </Button>
                    </Tooltip>
                    <Button size="small" variant="outlined" onClick={() => navigate(`/item/${b.id}/studio`)} sx={{ minWidth: 0 }}>
                      Edit
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
