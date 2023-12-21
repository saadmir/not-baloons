type tLoon = {
  id: string, 
  x: number, 
  y: number,
  color: string, 
  scale?: number,
  bbox?: tBoundingBox

  position_x?: number, 
  position_y?: number,
}

type tBoundingBox = {
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  top: number,
  right: number,
  bottom: number,
  left: number,
}

type tLoonMap<T> = {
  [id: string]: T
}

type tScores = { 
  [round: string]: string 
}

type tGameContext = {
  endOfRound: boolean,
  startRound: () => void,
  loonStates: tLoonMap<tLoon>,
  dartBBoxes: tLoonMap<tBoundingBox>,
  setDartBBoxes: (boundingBoxMap: tLoonMap<tBoundingBox>) => void,
  popLoon: (loonId: string) => void,
  score: number,
  setScore: (count: number) => void,
  scores: tScores,
  popped: string[],
  setPopped: (loonIds: string[]) => void
  inRound: boolean
}
