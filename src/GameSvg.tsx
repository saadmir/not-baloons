import { useEffect, useRef, useContext } from 'react'

import { GameContext } from './GameContext'
import Turret from './Turret'
import Loon from './Loon'


const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 300;

const isCollide = (a: tBoundingBox, b: tBoundingBox) => !(
  ((a.y + a.height) < (b.y)) ||
  (a.y > (b.y + b.height)) ||
  ((a.x + a.width) < b.x) ||
  (a.x > (b.x + b.width))
)

export default () => {
  const { 
    startRound, 
    loonStates, 
    dartBBoxes, 
    setDartBBoxes, 
    popLoon,
    scores,
  } = useContext(GameContext) as tGameContext;

  const svgRef = useRef(null);
  const loonRefs = useRef<{ [loonId: string]: SVGCircleElement }>({});

  useEffect(() => {
    if (!Object.keys(dartBBoxes).length || !Object.keys(loonStates).length) return;
    const _dartBBoxes = {...dartBBoxes};
    for (const dartId in _dartBBoxes) {
      for (const loonId in loonRefs.current) {
        if (_dartBBoxes[dartId] && loonRefs?.current[loonId]?.getBoundingClientRect && isCollide(_dartBBoxes[dartId], loonRefs.current[loonId].getBoundingClientRect())) {
          popLoon(loonId)
          delete _dartBBoxes[dartId]
          delete loonRefs.current[loonId]
        }
        if (!loonRefs.current[loonId]) delete loonRefs.current[loonId]
      }
    }
    setDartBBoxes({});
  }, [dartBBoxes]);

  const renderLoons = () => Object.keys(loonStates).map((id, i) => {
    const { width, height } = svgRef.current.getBoundingClientRect() as tBoundingBox
    const scale = width/height;
    const yPlus = CANVAS_HEIGHT/2
    const xPlus = CANVAS_WIDTH - yPlus
    return (
      <Loon
        key={`loon-${id}`}
        id={id} 
        x={xPlus - (loonStates[id].position_x * scale)} 
        y={yPlus + loonStates[id].position_y} 
        scale={width/height}
        bbox={svgRef.current.getBoundingClientRect()}
        ref={el => (loonRefs.current[id] = el)}
        color={i % 2 == 0 ? 'green' : 'cyan'}
      />
    )
  })

  const renderTurrets = () => Array.from(Array(5).keys()).map(i => (
    <Turret key={`turret-${i}`} id={`turret-${i}`} x={i * 50}  y={15} canvasBBox={() => svgRef?.current?.getBoundingClientRect()} />
  ))

  const renderScores = () => (
    <ul>
      {Object.keys(scores).map(round => (<li key={`round-${round}`}>{round}: {scores[round]}/20</li>))}
    </ul>
  )

  return (
    <>
      <button onClick={e => { loonRefs.current = {}; startRound(); }}>Start Round</button>
      <br />
      <div>
        <svg viewBox={`0 -10 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} width={`${CANVAS_WIDTH}`} height={`${CANVAS_HEIGHT}`} ref={svgRef}>
          <rect x="0" y="0" width="100%" height="40" fill="#EEEEEE" />
          <text x="0" y="10" style={{ font: '10px sans-serif' }}>Drag a Turret</text>
          {renderTurrets()}
          {renderLoons()}
          </svg>
      </div>
      <div>
        <h4>Scores</h4>
        {renderScores()}
      </div>
    </>
  )
}
