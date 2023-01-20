import { invoke } from '@tauri-apps/api'
import { Descendant, Node } from 'slate'

import { DB, FS, ITreeNode } from '@/db/db'

class TreeNode implements ITreeNode {
  public path: string
  public children: Array<ITreeNode>
  public title: string

  constructor(path: string, title: string) {
    this.path = path
    this.children = []
    this.title = title
  }
}

export const tauriDb: DB = {
  fs: new (class implements FS {
    readDirRecursively = async (rootPath: string) => {
      const rootTitle = rootPath.split('/').pop() || ''
      const root = new TreeNode('', rootTitle)

      const stack = [root]

      while (stack.length) {
        const currentNode = stack.pop()

        if (currentNode) {
          const title = currentNode.path.split('/').pop() || ''

          if (title === 'node_modules') {
            continue
          }

          const children = (await invoke('read_dir', {
            path: rootPath + currentNode.path,
          })) as string[]

          for (let child of children.sort((a, b) => a.localeCompare(b))) {
            const childPath = `${currentNode.path}/${child}`
            const title = childPath.split('/').pop() || ''
            const childNode = new TreeNode(childPath, title)

            currentNode.children.push(childNode)

            if (
              (await invoke('is_dir', {
                path: rootPath + childNode.path,
              })) as boolean
            ) {
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
