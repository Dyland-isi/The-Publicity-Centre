'use client'

import dynamic from 'next/dynamic'

const HeroBackground = dynamic(
  () => import('./HeroScene'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 w-full h-full bg-gray-50" />
    ),
  }
)

export { HeroBackground }
export default HeroBackground
