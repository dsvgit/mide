import { tauriDb } from '@/db/tauri'
import { fakeDb } from '@/db/fake'

export const db = window.__TAURI_IPC__ === undefined ? fakeDb : tauriDb
