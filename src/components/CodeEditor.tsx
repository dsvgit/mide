import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { SlateEditor } from '@/slate/SlateEditor'
import { FilesStore } from '@/state/FilesStore'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const CodeEditor = () => {
  const selectedFile = useRecoilValue(FilesStore.selectedFile)
  const [value, setValue] = useRecoilState(FilesStore.selectedContent)
  const { saveFile } = FilesStore.useFileActions()

  if (!value) {
    return <div className="center">no file selected</div>
  }

  const language = selectedFile?.split('.').pop()

  return (
    <ErrorBoundary>
      <SlateEditor
        value={value}
        setValue={setValue}
        onSave={saveFile}
        ext={language}
      />
    </ErrorBoundary>
  )
}
