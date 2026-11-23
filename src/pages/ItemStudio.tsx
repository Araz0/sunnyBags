import React from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EventIcon from '@mui/icons-material/Event'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import { useStudio } from '../hooks/useStudio'
import { SuggestionEngine } from '../components/studio/SuggestionEngine'
import { BatchTargets } from '../components/studio/BatchTargets'
import { ChromaPanel } from '../components/studio/ChromaPanel'
import { CompositionPanel } from '../components/studio/CompositionPanel'
import { PreviewMonitor } from '../components/studio/PreviewMonitor'
import { StudioWrapper, StudioContainer, ControlsColumn } from '../components/studio/StudioStyles'

import { LANGUAGES, PLATFORMS, TONES } from '../studio/constants'
import { useConnections } from '../studio/connections'
import { automatedPlatforms } from '../studio/publish'
import { studioActions } from '../studio/store'
import { usePlatformChip } from '../studio/ui/bits'
import { usePublishNow } from '../studio/ui/usePublishNow'
import { PublishNowButton } from '../studio/ui/PublishNowButton'
import { bagImage, copyText, fmtRelative, formatPrice, generateCaption, platformMeta } from '../studio/helpers'
import { compressPhoto, removeExtraPhoto, setExtraPhoto, useExtraPhoto } from '../studio/extras'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import { useStudioData } from '../studio/store'
import { CaptionLanguage, CaptionTone, Platform, PostDesign, ScheduledPost } from '../studio/types'
import { useStudioUi } from '../studio/ui/context'

