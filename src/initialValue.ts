import { Descendant } from 'slate'

const text = `
import{Editor}from"slate";import React from"react";export const useOnKeydown=(editor:Editor)=>{const onKeyDown:React.KeyboardEventHandler=(e)=>{if(e.key==='Tab'){e.preventDefault();if(e.shiftKey){}else{Editor.insertText(editor,'    ')}}}return onKeyDown}
`

export const initialValue = text
  .trimStart()
  .split('\n')
  .map((line) => ({
    type: 'paragraph',
    children: [{ text: line }],
  })) as Descendant[]
