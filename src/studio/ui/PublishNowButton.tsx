import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, CircularProgress } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import { missingFor, routeFor, useConnections } from '../connections'
import { platformMeta } from '../helpers'
import { Platform } from '../types'
import { useStudioUi } from './context'

interface Props {
  platforms: Platform[]
  onPublish: () => void
  busy?: boolean
  progress?: string | null
  disabled?: boolean
  size?: 'small' | 'medium'
  variant?: 'contained' | 'outlined'
}

/**
 * Always-visible "Post to Instagram" / "Publish now" button. When nothing is
 * connected yet it explains what's missing instead of hiding.
 */
export const PublishNowButton: React.FC<Props> = ({ platforms, onPublish, busy, progress, disabled, size = 'medium', variant = 'contained' }) => {
  const c = useConnections()
  const ui = useStudioUi()
  const navigate = useNavigate()
  const ready = platforms.filter((p) => routeFor(p, c) !== 'manual')
  const shown = ready.length ? ready : platforms.includes('instagram') ? (['instagram'] as Platform[]) : platforms
  const label =
    shown.length === 1 ? `Post to ${platformMeta(shown[0]).label}` : shown.length ? `Post to ${shown.map((p) => platformMeta(p).label).join(' + ')}` : 'Post now'

  const click = () => {
    if (ready.length) return onPublish()
    if (!platforms.length) return ui.toast('Pick at least one platform first')
    const p = shown[0]
    ui.toast(`To post to ${platformMeta(p).label} automatically, add in Connections: ${missingFor(p, c).join(', ')}`)
    navigate('/studio/connections')
  }

  return (
    <Button
      size={size}
      variant={variant}
      color="success"
      startIcon={busy ? <CircularProgress size={14} color="inherit" /> : <BoltIcon />}
      onClick={click}
      disabled={disabled || busy}
      sx={{ whiteSpace: 'nowrap' }}
    >
      {busy ? (progress ?? 'Posting…') : label}
    </Button>
  )
}
