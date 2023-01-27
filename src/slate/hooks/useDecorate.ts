import Prism from 'prismjs'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import { Editor, NodeEntry, Range, Node, Point } from 'slate'

import { SlateEditorProps } from '@/slate/SlateEditor'

export const extToLanguage: Record<string, string> = {
  md: 'markdown',
  ts: 'typescript',
  js: 'javascript',
  jsx: 'jsx',
  tsx: 'tsx',
  json: 'json',
  html: 'html',
  css: 'css',
  xml: 'xml',
}

type TokenEntry = {
  token: Prism.Token | string
  parent: TokenEntry | null
}

export const useDecorate = (options: Partial<SlateEditorProps>) => {
  const decorate: (entry: NodeEntry) => Range[] = ([editor, path]) => {
    const ranges: Range[] = []
    const language = extToLanguage[options.ext!]

    if (!Editor.isEditor(editor) || !language) {
      return ranges
    }

    const text = editor.children.map((node) => Node.string(node)).join('\n')

    const tokens = Prism.tokenize(text, Prism.languages[language])
    const positions = Editor.positions(editor, {
      at: path,
      unit: 'character',
    })

    const stack: TokenEntry[] = []
    for (let i = tokens.length - 1; i >= 0; i--) {
      stack.push({ token: tokens[i], parent: null })
    }

    let start = positions.next().value
    while (stack.length) {
      const tokenEntry = stack.pop()!
      const token = tokenEntry.token

      if (typeof token !== 'string' && Array.isArray(token.content)) {
        for (let i = token.content.length - 1; i >= 0; i--) {
          stack.push({ parent: tokenEntry, token: token.content[i] })
        }
      } else {
        for (let i = 0; i < token.length - 1; i++) {
          positions.next()
        }

        const end = positions.next().value

        const range = {
          anchor: start!,
          focus: end!,
        }

        const tokenEntryPath = getTokenEntryPath(tokenEntry).reverse()
        for (const tokenEntry of tokenEntryPath) {
          const type = tokenEntry.token.type
          if (range.script && type === 'tag') {
            continue
          }

          range[type] = true

          ranges.push(range)
        }

        start = end
      }
    }

    // console.log(ranges)

    return []
  }

  return decorate
}

const getTokenEntryPath = (tokenEntry: TokenEntry) => {
  const path: TokenEntry[] = [tokenEntry]
  let parent = tokenEntry.parent

  while (parent) {
    path.push(parent)
    tokenEntry = parent
    parent = tokenEntry.parent
  }

  return path.reverse()
}
