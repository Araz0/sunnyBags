import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { PLATFORMS } from '../constants'
import { clearConnections, Connections, routeFor, setConnections, useConnections } from '../connections'
import { testMeta, testWebhook } from '../publish'
import { PageHead, Panel, usePlatformChip } from '../ui/bits'
import { useStudioUi } from '../ui/context'

const Secret: React.FC<{ label: string; value: string; onChange: (v: string) => void; helper?: React.ReactNode }> = ({
  label,
  value,
  onChange,
  helper,
}) => {
  const [show, setShow] = React.useState(false)
  return (
    <TextField
      label={label}
      size="small"
      fullWidth
      type={show ? 'text' : 'password'}
      value={value}
      onChange={(e) => onChange(e.target.value.trim())}
      autoComplete="off"
      helperText={helper}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => setShow(!show)} aria-label={show ? 'Hide' : 'Show'}>
              {show ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

const ROUTE_LABEL = { meta: 'Meta API', webhook: 'Webhook', manual: 'Manual' } as const

export const StudioConnections: React.FC = () => {
  const c = useConnections()
  const ui = useStudioUi()
  const chipProps = usePlatformChip()
  const [result, setResult] = React.useState<{ key: string; ok: boolean; msg: string } | null>(null)
  const [busy, setBusy] = React.useState<string | null>(null)

  const meta = (patch: Partial<Connections['meta']>) => setConnections({ meta: { ...c.meta, ...patch } })
  const cloud = (patch: Partial<Connections['cloudinary']>) => setConnections({ cloudinary: { ...c.cloudinary, ...patch } })
  const hook = (patch: Partial<Connections['webhook']>) => setConnections({ webhook: { ...c.webhook, ...patch } })

  const run = async (key: string, fn: () => Promise<string>) => {
    setBusy(key)
    setResult(null)
    try {
      setResult({ key, ok: true, msg: await fn() })
    } catch (e) {
      setResult({ key, ok: false, msg: (e as Error).message })
    } finally {
      setBusy(null)
    }
  }

  const resultFor = (key: string) =>
    result?.key === key && (
      <Alert severity={!result.ok ? 'error' : result.msg.includes('✕') ? 'warning' : 'success'} onClose={() => setResult(null)} sx={{ whiteSpace: 'pre-line' }}>
        {result.msg}
      </Alert>
    )

  return (
    <>
      <PageHead
        title="Connections"
        subtitle="Connect your accounts so the studio can publish for you."
        actions={
          <Button component={RouterLink} to="/studio/guide#automation" variant="outlined">
            How to get these tokens
          </Button>
        }
      />

      <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
        Tokens are saved <strong>only in this browser</strong> (localStorage). They're not in backups or in the code. Only enter them on
        your own device, and never commit them to the repository.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <Stack spacing={3}>
            <Panel title="Status">
              <Stack spacing={1.25}>
                {PLATFORMS.map((p) => {
                  const r = routeFor(p.id, c)
                  return (
                    <Stack key={p.id} direction="row" alignItems="center" spacing={1.25}>
                      {r === 'manual' ? <RadioButtonUncheckedIcon color="disabled" fontSize="small" /> : <CheckCircleIcon color="success" fontSize="small" />}
                      <Typography fontWeight={600} flex={1}>
                        {p.label}
                      </Typography>
                      <Chip size="small" label={ROUTE_LABEL[r]} color={r === 'manual' ? 'default' : 'success'} variant={r === 'manual' ? 'outlined' : 'filled'} />
                    </Stack>
                  )
                })}
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" mt={2}>
                Manual means the publish assistant walks you through it (download → copy → post).
              </Typography>
            </Panel>

            <Panel title="Auto-publish">
              <FormControlLabel
                control={<Switch checked={c.autoPublish} onChange={(e) => setConnections({ autoPublish: e.target.checked })} />}
                label="Publish due posts automatically"
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                The site is a static page, so it can only publish while a studio tab is open: at posting time, or as soon as you
                open the studio afterwards. Leave a tab open on a computer that stays on, or use a webhook (Make / n8n) to
                schedule on their servers. Each post is tried once automatically. If it fails, the error shows in the queue and
                you can retry from the publish assistant.
              </Typography>
            </Panel>

            <Button color="inherit" onClick={() => confirm('Remove all saved tokens from this browser?') && (clearConnections(), ui.toast('Tokens removed'))}>
              Remove all tokens from this browser
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Stack spacing={3}>
            <Panel title="Meta: Instagram & Facebook">
              <Stack spacing={2}>
                <Secret
                  label="Page access token"
                  value={c.meta.pageToken}
                  onChange={(v) => meta({ pageToken: v })}
                  helper="Long-lived Page token with instagram_content_publish + pages_manage_posts."
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField size="small" fullWidth label="Facebook Page ID" helperText="The “id” from GET me/accounts" value={c.meta.pageId} onChange={(e) => meta({ pageId: e.target.value.trim() })} />
                  <TextField size="small" fullWidth label="Instagram user ID" value={c.meta.igUserId} onChange={(e) => meta({ igUserId: e.target.value.trim() })} helperText="Leave empty — “Test connection” fills it in" />
                </Stack>
                <TextField size="small" label="Graph API version" value={c.meta.graphVersion} onChange={(e) => meta({ graphVersion: e.target.value.trim() })} sx={{ maxWidth: 200 }} />
                <Box>
                  <Button variant="outlined" disabled={!c.meta.pageToken || busy === 'meta'} onClick={() =>
                      run('meta', async () => {
                        const r = await testMeta(c)
                        if (r.igUserId) meta({ igUserId: r.igUserId })
                        return r.message
                      })
                    }>
                    {busy === 'meta' ? 'Testing…' : 'Test connection'}
                  </Button>
                </Box>
                {resultFor('meta')}
              </Stack>
            </Panel>

            <Panel title="Cloudinary: image hosting (optional)">
              <Typography variant="body2" color="text.secondary" mb={2}>
                Instagram needs each image at a public URL. Without Cloudinary, the studio uploads the image to your Facebook Page as a hidden,
                unpublished photo, uses that link, and deletes it after posting. Cloudinary is only an alternative, and it gives a webhook proper
                image links.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField size="small" fullWidth label="Cloud name" value={c.cloudinary.cloudName} onChange={(e) => cloud({ cloudName: e.target.value.trim() })} />
                <TextField size="small" fullWidth label="Unsigned upload preset" value={c.cloudinary.uploadPreset} onChange={(e) => cloud({ uploadPreset: e.target.value.trim() })} />
              </Stack>
            </Panel>

            <Panel title="Webhook: TikTok, Pinterest & anything else">
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  TikTok and Pinterest don't allow posting straight from a browser. Send posts to a Make, Zapier or n8n scenario
                  instead, and it publishes them for you.
                </Typography>
                <Secret label="Webhook URL" value={c.webhook.url} onChange={(v) => hook({ url: v })} />
                <Secret label="Shared secret (optional)" value={c.webhook.secret} onChange={(v) => hook({ secret: v })} helper="Sent as “secret” in the JSON so your scenario can reject other callers." />
                <Box>
                  <Typography variant="body2" fontWeight={600} mb={1}>
                    Send these platforms to the webhook
                  </Typography>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    {PLATFORMS.map((p) => {
                      const on = c.webhook.platforms.includes(p.id)
                      return (
                        <Chip
                          key={p.id}
                          label={p.label}
                          {...chipProps(p.id, on)}
                          onClick={() => hook({ platforms: on ? c.webhook.platforms.filter((x) => x !== p.id) : [...c.webhook.platforms, p.id] })}
                        />
                      )
                    })}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    If Meta is connected, Instagram and Facebook use the Meta API first.
                  </Typography>
                </Box>
                <Box>
                  <Button variant="outlined" disabled={!c.webhook.url || busy === 'hook'} onClick={() => run('hook', () => testWebhook(c))}>
                    {busy === 'hook' ? 'Sending…' : 'Send test event'}
                  </Button>
                </Box>
                {resultFor('hook')}
              </Stack>
            </Panel>

            <Typography variant="body2" color="text.secondary">
              Step-by-step setup is in the{' '}
              <Link component={RouterLink} to="/studio/guide#automation">
                Guide
              </Link>
              .
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}
