import { useEffect, useRef, useState, useContext, useMemo, ReactNode } from 'react'
import GameContextProvider from './GameContext'
import GameSvg from './GameSvg'

import './App.css'

export default function App() {
  return (
    <main>
      <GameContextProvider>
          <GameSvg />
      </GameContextProvider>
    </main>
  )
}
