/* eslint react-hooks/rules-of-hooks: 0 */
import { atom, selector } from 'recoil'
import { Descendant } from 'slate'
import { useMemo } from 'react'

import { db } from '@/db/provider'
import { ITreeNode } from '@/db/db'
import { textToContent } from '@/slate/utils'
import { State } from '@/state/State'
import { dialog } from '@tauri-apps/api'

export const FilesStore = new (class {
  projectDirectory = atom<string | null>({
    key: 'FilesStore_projectDirectory',
    default: '..',
  })

  filesTree = selector<ITreeNode | null>({
    key: 'FilesSelector_filesTree',
    get: async ({ get }) => {
      const projectDirectory = get(this.projectDirectory)

      if (!projectDirectory) {
        return null
      }

      const filesTree = await db.fs.readDirRecursively(projectDirectory)

      return filesTree
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
    const openDirectory = State.useStoreCallback((_, set) => async () => {
      const dir = await dialog.open({
        title: 'Open Project Directory',
        directory: true,
        multiple: false,
        defaultPath: '~',
      })

      if (dir && !Array.isArray(dir)) {
        set(this.selectedFile, null)
        set(this.selectedContent, null)
        set(this.projectDirectory, dir)
      }
    })

    const refreshDirectory = State.useStoreCallback((get, set) => async () => {
      const projectDirectory = get(this.projectDirectory)

      if (projectDirectory) {
        set(this.projectDirectory, null)

        setTimeout(() => {
          set(this.selectedFile, null)
          set(this.selectedContent, null)
          set(this.projectDirectory, projectDirectory)
        }, 10)
      }
    })

    const openFile = State.useStoreCallback(
      (get, set) => async (relativePathname: string) => {
        try {
          const projectDirectory = get(this.projectDirectory)
          const text = await db.fs.readFile(projectDirectory + relativePathname)

          if (text === 'null') {
            alert("Can't open file")
            return
          }

          set(this.selectedFile, null)
          set(this.selectedContent, null)

          const content = textToContent(text)

          setTimeout(() => {
            set(this.selectedFile, relativePathname)
            set(this.selectedContent, content)
          }, 0)
        } catch (e) {
          alert("Can't open file")
          console.log(e)
        }
      }
    )

    const saveFile = State.useStoreCallback((get) => async () => {
      const projectDirectory = get(this.projectDirectory)
      const selectedFile = get(this.selectedFile)
      const selectedContent = get(this.selectedContent)

      if (selectedContent) {
        db.fs.writeFile(`${projectDirectory}/${selectedFile}`, selectedContent)
      }
    })

    return useMemo(
      () => ({
        openDirectory,
        refreshDirectory,
        openFile,
        saveFile,
      }),
      []
    )
  }
})()
