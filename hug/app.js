function init() {  
  const elements = {
    wrapper: document.querySelector('.wrapper'),
    mapCover: document.querySelector('.map-cover'), 
    indicator: document.querySelector('.indicator'),
    player: document.querySelector('.player'), 
  }

  const control = {
    wrapper: document.querySelector('.control-wrapper'),
    el: document.querySelector('.control'),
    active: false,
    direction: null,
    timer: null,
    pos: { x: 0, y: 0 },
    movePos: { x: 0, y: 0 },
  }

  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))
  const randomN = max => Math.ceil(Math.random() * max)
  const px = n => `${n}px`
  const addEvents = (target, event, action, array) => {
    array.forEach(a => event === 'remove' ? target.removeEventListener(a, action) : target.addEventListener(a, action))
  }
  const ePos = (e, type) => Math.round(e.type[0] === 'm' ? e[`page${type}`] : e.touches[0][`page${type}`])
  const setPos = ({ el, x, y }) => Object.assign(el.style, { left: `${x}px`, top: `${y}px` })

  const setSize = ({ el, w, h, d }) => {
    const m = d || 1
    if (w) el.style.width = px(w * m)
    if (h) el.style.height = px(h * m)
  }

  const mouse = {
    up: (t, e, a) => addEvents(t, e, a, ['mouseup', 'touchend']),
    move: (t, e, a) => addEvents(t, e, a, ['mousemove', 'touchmove']),
    down: (t, e, a) => addEvents(t, e, a, ['mousedown', 'touchstart']),
    enter: (t, e, a) => addEvents(t, e, a, ['mouseenter', 'touchstart']),
    leave: (t, e, a) => addEvents(t, e, a, ['mouseleave'])
  }

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
    buffer: 20,
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

  const getRandomX = () => {
    return 20 * randomN((settings.map.w / 20) - 1)
  }

  const getRandomY = () => {
    return 20 * randomN((settings.map.h / 20) - 1)
  }

  const addBunny = () => {
    const bunny = {
      id: settings.elements.length + 1,
      x: getRandomX(), y: getRandomY(),
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
      buffer: 30,
    }

    settings.elements.push(bunny)
    settings.map.el.appendChild(bunny.el)

    bunny.sprite.el = bunny.el.childNodes[0]
    bunny.el.style.zIndex = bunny.y
    setPos(bunny)

    if (randomN(2) === 2) triggerBunnyWalk(bunny)
  }

  const addTree = () => {
    const tree = {
      id: settings.elements.length + 1,
      x: getRandomX(), y: getRandomY(),
      el: Object.assign(document.createElement('div'), 
      { 
        className: 'tree',
        innerHTML: '<div></div>' 
      }),
      buffer: 40,
    }
    settings.elements.push(tree)
    settings.map.el.appendChild(tree.el)
    tree.el.style.zIndex = tree.y
    setPos(tree)
  }

  const settings = {
    d: 20,
    offsetPos: {
      x: 0, y: 0,
    },
    elements: [],
    map: {
      el: document.querySelector('.map'),
      walls: [],
      w: 20 * 200,
      h: 20 * 200,
      x: 0, y: 0,
    },
    transitionTimer: null,
    isWindowActive: true,
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

  const triggerBunnyMessage = (bunny, classToAdd) => {
    bunny.el.setAttribute('message', ['thanks!', 'arigato!', 'yeah!', '^ _ ^', 'thank you!'][randomN(5) - 1])
    bunny.el.classList.add(classToAdd)
    setTimeout(()=>{
      bunny.el.classList.remove(classToAdd)
    }, 800)
  }

  const hugBunny = bunny => {
    const classToAdd = bunny.x > player.x ? 'hug-bear-bunny' : 'hug-bunny-bear'
    player.el.classList.add('d-none')
    bunny.el.classList.add(classToAdd)
    clearInterval(bunny.animationTimer)
    player.pause = true
    player.y = bunny.y
    if (classToAdd === 'hug-bear-bunny') {
      player.x = bunny.x - 40
      animateSprite(player, 'right')
      animateSprite(bunny, 'left')
    } else {
      player.x = bunny.x + 40
      animateSprite(player, 'left')
      animateSprite(bunny, 'right')
    }

    positionMap()
    settings.map.el.classList.add('slow-transition')
    setPos(settings.map)
    player.el.parentNode.style.zIndex = player.y

    setTimeout(()=> {
      player.el.classList.remove('d-none')
      ;[classToAdd, 'sad'].forEach(c => bunny.el.classList.remove(c))
      bunny.sad = false
      stopSprite(bunny)
      triggerBunnyWalk(bunny)
      player.pause = false
      settings.map.el.classList.remove('slow-transition')
      triggerBunnyMessage(bunny, classToAdd === 'hug-bear-bunny' ? 'happy-left' : 'happy-right')
    }, 1800)
  }

  const noWall = (actor, para, dist) => {
    const newPos = {...actor}
    newPos[para] += dist
    if (actor === player && !player.pause) {
      const bunnyToHug = settings.elements.filter(el => el.sad && el.id !== actor.id).find(el => distanceBetween(el, newPos) <= el.buffer)
      if (bunnyToHug) {
        hugBunny(bunnyToHug)
        return 
      }
    } 
    
    if (settings.elements.filter(el => el.id !== actor.id).some(el => {
      return distanceBetween(el, newPos) <= el.buffer 
            && distanceBetween(el, actor) > el.buffer // TODO need to check if this works
    })) return
    
    const buffer = 40
    if (para === 'x') {
      if (dist < 0) return actor.x + dist - buffer > 0
      return actor.x + dist + buffer < settings.map.w 
    } else {
      if (dist < 0) return actor.y + dist - buffer > 0
      return (actor.y + dist) < settings.map.h - buffer
    }
  }

  const walk = (actor, dir) => {
    if (!dir || player.pause || !settings.isWindowActive) return
    const { para, dist } = getWalkConfig(dir) 
  
    if (noWall(actor, para, dist)) {
      animateSprite(actor, dir)
      if (actor === player) {
        player[para] += dist
        positionMap()
        setPos(settings.map)
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

  const positionMap = () => {
    settings.map.x = settings.offsetPos.x - player.x
    settings.map.y = settings.offsetPos.y - player.y
  }

  const resizeAndRepositionMap = () => {
    settings.map.el.classList.add('transition')
    clearTimeout(settings.transitionTimer)
    settings.transitionTimer = setTimeout(()=> {
      settings.map.el.classList.remove('transition')
    }, 500)
    updateOffset()
    positionMap()
    setPos(settings.map)
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

  const drag = (el, pos, x, y) =>{
    pos.a.x = pos.b.x - x
    pos.a.y = pos.b.y - y
    const newX = el.offsetLeft - pos.a.x
    const newY = el.offsetTop - pos.a.y
    const distance = distanceBetween({ x: 0, y: 0 }, { x: newX, y: newY })
    if (distance < 35) {
      setPos({ el, x: newX, y: newY })
      control.direction = Math.abs(newX) < Math.abs(newY)
        ? newY < 0 ? 'up' : 'down'
        : newX < 0 ? 'left' : 'right'
    }  
  }

  const addTouchAction = el =>{
    const pos = { a: { x: 0, y: 0 }, b: { x: 0, y: 0 } }
    const onGrab = e =>{
      pos.b.x = ePos(e, 'X')
      pos.b.x = ePos(e, 'Y')  
      mouse.up(document, 'add', onLetGo)
      mouse.move(document, 'add', onDrag)
      control.active = true
      control.timer = setInterval(()=> {
        if (control.active) walk(player, control.direction)
      }, 150)
    }
    const onDrag = e =>{
      const x = ePos(e, 'X')
      const y = ePos(e, 'Y')
      drag(el, pos, x, y)
      pos.b.x = x
      pos.b.y = y
    }
    const onLetGo = () => {
      mouse.up(document, 'remove', onLetGo)
      mouse.move(document,'remove', onDrag)
      el.style.transition = '0.2s'
      setPos({ el, x: 0, y: 0 })
      setTimeout(()=>{
        el.style.transition = '0s'
      }, 200)
      clearInterval(control.timer)
      control.active = false
      stopSprite(player)
    }
    mouse.down(el,'add', onGrab)
  }

  player.x = getRandomX()
  player.y = getRandomY()
  player.el.style.zIndex = player.y
  setSize(settings.map)

  window.addEventListener('keydown', e => {
    if (e.key[0] !== 'A') return
    handleWalk(e.key.toLowerCase().replace('arrow',''))
  })
  window.addEventListener('keyup', () => {
    player.walkingDirection = null
    stopSprite(player)
  })

  window.addEventListener('focus', ()=> settings.isWindowActive = true)
  window.addEventListener('blur', ()=> settings.isWindowActive = false)

  window.addEventListener('resize', resizeAndRepositionMap)
  resizeAndRepositionMap()
  addTouchAction(control.el)
  
  new Array(45).fill('').forEach(()=> addBunny())
  new Array(100).fill('').forEach(()=> addTree())
}

window.addEventListener('DOMContentLoaded', init)


