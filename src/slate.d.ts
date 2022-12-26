import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { GrammarRest } from 'prismjs'
import { HistoryEditor } from "slate-history";

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText & GrammarRest
  }
}
