import React from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import DownloadIcon from '@mui/icons-material/Download'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import IosShareIcon from '@mui/icons-material/IosShare'
import CloseIcon from '@mui/icons-material/Close'
import BoltIcon from '@mui/icons-material/Bolt'
import { downloadDataUrl } from '../../utils/export'
import { routeFor, useConnections } from '../connections'
import { automatedPlatforms, manualPlatforms, publishPost, renderPostImages } from '../publish'
import { copyText, fmtDateTime, getBag, platformMeta } from '../helpers'
import { studioActions, useStudioData } from '../store'
import { PlatformDots } from './bits'

interface Props {
  postId: string | null
  onClose: () => void
  onDone: (msg: string) => void
}

const Step: React.FC<{ n: number; done: boolean; title: string; children: React.ReactNode }> = ({ n, done, title, children }) => (
  <Stack direction="row" spacing={1.5} alignItems="flex-start">
    {done ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon color="disabled" />}
    <Box flex={1}>
      <Typography fontWeight={700} fontSize="0.95rem">
        {n}. {title}
      </Typography>
      <Box mt={0.75}>{children}</Box>
    </Box>
  </Stack>
)

const dataUrlToFile = async (url: string, name: string) => {
  const blob = await (await fetch(url)).blob()
  return new File([blob], name, { type: blob.type })
}

