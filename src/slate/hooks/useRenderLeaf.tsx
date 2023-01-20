import { RenderLeafProps } from 'slate-react'
import React, { useCallback } from 'react'

const Leaf = (props: RenderLeafProps) => {
  const { attributes, children } = props
  const leaf = props.leaf as any

  const { text, ...rest } = leaf
  const className = `token ${Object.keys(rest).join(' ')}`

  return (
    <span {...attributes} className={className}>
      {children}
    </span>
  )
}

export const useRenderLeaf = () => {
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  )

  return renderLeaf
}
