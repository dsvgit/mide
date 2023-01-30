import React from 'react'
import { useRecoilState } from 'recoil'
import { Resizable } from 're-resizable'

import { AppStore } from '@/state/AppStore'

type Props = {
  toolbar: React.ReactNode
  sidebar: React.ReactNode
  main: React.ReactNode
}

export const AppLayout = ({ toolbar, sidebar, main }: Props) => {
  const [sidebarWidth, setSidebarWidth] = useRecoilState(AppStore.sidebarWidth)

  return (
    <div className="layout">
      <div className="toolbar">{toolbar}</div>

      <Resizable
        style={{
          flexBasis: sidebarWidth,
        }}
        className="sidebar"
        defaultSize={{
          width: sidebarWidth,
          height: '100vh',
        }}
        onResizeStop={(e, direction, ref, d) => {
          setSidebarWidth(parseInt(ref.style.width))
        }}
        enable={{ right: true }}
        minWidth={280}
        maxWidth={800}
      >
        {sidebar}
      </Resizable>

      <div className="main">{main}</div>
    </div>
  )
}
