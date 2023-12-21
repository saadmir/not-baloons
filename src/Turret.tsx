import { useEffect, useRef, useState, useContext, useCallback, PointerEvent } from 'react'

import { GameContext } from './GameContext'

const DART_WIDTH = 1
const DART_HEIGHT = 10
const DART_OFFSET = 25
const DART_FILL = 'red'

const TURRET_WIDTH = 20
const TURRET_HEIGHT = 20;

interface iOffset {
  x: number
  y: number
}

  interface iPos {
  x: number
  y: number
  active?: boolean
  offset?: iOffset
  width?: number
  height?: number
}

export default ({ id, x, y, canvasBBox }: { id: string, x: number, y: number, canvasBBox: () => tBoundingBox }) => {
  const { dartBBoxes, setDartBBoxes } = useContext(GameContext) as tGameContext;

  const turretRef = useRef<SVGRectElement>();

  const dartNRef = useRef<SVGRectElement>();
  const dartERef = useRef<SVGRectElement>();
  const dartSRef = useRef<SVGRectElement>();
  const dartWRef = useRef<SVGRectElement>();

  const [shootDarts, setShootDarts] = useState<boolean>(false)

  const [dartN, setDartN] = useState<iPos>({ x, y, width: 0, height: 0 })
  const [dartE, setDartE] = useState<iPos>({ x, y, width: 0, height: 0 })
  const [dartS, setDartS] = useState<iPos>({ x, y, width: 0, height: 0 })
  const [dartW, setDartW] = useState<iPos>({ x, y, width: 0, height: 0 })

  const [offset, setOffset] = useState<iPos>({ x, y, active: false })

  const screenToSVGCoords = useCallback(({ clientX, clientY }) => ({
    x: clientX - canvasBBox().x,
    y: clientY - canvasBBox().y
  }), [canvasBBox])

  const onPointerMove = (e: PointerEvent) => {
    e.preventDefault();
    if (offset.active) {
      let coords = screenToSVGCoords(e);
      turretRef.current.setAttribute('x', `${coords.x - offset.x}`)
      turretRef.current.setAttribute('y', `${coords.y - offset.y}`)
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    e.preventDefault();
    setOffset(prev => ({...prev, active: false }))
    const x = parseFloat(turretRef.current.getAttribute('x'))
    const y = parseFloat(turretRef.current.getAttribute('y'))
    setDartN({
      x: x + (TURRET_WIDTH/2),
      y: y - DART_HEIGHT - DART_OFFSET,
    })
    setDartE({
      x: x + TURRET_WIDTH + DART_OFFSET,
      y: y + (TURRET_HEIGHT/2),
    })
    setDartS({
      x: x + (TURRET_WIDTH/2),
      y: y + TURRET_HEIGHT + DART_OFFSET,
    })
    setDartW({
      x: x - DART_HEIGHT - DART_OFFSET,
      y: y + (TURRET_HEIGHT/2),
    })
    setShootDarts(true)
  };

  const onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    const coords = screenToSVGCoords(e);
    setOffset({
      active: true,
      x: coords.x - parseFloat(turretRef.current.getAttribute('x')),
      y: coords.y - parseFloat(turretRef.current.getAttribute('y'))
    })
  };

  useEffect(()=> {
    let interval: NodeJS.Timer;
    if (shootDarts && !interval) {
      interval = setInterval(() => {
        if (!shootDarts) {
          clearInterval(interval)
          return
        }
        setDartN(prev => ({
          ...prev,
          height: prev.height !== 0 ? 0 : DART_HEIGHT,
          width: prev.width !== 0 ? 0 : DART_WIDTH,
        }))
        setDartE(prev => ({
          ...prev,
          height: prev.height !== 0 ? 0 : DART_WIDTH,
          width: prev.width !== 0 ? 0 : DART_HEIGHT,
        }))
        setDartS(prev => ({
          ...prev,
          height: prev.height !== 0 ? 0 : DART_HEIGHT,
          width: prev.width !== 0 ? 0 : DART_WIDTH,
        }))
        setDartW(prev => ({
          ...prev,
          height: prev.height !== 0 ? 0 : DART_WIDTH,
          width: prev.width !== 0 ? 0 : DART_HEIGHT,
        }))
        const bboxes = {};
        for (const ref of [dartNRef, dartERef, dartSRef, dartWRef]) {
          bboxes[ref.current.getAttribute('id')] = ref.current.getBoundingClientRect()
        }
        setDartBBoxes({
          ...dartBBoxes,
          ...bboxes
        })
      }, 1000)
    }

    return (() => {
      clearInterval(interval)
    })
  }, [shootDarts])

  return (
    <>
      <rect 
        key={`turret-${id}`}
        ref={turretRef}
        style={{
          cursor: 'move',
        }}
        x={x} 
        y={y} 
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        width={TURRET_WIDTH} 
        height={TURRET_HEIGHT}
        fill="blue" 
      />
      <rect 
        id={`dart-${id}-N`}
        ref={dartNRef}
        x={dartN.x} 
        y={dartN.y} 
        width={dartN.width} 
        height={dartN.height} 
        fill={DART_FILL} 
      />
      <rect 
        id={`dart-${id}-E`}  
        ref={dartERef}
        x={dartE.x} 
        y={dartE.y} 
        width={dartE.width} 
        height={dartE.height} 
        fill={DART_FILL} 
      />
      <rect 
        id={`dart-${id}-S`}  
        ref={dartSRef}
        x={dartS.x} 
        y={dartS.y} 
        width={dartS.width} 
        height={dartS.height} 
        fill={DART_FILL} 
      />
      <rect 
        id={`dart-${id}-W`} 
        ref={dartWRef}
        x={dartW.x} 
        y={dartW.y} 
        width={dartW.width} 
        height={dartW.height} 
        fill={DART_FILL} 
      />
    </>
  )
}
