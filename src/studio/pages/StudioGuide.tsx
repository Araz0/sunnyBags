import React from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Alert,
  Box,
  Grid,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { PageHead } from '../ui/bits'

const TOC: [string, string][] = [
  ['quick-start', 'Quick start'],
  ['routine', 'Daily routine'],
  ['publish-now', 'Publish now, sync & stats'],
  ['scheduler', 'Auto scheduler & reshuffle'],
  ['progress', 'Checking off & “already posted”'],
  ['reminders', 'Reminders'],
  ['automation', 'Automated posting'],
  ['meta', 'Set up Instagram & Facebook'],
  ['cloudinary', 'Set up Cloudinary'],
  ['webhook', 'Set up a webhook (TikTok, Pinterest)'],
  ['security', 'Where tokens are stored'],
  ['data', 'Backups & other devices'],
  ['troubleshooting', 'Troubleshooting'],
]

const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <Box id={id} component="section" sx={{ scrollMarginTop: 24, mb: 5 }}>
    <Typography variant="h2" sx={{ fontSize: '1.3rem', mb: 1.5 }}>
      {title}
    </Typography>
    <Stack spacing={1.5} sx={{ '& li': { mb: 0.75 }, '& ol, & ul': { pl: 3, my: 0 }, lineHeight: 1.65 }}>
      {children}
    </Stack>
  </Box>
)

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography component="div" sx={{ lineHeight: 1.7 }}>
    {children}
  </Typography>
)

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box component="code" sx={{ bgcolor: 'action.hover', px: 0.6, py: 0.1, borderRadius: 1, fontSize: '0.86em', fontFamily: 'ui-monospace, Consolas, monospace' }}>
    {children}
  </Box>
)

const Pre: React.FC<{ children: string }> = ({ children }) => (
  <Box
    component="pre"
    sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2, overflowX: 'auto', fontSize: '0.8rem', fontFamily: 'ui-monospace, Consolas, monospace', m: 0 }}
  >
    {children}
  </Box>
)

const Ext: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link href={href} target="_blank" rel="noreferrer">
    {children}
  </Link>
)

const In: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link component={RouterLink} to={to}>
    {children}
  </Link>
)

const PAYLOAD = `{
  "event": "sunnybags.publish",
  "secret": "your-shared-secret",
  "postId": "lx3k9a2b1c",
  "platforms": ["tiktok", "pinterest"],
  "caption": "Meet Bag #133 ☀️ ...",
  "scheduledAt": "2026-11-25T17:00:00.000Z",
  "bag": { "id": 133, "category": "Coin Purses", "price": 2, "fabric": "cotton",
           "description": "Emerald-green cotton tote ..." },
  "shopUrl": "https://your-site/item/133",
  "imageUrls": ["https://res.cloudinary.com/.../sunnybags/abc.jpg"],
  "images": null   // only filled (base64 data URLs) when Cloudinary isn't set up
}`