export const ItemStudio: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>()
  const s = useStudio(itemId)
  const { posts, settings } = useStudioData()
  const ui = useStudioUi()
  const item = s.currentItem

  const [tone, setTone] = React.useState<CaptionTone>(settings.captionTone)
  const [caption, setCaption] = React.useState('')
  const [lang, setLang] = React.useState<CaptionLanguage>(settings.captionLanguage)
  const [platforms, setPlatforms] = React.useState<Platform[]>(settings.defaultPlatforms)
  const connections = useConnections()
  const chipProps = usePlatformChip()
  const { publishNow, busyId, progress } = usePublishNow()
  const extraPhoto = useExtraPhoto(item?.id)
  const [includeExtra, setIncludeExtra] = React.useState(true)
  const extraInput = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (item) setCaption(generateCaption(item, tone, settings, lang))
    // regenerate when the bag or tone changes, not on every settings keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id, tone, lang])

  if (!item) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h1">Bag not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => s.navigate('/studio/library')}>
          Back to library
        </Button>
      </Stack>
    )
  }

  const history = posts.filter((p) => p.bagId === item.id)
  const postedCount = history.filter((p) => p.status === 'posted').length
  const nextPlanned = history
    .filter((p) => p.status === 'scheduled')
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0]

  const currentDesign = (): PostDesign => ({
    sizeId: s.livePreview.id,
    sizeName: s.livePreview.name,
    w: s.livePreview.w,
    h: s.livePreview.h,
    side: s.sides.front && s.sides.back ? 'both' : s.sides.back ? 'B' : 'A',
    bgColor: s.bgColor,
    isTransparent: s.isTransparent,
    bagScale: s.bagScale,
    format: s.format,
    includeExtra,
  })

  const uploadExtra = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setExtraPhoto(item.id, await compressPhoto(file))
      setIncludeExtra(true)
      ui.toast('Extra photo saved. It will be the last slide of this bag’s posts.')
    } catch (err) {
      ui.toast((err as Error).name === 'QuotaExceededError' ? 'Browser storage is full. Remove extra photos from other bags.' : (err as Error).message)
    }
  }

  const slides: { key: string; label: string; src?: string; on: boolean; toggle: () => void; photo?: boolean }[] = [
    { key: 'A', label: '1 · Front', src: bagImage(item, 'A'), on: s.sides.front, toggle: () => s.setSides({ ...s.sides, front: !s.sides.front || !s.sides.back }) },
    { key: 'B', label: '2 · Back', src: bagImage(item, 'B'), on: s.sides.back, toggle: () => s.setSides({ ...s.sides, back: !s.sides.back || !s.sides.front }) },
    { key: 'X', label: '3 · Extra photo', src: extraPhoto, on: !!extraPhoto && includeExtra, toggle: () => setIncludeExtra(!includeExtra), photo: true },
  ]

  const schedule = () => ui.openEditor({ bagId: item.id, design: currentDesign(), caption })

  const autoTargets = automatedPlatforms({ platforms } as ScheduledPost, connections)

  const publishImmediately = async () => {
    const names = autoTargets.map((p) => platformMeta(p).label).join(' + ')
    if (!confirm(`Publish Bag #${item.id} to ${names} now with this design and caption?`)) return
    const post = studioActions.addPost({
      bagId: item.id,
      scheduledAt: new Date().toISOString(),
      platforms,
      caption,
      status: 'scheduled',
      design: currentDesign(),
      auto: false,
      language: lang,
    })
    await publishNow(post.id, { confirm: false })
  }

  return (
    <StudioWrapper>
      {/* ── Header ─────────────────────────────────────────── */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={2} mb={3}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
            <Typography variant="h1">Bag #{item.id}</Typography>
            <Chip size="small" label={item.category} />
            <Chip size="small" variant="outlined" label={formatPrice(item)} />
            {item.available === false && <Chip size="small" color="default" label="Sold" />}
          </Stack>
          <Typography color="text.secondary" mt={0.5} variant="body2">
            {postedCount ? `Posted ${postedCount}×` : 'Never posted'}
            {nextPlanned ? ` · next post ${fmtRelative(nextPlanned.scheduledAt)}` : ''}
          </Typography>
        </Box>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button color="inherit" startIcon={<OpenInNewIcon />} onClick={() => s.navigate(`/item/${item.id}`)}>
            Shop page
          </Button>
          <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={s.handleExport}>
            Export images
          </Button>
          <Button variant="outlined" startIcon={<EventIcon />} onClick={schedule} disabled={item.available === false} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
            Schedule
          </Button>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <PublishNowButton
            platforms={platforms}
            onPublish={publishImmediately}
            busy={!!busyId}
            progress={progress}
            disabled={!caption.trim() || item.available === false}
          />
          </Box>
        </Stack>
      </Stack>

      {/* Phone: actions stay in reach above the tab bar */}
      <Paper
        elevation={6}
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          left: 8,
          right: 8,
          bottom: 'calc(72px + env(safe-area-inset-bottom))',
          zIndex: 15,
          p: 1,
          gap: 1,
          borderRadius: 3,
          '& > *': { flex: 1 },
        }}
      >
        <Button variant="outlined" startIcon={<EventIcon />} onClick={schedule} disabled={item.available === false}>
          Schedule
        </Button>
        <PublishNowButton
          platforms={platforms}
          onPublish={publishImmediately}
          busy={!!busyId}
          progress={progress}
          disabled={!caption.trim() || item.available === false}
        />
      </Paper>

      <StudioContainer>
        <ControlsColumn>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="h3">Carousel</Typography>
              <Typography variant="caption" color="text.secondary">
                {slides.filter((x) => x.on).length} slide{slides.filter((x) => x.on).length === 1 ? '' : 's'} · click to include / exclude
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Posts go out in this order. The extra photo (e.g. the bag being worn) is saved for this bag and used in all its posts.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              {slides.map((sl) => (
                <Box key={sl.key} sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    onClick={sl.src ? sl.toggle : () => extraInput.current?.click()}
                    sx={{
                      aspectRatio: `${s.livePreview.w} / ${s.livePreview.h}`,
                      bgcolor: sl.photo ? 'action.hover' : s.bgColor,
                      borderRadius: 2,
                      border: 2,
                      borderStyle: sl.src ? 'solid' : 'dashed',
                      borderColor: sl.on ? 'success.main' : 'divider',
                      display: 'grid',
                      placeItems: 'center',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      opacity: sl.src && !sl.on ? 0.4 : 1,
                      transition: 'opacity .15s, border-color .15s',
                    }}
                  >
                    {sl.src ? (
                      <img
                        src={sl.src}
                        alt={sl.label}
                        style={sl.photo ? { width: '100%', height: '100%', objectFit: 'cover' } : { maxWidth: `${s.bagScale * 90}%`, maxHeight: `${s.bagScale * 90}%`, objectFit: 'contain' }}
                      />
                    ) : (
                      <Stack alignItems="center" spacing={0.5} sx={{ color: 'text.secondary', p: 1, textAlign: 'center' }}>
                        <AddPhotoAlternateOutlinedIcon />
                        <Typography variant="caption">Add photo</Typography>
                      </Stack>
                    )}
                  </Box>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mt={0.5}>
                    <Typography variant="caption" fontWeight={600} noWrap>
                      {sl.label}
                    </Typography>
                    {sl.photo && sl.src && (
                      <Stack direction="row">
                        <Button size="small" sx={{ minWidth: 0, px: 0.5, fontSize: '0.7rem' }} onClick={() => extraInput.current?.click()}>
                          Change
                        </Button>
                        <Button
                          size="small"
                          color="inherit"
                          sx={{ minWidth: 0, px: 0.5, fontSize: '0.7rem' }}
                          onClick={() => confirm('Remove the extra photo for this bag?') && removeExtraPhoto(item.id)}
                        >
                          Remove
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
            <input ref={extraInput} type="file" accept="image/*" hidden onChange={uploadExtra} />
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5} gap={1} flexWrap="wrap">
              <Typography variant="h3">Caption</Typography>
              <ToggleButtonGroup size="small" exclusive value={lang} onChange={(_, v: CaptionLanguage | null) => v && setLang(v)}>
                {LANGUAGES.map((l) => (
                  <ToggleButton key={l.id} value={l.id} sx={{ px: 1.25, py: 0.4 }}>
                    {l.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <ToggleButtonGroup size="small" exclusive value={tone} onChange={(_, v: CaptionTone | null) => v && setTone(v)}>
                {TONES.map((t) => (
                  <ToggleButton key={t.id} value={t.id} sx={{ px: 1.25, py: 0.4 }}>
                    {t.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
            <TextField value={caption} onChange={(e) => setCaption(e.target.value)} multiline minRows={6} fullWidth size="small" />
            <Stack direction="row" gap={1} mt={1.5} flexWrap="wrap" alignItems="center">
              {PLATFORMS.map((p) => {
                const on = platforms.includes(p.id)
                const connected = automatedPlatforms({ platforms: [p.id] } as ScheduledPost, connections).length > 0
                return (
                  <Chip
                    key={p.id}
                    size="small"
                    label={`${p.label}${connected ? ' ⚡' : ''}`}
                    {...chipProps(p.id, on)}
                    onClick={() => setPlatforms(on ? platforms.filter((x) => x !== p.id) : [...platforms, p.id])}
                  />
                )
              })}
              <Typography variant="caption" color="text.secondary">
                ⚡ = publishes automatically
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} mt={1.5}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={() => copyText(caption).then(() => ui.toast('Caption copied'), () => ui.toast('Copy failed'))}
              >
                Copy
              </Button>
              <Button size="small" onClick={() => setCaption(generateCaption(item, tone, settings, lang))}>
                Reset
              </Button>
              <Box flex={1} />
              <Typography variant="caption" color="text.secondary" alignSelf="center">
                {caption.length}/2200
              </Typography>
            </Stack>
          </Paper>

          <BatchTargets
            resolutionDirectory={s.resolutionDirectory}
            checkedSizes={s.checkedSizes}
            previewSizeId={s.previewSizeId}
            customW={s.customW}
            customH={s.customH}
            sides={s.sides}
            onToggleSize={s.toggleSizeCheckbox}
            onSetPreviewSize={s.setPreviewSizeId}
            onSetCustomW={s.setCustomW}
            onSetCustomH={s.setCustomH}
            onSetSides={s.setSides}
          />

          <ChromaPanel
            isTransparent={s.isTransparent}
            bgColor={s.bgColor}
            defaultBgColor={item.backgroundColor}
            onTransparentToggle={s.handleTransparentToggle}
            onBgColorChange={s.setBgColor}
            onResetBgColor={() => s.setBgColor(item.backgroundColor ?? '#ffffff')}
          />

          <CompositionPanel
            bagScale={s.bagScale}
            format={s.format}
            isTransparent={s.isTransparent}
            onScaleChange={s.setBagScale}
            onFormatChange={s.setFormat}
          />

          <SuggestionEngine
            suggestedBag={s.suggestedBag}
            suggestionStats={s.suggestionStats}
            showSuggestion={s.showSuggestion}
            getBagThumbnail={s.getBagThumbnail}
            onSuggest={s.handleGetSuggestion}
            onReset={s.handleResetHistory}
            onViewSuggestion={s.handleViewSuggestion}
          />
        </ControlsColumn>

        <PreviewMonitor
          previewSide={s.previewSide}
          livePreview={s.livePreview}
          bgColor={s.bgColor}
          isTransparent={s.isTransparent}
          bagScale={s.bagScale}
          previewImgSrc={s.previewImgSrc}
          onSideChange={s.setPreviewSide}
        />
      </StudioContainer>
      <Box sx={{ display: { xs: 'block', md: 'none' }, height: 72 }} />
    </StudioWrapper>
  )
}
