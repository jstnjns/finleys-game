export default function setupScene(k) {
  k.setGravity(1000)

  k.loadSprite('background', 'game/assets/background.webp')

  const background = k.add([
    k.sprite('background', { width: k.width(), height: k.height() }),
    k.pos(0, 0),
    k.area({ shape: new k.Rect(k.vec2(0, 0), k.width(), k.height()) }),
    k.layer('background'),
  ])

  const PLATFORM_HEIGHT = 100

  const platform = k.add([
    k.rect(k.width(), PLATFORM_HEIGHT),
    k.pos(0, 800),
    k.area(),
    k.body({ isStatic: true }),
    k.color(k.Color.fromHex('#222222')),
  ])
}
