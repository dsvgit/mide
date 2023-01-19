import { RecoilRoot } from 'recoil'

import { FilesTree } from '@/components/FilesTree'
import { CodeEditor } from '@/components/CodeEditor'

import '@/styles/index.css'
import '@/styles/prism-dracula.css'

const App = () => {
  return (
    <RecoilRoot>
      <div className="layout">
        <FilesTree />
        <CodeEditor />
      </div>
    </RecoilRoot>
  )
}

export default App
