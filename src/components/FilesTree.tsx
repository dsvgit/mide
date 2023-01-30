import React, { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'

import { FilesStore } from '@/state/FilesStore'
import { ITreeNode } from '@/db/db'

export const FilesTree = () => {
  const filesTree = useRecoilValue(FilesStore.filesTree)
  const { openFile } = FilesStore.useFileActions()

  const renderTree = (node: ITreeNode) => (
    <TreeItem
      key={node.path}
      nodeId={node.path}
      label={node.title}
      className="treeItem"
    >
      {Array.isArray(node.children)
        ? node.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  )

  if (!filesTree) {
    return <div className="center">no project selected</div>
  }

  return (
    <TreeView
      className="files"
      aria-label="rich object"
      defaultCollapseIcon={'▼'}
      defaultExpanded={['']}
      defaultExpandIcon={'▶'}
      onNodeSelect={(_: SyntheticEvent, value: string) => {
        const parts = value.split('/')
        const filename = parts[parts.length - 1]

        if (filename.includes('.')) {
          openFile(value)
        }
      }}
    >
      {renderTree(filesTree)}
    </TreeView>
  )
}
