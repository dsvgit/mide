import React, { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'

import { FilesStore } from '@/state/FilesStore'
import { ITreeNode } from '@/db/db'

export const FilesTree = () => {
  const root = useRecoilValue(FilesStore.root)
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
    <div className="filesTree">
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
      <button
        onClick={() => {
          fileActions.saveFile()
        }}
      >
        Save
      </button>
    </div>
  )
}
