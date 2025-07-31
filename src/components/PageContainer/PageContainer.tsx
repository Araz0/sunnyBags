import React from 'react'
import { NavigationMenu } from '../NavigationMenu'

export type PageContainerProps = {
  children: React.ReactNode
}
export const PageContainerRaw = ({ children }: PageContainerProps) => {
  return (
    <>
      <NavigationMenu />
      {children}
    </>
  )
}

export const PageContainer = React.memo(PageContainerRaw)
