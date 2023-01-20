import React, { SyntheticEvent } from 'react'
import { useRecoilValue } from 'recoil'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'

import { FilesStore } from '@/state/FilesStore'
import { ITreeNode } from '@/db/db'

export const FilesTree = () => {
  const filesTree = useRecoilValue(FilesStore.filesTree)
  const { openFile, openDirectory, saveFile } = FilesStore.useFileActions()

  const renderTree = (node: ITreeNode) => (
    <TreeItem key={node.path} nodeId={node.path} label={node.title}>
      {Array.isArray(node.children)
        ? node.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  )

  return (
    <div className="filesTree">
      {filesTree && (
        <TreeView
          aria-label="rich object"
          defaultCollapseIcon={'▼'}
          defaultExpanded={['']}
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
          {renderTree(filesTree)}
        </TreeView>
      )}
      <button
        onClick={() => {
          openDirectory()
        }}
      >
        Open Folder
      </button>
      <button
        onClick={() => {
          saveFile()
        }}
      >
        Save
      </button>
    </div>
  )
}
