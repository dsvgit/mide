import { RecoilRoot } from 'recoil'

import { SlateEditor } from '@/slate/SlateEditor'
import { FilesTree } from '@/FilesTree'

import '@/styles/index.css'
import '@/styles/prism-dracula.css'

const App = () => {
  return (
    <RecoilRoot>
      <div className="layout">
        <FilesTree />
        <SlateEditor />
      </div>
    </RecoilRoot>
  )
}

export default App
