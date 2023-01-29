import React, { useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import { useDecorate } from '@/slate/hooks/useDecorate'
import { useRenderLeaf } from '@/slate/hooks/useRenderLeaf'
import { useOnKeydown } from '@/slate/hooks/useOnKeydown'
import { ExtractRanges } from '@/slate/extractors/ExtractRanges'
import { ExtractIntervals } from '@/slate/extractors/ExtractIntervals'
import { getLanguage } from '@/slate/utils'
import { useRenderElement } from '@/slate/hooks/useRenderElement'

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
  const renderElement = useRenderElement()

  const decorate = useDecorate(editor)
  const onKeyDown = useOnKeydown(editor, props)

  if (!value) {
    return null
  }

  const language = getLanguage(props.ext || '')
  const languageClassName = language ? `language-${language}` : ''

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <ExtractIntervals />
      <ExtractRanges {...props} />
      <Editable
        className={`editable ${languageClassName}`}
        decorate={decorate}
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        onKeyDown={onKeyDown}
      />
    </Slate>
  )
}
