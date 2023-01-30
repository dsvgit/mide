import { Suspense } from 'react'
import { RecoilRoot } from 'recoil'

import { FilesTree } from '@/components/FilesTree'
import { CodeEditor } from '@/components/CodeEditor'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AppLayout } from '@/components/AppLayout'
import { Toolbar } from '@/components/Toolbar'

import '@/styles/index.css'
import '@/styles/prism-dracula.css'

const App = () => {
  return (
    <RecoilRoot>
      <AppLayout
        toolbar={<Toolbar />}
        sidebar={
          <ErrorBoundary>
            <Suspense fallback={<div className="center">loading...</div>}>
              <FilesTree />
            </Suspense>
          </ErrorBoundary>
        }
        main={
          <ErrorBoundary>
            <CodeEditor />
          </ErrorBoundary>
        }
      />
    </RecoilRoot>
  )
}

export default App
