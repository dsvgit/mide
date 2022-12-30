import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import cn from 'classnames'

import {
  CurrentFileContentState,
  CurrentFileState,
  FilesSelector,
} from '@/state/files'
import { invoke } from '@tauri-apps/api'
import { Descendant, Node } from 'slate'

export const FilesTree = () => {
  const [currentFile, setCurrentFile] = useRecoilState(CurrentFileState)
  const [currentFileContent, setCurrentFileContent] = useRecoilState(
    CurrentFileContentState
  )
  const files = useRecoilValue(FilesSelector)

  return (
    <div className="filesTree">
      {files.map((file) => (
        <FileItem
          key={file}
          name={file}
          selected={file === currentFile}
          onClick={async () => {
            setCurrentFile(file)

            const text = (await invoke('read_file', {
              path: `../src/${file}`,
            })) as string
            const content = text
              .trimStart()
              .split('\n')
              .map((line) => ({
                type: 'paragraph',
                children: [{ text: line }],
              })) as Descendant[]

            setCurrentFileContent(null)
            setTimeout(() => {
              setCurrentFileContent(content)
            }, 10)
          }}
        />
      ))}
      <button
        onClick={async () => {
          await invoke('write_file', {
            path: `../src/${currentFile}`,
            contents: currentFileContent
              ?.map((node) => Node.string(node))
              .join('\n'),
          })
        }}
      >
        Save
      </button>
    </div>
  )
}

type FileItemProp = {
  name: string
  onClick?: () => void
  selected?: boolean
}

const FileItem = (props: FileItemProp) => {
  const { name, selected, onClick } = props

  return (
    <button
      className={cn('fileName', { 'fileName--selected': selected })}
      onClick={onClick}
    >
      {name}
    </button>
  )
}
