import { τ } from '../constants/dimensions.js'

const render = (context, [x, y], r, stroke, fill) => {
  context.beginPath()
  context.arc(x, y, r, 0, τ)

  if (stroke) context.stroke()
  if (fill) context.fill()
}

export default render
