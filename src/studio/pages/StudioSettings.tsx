import React from 'react'
import {
  Alert,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  MenuItem,
  Slider,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import { allBags } from '../../data'
import { LANGUAGES, PLATFORMS, TONES, WEEKDAYS } from '../constants'
import { generateCaption } from '../helpers'
import { downloadBlob } from '../ics'
import { studioActions, useStudioData } from '../store'
import { CaptionLanguage, CaptionTone, StudioData } from '../types'
import { PageHead, Panel, usePlatformChip } from '../ui/bits'
import { useStudioUi } from '../ui/context'

const MON_FIRST = [1, 2, 3, 4, 5, 6, 0]

export const StudioSettings: React.FC = () => {
  const { settings, posts } = useStudioData()
  const ui = useStudioUi()
  const chipProps = usePlatformChip()
  const set = studioActions.updateSettings
  const fileRef = React.useRef<HTMLInputElement>(null)
  const sample = allBags.all.find((b) => b.available !== false) ?? allBags.all[0]
  const notifSupported = 'Notification' in window
  const [perm, setPerm] = React.useState(notifSupported ? Notification.permission : 'denied')

  const toggleNotifications = async (on: boolean) => {
    if (on && notifSupported && Notification.permission !== 'granted') {
      const p = await Notification.requestPermission()
      setPerm(p)
      if (p !== 'granted') {
        ui.toast('Notifications blocked by the browser')
        return
      }
    }
    set({ notifications: on })
  }

  const backup = () => {
    downloadBlob(JSON.stringify(studioActions.exportData(), null, 2), `sunnybags-studio-${new Date().toISOString().slice(0, 10)}.json`, 'application/json')
  }

  const restore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    f.text()
      .then((t) => {
        const data = JSON.parse(t) as StudioData
        if (!Array.isArray(data.posts)) throw new Error('bad file')
        if (!confirm(`Replace your current ${posts.length} posts with ${data.posts.length} from the backup?`)) return
        studioActions.importData(data)
        ui.toast('Backup restored')
      })
      .catch(() => ui.toast('That file is not a studio backup'))
    e.target.value = ''
  }

  return (
    <>
      <PageHead title="Settings" subtitle="Your posting rhythm and defaults. Auto-plan and “Next slot” follow these." />
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Stack spacing={3}>
            <Panel title="Posting schedule">
              <Stack spacing={2.5}>
                <div>
                  <Typography variant="body2" fontWeight={600} mb={1}>
                    Posting days
                  </Typography>
                  <ToggleButtonGroup
                    value={settings.postingDays}
                    onChange={(_, v: number[]) => set({ postingDays: v, weeklyGoal: Math.max(1, Math.min(settings.weeklyGoal, v.length || 1)) })}
                    size="small"
                    sx={{ flexWrap: 'wrap' }}
                  >
                    {MON_FIRST.map((d) => (
                      <ToggleButton key={d} value={d} sx={{ px: 1.75 }}>
                        {WEEKDAYS[d]}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </div>
                <TextField
                  label="Posting time"
                  type="time"
                  value={settings.postingTime}
                  onChange={(e) => set({ postingTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{ maxWidth: 200 }}
                  helperText="Evenings (18–20h) usually get the most reach."
                />
                <div>
                  <Typography variant="body2" fontWeight={600}>
                    Weekly goal: {settings.weeklyGoal} post{settings.weeklyGoal > 1 ? 's' : ''}
                  </Typography>
                  <Slider min={1} max={7} step={1} marks value={settings.weeklyGoal} onChange={(_, v) => set({ weeklyGoal: v as number })} sx={{ maxWidth: 360 }} />
                  <Typography variant="caption" color="text.secondary">
                    Hitting this every week builds your streak. Start small — consistency beats volume.
                  </Typography>
                </div>
              </Stack>
            </Panel>

            <Panel title="Auto scheduler">
              <Stack spacing={2}>
                <TextField
                  select
                  size="small"
                  label="Keep my queue filled automatically"
                  value={settings.autoFillWeeks}
                  onChange={(e) => set({ autoFillWeeks: Number(e.target.value) })}
                  sx={{ maxWidth: 320 }}
                  helperText="Whenever you open the studio, empty posting slots in this window are filled with new bags."
                >
                  <MenuItem value={0}>Off</MenuItem>
                  <MenuItem value={1}>1 week ahead</MenuItem>
                  <MenuItem value={2}>2 weeks ahead</MenuItem>
                  <MenuItem value={4}>4 weeks ahead</MenuItem>
                  <MenuItem value={8}>8 weeks ahead</MenuItem>
                </TextField>
                <FormControlLabel
                  control={<Switch checked={settings.includePosted} onChange={(e) => set({ includePosted: e.target.checked })} />}
                  label="Allow re-posting bags that were already posted (least recent first)"
                />
                <Typography variant="caption" color="text.secondary">
                  Use “Auto-schedule → Schedule everything” on the dashboard or queue to plan every remaining bag at once.
                </Typography>
              </Stack>
            </Panel>

            <Panel title="Reminders">
              <Stack spacing={1.5}>
                <FormControlLabel
                  control={<Switch checked={settings.notifications && perm === 'granted'} onChange={(e) => toggleNotifications(e.target.checked)} disabled={!notifSupported} />}
                  label="Browser notification when a post is due (while the studio is open)"
                />
                <Alert severity="info" variant="outlined">
                  For reminders on your phone even when this site is closed, use <strong>Queue → Add reminders to my calendar</strong>. Each event alerts 10 minutes before and links straight to the publish assistant.
                </Alert>
              </Stack>
            </Panel>

            <Panel title="Data">
              <Typography variant="body2" color="text.secondary" mb={2}>
                Your plan is saved in this browser. Back it up to move it to another device.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={backup}>
                  Download backup
                </Button>
                <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => fileRef.current?.click()}>
                  Restore
                </Button>
                <input ref={fileRef} type="file" accept="application/json" hidden onChange={restore} />
              </Stack>
            </Panel>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Panel title="Caption defaults">
            <Stack spacing={2.5}>
              <div>
                <Typography variant="body2" fontWeight={600} mb={1}>
                  Default platforms
                </Typography>
                <Stack direction="row" gap={1} flexWrap="wrap">
                  {PLATFORMS.map((p) => {
                    const on = settings.defaultPlatforms.includes(p.id)
                    return (
                      <Chip
                        key={p.id}
                        label={p.label}
                        {...chipProps(p.id, on)}
                        onClick={() =>
                          set({
                            defaultPlatforms: on
                              ? settings.defaultPlatforms.filter((x) => x !== p.id)
                              : [...settings.defaultPlatforms, p.id],
                          })
                        }
                      />
                    )
                  })}
                </Stack>
              </div>
              <div>
                <Typography variant="body2" fontWeight={600} mb={1}>
                  Caption language
                </Typography>
                <ToggleButtonGroup size="small" exclusive value={settings.captionLanguage} onChange={(_, v: CaptionLanguage | null) => v && set({ captionLanguage: v })}>
                  {LANGUAGES.map((l) => (
                    <ToggleButton key={l.id} value={l.id} sx={{ px: 1.75 }}>
                      {l.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                  Used for new and auto-planned posts. You can still change it per post. DE + EN puts the German text first.
                </Typography>
              </div>
              <TextField select label="Default tone" value={settings.captionTone} onChange={(e) => set({ captionTone: e.target.value as CaptionTone })} size="small" sx={{ maxWidth: 240 }}>
                {TONES.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Sign-off line (English)" value={settings.signature} onChange={(e) => set({ signature: e.target.value })} size="small" />
              <TextField label="Hashtags (English)" value={settings.hashtags} onChange={(e) => set({ hashtags: e.target.value })} multiline minRows={2} size="small" />
              <TextField label="Sign-off line (Deutsch)" value={settings.signatureDe} onChange={(e) => set({ signatureDe: e.target.value })} size="small" />
              <TextField
                label="Hashtags (Deutsch)"
                value={settings.hashtagsDe}
                onChange={(e) => set({ hashtagsDe: e.target.value })}
                multiline
                minRows={2}
                size="small"
                helperText="DE + EN posts combine both sets, without duplicates and up to the Instagram limit of 30."
              />
              <div>
                <Typography variant="body2" fontWeight={600} mb={1}>
                  Preview
                </Typography>
                <Typography
                  component="pre"
                  sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.85rem', bgcolor: 'action.hover', p: 2, borderRadius: 2, m: 0 }}
                >
                  {generateCaption(sample, settings.captionTone, settings)}
                </Typography>
              </div>
            </Stack>
          </Panel>
        </Grid>
      </Grid>
    </>
  )
}
