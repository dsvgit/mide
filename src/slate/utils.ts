import { Descendant } from 'slate'

import { CodeLineType } from '@/slate/types'

export const textToContent = (text: string) => {
  return text
    .trimStart()
    .split('\n')
    .map((line) => ({
      type: CodeLineType,
      children: [{ text: line }],
    })) as Descendant[]
}

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
  java: 'java',
  py: 'python',
  php: 'php',
}

export const getLanguage = (ext: string): string | undefined => {
  return extToLanguage[ext]
}
