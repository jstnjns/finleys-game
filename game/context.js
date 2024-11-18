import kaplay from '../kaplay/dist/kaplay.mjs'

const k = kaplay({
  global: false,

  background: [0, 0, 0],
  width: window.innerWidth,
  height: window.innerHeight,
  crisp: true,

  debug: true,
  debugKey: 'd',
})

export default k
