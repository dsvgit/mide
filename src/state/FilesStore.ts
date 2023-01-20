/* eslint react-hooks/rules-of-hooks: 0 */
import { atom, selector } from 'recoil'
import { Descendant } from 'slate'
import { useMemo } from 'react'

import { db } from '@/db/provider'
import { ITreeNode } from '@/db/db'
import { textToContent } from '@/slate/utils'
import { State } from '@/state/State'

export const FilesStore = new (class {
  root = selector<ITreeNode>({
    key: 'FilesSelector_root',
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
    const openFile = State.useStoreCallback(
      (_, set) => async (path: string, file: string) => {
        set(this.selectedFile, null)
        set(this.selectedContent, null)

        const text = await db.fs.readFile(path)
        const content = textToContent(text)

        set(this.selectedFile, file)
        set(this.selectedContent, content)
      }
    )

    const saveFile = State.useStoreCallback((get) => async () => {
      const selectedFile = get(this.selectedFile)
      const selectedContent = get(this.selectedContent)

      if (selectedContent) {
        db.fs.writeFile(`../src/${selectedFile}`, selectedContent)
      }
    })

    return useMemo(
      () => ({
        openFile,
        saveFile,
      }),
      []
    )
  }
})()
