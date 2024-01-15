function init() {  
  const elements = {
    wrapper: document.querySelector('.wrapper'),
    mapCover: document.querySelector('.map-cover'), 
    mapImage: {
      el: document.querySelector('.map-image'),
      ctx: null,
    },
    indicator: document.querySelector('.indicator'),
    player: document.querySelector('.player'), 
  }

  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))
  const randomN = max => Math.ceil(Math.random() * max)

  const player = {
    id: 'bear',
    x: 0, y: 0,
    frameOffset: 1,
    animationTimer: null,
    el: elements.player,
    sprite: {
      el: document.querySelector('.player').childNodes[1],
      x: 0, y: 0
    },
    facingDirection: 'down',
    walkingDirection: '',
    walkingInterval: null,
    pause: false,
  }

  const triggerBunnyWalk = bunny => {
    bunny.animationTimer = setInterval(()=> {
      const dir = ['up', 'down', 'right', 'left'][Math.floor(Math.random() * 4)]
      walk(bunny, dir)

      setTimeout(()=> {
        walk(bunny, dir)
      }, 300)
      setTimeout(()=> {
        walk(bunny, dir)
      }, 600)
      setTimeout(()=> {
        stopSprite(bunny)
      }, 900)
    }, 2000)
  }

  const addBunny = () => {
    const bunny = {
      id: settings.npcs.length + 1,
      x: 20 * randomN(19), y: 20 * randomN(19),
      frameOffset: 1,
      animationTimer: null,
      el: Object.assign(document.createElement('div'), 
      { 
        className: 'sprite-container sad',
        innerHTML: '<div class="bunny sprite"></div>'
      }),
      sprite: {
          el: null,
          x: 0, y: 0
        },
      sad: true,
    }

    settings.npcs.push(bunny)
    settings.map.el.appendChild(bunny.el)

    bunny.sprite.el = bunny.el.childNodes[0]
    setPos(bunny)

    triggerBunnyWalk(bunny)
  }

  const settings = {
    d: 20,
    offsetPos: {
      x: 0, y: 0,
    },
    npcs: [],
    mapData: {
      // column: 30,
      // row: 20,
      // walls: '',
      // pos: {
      // }
      x: 20, y: 20,
    },
    map: {
      el: document.querySelector('.map-image-wrapper'),
      canvas: document.querySelector('.map-image'),
      walls: [],
      w: 20 * 20,
      h: 20 * 20,
    }, 
    mapImage: {
      el: elements.mapImage.el.parentNode,
      canvas: elements.mapImage.el,
      x: 0,
      y: 0,
      w: 0,
      h: 0
    },
    transitionTimer: null,
    isWindowActive: true,
  }


  const px = n => `${n}px`

  const setSize = ({ el, w, h, d }) => {
    const m = d || 1
    if (w) el.style.width = px(w * m)
    if (h) el.style.height = px(h * m)
  }
  
  const getWalkConfig = dir => {
    const { d } = settings
    return {
      right: { para: 'x', dist: d },
      left: { para: 'x', dist: -d },
      up: { para: 'y', dist: -d },
      down: { para: 'y', dist: d }
    }[dir] 
  }

  const setBackgroundPos = ({ el, x, y }) => {
    el.style.setProperty('--bx', px(x))
    el.style.setProperty('--by', px(y))
  }

  const animateSprite = (actor, dir) => {
    const h = -32 * 2
    actor.sprite.y = {
      down: 0,
      up: h,
      right: h * 2,
      left: h * 3
    }[dir]
    actor.frameOffset = actor.frameOffset === 1 ? 2 : 1
    actor.sprite.x = actor.frameOffset * (2 * -20)
    setBackgroundPos(actor.sprite)
  }

  const setPos = ({ el, x, y }) => Object.assign(el.style, { left: `${x}px`, top: `${y}px` })

  const noWall = (actor, para, dist) => {
    const newPos = {...actor}
    newPos[para] += dist
    if (actor === player && !player.pause) {
      const bunnyToHug = settings.npcs.filter(c => c.sad && c.id !== actor.id).find(c => distanceBetween(c, newPos) < 20)
      if (bunnyToHug) {
        const classToAdd = bunnyToHug.x > player.x ? 'hug-bear-bunny' : 'hug-bunny-bear'
        player.el.classList.add('d-none')
        bunnyToHug.el.classList.add(classToAdd)
        clearInterval(bunnyToHug.animationTimer)
        player.pause = true

        setTimeout(()=> {
          player.pause = false
          player.el.classList.remove('d-none')
          ;[classToAdd, 'sad'].forEach(c => bunnyToHug.el.classList.remove(c))
          bunnyToHug.sad = false
          triggerBunnyWalk(bunnyToHug)
          animateSprite(bunnyToHug, 'down')
          stopSprite(bunnyToHug)
          ;['x', 'y'].forEach(para => player[para] = bunnyToHug[para])
          // walk(player,'down')
          // setTimeout(()=> {
          //   stopSprite(player)
          // }, 200)
        }, 1400)
        return 
      }
    } else if (settings.npcs.filter(c => c.id !== actor.id).some(c => distanceBetween(c, newPos) < 20)) return

    if (para === 'x') {
      return actor.x + dist - 10 > 0 && actor.x + dist + 10 < settings.map.w 
    }
    return (actor.y + dist) > 10 && (actor.y + dist) < settings.map.h  - 10
  }

  const walk = (actor, dir) => {
    if (!dir || player.pause || !settings.isWindowActive) return
    const { para, dist } = getWalkConfig(dir) 
  
    if (noWall(actor, para, dist)) {
      animateSprite(actor, dir)

      if (actor === player) {
        player[para] += dist
        positionMapImage()
        // setStyles(settings.mapImage)
        setPos(settings.mapImage)
        player.el.parentNode.style.zIndex = player.y
        elements.indicator.innerHTML = `x:${player.x} | y:${player.y}`
      } else {
        actor[para] += dist
        setPos(actor)
        actor.el.style.zIndex = actor.y
      }
    }
  }


  const updateOffset = () => {
    const { width, height } = elements.wrapper.getBoundingClientRect()
    settings.offsetPos = {
      x: (width / 2),
      y: (height / 2),
    }
  }

  const positionMapImage = () => {
    settings.mapImage.x = settings.offsetPos.x - player.x
    settings.mapImage.y = settings.offsetPos.y - player.y
  }

  const resizeAndRepositionMap = () => {
    settings.mapImage.el.classList.add('transition')
    clearTimeout(settings.transitionTimer)
    settings.transitionTimer = setTimeout(()=> {
      settings.mapImage.el.classList.remove('transition')
    }, 500)
    updateOffset()
    positionMapImage()
    setPos(settings.mapImage)
  }

  const stopSprite = actor => {
    actor.sprite.x = 0
    setBackgroundPos(actor.sprite)
    clearInterval(actor.walkingInterval)
  }

  const handleWalk = dir =>{
    if (player.walkingDirection !== dir){
      stopSprite(player)
      player.walkingDirection = dir
      player.walkingInterval = setInterval(()=>{
        player.walkingDirection && !settings.activeEvent
          ? walk(player, dir)
          : stopSprite(player)
      }, 150)
    }
  }



  player.x = settings.mapData.x
  player.y = settings.mapData.y
  player.el.style.zIndex = player.y
  setSize(settings.map)

  window.addEventListener('keydown', e => handleWalk(e.key.toLowerCase().replace('arrow','')))
  window.addEventListener('keyup', () => {
    player.walkingDirection = null
    stopSprite(player)
  })

  window.addEventListener('focus', ()=> settings.isWindowActive = true)
  window.addEventListener('blur', ()=> settings.isWindowActive = false)

  
  window.addEventListener('resize', resizeAndRepositionMap)
  resizeAndRepositionMap()
  
  new Array(4).fill('').forEach(()=> addBunny())

}

window.addEventListener('DOMContentLoaded', init)


