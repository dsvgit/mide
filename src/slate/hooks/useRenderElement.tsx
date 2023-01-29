import { RenderElementProps, useSlateStatic } from 'slate-react'
import React, { useCallback } from 'react'

const Element = (props: RenderElementProps) => {
  const { attributes, element, children } = props

  const editor = useSlateStatic()
  const Tag = editor.isInline(element) ? 'span' : 'div'

  return (
    <Tag {...attributes} spellCheck={false} className={element.type}>
      {children}
    </Tag>
  )
}

export const useRenderElement = () => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  )

  return renderElement
}
