import {
  Descendant,
  BaseEditor,
  Range,
  Point,
  Element,
  BasePoint,
  BaseRange,
} from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

import { CodeLineElement } from './types'

type CustomElement = CodeLineElement

interface MideEditor extends BaseEditor {
  ranges?: Map<string, Range[]>
  intervals?: Map<string, [number, number][]>
  children: Element[]
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor & MideEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Point: BasePoint & { basePath?: number[] }
    Range: BaseRange & {
      [key: string]: unknown
    }
  }
}
