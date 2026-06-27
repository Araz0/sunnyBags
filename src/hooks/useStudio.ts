import React from 'react'
import { useNavigate } from 'react-router-dom'
import { allBags, categories, ExtendedBag } from '../data'
import {
  suggestBag,
  resetSuggestionHistory,
  getSuggestionStats,
} from '../utils/suggest'
import { exportAssets, copyPostText } from '../utils/export'
import {
  ImageFormat,
  PreviewSide,
  ResolutionEntry,
  SideState,
} from '../types/studio'

export const useStudio = (itemId: string | undefined) => {
  const navigate = useNavigate()

  // ── Item ──────────────────────────────────────────────────────────────────
  const [currentItem, setCurrentItem] = React.useState<ExtendedBag | undefined>(
    () => allBags.all.find((b) => b.id === Number(itemId)),
  )

  React.useEffect(() => {
    const item = allBags.all.find((b) => b.id === Number(itemId))
    if (item) {
      setCurrentItem(item)
      if (item.backgroundColor) setBgColor(item.backgroundColor)
    }
  }, [itemId])

  // ── Canvas / appearance ────────────────────────────────────────────────────
  const [bgColor, setBgColor] = React.useState('#ffffff')
  const [patternIndex, setPatternIndex] = React.useState<number | null>(null)
  const [customPattern, setCustomPattern] = React.useState<string | null>(null)
  const [invertPattern, setInvertPattern] = React.useState(false)
  const [bagScale, setBagScale] = React.useState(1.0)
  const [isTransparent, setIsTransparent] = React.useState(false)
  const [format, setFormat] = React.useState<ImageFormat>('image/jpeg')

  // ── Preview ───────────────────────────────────────────────────────────────
  const [previewSide, setPreviewSide] = React.useState<PreviewSide>('A')
  const [previewSizeId, setPreviewSizeId] = React.useState('insta_feed')

  // ── Export targets ────────────────────────────────────────────────────────
  const [customW, setCustomW] = React.useState<number>(
    () => Number(localStorage.getItem('studio_custom_w')) || 1200,
  )
  const [customH, setCustomH] = React.useState<number>(
    () => Number(localStorage.getItem('studio_custom_h')) || 1200,
  )
  const [checkedSizes, setCheckedSizes] = React.useState<
    Record<string, boolean>
  >({
    insta_feed: true,
  })
  const [sides, setSides] = React.useState<SideState>({
    front: true,
    back: true,
  })

  React.useEffect(() => {
    localStorage.setItem('studio_custom_w', customW.toString())
    localStorage.setItem('studio_custom_h', customH.toString())
  }, [customW, customH])

  // ── Suggestion engine ─────────────────────────────────────────────────────
  const [suggestedBag, setSuggestedBag] = React.useState<ExtendedBag | null>(
    null,
  )
  const [suggestionStats, setSuggestionStats] = React.useState<ReturnType<
    typeof getSuggestionStats
  > | null>(null)
  const [showSuggestion, setShowSuggestion] = React.useState(false)

  // ── Derived ───────────────────────────────────────────────────────────────

  const resolutionDirectory = React.useMemo<ResolutionEntry[]>(
    () => [
      { id: 'insta_feed', w: 1080, h: 1350, name: 'Instagram Feed (4:5)' },
      { id: 'insta_story', w: 1080, h: 1920, name: 'Story / Reel (9:16)' },
      { id: 'square_post', w: 1080, h: 1080, name: 'Square Grid (1:1)' },
      { id: 'hq_print', w: 2160, h: 2700, name: 'Ultra High-Res (4:5)' },
      { id: 'custom_frame', w: customW, h: customH, name: 'Custom' },
    ],
    [customW, customH],
  )

  const livePreview = React.useMemo<ResolutionEntry>(
    () =>
      resolutionDirectory.find(
        (r: ResolutionEntry) => r.id === previewSizeId,
      ) ?? resolutionDirectory[0],
    [previewSizeId, resolutionDirectory],
  )

  const paddedCategoryId =
    currentItem?.category_id.toString().padStart(4, '0') ?? '0000'
  const previewImgSrc = currentItem
    ? `/gallery/images/${paddedCategoryId}/${currentItem.id}${previewSide}.png`
    : ''

  const getBagThumbnail = (bag: ExtendedBag) => {
    const cat = categories.find((c) => c.id === bag.category_id)
    return `/gallery/thumbnails/${(cat?.id ?? 0).toString().padStart(4, '0')}/${bag.id}A.png`
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleTransparentToggle = (checked: boolean) => {
    setIsTransparent(checked)
    if (checked && format === 'image/jpeg') setFormat('image/png')
  }

  const handleCustomPatternUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPatternIndex(null)
        setCustomPattern(ev.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const clearPattern = () => {
    setPatternIndex(null)
    setCustomPattern(null)
  }

  const selectPresetPattern = (idx: number) => {
    setCustomPattern(null)
    setPatternIndex(idx)
  }

  const toggleSizeCheckbox = (id: string, checked: boolean) =>
    setCheckedSizes((prev: Record<string, boolean>) => ({
      ...prev,
      [id]: checked,
    }))

  const handleGetSuggestion = () => {
    const bag = suggestBag()
    if (!bag) {
      alert('No unsold items available!')
      return
    }
    setSuggestedBag(bag)
    setShowSuggestion(true)
    setSuggestionStats(getSuggestionStats())
  }

  const handleResetHistory = () => {
    resetSuggestionHistory()
    setSuggestionStats(getSuggestionStats())
    setShowSuggestion(false)
  }

  const handleViewSuggestion = (id: number) => {
    const bag = allBags.all.find((b) => b.id === id)
    if (!bag) return
    setCurrentItem(bag)
    if (bag.backgroundColor) setBgColor(bag.backgroundColor)
    navigate(`/item/${id}/studio`, { replace: true })
    setShowSuggestion(false)
  }

  const handleExport = async () => {
    if (!currentItem) return
    const targets = resolutionDirectory.filter(
      (r: ResolutionEntry) => checkedSizes[r.id],
    )
    if (!targets.length) {
      alert('Select at least one export size.')
      return
    }
    await exportAssets({
      item: currentItem,
      bgColor,
      isTransparent,
      bagScale,
      format,
      sides,
      targets,
    })
  }

  const handleCopyPostText = () => {
    if (currentItem) copyPostText(currentItem.id, currentItem.description ?? '')
  }

  return {
    // item
    currentItem,
    navigate,
    paddedCategoryId,
    previewImgSrc,
    getBagThumbnail,
    // appearance
    bgColor,
    setBgColor,
    patternIndex,
    invertPattern,
    setInvertPattern,
    bagScale,
    setBagScale,
    isTransparent,
    format,
    setFormat,
    customPattern,
    // preview
    previewSide,
    setPreviewSide,
    previewSizeId,
    setPreviewSizeId,
    livePreview,
    // targets
    customW,
    setCustomW,
    customH,
    setCustomH,
    checkedSizes,
    sides,
    setSides,
    resolutionDirectory,
    // suggestion
    suggestedBag,
    suggestionStats,
    showSuggestion,
    // handlers
    handleTransparentToggle,
    handleCustomPatternUpload,
    clearPattern,
    selectPresetPattern,
    toggleSizeCheckbox,
    handleGetSuggestion,
    handleResetHistory,
    handleViewSuggestion,
    handleExport,
    handleCopyPostText,
  }
}
