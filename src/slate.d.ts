import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { GrammarRest } from 'prismjs'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText & GrammarRest
  }
}