export const StudioGuide: React.FC = () => {
  const { hash } = useLocation()
  React.useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <>
      <PageHead title="Guide" subtitle="How the studio works, and how to connect your social accounts." />
      <Grid container spacing={4}>
        <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, position: 'sticky', top: 24 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              On this page
            </Typography>
            <Stack spacing={0.75} mt={1}>
              {TOC.map(([id, label]) => (
                <Link key={id} href={`#${id}`} underline="hover" color="text.primary" fontSize="0.88rem" onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                  history.replaceState(null, '', `#${id}`)
                }}>
                  {label}
                </Link>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9} sx={{ maxWidth: 860 }}>
          <Section id="quick-start" title="Quick start">
            <ol>
              <li>
                Once Instagram is connected, click <strong>Queue → History → Sync from Instagram</strong> to mark everything already on your feed. Or, in{' '}
                <In to="/studio/library">Bag library</In>, select the bags you already posted and click <strong>Mark as already posted</strong>.
              </li>
              <li>
                In <In to="/studio/settings">Settings</In>, pick your posting days, time and weekly goal. Optionally turn on{' '}
                <strong>Keep my queue filled automatically</strong>.
              </li>
              <li>
                On the <In to="/studio">Dashboard</In>, click <strong>Auto-schedule → Schedule everything</strong> (or a shorter range).
              </li>
              <li>
                Don't like a pick? Hit 🔀 on that post to swap it, or <strong>Reshuffle all</strong> for a fresh plan.
              </li>
              <li>
                Get reminded: <In to="/studio/queue">Queue</In> → <strong>Calendar reminders</strong> adds every post to your phone calendar.
              </li>
              <li>
                Optional: connect accounts in <In to="/studio/connections">Connections</In> so posts go out by themselves.
              </li>
            </ol>
          </Section>

          <Section id="routine" title="Daily routine (2 minutes)">
            <P>
              The studio is built for your phone: tabs at the bottom, a <strong>Post to Instagram</strong> bar in the bag editor, and a list view in the calendar.
              Open <Code>/studio</Code> in your phone browser and use <em>Add to Home Screen</em> to launch it like an app. Tokens and your plan are stored per browser,
              so on a new phone, restore a backup (Settings) and re-enter the tokens (Connections).
            </P>
            <P>When a post is due, your calendar or the browser pings you and the queue shows it as <strong>Due now</strong>.</P>
            <ol>
              <li>Click <strong>Post now</strong> to open the publish assistant.</li>
              <li>Download the image (or use <strong>Share</strong> on your phone to go straight into Instagram).</li>
              <li>Copy the caption, open the app, post.</li>
              <li>Click <strong>I posted it</strong>, or just tick the checkbox in the queue.</li>
            </ol>
            <P>If the platforms are connected and auto-publish is on, this all happens by itself.</P>
          </Section>

          <Section id="publish-now" title="Publish now, sync & stats">
            <ul>
              <li>
                <strong>Publish now</strong> (⚡ green button) sends a post straight to every connected platform it's set for: from a queue row, the post
                editor, or the bag studio (<Code>/item/123/studio</Code>, which uses the current design and caption). Platforms marked ⚡ are connected. Others
                stay manual. A post published early moves to “now”, and its old slot is freed.
              </li>
              <li>
                <strong>Carousel order:</strong> every post goes out as <strong>1. front → 2. back → 3. extra photo</strong>. The extra photo is optional: add it
                in the bag's studio page (Carousel → Add photo). It's saved for that bag and added to all its posts, and you can turn it off per post in the editor.
                Click a slide in the studio to leave it out. If a bag has no back photo, that slide is skipped.
              </li>
              <li>
                <strong>Instagram sync runs automatically</strong> when you open the studio and every 30 minutes (Connections → Automation). Posted something by hand
                in the Instagram app? The matching planned post is checked off by itself. <strong>Sync from Instagram</strong> (Queue → History) re-reads the whole feed on demand. Every post whose caption contains <Code>Bag #123</Code> is recorded as
                posted, with its link and likes, so the scheduler won't repeat it. Bags in older posts without that text can be marked by hand in the library.
              </li>
              <li>
                <strong>Likes &amp; comments</strong> for posts published from the studio refresh automatically every 6 hours when you open the studio, or with
                <em> Refresh likes &amp; comments</em>. The dashboard shows your best-performing posts.
              </li>
              <li>
                Captions are plain text: number, description, fabric, sign-off and hashtags, in <strong>English, Deutsch or DE + EN</strong>. Set the default in Settings, or switch per post in the editor or bag studio. All 148 bag descriptions have hand-written German versions, and German sign-off and hashtags are set separately. Sync from Instagram recognises both “Bag #12” and “Tasche #12”. Changed your hashtags or sign-off? Use{' '}
                <strong>Auto-schedule → Rewrite upcoming captions</strong>.
              </li>
            </ul>
          </Section>

          <Section id="scheduler" title="Auto scheduler & reshuffle">
            <ul>
              <li>
                <strong>Auto-schedule</strong> fills your free posting slots (one post per posting day). It picks unsold bags that aren't
                queued, starting with bags that were never posted, then the least recently posted ones. Discounted bags get a small
                boost, and it rotates collections so the feed stays varied.
              </li>
              <li>
                <strong>Schedule everything</strong> plans every remaining bag at once, as far ahead as needed.
              </li>
              <li>
                <strong>Keep my queue filled</strong> (Settings) tops the queue up each time you open the studio, so you never run out.
              </li>
              <li>
                Posts planned by the scheduler have a ⚡ icon. Only those can be reshuffled: 🔀 swaps one post, <strong>Reshuffle all</strong>{' '}
                re-picks all upcoming ones. Once you edit a post yourself it stays locked in.
              </li>
              <li>
                Bags marked as posted are skipped, unless you allow re-posting in Settings.
              </li>
            </ul>
          </Section>

          <Section id="progress" title="Checking off & “already posted”">
            <ul>
              <li>
                Each post in the queue has a checkbox. Tick it once it's posted, untick to undo. <strong>This week</strong> shows
                your progress bar.
              </li>
              <li>
                In the library, select bags (or use the ✓✓ button on a card) and click <strong>Mark as already posted</strong> for anything
                you posted before. Any upcoming auto-planned posts for those bags are removed and refilled with other bags.
              </li>
              <li>Everything is saved automatically in this browser (localStorage). No save button needed.</li>
            </ul>
          </Section>

          <Section id="reminders" title="Reminders">
            <ul>
              <li>
                <strong>Calendar reminders</strong> (Queue) downloads an <Code>.ics</Code> file. Open it on your phone or computer to add every scheduled
                post to your calendar, with an alert 10 minutes before. Each event links to its publish assistant. Re-download it after
                big changes.
              </li>
              <li>
                <strong>Browser notifications</strong> (Settings) work while a studio tab is open.
              </li>
              <li>The browser tab title shows how many posts are waiting, e.g. <Code>(2) Studio</Code>.</li>
            </ul>
          </Section>

          <Section id="automation" title="Automated posting">
            <P>
              This website has no server, so the studio publishes from your browser. Each platform gets one of three routes:
            </P>
            <Paper variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Platform</TableCell>
                    <TableCell>Automatic route</TableCell>
                    <TableCell>You need</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Instagram</TableCell>
                    <TableCell>Meta Graph API</TableCell>
                    <TableCell>Business/Creator account linked to a Facebook Page, Page token + Page ID</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Facebook Page</TableCell>
                    <TableCell>Meta Graph API</TableCell>
                    <TableCell>Page token + Page ID</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TikTok</TableCell>
                    <TableCell>Webhook → Make / Zapier / n8n</TableCell>
                    <TableCell>An automation scenario that posts to TikTok (e.g. via Buffer)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Pinterest</TableCell>
                    <TableCell>Webhook → Make / Zapier / n8n</TableCell>
                    <TableCell>A scenario with a “Create Pin” step</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
            <P>Platforms without a route stay manual, and the publish assistant guides you through them.</P>
            <Alert severity="info" variant="outlined">
              <strong>Important:</strong> auto-publish only runs while a studio tab is open in a browser. A post that comes due while the tab is
              closed is published the next time you open the studio. To post on time with your laptop shut, either leave a tab open on a
              computer that stays on, or route all platforms through a webhook and let Make/n8n handle the timing (e.g. with Buffer).
            </Alert>
            <P>
              In the publish assistant, the <strong>Publish automatically</strong> button sends a post right away, whatever its scheduled time.
            </P>
          </Section>

          <Section id="meta" title="Set up Instagram & Facebook (Meta Graph API)">
            <P>Takes about 15 minutes, once. It's free, and you don't need Meta's App Review because you're only posting to your own accounts.</P>
            <ol>
              <li>
                <strong>Make Instagram a professional account.</strong> In the Instagram app: Settings → Account type and tools → Switch to
                professional account (Business or Creator).
              </li>
              <li>
                <strong>Link it to a Facebook Page.</strong> Create a Page for SunnyBags if you don't have one. Then in the Page settings →
                Linked accounts → Instagram, connect your account. Meta Business Suite works too.
              </li>
              <li>
                <strong>Create a Meta app.</strong> Go to <Ext href="https://developers.facebook.com/apps">developers.facebook.com/apps</Ext> → Create app,
                name it e.g. “SunnyBags Studio”. The app can stay in development mode.
              </li>
              <li>
                <strong>Add the use cases. This step unlocks the permissions.</strong> In the app dashboard open <em>Use cases</em> (or pick them while creating
                the app) and add:
                <ul>
                  <li><em>Manage everything on your Page</em>: unlocks <Code>pages_manage_posts</Code> and <Code>pages_read_engagement</Code>.</li>
                  <li>
                    <em>Manage messaging &amp; content on Instagram</em>. Choose <strong>API setup with Facebook login</strong> (not “Instagram login”). This unlocks{' '}
                    <Code>instagram_basic</Code> and <Code>instagram_content_publish</Code>.
                  </li>
                </ul>
                Click <em>Customize</em> on each use case and make sure the permissions above are added. If you skip this, the Graph API Explorer only offers{' '}
                <Code>pages_show_list</Code> and <Code>business_management</Code>, and Test reports “does not exist / missing permissions”.
              </li>
              <li>
                <strong>Get a user token.</strong> Open the <Ext href="https://developers.facebook.com/tools/explorer/">Graph API Explorer</Ext>, select your app,
                choose <em>User Token</em>, and tick these permissions:
                <Box mt={1}>
                  <Code>pages_show_list</Code> <Code>pages_read_engagement</Code> <Code>pages_manage_posts</Code> <Code>instagram_basic</Code>{' '}
                  <Code>instagram_content_publish</Code> <Code>business_management</Code>
                </Box>
                Click <em>Generate Access Token</em>. In the popup, choose <em>Edit settings</em> and make sure your Page <strong>and</strong> your Instagram
                account are both ticked.
              </li>
              <li>
                <strong>Make it long-lived.</strong> Paste the token into the{' '}
                <Ext href="https://developers.facebook.com/tools/debug/accesstoken/">Access Token Debugger</Ext>, click <em>Debug</em>, then{' '}
                <em>Extend Access Token</em> at the bottom. Copy the new token.
              </li>
              <li>
                <strong>Get the Page token.</strong> Back in the Graph API Explorer, paste the long-lived token and run <Code>GET me/accounts</Code>. Find
                your Page in the result and copy its <Code>id</Code> (Page ID) and <Code>access_token</Code> (Page token). A Page token made from a
                long-lived user token doesn't expire.
              </li>
              <li>
                <strong>Paste them</strong> into <In to="/studio/connections">Connections</In> → Meta and click <strong>Test connection</strong>. It shows your Page
                name and fills in your Instagram user ID by itself. Use the <Code>id</Code> from <Code>me/accounts</Code> as the Page ID. Your personal profile ID, or the
                ID in the Page's URL, won't work.
              </li>
              <li>
                Done. Instagram posts use a temporary hidden photo on your Page as the image link, so Cloudinary is optional.
              </li>
            </ol>
            <P>Good to know:</P>
            <ul>
              <li>Instagram limits API publishing to a fixed number of posts per 24 hours (currently 50), far more than you need.</li>
              <li>Instagram only accepts JPEGs from the API. The studio converts automatically, so transparent designs get their background colour.</li>
              <li>
                Changing your Facebook password or removing the app invalidates the token. If you see “Invalid OAuth access token”, repeat steps 5–7.
              </li>
              <li>
                Meta retires old Graph API versions after about two years. If you get a version error, set the newest version shown in the Graph API
                Explorer in the “Graph API version” field.
              </li>
            </ul>
          </Section>

          <Section id="cloudinary" title="Set up Cloudinary (optional image hosting)">
            <P>
              Optional. Instagram downloads the image from a public URL. By default the studio gets one by uploading a hidden photo to your Facebook Page.
              It's deleted right after posting. Use Cloudinary instead if you prefer, or to give your webhook real image links. The free plan is plenty.
            </P>
            <ol>
              <li>Sign up at <Ext href="https://cloudinary.com/users/register_free">cloudinary.com</Ext>.</li>
              <li>Your <strong>Cloud name</strong> is shown on the dashboard.</li>
              <li>
                Go to Settings (gear) → <strong>Upload</strong> → <strong>Upload presets</strong> → <em>Add upload preset</em>. Set <strong>Signing mode: Unsigned</strong>,
                optionally limit allowed formats to <Code>jpg,png,webp</Code> and set a folder, then save.
              </li>
              <li>Paste the cloud name and preset name into <In to="/studio/connections">Connections</In> → Cloudinary.</li>
            </ol>
            <P>
              An unsigned preset lets anyone who knows its name upload to your account. Keep the name private. If it leaks, delete the preset and
              create a new one.
            </P>
          </Section>

          <Section id="webhook" title="Set up a webhook (TikTok, Pinterest, anything else)">
            <P>
              TikTok and Pinterest don't allow posting directly from a browser. TikTok's posting API also requires an app approved by TikTok.
              The easy way is to let an automation tool do it. The studio sends each due post to your webhook URL, and the tool posts it.
            </P>
            <Typography fontWeight={700}>Example with Make (make.com)</Typography>
            <ol>
              <li>Create a free account and a new <strong>scenario</strong>.</li>
              <li>Add the <strong>Webhooks → Custom webhook</strong> module, click <em>Add</em>, and copy the URL it gives you.</li>
              <li>
                Paste the URL into <In to="/studio/connections">Connections</In> → Webhook, choose which platforms it should handle, and optionally set a
                shared secret.
              </li>
              <li>In Make, click <em>Run once</em>, then <strong>Send test event</strong> in the studio. Make now knows the data structure.</li>
              <li>
                Add a <strong>Router</strong> with a route per platform. Filter on <Code>platforms</Code> containing <Code>pinterest</Code> /{' '}
                <Code>tiktok</Code>, and on <Code>secret</Code> if you set one.
              </li>
              <li>
                <strong>Pinterest:</strong> add Pinterest → <em>Create a Pin</em>, using <Code>imageUrls[1]</Code> as the image, <Code>caption</Code> as the description and{' '}
                <Code>shopUrl</Code> as the link.
              </li>
              <li>
                <strong>TikTok:</strong> check which TikTok actions Make or Zapier currently offer. Often the simplest route is to send the post to{' '}
                <Ext href="https://buffer.com">Buffer</Ext> (or a similar scheduler connected to TikTok), which then publishes it. Buffer can also
                schedule it for a precise time.
              </li>
              <li>Turn the scenario on.</li>
            </ol>
            <P>Zapier (“Webhooks by Zapier → Catch Hook”) and n8n (“Webhook” node) work the same way. This is what the studio sends:</P>
            <Pre>{PAYLOAD}</Pre>
            <P>
              Set up Cloudinary as well, so <Code>imageUrls</Code> is filled. Without it the images arrive as large base64 data in <Code>images</Code>.
              Some tools block cross-site browser requests (CORS). The studio then sends the request anyway but can't read the reply, so
              the result shows as “sent (unconfirmed)”. Check the scenario's history to be sure.
            </P>
          </Section>

          <Section id="security" title="Where tokens are stored">
            <ul>
              <li>
                Tokens are entered in <In to="/studio/connections">Connections</In> and saved in this browser's localStorage under{' '}
                <Code>sunnybags_studio_connections_v1</Code>. They're never in the code or the repository, and never in the backup file.
              </li>
              <li>They're sent only to the service they belong to (graph.facebook.com, api.cloudinary.com, your webhook).</li>
              <li>
                Anyone using this browser profile can read them. Only enter them on your own device, and use{' '}
                <em>Remove all tokens from this browser</em> on shared computers.
              </li>
              <li>
                The studio pages aren't password protected. Tokens are still safe (they live in <em>your</em> browser, not on the site), but
                strangers who find <Code>/studio</Code> could look around with their own empty data.
              </li>
            </ul>
          </Section>

          <Section id="data" title="Backups & other devices">
            <P>
              Your plan, checkmarks and settings are saved in the browser you use. To move them, use <In to="/studio/settings">Settings</In> →{' '}
              <strong>Download backup</strong>, then <strong>Restore</strong> on the other device. Re-enter tokens there by hand.
              Clearing browser data deletes the plan, so download a backup now and then.
            </P>
          </Section>

          <Section id="troubleshooting" title="Troubleshooting">
            <ul>
              <li><strong>“Invalid OAuth access token” / “Session has expired”</strong>: the token is no longer valid. Redo Meta steps 5–7.</li>
              <li><strong>“(#10) / (#200) permission” errors</strong>: a permission or use case is missing (steps 4–5), or you pasted the user token instead of the Page token.</li>
              <li><strong>Instagram fails but Facebook works</strong>: check the Instagram user ID (click Test connection). Without Cloudinary, the token also needs <Code>pages_manage_posts</Code> for the temporary photo.</li>
              <li><strong>“Cloudinary: Upload preset not found”</strong>: the preset name is wrong or the preset isn't set to <em>Unsigned</em>.</li>
              <li><strong>A post didn't go out on time</strong>: no studio tab was open. It's sent the next time you open the studio, or press Publish automatically.</li>
              <li><strong>Failed auto-publish</strong>: the error shows in red under the post in the queue. Fix the cause, then use <em>Publish automatically</em> in the assistant. Platforms that already succeeded are not posted twice.</li>
            </ul>
          </Section>
        </Grid>
      </Grid>
    </>
  )
}
