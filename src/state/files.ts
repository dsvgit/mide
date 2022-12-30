import { atom, selector } from 'recoil'
import { invoke } from '@tauri-apps/api'
import { Descendant } from 'slate'

export const CurrentFileState = atom<string | null>({
  key: 'CurrentFileState',
  default: null,
})

export const FilesSelector = selector<string[]>({
  key: 'FilesSelector',
  get: async ({ get }) => {
    return (await invoke('read_dir', { path: '../src' })) as string[]
  },
})

export const CurrentFileContentState = atom<Descendant[] | null>({
  key: 'CurrentFileContentState',
  default: null,
})
