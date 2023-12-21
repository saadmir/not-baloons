import { forwardRef } from 'react'

const Loon = forwardRef<SVGCircleElement, tLoon>(({ id, x = 0, y = 0, color = "green"}: tLoon, ref) => (
    <circle 
      key={`circle-${id}`}
      ref={ref}
      cx={x}
      cy={y}
      r="10"
      fill={color}
    />
))

export default Loon