import React from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Slider,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import CloseIcon from '@mui/icons-material/Close'
import { allBags } from '../../data'
import { defaultDesign, LANGUAGES, PLATFORMS, PRESET_SIZES, TONES } from '../constants'
import { bagImage, generateCaption, getBag, toLocalInput, withTime } from '../helpers'
import { nextFreeSlots } from '../planner'
import { studioActions, useStudioData } from '../store'
import { CaptionLanguage, CaptionTone, Platform, PostDesign, PostSide, PostStatus, ScheduledPost } from '../types'
import { BagThumb, bagLabel, usePlatformChip } from './bits'
import { EditorRequest } from './context'
import { usePublishNow } from './usePublishNow'
import { useExtraPhoto } from '../extras'
import { PublishNowButton } from './PublishNowButton'

const bagOptions = allBags.all.filter((b) => b.available !== false)

interface Props {
  request: EditorRequest | null
  onClose: () => void
  onSaved: (msg: string) => void
}

export const PostEditorDialog: React.FC<Props> = ({ request, onClose, onSaved }) => {
  const { settings, posts } = useStudioData()
  const editing = request?.post
  const fullScreen = useMediaQuery(useTheme().breakpoints.down('sm'))
  const chipProps = usePlatformChip()
  const { publishNow, busyId, progress } = usePublishNow()

  const [bagId, setBagId] = React.useState<number | null>(null)
  const [when, setWhen] = React.useState('')
  const [status, setStatus] = React.useState<PostStatus>('scheduled')
  const [platforms, setPlatforms] = React.useState<Platform[]>([])
  const [tone, setTone] = React.useState<CaptionTone>(settings.captionTone)
  const [lang, setLang] = React.useState<CaptionLanguage>(settings.captionLanguage)
  const [caption, setCaption] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [design, setDesign] = React.useState<PostDesign>(defaultDesign())

  // Initialise whenever the dialog opens
  React.useEffect(() => {
    if (!request) return
    if (request.post) {
      const p = request.post
      setBagId(p.bagId)
      setWhen(toLocalInput(p.scheduledAt))
      setStatus(p.status)
      setPlatforms(p.platforms)
      setCaption(p.caption)
      setLang(p.language ?? settings.captionLanguage)
      setNotes(p.notes ?? '')
      setDesign(p.design)
      return
    }
    const bag = request.bagId != null ? getBag(request.bagId) : undefined
    const slot = request.date
      ? withTime(request.date, settings.postingTime)
      : nextFreeSlots(settings, posts, 1)[0] ?? new Date(Date.now() + 3600000)
    setBagId(bag?.id ?? null)
    setWhen(toLocalInput(slot.toISOString()))
    setStatus('scheduled')
    setPlatforms(settings.defaultPlatforms)
    setTone(settings.captionTone)
    setLang(settings.captionLanguage)
    setCaption(request.caption ?? (bag ? generateCaption(bag, settings.captionTone, settings) : ''))
    setNotes('')
    setDesign(request.design ?? defaultDesign(bag?.backgroundColor || '#ffffff'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request])

  const bag = bagId != null ? getBag(bagId) : undefined
  const extraPhoto = useExtraPhoto(bag?.id)
  const hashtagCount = (caption.match(/#[\p{L}\d_]+/gu) ?? []).length

  const selectBag = (id: number | null) => {
    setBagId(id)
    const b = id != null ? getBag(id) : undefined
    if (b) {
      setCaption(generateCaption(b, tone, settings, lang))
      setDesign((d) => ({ ...d, bgColor: b.backgroundColor || d.bgColor }))
    }
  }

  const regenerate = (t = tone, l = lang) => bag && setCaption(generateCaption(bag, t, settings, l))

  const useNextSlot = () => {
    const others = posts.filter((p) => p.id !== editing?.id)
    const s = nextFreeSlots(settings, others, 1)[0]
    if (s) setWhen(toLocalInput(s.toISOString()))
  }

  const persist = (overrides: Partial<ScheduledPost> = {}): string | null => {
    if (!bag || !when) return null
    const payload = {
      bagId: bag.id,
      scheduledAt: new Date(when).toISOString(),
      platforms,
      caption,
      status,
      design,
      notes: notes || undefined,
      auto: false,
      language: lang,
      ...overrides,
    }
    if (editing) {
      studioActions.updatePost(editing.id, payload)
      return editing.id
    }
    return studioActions.addPost(payload).id
  }

  const save = () => {
    if (!persist()) return
    onSaved(editing ? 'Post updated' : status === 'draft' ? 'Saved as draft' : 'Post scheduled')
    onClose()
  }

  const publishImmediately = async () => {
    const id = persist({ status: 'scheduled', scheduledAt: new Date().toISOString() })
    if (!id) return
    if (await publishNow(id, { confirm: false })) onClose()
  }

  const remove = () => {
    if (editing && confirm('Delete this post?')) {
      studioActions.deletePost(editing.id)
      onSaved('Post deleted')
      onClose()
    }
  }

  const previewSide: 'A' | 'B' = design.side === 'B' ? 'B' : 'A'

  return (
    <Dialog open={!!request} onClose={onClose} maxWidth="md" fullWidth fullScreen={fullScreen}>
      <DialogTitle sx={{ pr: 6 }}>
        {editing ? 'Edit post' : 'New post'}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Stack spacing={2.25}>
              <Autocomplete
                options={bagOptions}
                value={bag ?? null}
                onChange={(_, v) => selectBag(v?.id ?? null)}
                getOptionLabel={bagLabel}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                renderOption={(props, b) => (
                  <li {...props} key={b.id}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <BagThumb bag={b} size={36} />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {bagLabel(b)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 320 }}>
                          {b.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </li>
                )}
                renderInput={(params) => <TextField {...params} label="Bag" placeholder="Search by number or category" />}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField
                  label="Publish at"
                  type="datetime-local"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <Tooltip title="Next free slot from your posting schedule">
                  <Button variant="outlined" startIcon={<EventAvailableIcon />} onClick={useNextSlot} sx={{ whiteSpace: 'nowrap' }}>
                    Next slot
                  </Button>
                </Tooltip>
              </Stack>

              <Box>
                <Typography variant="body2" fontWeight={600} mb={1}>
                  Platforms
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {PLATFORMS.map((p) => {
                    const on = platforms.includes(p.id)
                    return (
                      <Chip
                        key={p.id}
                        label={p.label}
                        onClick={() => setPlatforms(on ? platforms.filter((x) => x !== p.id) : [...platforms, p.id])}
                        {...chipProps(p.id, on)}
                      />
                    )
                  })}
                </Stack>
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} gap={1} flexWrap="wrap">
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={tone}
                    onChange={(_, v: CaptionTone | null) => {
                      if (v) {
                        setTone(v)
                        regenerate(v)
                      }
                    }}
                  >
                    {TONES.map((t) => (
                      <ToggleButton key={t.id} value={t.id} sx={{ px: 1.5 }}>
                        {t.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={lang}
                    onChange={(_, v: CaptionLanguage | null) => {
                      if (v) {
                        setLang(v)
                        regenerate(tone, v)
                      }
                    }}
                  >
                    {LANGUAGES.map((l) => (
                      <ToggleButton key={l.id} value={l.id} sx={{ px: 1.25 }}>
                        {l.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <Button size="small" startIcon={<AutoAwesomeIcon />} onClick={() => regenerate()} disabled={!bag}>
                    Regenerate
                  </Button>
                </Stack>
                <TextField
                  label="Caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  multiline
                  minRows={7}
                  fullWidth
                  helperText={
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: hashtagCount > 30 ? '#df4b4b' : undefined }}>{hashtagCount}/30 hashtags</span>
                      <span style={{ color: caption.length > 2200 ? '#df4b4b' : undefined }}>{caption.length}/2200</span>
                    </span>
                  }
                />
              </Box>

              <TextField label="Private notes" value={notes} onChange={(e) => setNotes(e.target.value)} size="small" placeholder="e.g. use morning light photo, tag the market" />

              <FormControlLabel
                control={<Switch checked={status === 'draft'} onChange={(e) => setStatus(e.target.checked ? 'draft' : 'scheduled')} />}
                label="Keep as draft (won't remind me)"
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <Box
                sx={{
                  aspectRatio: `${design.w} / ${design.h}`,
                  maxHeight: 360,
                  mx: 'auto',
                  width: '100%',
                  maxWidth: (design.w / design.h) * 360,
                  bgcolor: design.isTransparent ? 'transparent' : design.bgColor,
                  backgroundImage: design.isTransparent
                    ? 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)'
                    : undefined,
                  backgroundSize: '20px 20px',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  overflow: 'hidden',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: 3,
                }}
              >
                {bag ? (
                  <img
                    src={bagImage(bag, previewSide)}
                    alt=""
                    style={{ maxWidth: `${design.bagScale * 100}%`, maxHeight: `${design.bagScale * 100}%`, objectFit: 'contain' }}
                  />
                ) : (
                  <Typography color="text.secondary" variant="body2">
                    Pick a bag
                  </Typography>
                )}
              </Box>

              <TextField
                select
                size="small"
                label="Format"
                value={design.sizeId}
                onChange={(e) => {
                  const s = PRESET_SIZES.find((x) => x.id === e.target.value)!
                  setDesign({ ...design, sizeId: s.id, sizeName: s.name, w: s.w, h: s.h })
                }}
              >
                {PRESET_SIZES.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name} · {s.w}×{s.h}
                  </MenuItem>
                ))}
              </TextField>

              <ToggleButtonGroup
                size="small"
                exclusive
                fullWidth
                value={design.side}
                onChange={(_, v: PostSide | null) => v && setDesign({ ...design, side: v })}
              >
                <ToggleButton value="both">Front + back</ToggleButton>
                <ToggleButton value="A">Front only</ToggleButton>
                <ToggleButton value="B">Back only</ToggleButton>
              </ToggleButtonGroup>

              {extraPhoto ? (
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={design.includeExtra !== false}
                      onChange={(e) => setDesign({ ...design, includeExtra: e.target.checked })}
                    />
                  }
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img src={extraPhoto} alt="" style={{ width: 28, height: 34, objectFit: 'cover', borderRadius: 4 }} />
                      <Typography variant="body2">Add extra photo as last slide</Typography>
                    </Stack>
                  }
                />
              ) : (
                bag && (
                  <Typography variant="caption" color="text.secondary">
                    Want a third slide? Add an extra photo in this bag's studio page.
                  </Typography>
                )
              )}

              <Stack direction="row" spacing={1.5} alignItems="center">
                <input
                  type="color"
                  value={design.bgColor.length === 4 ? '#' + [...design.bgColor.slice(1)].map((c) => c + c).join('') : design.bgColor}
                  onChange={(e) => setDesign({ ...design, bgColor: e.target.value })}
                  style={{ width: 40, height: 34, border: 'none', padding: 0, background: 'none', cursor: 'pointer' }}
                  aria-label="Background color"
                />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  Background
                </Typography>
                <Box sx={{ width: 140 }}>
                  <Typography variant="caption" color="text.secondary">
                    Bag size {Math.round(design.bagScale * 100)}%
                  </Typography>
                  <Slider
                    size="small"
                    min={0.3}
                    max={1.6}
                    step={0.02}
                    value={design.bagScale}
                    onChange={(_, v) => setDesign({ ...design, bagScale: v as number })}
                  />
                </Box>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, pb: 'calc(16px + env(safe-area-inset-bottom))', flexWrap: 'wrap', gap: 1, '& > :not(style) ~ :not(style)': { ml: 0 } }}>
        {editing && (
          <Button color="inherit" startIcon={<DeleteOutlineIcon />} onClick={remove} sx={{ mr: 'auto' }}>
            Delete
          </Button>
        )}
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <PublishNowButton
          variant="outlined"
          platforms={platforms}
          onPublish={publishImmediately}
          busy={!!busyId}
          progress={progress}
          disabled={!bag || !caption.trim()}
        />
        <Button variant="contained" onClick={save} disabled={!bag || !when || platforms.length === 0 || !!busyId}>
          {editing ? 'Save changes' : status === 'draft' ? 'Save draft' : 'Schedule post'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
