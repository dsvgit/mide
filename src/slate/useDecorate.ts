import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import { NodeEntry, Range, Text } from 'slate'
import { useCallback } from 'react'

export const useDecorate = () => {
  const decorate: (entry: NodeEntry) => Range[] = useCallback(
    ([node, path]) => {
      const ranges: Range[] = []

      if (!Text.isText(node)) {
        return ranges
      }

      const tokens = Prism.tokenize(node.text, Prism.languages.tsx)

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

      console.log(node, tokens, ranges);

      return ranges
    },
    []
  )

  return decorate
}

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

// modifications and additions to prism library

Prism.languages.tsx = Prism.languages.extend('tsx', {
  space: {
    pattern: /\s/,
    // lookbehind: true,
    greedy: true
  }
})
Prism.languages.insertBefore('tsx', 'prolog', {
  comment: { pattern: /\/\/[^\n]*/, alias: 'comment' },
})
