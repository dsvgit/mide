import React, { useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import { initialValue } from '@/initialValue'
import { useDecorate } from '@/slate/useDecorate'
import { useRenderLeaf } from '@/slate/useRenderLeaf'
import { Tooltip } from '@/slate/Tooltip'
import { useOnKeydown } from '@/slate/useOnKeydown'
import { useRecoilState } from 'recoil'
import { CurrentFileContentState } from '@/state/files'

export const SlateEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [value, setValue] = useRecoilState(CurrentFileContentState)
  const renderLeaf = useRenderLeaf()

  const decorate = useDecorate()
  const onKeyDown = useOnKeydown(editor)

  if (!value) {
    return null
  }

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Tooltip />
      <Editable
        className="language-tsx"
        decorate={decorate}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
      />
    </Slate>
  )
}
