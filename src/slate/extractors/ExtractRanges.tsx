import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-java'
import { useMemo } from 'react'
import { Node, Point, Range } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import { CodeLineType } from '@/slate/types'
import { SlateEditorProps } from '@/slate/SlateEditor'
import { getLanguage } from '@/slate/utils'

class PrismTokenNode {
  token: string | Prism.Token
  parent: null | PrismTokenNode

  constructor(token: string | Prism.Token, parent: null | PrismTokenNode) {
    this.token = token
    this.parent = parent
  }
}

// set editor.ranges with decorations to use them in decorate function then
export const ExtractRanges = (options: Partial<SlateEditorProps>) => {
  const editor = useSlate()

  useMemo(() => {
    const language = getLanguage(options.ext || '')
    const ranges = new Map<string, Range[]>()

    if (!language) {
      editor.ranges = ranges
      return null
    }

    const intervals = editor.intervals!.get(CodeLineType) || [] // work only with code line intervals
    for (const interval of intervals) {
      const text = editor.children
        .slice(interval[0], interval[1] + 1)
        .map((element) => Node.string(element))
        .join('\n')
      const tokens = Prism.tokenize(text, Prism.languages[language])

      const stack: PrismTokenNode[] = []

      // fill initial stack with reversed tokens
      for (let i = tokens.length - 1; i >= 0; i--) {
        stack.push(new PrismTokenNode(tokens[i], null))
      }

      let startOffset = 0
      let index = interval[0]
      while (stack.length) {
        const currentTokenNode = stack.pop()!
        const token = currentTokenNode.token
        const length = token.length

        if (typeof token !== 'string' && Array.isArray(token.content)) {
          // add reversed content (children) tokens to stack
          for (let i = token.content.length - 1; i >= 0; i--) {
            stack.push(new PrismTokenNode(token.content[i], currentTokenNode))
          }
          continue
        }

        // split string into lines to be sure that there are no multiline tokens
        const str =
          typeof token === 'string' ? token : (token.content as string)
        if (str !== '\n') {
          const lines = str.split(/(\n)/)
          if (lines.length > 1) {
            // if it is multiline token split it add it back to stack each line separately in reversed order
            for (let i = lines.length - 1; i >= 0; i--) {
              const line = lines[i]

              stack.push(
                new PrismTokenNode(
                  typeof token === 'string'
                    ? line
                    : new Prism.Token(token.type, line, token.alias, line),
                  currentTokenNode
                )
              )
            }
            continue
          }
        } else {
          // if it is line break reset startOffset and increment index
          index++
          startOffset = 0
          continue
        }

        // calculate endOffset
        const endOffset = startOffset + length

        // create types set based on token's and all ancestors' types
        const types = new Set<string>(['token'])
        let tokenNodeCursor: PrismTokenNode | null = currentTokenNode
        while (tokenNodeCursor) {
          const { token } = tokenNodeCursor

          if (typeof token !== 'string') {
            const type = token.type
            const aliasArray = Array.isArray(token.alias)
              ? token.alias
              : [token.alias]

            const isTag = type === 'tag' || aliasArray.includes('tag')

            if (types.has('script') && isTag) {
              // skip "tag" type and following, if types already has "script" type
              // matters for correct jsx, tsx attributes highlighting
              break
            }

            types.add(type)

            for (const alias of aliasArray) {
              alias && types.add(alias)
            }
          }

          tokenNodeCursor = tokenNodeCursor.parent
        }

        // fill ranges map for decorate function
        if (types.size) {
          const key = ReactEditor.findKey(editor, editor.children[index])
          if (!ranges.has(key.id)) {
            ranges.set(key.id, [])
          }

          const anchor: Point = {
            basePath: [index, 0],
            path: [],
            offset: startOffset,
          }
          const focus: Point = {
            basePath: [index, 0],
            path: [],
            offset: endOffset,
          }

          const range: Range = { anchor, focus }

          for (const type of types) {
            range[type] = true
          }

          ranges.get(key.id)!.push(range)
        }

        // move startOffset to end
        startOffset = endOffset
      }
    }

    editor.ranges = ranges
  }, [editor.children])

  return null
}
