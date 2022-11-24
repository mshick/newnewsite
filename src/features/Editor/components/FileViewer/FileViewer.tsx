import Image from '#/components/Image'
import { useCallback, useEffect, useState } from 'react'
import { useEditorContext } from '../../data/context'
import { useEditorMethod } from '../../data/hooks'
import { useFileAtom } from '../../store'
import { Repo } from '../../types'
import { ActionButton } from './components/ActionButton'
import ScriptEditor, { MonacoOnInitializePane } from './ScriptEditor'

type FileEditorProps = {
  repo: Repo
}

export function FileViewer({ repo }: FileEditorProps) {
  const { file, removeFile, restoreFile, resetFile } = useFileAtom()

  const { methods } = useEditorContext()

  const [commitChanges] = useEditorMethod({
    query: methods.commitChanges
  })

  const [code, setCode] = useState<string>('')

  useEffect(() => {
    if (file?.type === 'text' && !file?.isDeleted) {
      setCode(file.text)
    } else {
      setCode('')
    }
  }, [file])

  const onInitializePane: MonacoOnInitializePane = useCallback(
    (monacoEditorRef, editorRef, model) => {
      editorRef.current.setScrollTop(1)
      editorRef.current.setPosition({
        lineNumber: 2,
        column: 0
      })
      editorRef.current.focus()
      monacoEditorRef.current.setModelMarkers(model[0], 'owner', null)
    },
    []
  )

  const onReset = useCallback(() => {
    console.log('onReset---------------')
    resetFile()

    if (file?.type === 'text') {
      setCode(file.text)
    }
  }, [file?.text, file?.type, resetFile])

  const onCommit = useCallback(() => {
    if (!file) {
      return
    }

    commitChanges({
      fileChanges: {
        additions: [
          {
            path: file.path,
            contents: Buffer.from(code).toString('base64')
          }
        ]
      }
    })
  }, [code, commitChanges, file])

  const onDelete = useCallback(() => {
    removeFile()
  }, [removeFile])

  const onUndelete = useCallback(() => {
    restoreFile()
  }, [restoreFile])

  let Component: JSX.Element | null

  if (file?.type === 'binary') {
    Component = (
      <Image
        src={`https://github.com/${repo.owner}/${repo.name}/raw/${repo.branch}/${file.path}`}
        alt={file.name}
      />
    )
  } else if (file?.type === 'text' && !file?.isDeleted) {
    Component = (
      <ScriptEditor
        path={file?.type === 'text' ? file.path : ''}
        language={file?.type === 'text' ? file.language : 'plaintext'}
        code={code}
        setCode={setCode}
        onInitializePane={onInitializePane}
      />
    )
  } else {
    Component = null
  }

  return (
    <div className="min-h-screen relative">
      {file && (
        <div className="fixed top-0 h-10 px-12 w-[inherit] flex align-middle items-center border-b">
          {file.path}
        </div>
      )}
      <div className="mt-10 mb-14zz">{Component}</div>
      {file && (
        <div className="fixed bottom-0 h-14 px-12 w-[inherit] flex items-center justify-end gap-2 border-t">
          <ActionButton onClick={onReset}>Reset</ActionButton>
          <ActionButton onClick={onCommit}>Commit</ActionButton>
          {file.isDeleted ? (
            <ActionButton onClick={onUndelete}>Undelete</ActionButton>
          ) : (
            <ActionButton onClick={onDelete}>Delete</ActionButton>
          )}
        </div>
      )}
    </div>
  )
}
