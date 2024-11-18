export default function setupScene(k) {
  k.setGravity(2000)
  k.loadSprite('background', 'game/assets/background.webp')

  const PLATFORM_HEIGHT = 100

  const platform = k.add([
    k.rect(k.width(), PLATFORM_HEIGHT),
    k.pos(0, k.height() - PLATFORM_HEIGHT),
    k.area(),
    k.body({ isStatic: true }),
    k.fixed(),
    k.color(k.Color.fromHex('#222222')),
  ])
}
