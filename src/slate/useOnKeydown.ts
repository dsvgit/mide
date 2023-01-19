import { Editor } from 'slate'
import React from 'react'
import isHotkey from 'is-hotkey'

import { SlateEditorProps } from '@/slate/SlateEditor'

export const useOnKeydown = (
  editor: Editor,
  options: Partial<SlateEditorProps>
) => {
  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (isHotkey('tab', e)) {
      e.preventDefault()

      Editor.insertText(editor, '  ')
    }

    if (isHotkey('mod+s', e)) {
      e.preventDefault()

      if (options.onSave) {
        options.onSave()
      }
    }
  }

  return onKeyDown
}
