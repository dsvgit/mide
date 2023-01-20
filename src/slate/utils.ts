import { Descendant } from 'slate'

export const textToContent = (text: string) => {
  return text
    .trimStart()
    .split('\n')
    .map((line) => ({
      type: 'paragraph',
      children: [{ text: line }],
    })) as Descendant[]
}