export const PublishDialog: React.FC<Props> = ({ postId, onClose, onDone }) => {
  const { posts } = useStudioData()
  const post = posts.find((p) => p.id === postId)
  const bag = post ? getBag(post.bagId) : undefined

  const [images, setImages] = React.useState<{ url: string; name: string }[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState({ image: false, caption: false, opened: false })
  const connections = useConnections()
  const [autoBusy, setAutoBusy] = React.useState<string | null>(null)

  React.useEffect(() => {
    setImages([])
    setError(null)
    setDone({ image: false, caption: false, opened: false })
    if (!post || !bag) return
    let cancelled = false
    renderPostImages(post, bag)
      .then((r) => !cancelled && setImages(r))
      .catch((e: Error) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  if (!post) return null

  const auto = automatedPlatforms(post, connections)
  const manual = manualPlatforms(post, connections)
  const okOn = (p: string) => post.publishLog?.some((l) => l.platform === p && l.ok)
  const lastErr = (p: string) => [...(post.publishLog ?? [])].reverse().find((l) => l.platform === p && !l.ok)?.error

  const publishAuto = async () => {
    setError(null)
    setAutoBusy('Starting…')
    try {
      const log = await publishPost(post, connections, setAutoBusy)
      const failed = log.filter((l) => !l.ok)
      if (failed.length) setError(failed.map((f) => `${f.platform}: ${f.error}`).join(' · '))
      else if (!manual.length) {
        onDone(`Bag #${post.bagId} published 🚀`)
        onClose()
      } else onDone(`Published to ${log.map((l) => l.platform).join(', ')}. Post the rest by hand.`)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setAutoBusy(null)
    }
  }

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator && 'canShare' in navigator

  const share = async () => {
    try {
      const files = await Promise.all(images.map((i) => dataUrlToFile(i.url, i.name)))
      if (!navigator.canShare({ files })) throw new Error('Sharing files is not supported here')
      await copyText(post.caption).catch(() => undefined)
      await navigator.share({ files, text: post.caption })
      setDone({ image: true, caption: true, opened: true })
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message)
    }
  }

  const download = () => {
    images.forEach((i) => downloadDataUrl(i.url, i.name))
    setDone((d) => ({ ...d, image: true }))
  }

  const copy = () =>
    copyText(post.caption).then(
      () => setDone((d) => ({ ...d, caption: true })),
      () => setError('Copy failed — select the caption text and copy it manually.'),
    )

  const markPosted = () => {
    studioActions.markPosted(post.id)
    onDone(`Bag #${post.bagId} marked as posted 🎉`)
    onClose()
  }

  const skip = () => {
    studioActions.updatePost(post.id, { status: 'skipped' })
    onDone('Post skipped')
    onClose()
  }

  return (
    <Dialog open={!!postId} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        Publish assistant · Bag #{post.bagId}
        <Typography variant="body2" color="text.secondary">
          Planned for {fmtDateTime(post.scheduledAt)}
        </Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Stack direction="row" spacing={1} sx={{ flex: '0 0 auto', width: { md: 300 }, overflowX: 'auto' }}>
            {images.length === 0 && !error ? (
              <Box sx={{ width: '100%', aspectRatio: `${post.design.w}/${post.design.h}`, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              images.map((i) => (
                <Box key={i.name} component="img" src={i.url} alt="" sx={{ width: images.length > 2 ? '31%' : images.length > 1 ? '48%' : '100%', borderRadius: 2, border: 1, borderColor: 'divider', boxShadow: 2 }} />
              ))
            )}
          </Stack>

          <Stack spacing={2.5} flex={1}>
            {canShare && (
              <Alert
                severity="info"
                icon={<IosShareIcon />}
                action={
                  <Button color="inherit" size="small" onClick={share} disabled={!images.length}>
                    Share
                  </Button>
                }
              >
                On your phone? Share straight into Instagram — caption is copied for you.
              </Alert>
            )}

            {auto.length > 0 && (
              <Box sx={{ border: 1, borderColor: 'success.main', borderRadius: 2, p: 1.5 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <BoltIcon color="success" fontSize="small" />
                  <Typography fontWeight={700} fontSize="0.95rem" flex={1}>
                    Automatic
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={publishAuto}
                    disabled={!!autoBusy || auto.every((p) => okOn(p))}
                    startIcon={autoBusy ? <CircularProgress size={14} color="inherit" /> : <BoltIcon />}
                  >
                    {autoBusy ?? (auto.every((p) => okOn(p)) ? 'Done' : 'Publish automatically')}
                  </Button>
                </Stack>
                <Stack spacing={0.5}>
                  {auto.map((p) => (
                    <Typography key={p} variant="body2" color={okOn(p) ? 'success.main' : lastErr(p) ? 'error.main' : 'text.secondary'}>
                      {okOn(p) ? '✓' : lastErr(p) ? '✕' : '•'} {platformMeta(p).label} via {routeFor(p, connections) === 'meta' ? 'Meta API' : 'webhook'}
                      {!okOn(p) && lastErr(p) ? ` — ${lastErr(p)}` : ''}
                    </Typography>
                  ))}
                </Stack>
                {manual.length > 0 && (
                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Still by hand below: {manual.map((p) => platformMeta(p).label).join(', ')}
                  </Typography>
                )}
              </Box>
            )}

            <Step n={1} done={done.image} title={`Download ${images.length > 1 ? `${images.length} images (carousel)` : 'image'}`}>
              <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={download} disabled={!images.length}>
                Download
              </Button>
            </Step>

            <Step n={2} done={done.caption} title="Copy caption">
              <Box
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.85rem',
                  bgcolor: 'action.hover',
                  p: 1.5,
                  borderRadius: 2,
                  maxHeight: 170,
                  overflow: 'auto',
                  mb: 1,
                  userSelect: 'text',
                }}
              >
                {post.caption}
              </Box>
              <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={copy}>
                Copy caption
              </Button>
            </Step>

            <Step n={3} done={done.opened} title="Open the app and post">
              <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
                <PlatformDots platforms={manual.length ? manual : post.platforms} />
                {(manual.length ? manual : post.platforms).map((p) => (
                  <Button
                    key={p}
                    size="small"
                    variant="outlined"
                    endIcon={<OpenInNewIcon />}
                    href={platformMeta(p).url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setDone((d) => ({ ...d, opened: true }))}
                  >
                    {platformMeta(p).label}
                  </Button>
                ))}
              </Stack>
            </Step>

            {post.notes && (
              <Alert severity="warning" variant="outlined">
                {post.notes}
              </Alert>
            )}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={skip} sx={{ mr: 'auto' }}>
          Skip this one
        </Button>
        <Button onClick={onClose} color="inherit">
          Later
        </Button>
        <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={markPosted}>
          I posted it
        </Button>
      </DialogActions>
    </Dialog>
  )
}
