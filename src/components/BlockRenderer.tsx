/**
 * BlockRenderer — maps Payload block types to their React components.
 *
 * The `blockType` field on each block matches the `slug` defined in the
 * corresponding /src/payload/blocks/*.ts file.
 *
 * To add a new block:
 *  1. Define the block in /src/payload/blocks/
 *  2. Add it to Pages.ts blocks array
 *  3. Create the React component in /src/components/blocks/
 *  4. Add an entry to blockMap below
 */
import React from 'react'
import HeroBlockComponent from './blocks/HeroBlock'
import StatsBlockComponent from './blocks/StatsBlock'
import ValuesBlockComponent from './blocks/ValuesBlock'
import AboutBlockComponent from './blocks/AboutBlock'
import ServicesBlockComponent from './blocks/ServicesBlock'
import PlatformTeaserBlockComponent from './blocks/PlatformTeaserBlock'
import ClientsBlockComponent from './blocks/ClientsBlock'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlockData = { blockType: string; [key: string]: any }

// Keys must exactly match the `slug` values in /src/payload/blocks/*.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockMap: Record<string, React.ComponentType<any>> = {
  hero: HeroBlockComponent,
  stats: StatsBlockComponent,
  values: ValuesBlockComponent,
  about: AboutBlockComponent,
  services: ServicesBlockComponent,
  platformTeaser: PlatformTeaserBlockComponent,
  clients: ClientsBlockComponent,
}

interface BlockRendererProps {
  blocks: BlockData[]
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        const Component = blockMap[block.blockType]
        if (!Component) {
          console.warn(`[BlockRenderer] Unknown block type: "${block.blockType}". Add it to blockMap.`)
          return null
        }
        return <Component key={`${block.blockType}-${index}`} {...block} />
      })}
    </>
  )
}
