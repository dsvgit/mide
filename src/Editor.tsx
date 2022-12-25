import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import React, { CSSProperties, useCallback, useMemo, useState } from 'react'
import { Text, createEditor, Descendant, NodeEntry, Range } from 'slate'
import { Slate, Editable, withReact, RenderLeafProps } from 'slate-react'
import { withHistory } from 'slate-history'

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'test' }],
  },
]

const getLength = (token: string | Prism.Token): number => {
  if (typeof token === 'string') {
    return token.length
  } else if (typeof token.content === 'string') {
    return token.content.length
  } else if (Array.isArray(token.content)) {
    return token.content.reduce((l, t) => l + getLength(t), 0)
  }

  throw new Error('Unreachable code')
}

const Leaf = (props: RenderLeafProps) => {
  const { attributes, children } = props
  const leaf = props.leaf as any

  const style: CSSProperties = {}

  if (leaf.comment) {
    style.color = 'slategray'
  }

  if (leaf.operator || leaf.url) {
    style.color = '#9a6e3a'
  }

  if (leaf.keyword) {
    style.color = '#07a'
  }

  if (leaf.variable || leaf.regex) {
    style.color = '#e90'
  }

  if (
    leaf.number ||
    leaf.boolean ||
    leaf.tag ||
    leaf.constant ||
    leaf.symbol ||
    leaf['attr-name'] ||
    leaf.selector
  ) {
    style.color = '#905'
  }

  if (leaf.punctuation) {
    style.color = '#999'
  }

  if (leaf.string || leaf.char) {
    style.color = '#690'
  }

  if (leaf.function || leaf['class-name']) {
    style.color = '#dd4a68'
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  )
}

export const Editor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [value, setValue] = useState(initialValue)
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  )

  const decorate: (entry: NodeEntry) => Range[] = useCallback(
    ([node, path]) => {
      const ranges: Range[] = []
      if (!Text.isText(node)) {
        return ranges
      }
      const tokens = Prism.tokenize(node.text, Prism.languages.javascript)
      let start = 0

      for (const token of tokens) {
        const length = getLength(token)
        const end = start + length

        if (typeof token !== 'string') {
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          })
        }

        start = end
      }

      return ranges
    },
    []
  )

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable decorate={decorate} renderLeaf={renderLeaf} />
    </Slate>
  )
}

// modifications and additions to prism library

Prism.languages.javascript = Prism.languages.extend('javascript', {})
Prism.languages.insertBefore('javascript', 'prolog', {
  comment: { pattern: /\/\/[^\n]*/, alias: 'comment' },
})
