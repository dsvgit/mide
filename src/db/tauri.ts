import { invoke } from '@tauri-apps/api'
import { Descendant, Node } from 'slate'

import { DB, ITreeNode } from '@/db/db'

class TreeNode implements ITreeNode {
  public path: string
  public children: Array<ITreeNode>

  constructor(path: string) {
    this.path = path
    this.children = []
  }
}

export const tauriDb: DB = {
  fs: new (class FS {
    readDir = async (path: string) => {
      const root = new TreeNode(path)

      const stack = [root]

      while (stack.length) {
        const currentNode = stack.pop()

        if (currentNode) {
          const children = (await invoke('read_dir', {
            path: currentNode.path,
          })) as string[]

          for (let child of children) {
            const childPath = `${currentNode.path}/${child}`
            const childNode = new TreeNode(childPath)
            currentNode.children.push(childNode)

            if ((await invoke('is_dir', { path: childNode.path })) as boolean) {
              stack.push(childNode)
            }
          }
        }
      }

      return root
    }

    readFile = async (path: string) => {
      return (await invoke('read_file', {
        path,
      })) as string
    }

    writeFile = async (path: string, content: Descendant[]) => {
      await invoke('write_file', {
        path,
        contents: content?.map((node) => Node.string(node)).join('\n'),
      })
    }
  })(),
}
