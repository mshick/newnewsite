import { join } from 'node:path'
import { type Image, processAsset, z } from 'velite'

export interface ImageOptions {
  /**
   * root path for absolute path, if provided, the value will be processed as an absolute path
   * @default undefined
   */
  absoluteRoot?: string
  // /**
  //  * allow remote url
  //  * @default false
  //  */
  // allowRemoteUrl?: boolean
}

/**
 * Image schema
 */
export const image = ({ absoluteRoot }: ImageOptions = {}) =>
  z.string().transform<Image>(async (value, { meta, addIssue }) => {
    try {
      const { output } = meta.config

      if (absoluteRoot && value.startsWith('/')) {
        return await processAsset(
          join(absoluteRoot, value),
          join(process.cwd(), absoluteRoot),
          output.name,
          output.base,
          true
        )
        // const metadata = await getImageMetadata(buffer)
        // if (metadata == null)
        //   throw new Error(`Failed to get image metadata: ${value}`)
        // return { src: value, ...metadata }
      }

      // TODO: is it necessary to allow remote url?
      // if (allowRemoteUrl && /^https?:\/\//.test(value)) {
      //   const response = await fetch(value)
      //   const blob = await response.blob()
      //   const buffer = await blob.arrayBuffer()
      //   const metadata = await getImageMetadata(Buffer.from(buffer))
      //   if (metadata == null) throw new Error(`Failed to get image metadata: ${value}`)
      //   return { src: value, ...metadata }
      // }

      // process asset as relative path
      return await processAsset(
        value,
        meta.path,
        output.name,
        output.base,
        true
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      addIssue({ fatal: true, code: 'custom', message })
      return null as never
    }
  })
