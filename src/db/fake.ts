import { Descendant } from 'slate'
import { text } from '@/initialValue'

import { DB, ITreeNode } from '@/db/db'

const root: ITreeNode = {
  path: 'root',
  children: [{ path: 'index.ts', children: [] }],
}

export const fakeDb: DB = {
  fs: {
    readDir: async (path: string) => {
      return root
    },
    readFile: async (path: string) => {
      return text
    },
    writeFile: async (path: string, content: Descendant[]) => {},
  },
}
