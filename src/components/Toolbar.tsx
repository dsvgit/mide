import React from 'react'
import { FilesStore } from '@/state/FilesStore'

export const Toolbar = () => {
  const { openDirectory, refreshDirectory, saveFile } =
    FilesStore.useFileActions()

  return (
    <div>
      <button onClick={openDirectory}>Open</button>
      <button onClick={refreshDirectory}>Refresh</button>
      <button onClick={saveFile}>Save</button>
    </div>
  )
}
