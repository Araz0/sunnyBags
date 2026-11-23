import React from 'react'
import { getConnections } from '../connections'
import { platformMeta } from '../helpers'
import { automatedPlatforms, manualPlatforms, publishPost } from '../publish'
import { studioActions } from '../store'
import { useStudioUi } from './context'

/** Publish a saved post right now through the connected APIs. */
export const usePublishNow = () => {
  const ui = useStudioUi()
  const [busyId, setBusyId] = React.useState<string | null>(null)
  const [progress, setProgress] = React.useState<string | null>(null)

  const publishNow = React.useCallback(
    async (postId: string, opts: { confirm?: boolean } = {}) => {
      const post = studioActions.exportData().posts.find((p) => p.id === postId)
      if (!post) return false
      const c = getConnections()
      const auto = automatedPlatforms(post, c)
      if (!auto.length) {
        ui.toast('None of this post’s platforms are connected. Set them up in Connections.')
        ui.openPublish(postId)
        return false
      }
      const names = auto.map((p) => platformMeta(p).label).join(' + ')
      if (opts.confirm !== false && !confirm(`Publish Bag #${post.bagId} to ${names} now?`)) return false

      setBusyId(postId)
      try {
        const log = await publishPost(post, c, setProgress)
        const failed = log.filter((l) => !l.ok)
        const manual = manualPlatforms(post, c)
        if (failed.length) {
          ui.toast(`Failed on ${failed.map((f) => platformMeta(f.platform).label).join(', ')}: ${failed[0].error}`)
          return false
        }
        ui.toast(
          manual.length
            ? `Published to ${names}. ${manual.map((p) => platformMeta(p).label).join(', ')} still needs posting by hand.`
            : `Bag #${post.bagId} is live on ${names} 🚀`,
        )
        return true
      } catch (e) {
        ui.toast(`Publishing failed: ${(e as Error).message}`)
        return false
      } finally {
        setBusyId(null)
        setProgress(null)
      }
    },
    [ui],
  )

  return { publishNow, busyId, progress }
}
