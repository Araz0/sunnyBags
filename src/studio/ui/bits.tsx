import React from 'react'
import { Box, Chip, Paper, Stack, Typography, useTheme } from '@mui/material'
import { ExtendedBag } from '../../data'
import { bagThumb, platformMeta } from '../helpers'
import { Platform, PostStatus } from '../types'

export const BagThumb: React.FC<{
  bag?: { id: number; category_id: number; backgroundColor?: string }
  size?: number
  radius?: number
}> = ({ bag, size = 44, radius = 8 }) => (
  <Box
    sx={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: `${radius}px`,
      bgcolor: bag?.backgroundColor || 'action.hover',
      border: 1,
      borderColor: 'divider',
      overflow: 'hidden',
      display: 'grid',
      placeItems: 'center',
    }}
  >
    {bag && (
      <img
        src={bagThumb(bag)}
        alt={`Bag ${bag.id}`}
        loading="lazy"
        style={{ width: '88%', height: '88%', objectFit: 'contain' }}
        onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')}
      />
    )}
  </Box>
)

const STATUS: Record<PostStatus, { label: string; color: 'default' | 'primary' | 'success' | 'warning' }> = {
  draft: { label: 'Draft', color: 'default' },
  scheduled: { label: 'Scheduled', color: 'primary' },
  posted: { label: 'Posted', color: 'success' },
  skipped: { label: 'Skipped', color: 'default' },
}

export const StatusChip: React.FC<{ status: PostStatus; due?: boolean }> = ({ status, due }) =>
  due ? (
    <Chip size="small" color="warning" label="Due now" />
  ) : (
    <Chip size="small" variant={status === 'scheduled' ? 'outlined' : 'filled'} color={STATUS[status].color} label={STATUS[status].label} />
  )

/** Platform brand colours, adjusted so TikTok's black stays visible in dark mode. */
// eslint-disable-next-line react-refresh/only-export-components
export const usePlatformStyle = () => {
  const dark = useTheme().palette.mode === 'dark'
  return (id: Platform) => {
    const meta = platformMeta(id)
    if (id === 'tiktok' && dark) return { bgcolor: '#ffffff', color: '#000000' }
    return { bgcolor: meta.color, color: '#ffffff' }
  }
}

/** Props for a selectable platform <Chip>. */
// eslint-disable-next-line react-refresh/only-export-components
export const usePlatformChip = () => {
  const style = usePlatformStyle()
  return (id: Platform, on: boolean) =>
    on
      ? { variant: 'filled' as const, sx: { ...style(id), '&:hover': { ...style(id), opacity: 0.9 } } }
      : { variant: 'outlined' as const }
}

export const PlatformDots: React.FC<{ platforms: Platform[] }> = ({ platforms }) => {
  const style = usePlatformStyle()
  return (
  <Stack direction="row" spacing={0.5} alignItems="center">
    {platforms.map((p) => (
      <Box
        key={p}
        title={platformMeta(p).label}
        sx={{
          fontSize: '0.68rem',
          fontWeight: 700,
          px: 0.75,
          py: 0.1,
          borderRadius: 1,
          ...style(p),
        }}
      >
        {platformMeta(p).label.slice(0, 2).toUpperCase()}
      </Box>
    ))}
  </Stack>
  )
}

export const Panel: React.FC<{
  title?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  pad?: number
}> = ({ title, action, children, pad = 2.5 }) => (
  <Paper variant="outlined" sx={{ p: pad, borderRadius: 3 }}>
    {(title || action) && (
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} gap={1}>
        {typeof title === 'string' ? <Typography variant="h3">{title}</Typography> : title}
        {action}
      </Stack>
    )}
    {children}
  </Paper>
)

export const Stat: React.FC<{ label: string; value: React.ReactNode; hint?: string; tone?: string }> = ({
  label,
  value,
  hint,
  tone,
}) => (
  <Paper variant="outlined" sx={{ p: 2.25, borderRadius: 3, flex: 1, minWidth: 150 }}>
    <Typography variant="body2" color="text.secondary" fontWeight={600}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: '1.9rem', fontWeight: 750, lineHeight: 1.2, mt: 0.5, color: tone }}>{value}</Typography>
    {hint && (
      <Typography variant="caption" color="text.secondary">
        {hint}
      </Typography>
    )}
  </Paper>
)

export const PageHead: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode }> = ({
  title,
  subtitle,
  actions,
}) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={3}>
    <Box>
      <Typography variant="h1">{title}</Typography>
      {subtitle && (
        <Typography color="text.secondary" mt={0.5}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {actions && (
      <Stack direction="row" gap={1} flexWrap="wrap">
        {actions}
      </Stack>
    )}
  </Stack>
)

// eslint-disable-next-line react-refresh/only-export-components
export const bagLabel = (b: ExtendedBag) => `#${b.id} · ${b.category ?? 'Bag'}`
