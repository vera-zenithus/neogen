import React from 'react'
import Hero from './Hero'
import Features from './Features'
import Pricing from './Pricing'
import NeoChat from './NeoChat'

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      <NeoChat />
    </main>
  )
}

export default Home
