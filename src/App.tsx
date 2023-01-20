import { Suspense } from 'react'
import { RecoilRoot } from 'recoil'

import { FilesTree } from '@/components/FilesTree'
import { CodeEditor } from '@/components/CodeEditor'
import { ErrorBoundary } from '@/components/ErrorBoundary'

import '@/styles/index.css'
import '@/styles/prism-dracula.css'

const App = () => {
  return (
    <RecoilRoot>
      <div className="layout">
        <ErrorBoundary>
          <Suspense fallback={<div>loading...</div>}>
            <FilesTree />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <CodeEditor />
        </ErrorBoundary>
      </div>
    </RecoilRoot>
  )
}

export default App
