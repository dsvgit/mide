/* eslint react-hooks/rules-of-hooks: 0 */
import { atom } from 'recoil'

export const AppStore = new (class {
  sidebarWidth = atom<number>({
    key: 'AppStore_sidebarWidth',
    default: 380,
  })
})()
