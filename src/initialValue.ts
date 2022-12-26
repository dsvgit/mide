import { Descendant } from 'slate'

const text = `
// start your code here
`

export const initialValue = text
  .trimStart()
  .split('\n')
  .map((line) => ({
    type: 'paragraph',
    children: [{ text: line }],
  })) as Descendant[]
