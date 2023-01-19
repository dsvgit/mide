/* eslint react-hooks/rules-of-hooks: 0 */
import { atom, selector, useRecoilCallback } from 'recoil'
import { Descendant } from 'slate'
import { useMemo } from 'react'

import { db } from '@/db/provider'
import { ITreeNode } from '@/db/db'

export const FilesStore = new (class {
  files = selector<ITreeNode>({
    key: 'FilesSelector_files',
    get: async ({ get }) => {
      return db.fs.readDir('../src')
    },
  })

  selectedFile = atom<string | null>({
    key: 'FilesStore_selectedFile',
    default: null,
  })

  selectedContent = atom<Descendant[] | null>({
    key: 'FilesStore_selectedContent',
    default: null,
  })

  useFileActions = () => {
    const openFile = useRecoilCallback(
      ({ set }) =>
        async (path: string, file: string) => {
          set(this.selectedFile, null)
          set(this.selectedFile, file)

          const text = await db.fs.readFile(path)
          const content = text
            .trimStart()
            .split('\n')
            .map((line) => ({
              type: 'paragraph',
              children: [{ text: line }],
            })) as Descendant[]

          set(this.selectedContent, null)
          setTimeout(() => {
            set(this.selectedContent, content)
          }, 10)
        }
    )

    return useMemo(
      () => ({
        openFile,
      }),
      []
    )
  }
})()