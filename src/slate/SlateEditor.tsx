import React, { useMemo } from 'react'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { useRecoilState } from 'recoil'

import { useDecorate } from '@/slate/useDecorate'
import { useRenderLeaf } from '@/slate/useRenderLeaf'
import { useOnKeydown } from '@/slate/useOnKeydown'
import { FilesStore } from '@/state/FilesStore'

export const SlateEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [value, setValue] = useRecoilState(FilesStore.selectedContent)
  const renderLeaf = useRenderLeaf()

  const decorate = useDecorate()
  const onKeyDown = useOnKeydown(editor)

  if (!value) {
    return null
  }

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable
        className="language-tsx"
        decorate={decorate}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
      />
    </Slate>
  )
}
