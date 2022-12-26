import React from 'react'
import { Transforms } from 'slate'
import { useSlate } from "slate-react";
import { HistoryEditor } from 'slate-history'
import cn from 'classnames'

export const Tooltip = () => {
  const editor = useSlate()

  return (
    <div className={cn('tooltip', {
      'tooltip--visible': editor.selection
    })}>
      <button
        onMouseDown={(e) => {
          e.preventDefault()
          editor.insertText('console.log()')
          Transforms.move(editor, {
            distance: 1,
            unit: 'character',
            reverse: true,
          })
        }}
      >
        log
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault()
          editor.insertText('if () {')
          Transforms.move(editor, {
            distance: 3,
            unit: 'character',
            reverse: true,
          })
        }}
      >
        if
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault()
          editor.insertText('    ')
        }}
      >
        tab
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault()
          editor.insertText(`""`)
          Transforms.move(editor, {
            distance: 1,
            unit: 'character',
            reverse: true,
          })
        }}
      >
        string
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault()
          HistoryEditor.undo(editor)
        }}
      >
        undo
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault()
          HistoryEditor.redo(editor)
        }}
      >
        redo
      </button>
    </div>
  )
}
