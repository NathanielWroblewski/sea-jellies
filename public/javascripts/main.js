import Vector from './models/vector.js'
import renderCircle from './views/circle.js'
import renderRect from './views/rect.js'
import { lerp, remap } from './utils/index.js'
import { noise, seed } from './utils/noise.js'
import { BLACK } from './constants/colors.js'
import { τ, FRAMES, LERP_COUNT, DELAY_FACTOR } from './constants/dimensions.js'

seed(Math.random())

const canvas = document.querySelector('.canvas')
const context = canvas.getContext('2d')

const WIDTH = canvas.width
const HEIGHT = canvas.height

const HAWIDTH = 0.5 * WIDTH
const HAHEIGHT = 0.5 * HEIGHT
const QTRWIDTH = 0.25 * WIDTH
const Q3WIDTH = 0.75 * WIDTH

const scale = 0.4

let frame = 0
let time

const MOTION = 0.1 // Radians

const PARTS = 8
const ANGLES = 20

const X1o = scale * WIDTH
const Y1o = scale * WIDTH
const X2o = 0.3 * WIDTH
const Y2o = 0.5 * scale * WIDTH

const x1 = t => X1o * noise(75 + MOTION * Math.cos(τ * (t + time)), MOTION * Math.sin(τ * (t + time)))
const y1 = t => Y1o * noise(100 + MOTION * Math.cos(τ * (t + time)), MOTION * Math.sin(τ * (t + time)))
const x2 = t => X2o + 0.5 * scale * WIDTH * noise(200 + MOTION * Math.cos(τ * (t + time)), MOTION * Math.sin(τ * (t + time)))
const y2 = t => Y2o * noise(300 + MOTION * Math.cos(τ * (t + time)), MOTION * Math.sin(τ * (t + time)))

const draw = (j, time) => {
  const φ = -PARTS * j / ANGLES

  const outside = Vector.from([x1(φ), y1(φ)])
  const inside = Vector.from([x2(φ), y2(φ)])

  renderCircle(context, inside, 1, BLACK, BLACK)
  renderCircle(context, outside, 1, BLACK, BLACK)

  for (let i = 0; i <= LERP_COUNT; i++) {
    const t = i/LERP_COUNT
    const outsideDelay = -DELAY_FACTOR * t + φ
    const insideDelay = -DELAY_FACTOR * (1 - t) + φ

    const delayedOutside = Vector.from([x1(outsideDelay), y1(outsideDelay)])
    const delayedInside = Vector.from([x2(insideDelay), y2(insideDelay)])

    const point = Vector.from([
      lerp(delayedOutside.x, delayedInside.x, t),
      lerp(delayedOutside.y, delayedInside.y, t)
    ])

    renderRect(context, point, [1, 1], null, BLACK)
  }
}

const SAMPLES_PER_FRAME = 1
const SHUTTER_ANGLE = 0.6

const step = () => {
  context.clearRect(0, 0, WIDTH, HEIGHT)

  let sa = 0
  // for (let sa = 0; sa < SAMPLES_PER_FRAME; sa++) {
    context.save()
    context.translate(HAWIDTH, HAHEIGHT)

    for (let i = 0; i < ANGLES; i++) {
      context.save()
      context.rotate(i * τ/ANGLES)

      time = remap(frame - 1 + sa * SHUTTER_ANGLE / SAMPLES_PER_FRAME, 0, FRAMES, 0, 1)

      draw(i)
      context.restore()
    }

    context.restore()
  // }

  frame++

  window.requestAnimationFrame(step)
}

window.clear = () => context.clearRect(0, 0, WIDTH, HEIGHT)
window.step = step

window.requestAnimationFrame(step)
