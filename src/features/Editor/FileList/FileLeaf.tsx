import classNames from '#/utils/classNames'
import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { Atom, useAtom, useAtomValue } from 'jotai'
import { MouseEventHandler, useCallback } from 'react'
import { currentFileAtomAtom } from '../store'
import { LeafFile, NodeFile } from '../types'

export type FileLeafProps = {
  parentAtom: Atom<NodeFile>
  childAtom: Atom<LeafFile>
}

export function FileLeaf({ parentAtom, childAtom }: FileLeafProps) {
  const file = useAtomValue(childAtom)
  const [currentFileAtom, setCurrentFileAtom] = useAtom(currentFileAtomAtom)
  const currentFile = useAtomValue(currentFileAtom.childAtom)

  const onClicked: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation()
      setCurrentFileAtom({ parentAtom, childAtom })
    },
    [childAtom, parentAtom, setCurrentFileAtom]
  )

  return (
    <li className="cursor-pointer" onClick={onClicked}>
      <span
        className={classNames(
          file.depth === 1 ? 'pl-2' : '',
          file.depth === 2 ? 'pl-6' : '',
          file.depth === 3 ? 'pl-10' : '',
          file.path === currentFile?.path
            ? 'bg-indigo-200'
            : 'hover:bg-gray-200',
          'transition block truncate py-2'
        )}
      >
        {file.type === 'text' ? (
          <DocumentTextIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
        ) : (
          <PhotoIcon className="inline-block w-5 h-5 mr-2 stroke-current" />
        )}

        {file.name}
      </span>
    </li>
  )
}
