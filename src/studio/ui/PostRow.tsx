import React from 'react'
import { Box, Button, Checkbox, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import ReplayIcon from '@mui/icons-material/Replay'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import BoltIcon from '@mui/icons-material/Bolt'
import { useConnections } from '../connections'
import { fmtDateTime, fmtRelative, getBag, isDue, platformMeta } from '../helpers'
import { automatedPlatforms } from '../publish'
import { isReshufflable, reshuffleOne } from '../planner'
import { studioActions, useStudioData } from '../store'
import { ScheduledPost } from '../types'
import { BagThumb, PlatformDots, StatusChip } from './bits'
import { useStudioUi } from './context'
import { usePublishNow } from './usePublishNow'
import { PublishNowButton } from './PublishNowButton'

export const PostRow: React.FC<{ post: ScheduledPost; now: number; compact?: boolean }> = ({ post, now, compact }) => {
  const ui = useStudioUi()
  const { posts, settings } = useStudioData()
  const connections = useConnections()
  const { publishNow, busyId, progress } = usePublishNow()
  const busy = busyId === post.id
  const canAuto = (post.status === 'scheduled' || post.status === 'draft') && automatedPlatforms(post, connections).length > 0
  const links = (post.publishLog ?? []).filter((l) => l.ok && l.url)
  const bag = getBag(post.bagId)
  const due = isDue(post, now)
  const posted = post.status === 'posted'
  const when = posted && post.postedAt ? post.postedAt : post.scheduledAt
  const failed = post.publishLog?.filter((l) => !l.ok && !post.publishLog?.some((o) => o.ok && o.platform === l.platform))

  const toggleDone = (checked: boolean) => {
    if (checked) {
      studioActions.markPosted(post.id)
      ui.toast(`Bag #${post.bagId} checked off ✓`)
    } else {
      studioActions.updatePost(post.id, { status: 'scheduled', postedAt: undefined })
    }
  }

  const shuffle = () => {
    const bag = reshuffleOne(post, settings, posts)
    ui.toast(bag ? `Swapped to Bag #${bag.id}` : 'No other bags left to suggest')
  }

  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      sx={{
        p: 1,
        pl: 0.5,
        borderRadius: 2,
        border: 1,
        borderColor: due ? 'warning.main' : 'divider',
        bgcolor: due ? 'rgba(224,138,30,0.06)' : 'background.paper',
        cursor: 'pointer',
        opacity: posted || post.status === 'skipped' ? 0.72 : 1,
        '&:hover': { borderColor: due ? 'warning.main' : 'text.secondary' },
      }}
      onClick={() => !post.imported && ui.openEditor({ post })}
    >
      {post.status !== 'skipped' && (
        <Tooltip title={posted ? 'Posted — uncheck to undo' : 'Check off as posted'}>
          <Checkbox
            checked={posted}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => toggleDone(e.target.checked)}
            color="success"
            size="small"
            disabled={post.imported}
          />
        </Tooltip>
      )}
      <BagThumb bag={bag} size={compact ? 40 : 52} />
      <Box flex={1} minWidth={0}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography fontWeight={700} fontSize="0.92rem" sx={{ textDecoration: posted ? 'line-through' : 'none' }}>
            Bag #{post.bagId}
          </Typography>
          <StatusChip status={post.status} due={due} />
          <PlatformDots platforms={post.platforms} />
          {post.auto && post.status === 'scheduled' && (
            <Tooltip title="Planned by the auto scheduler — can be reshuffled">
              <BoltIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
            </Tooltip>
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" noWrap>
          {post.imported ? 'Marked as already posted' : `${posted ? 'Posted ' : ''}${fmtDateTime(when)} · ${fmtRelative(when, now)}`}
          {!compact && !post.imported && ` · ${post.caption.split('\n')[0]}`}
        </Typography>
        {(links.length > 0 || post.stats) && (
          <Stack direction="row" spacing={1.5} alignItems="center" onClick={(e) => e.stopPropagation()} sx={{ mt: 0.25 }}>
            {post.stats && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FavoriteBorderIcon sx={{ fontSize: 14 }} /> {post.stats.likes}
                <ChatBubbleOutlineIcon sx={{ fontSize: 14, ml: 1 }} /> {post.stats.comments}
              </Typography>
            )}
            {links.map((l) => (
              <Link key={l.platform + l.ref} href={l.url} target="_blank" rel="noreferrer" variant="caption" fontWeight={600}>
                View on {platformMeta(l.platform).label}
              </Link>
            ))}
          </Stack>
        )}
        {!!failed?.length && (
          <Typography variant="caption" color="error.main" noWrap component="div">
            Auto-publish failed: {failed.map((f) => `${f.platform} (${f.error})`).join(', ')}
          </Typography>
        )}
      </Box>
      <Stack direction="row" spacing={0.25} alignItems="center" onClick={(e) => e.stopPropagation()}>
        {isReshufflable(post, now) && (
          <Tooltip title="Suggest a different bag for this slot">
            <IconButton size="small" onClick={shuffle}>
              <ShuffleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {(post.status === 'scheduled' || post.status === 'draft') && (
          <PublishNowButton
            size="small"
            platforms={post.platforms}
            onPublish={() => publishNow(post.id)}
            busy={busy}
            progress={progress}
            disabled={!!busyId && !busy}
          />
        )}
        {canAuto && (
          <Tooltip title="Open publish assistant">
            <IconButton size="small" onClick={() => ui.openPublish(post.id)}>
              <SendOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {!canAuto && (post.status === 'scheduled' || post.status === 'draft') && (
          <Button
            size="small"
            variant={due ? 'contained' : 'outlined'}
            color={due ? 'warning' : 'primary'}
            startIcon={<SendOutlinedIcon />}
            onClick={() => ui.openPublish(post.id)}
            sx={{ whiteSpace: 'nowrap', display: { xs: compact ? 'none' : 'inline-flex', sm: 'inline-flex' } }}
          >
            {due ? 'Post now' : 'Publish'}
          </Button>
        )}
        {post.status === 'skipped' && (
          <Tooltip title="Back to schedule">
            <IconButton size="small" onClick={() => studioActions.updatePost(post.id, { status: 'scheduled' })}>
              <ReplayIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {!compact && !post.imported && (
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => ui.openEditor({ post })}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  )
}
