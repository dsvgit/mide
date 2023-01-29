import { Descendant } from 'slate'

export type CodeLineType = 'code_line'
export const CodeLineType: CodeLineType = 'code_line'

export type CodeLineElement = {
  type: CodeLineType
  language: string
  children: Descendant[]
}
