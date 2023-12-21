import { useState, useEffect, useRef, createContext, ReactNode } from 'react'

import useApi from './useApi'
export const GameContext = createContext<undefined | tGameContext>(undefined)

export default ({ children }: { children: ReactNode}) => {
  const { loonStates, popLoon: _popLoon, startRound, endOfRound } = useApi()
  const [dartBBoxes, setDartBBoxes] = useState<tLoonMap<tBoundingBox>>({})
  const [round, setRound] = useState<number>(1)
  const [score, setScore] = useState<number>(0)
  const [scores, setScores] = useState<tScores>({})
  const [popped, setPopped] = useState([])
  const [inRound, setInRound] = useState(false)
  const ws = useRef<WebSocket| null>(null)

  useEffect(() => {
    if (!endOfRound) return;
    setScores({
      ...scores,
      [`${round}`]: `${popped.length}`
    })
    setRound(round + 1)
    setScore(0)
    setPopped([])
    setInRound(false)
  }, [endOfRound]);

  const popLoon = (loonId: string) => {
    _popLoon(loonId)
    setPopped([...popped, loonId])
    setScore(score + 1)
  }

  return (
    <GameContext.Provider value={{
      endOfRound,
      startRound: () => { setInRound(true); startRound(); },
      loonStates,
      dartBBoxes,
      setDartBBoxes,
      popLoon,
      score,
      setScore,
      scores,
      popped,
      setPopped,
      inRound,
    }}>
      {children}
    </GameContext.Provider>
  )
}