import React from 'react'
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import DateRangeIcon from '@mui/icons-material/DateRange'
import NotesIcon from '@mui/icons-material/Notes'
import { fmtDateTime, generateCaption, getBag } from '../helpers'
import { buildAutoPlan, isReshufflable, reshuffleAll } from '../planner'
import { studioActions, useStudioData } from '../store'
import { useStudioUi } from './context'

/** "Auto-schedule" menu + "Reshuffle all" button. */
export const SchedulerActions: React.FC = () => {
  const { posts, settings } = useStudioData()
  const ui = useStudioUi()
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)
  const reshufflable = posts.filter((p) => isReshufflable(p)).length

  const plan = (weeks: number | 'all') => {
    setAnchor(null)
    const list = buildAutoPlan(settings, posts, weeks)
    if (!list.length) {
      ui.toast(
        weeks === 'all'
          ? 'Every available bag is already scheduled or posted'
          : 'Your schedule is already full for that period',
      )
      return
    }
    if (
      weeks === 'all' &&
      !confirm(
        `Schedule ${list.length} bags, from ${fmtDateTime(list[0].scheduledAt)} until ${fmtDateTime(list[list.length - 1].scheduledAt)}?`,
      )
    )
      return
    studioActions.addPosts(list)
    ui.toast(`Scheduled ${list.length} post${list.length > 1 ? 's' : ''} ✨`)
  }

  const refreshCaptions = () => {
    setAnchor(null)
    const n = posts.filter((p) => isReshufflable(p)).length
    if (!n) {
      ui.toast('No upcoming auto-planned posts')
      return
    }
    if (!confirm(`Rewrite the captions of ${n} upcoming auto-planned posts with your current caption settings? Posts you edited yourself are kept.`)) return
    studioActions.mutatePosts((all) =>
      all.map((p) => {
        const bag = isReshufflable(p) ? getBag(p.bagId) : undefined
        return bag ? { ...p, caption: generateCaption(bag, settings.captionTone, settings), language: settings.captionLanguage, includeFabric: settings.includeFabric } : p
      }),
    )
    ui.toast(`Rewrote ${n} caption${n > 1 ? 's' : ''}`)
  }

  const shuffleAll = () => {
    if (!confirm(`Pick new bags for all ${reshufflable} upcoming auto-planned posts? Posts you created or edited stay as they are.`)) return
    const n = reshuffleAll(settings, posts)
    ui.toast(`Reshuffled ${n} post${n === 1 ? '' : 's'} 🔀`)
  }

  return (
    <>
      <Button variant="contained" startIcon={<AutoAwesomeIcon />} endIcon={<ExpandMoreIcon />} onClick={(e) => setAnchor(e.currentTarget)}>
        Auto-schedule
      </Button>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        <MenuItem onClick={() => plan(1)}>
          <ListItemIcon><DateRangeIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Next week" />
        </MenuItem>
        <MenuItem onClick={() => plan(2)}>
          <ListItemIcon><DateRangeIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Next 2 weeks" />
        </MenuItem>
        <MenuItem onClick={() => plan(4)}>
          <ListItemIcon><DateRangeIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Next month" />
        </MenuItem>
        <MenuItem onClick={() => plan('all')}>
          <ListItemIcon><AllInclusiveIcon fontSize="small" /></ListItemIcon>
          <ListItemText
            primary="Schedule everything"
            secondary={settings.includePosted ? 'Every available bag' : 'Every bag not posted yet'}
          />
        </MenuItem>
        <MenuItem onClick={refreshCaptions}>
          <ListItemIcon><NotesIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Rewrite upcoming captions" secondary="Apply current language, tone, material, sign-off & hashtags" />
        </MenuItem>
      </Menu>
      <Button variant="outlined" startIcon={<ShuffleIcon />} onClick={shuffleAll} disabled={!reshufflable}>
        Reshuffle all
      </Button>
    </>
  )
}
