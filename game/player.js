export default function setupPlayer(k) {
  k.loadSprite('player', './game/assets/Fighter/spritesheet.png', {
    sliceX: 88,
    sliceY: 1,
    anims: {
      idle: { from: 17, to: 22, loop: true },
      jump: { from: 23, to: 31, loop: false, speed: 13 },
      walk: { from: 33, to: 40, loop: true },
      punch: { from: 0, to: 3, pingpong: true, speed: 20 },
      kick: { from: 7, to: 10, pingpong: true, speed: 20 },
    },
  })

  const player = k.add([
    k.sprite('player', { anim: 'idle' }),
    k.pos(0, 0),
    k.area({
      offset: k.vec2(42, 44),
      shape: new k.Rect(k.vec2(0, 0), 40, 84),
    }),
    k.body(),
    k.health(8),
    {
      canWalk: true,
      isWalking: false,
    },
  ])

  player.onUpdate(() => {
    const playerPos = player.worldPos()
    const playerDimensions = k.camPos(
      k.vec2(playerPos.x + player.width / 2, k.height() / 4),
    )
  })

  player.onKeyPress('up', () => {
    if (player.isGrounded()) {
      player.jump()
      player.play('jump', {
        onEnd: () => {
          player.play('idle')
          player.isWalking = false
        },
      })
    }
  })

  player.onKeyDown('left', function goLeft() {
    if (!player.canWalk) return

    player.flipX = true

    if (!player.isWalking && player.isGrounded()) {
      player.isWalking = true
      player.play('walk')
    }

    player.move(-300, 0)
  })

  player.onKeyDown('right', function goRight() {
    if (!player.canWalk) return

    player.flipX = false

    if (!player.isWalking && player.isGrounded()) {
      player.isWalking = true
      player.play('walk')
    }

    player.move(300, 0)
  })

  player.onKeyRelease('left', () => {
    player.isWalking = false
    player.canWalk = true
    player.play('idle')
  })

  player.onKeyRelease('right', () => {
    player.isWalking = false
    player.canWalk = true
    player.play('idle')
  })

  player.onKeyPress('space', () => {
    if (player.isGrounded()) {
      player.canWalk = false
      player.play('punch', {
        onEnd: () => {
          player.isWalking = false
          player.canWalk = true
          player.play('idle')
        },
      })
    } else {
      player.play('kick', {
        onEnd: () => {
          player.isWalking = false
          player.canWalk = true
          player.play('idle')
        },
      })
    }
  })

  return player
}
