import React from 'react'
import { PostDesign, ScheduledPost } from '../types'

export interface EditorRequest {
  post?: ScheduledPost
  bagId?: number
  date?: Date
  design?: PostDesign
  caption?: string
}

export interface StudioUi {
  openEditor: (req?: EditorRequest) => void
  openPublish: (postId: string) => void
  toast: (msg: string) => void
}

export const StudioUiContext = React.createContext<StudioUi>({
  openEditor: () => undefined,
  openPublish: () => undefined,
  toast: () => undefined,
})

export const useStudioUi = () => React.useContext(StudioUiContext)
