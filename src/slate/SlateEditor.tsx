import React, { useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import { extToLanguage, useDecorate } from '@/slate/hooks/useDecorate'
import { useRenderLeaf } from '@/slate/hooks/useRenderLeaf'
import { useOnKeydown } from '@/slate/hooks/useOnKeydown'

export type SlateEditorProps = {
  value?: Descendant[]
  setValue?: (value: Descendant[]) => void
  onSave?: () => void
  ext?: string
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

  const language = extToLanguage[props.ext || '']

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable
        className={language ? `language-${language}` : ''}
        decorate={decorate}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
      />
    </Slate>
  )
}
