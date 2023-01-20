import { Descendant } from 'slate'
import { text } from '@/initialValue'

import { DB, ITreeNode } from '@/db/db'

const root: ITreeNode = {
  path: '/',
  title: 'project',
  children: [{ path: 'index.ts', title: 'index.ts', children: [] }],
}

export const fakeDb: DB = {
  fs: {
    readDirRecursively: async (path: string) => {
      return root
    },
    readFile: async (path: string) => {
      return text
    },
    writeFile: async (path: string, content: Descendant[]) => {},
  },
}
