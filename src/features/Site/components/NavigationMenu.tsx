import Link from '#/components/Link'
import classNames from '#/utils/classNames'
import { NavigationItem } from '../types'

export type NavigationMenuProps = {
  items: NavigationItem[]
}

export function NavigationMenu({ items }: NavigationMenuProps) {
  return (
    <>
      {items?.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={classNames(
            item.current
              ? String.raw`before:content-["\005F"] after:content-["\005F"]`
              : `before:content-["["] after:content-["]"]`,
            'first-of-type:-ml-2 p-2 outline-none focus:bg-blue-700 focus:text-white no-underline before:p-0 after:p-0 hover:bg-blue-700 hover:text-white'
          )}
        >
          {item.text}
        </Link>
      ))}
    </>
  )
}
