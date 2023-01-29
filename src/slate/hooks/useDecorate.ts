import Prism from 'prismjs'
import { Editor, NodeEntry } from 'slate'

import { useCallback } from 'react'
import { ReactEditor } from 'slate-react'

type TokenEntry = {
  token: Prism.Token | string
  parent: TokenEntry | null
}

export const useDecorate = (editor: Editor) => {
  return useCallback(([_, path]: NodeEntry) => {
    if (path.length !== 1) {
      // skip not top level elements
      return []
    }

    // find ranges for element by id
    const element = editor.children[path[0]]
    const id = ReactEditor.findKey(editor, element).id
    const ranges = editor.ranges!.get(id)

    return ranges ? ranges.slice() : []
  }, [])
}
