import React, { useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import { initialValue } from '@/initialValue'
import { useDecorate } from '@/slate/useDecorate'
import { useRenderLeaf } from '@/slate/useRenderLeaf'
import { Tooltip } from '@/slate/Tooltip'
import { useOnKeydown } from '@/slate/useOnKeydown'

export const SlateEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [value, setValue] = useState(initialValue)
  const renderLeaf = useRenderLeaf()

  const decorate = useDecorate()
  const onKeyDown = useOnKeydown(editor)

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
