import { Descendant } from 'slate'

interface ITreeNode {
  path: string
  children: Array<ITreeNode>
}

interface FS {
  readDir: (path: string) => Promise<ITreeNode>
  readFile: (path: string) => Promise<string>
  writeFile: (path: string, content: Descendant[]) => Promise<void>
}

export type DB = {
  fs: FS
}
