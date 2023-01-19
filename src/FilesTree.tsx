import React, { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import cn from 'classnames'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'

import { FilesStore } from '@/state/FilesStore'
import { db } from '@/db/provider'
import { ITreeNode } from '@/db/db'

function RichObjectTreeView({ root }: { root: ITreeNode }) {
  const fileActions = FilesStore.useFileActions()

  const openFile = (file: string) => {
    fileActions.openFile(`../src/${file}`, file)
  }

  const renderTree = (node: ITreeNode) => (
    <TreeItem key={node.path} nodeId={node.path} label={node.path}>
      {Array.isArray(node.children)
        ? node.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  )

  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={'▼'}
      defaultExpanded={['../src']}
      defaultExpandIcon={'▶'}
      sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      onNodeSelect={(_: SyntheticEvent, value: string) => {
        const parts = value.split('/')
        const filename = parts[parts.length - 1]

        if (filename.includes('.')) {
          openFile(value)
        }
      }}
    >
      {renderTree(root)}
    </TreeView>
  )
}

export const FilesTree = () => {
  const selectedFile = useRecoilValue(FilesStore.selectedFile)
  const selectedContent = useRecoilValue(FilesStore.selectedContent)
  const files = useRecoilValue(FilesStore.files)
  const fileActions = FilesStore.useFileActions()

  const openFile = (file: string) => {
    fileActions.openFile(`../src/${file}`, file)
  }

  return (
    <div className="filesTree">
      <RichObjectTreeView root={files} />
      <button
        onClick={() => {
          if (selectedContent) {
            db.fs.writeFile(`../src/${selectedFile}`, selectedContent)
          }
        }}
      >
        Save
      </button>
    </div>
  )
}

type FileItemProp = {
  name: string
  onFileOpen?: (name: string) => void
  selected?: boolean
}

const FileItem = (props: FileItemProp) => {
  const { name, selected, onFileOpen } = props

  return (
    <button
      className={cn('fileName', { 'fileName--selected': selected })}
      onClick={() => onFileOpen && onFileOpen(name)}
    >
      {name}
    </button>
  )
}
