import { Descendant } from 'slate'

export const text = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`

export const initialValue = text
  .trimStart()
  .split('\n')
  .map((line) => ({
    type: 'paragraph',
    children: [{ text: line }],
  })) as Descendant[]
