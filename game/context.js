import kaplay from '../kaplay/dist/kaplay.mjs'

const k = kaplay({
  global: false,

  background: [0, 0, 0],
  width: 1920,
  height: 1080,
  letterbox: true,
  crisp: true,

  debug: true,
  debugKey: 'd',
})

export default k
