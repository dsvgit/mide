import React, { useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import { useDecorate } from '@/slate/useDecorate'
import { useRenderLeaf } from '@/slate/useRenderLeaf'
import { useOnKeydown } from '@/slate/useOnKeydown'

export type SlateEditorProps = {
  value?: Descendant[]
  setValue?: (value: Descendant[]) => void
  onSave?: () => void
  language?: string
}

export const SlateEditor = (props: SlateEditorProps) => {
  const { value, setValue } = props

  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const renderLeaf = useRenderLeaf()

  const decorate = useDecorate(props)
  const onKeyDown = useOnKeydown(editor, props)

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
