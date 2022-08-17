function init() {  

  // TODO add star to background
  // TODO add more assets
  // TODO add something that trigger with elementInContact
  // TODO adjust circle size and background

  const circleData = {
    angle: 271,
    interval: null,
    key: 'r',
    mapIndex: 0,
    pos: 0,
    activeEvent: null,
  }
  
  const config = {
    'l': 1,
    'r': -1,
    'u': -2,
    'd': 2,
  }

  const touchControl = {
    active: false,
    timer: null,
    direction: null,
  }
  
  const addEvents = (target, event, action, array) =>{
    array.forEach(a => event === 'remove' ? target.removeEventListener(a, action) : target.addEventListener(a, action))
  }
  const mouse = {
    up: (t, e, a) => addEvents(t, e, a, ['mouseup', 'touchend']),
    move: (t, e, a) => addEvents(t, e, a, ['mousemove', 'touchmove']),
    down: (t, e, a) => addEvents(t, e, a, ['mousedown', 'touchstart']),
    enter: (t, e, a) => addEvents(t, e, a, ['mouseenter', 'touchstart']),
    leave: (t, e, a) => addEvents(t, e, a, ['mouseleave', 'touchmove'])
  }
  
  const bearData = {
    animationTimer: ['',''],
    bear: null,
    sprite: null,
    frameOffset: 0,
    interval: null,
    vertPos: 10,
    pause: false,
    direction: null,
  }

  const artData = {
    bear_art: {
      width: 200,
      height: 200
    }
  }

  const elements = {
    tree: {
      width: 48,
      height: 60,
    },
    tree_white: {
      width: 48,
      height: 60,
    },
    round_tree: {
      width: 36,
      height: 58,
    },
    round_tree_white: {
      width: 36,
      height: 58,
    },
    mountain: {
      width: 80,
      height: 30,
    },
    house1: {
      width: 96,
      height: 96,
      offset: 20,
    },
    house2: {
      width: 80,
      height: 82,
      offset: 20
    },
    art: {
      width: 52,
      height: 60,
      offset: 60
    },
  }

  // this needs to be even number to work
  // join lines with shift cmd p, need to check unjoin
  const mapElements = {
    0: [
      {
        element: 'tree',
        angle: 30,
        offset: 100,
      },
      {
        element: 'tree_white',
        angle: 40,
        offset: 20,
      },
      {
        element: 'house2',
        angle: 120,
        offset: 60
      },
      {
        element: 'round_tree',
        angle: 80,
        offset: 40
      },
      {
        element: 'round_tree_white',
        angle: 60,
        offset: 40
      },
    ],
    1: [     
      {
        element: 'tree',
        angle: 10,
      },
      {
        element: 'tree',
        angle: 60,
      },
      {
        element: 'tree',
        angle: 90,
      },
    ],
    2: [
      {
        element: 'tree',
        angle: 10,
      },
      {
        element: 'art',
        art: 'bear_art',
        angle: 60,
      },
      {
        element: 'tree',
        angle: 120,
      },
    ],
    3: [
      {
        element: 'tree',
        angle: 10,
      },
      {
        element: 'tree',
        angle: 60,
      },
      {
        element: 'tree',
        angle: 120,
      },
    ],
    4: [
      {
        element: 'tree',
        angle: 10,
      },
      {
        element: 'tree',
        angle: 60,
      },
      {
        element: 'tree',
        angle: 120,
      },
    ],
    5: [
      {
        element: 'tree',
        angle: 10,
      },
      {
        element: 'tree',
        angle: 60,
      },
      {
        element: 'tree',
        angle: 120,
      },
    ],
  }
  
  const mapElementKeys = Object.keys(mapElements)
  const indicator = document.querySelector('.indicator')
  const cellD = 32
  const circle = document.querySelector('.circle')
  const circleWrapper = document.querySelector('.circle_wrapper')
  const pointer = document.querySelector('.pointer')
  const background = document.querySelector('.background')
  const control = document.querySelector('.touch_circle')
  const actionButton = document.querySelector('.action_button')
  const artWrapper = document.querySelector('.art_wrapper')
  const halfCircumference = r => Math.PI * r
  const isNum = x => typeof x === 'number'


  const setTargetParams = ({ target, x, y, w, h }) =>{
    const { style } = target
    if (isNum(x)) style.left = `${x}px`
    if (isNum(w)) style.width = `${w}px`
    if (isNum(y)) style.top = `${y}px`
    if (isNum(h)) style.height = `${h}px`
  }
  
  
  const placeElements = index => mapElements[index].forEach(element => placeElement(element, index))


  const placeElement = (element, i) => {
    const newElement = document.createElement('div')
    const offset = i % 2 === 0 ? 0 : 180
    newElement.className = `element ${element.element}`
    circle.append(newElement)
    const { width: w, height: h, offset: o } = elements[element.element]
    const vertOffset = h - (element.offset || o || 5)

    setTargetParams({ target: newElement, w, h })
    // newElement.innerHTML = element.element + i
    Object.assign(newElement.style, {
      transform: `translate(${220 - (w / 2)}px, ${-vertOffset}px) rotate(${element.angle + offset}deg)`,
      zIndex: element.offset || o || 5,
      backgroundSize: `${w}px ${h}px !important`,
      transformOrigin: `center ${220 + vertOffset}px`
    })
    
    element.placed = newElement
  }
  
  
  
  const setSpritePos = (num, actor, sprite) =>{
    actor.spritePos = num
    sprite.style.marginLeft = `${num}px`
  }

  const turnSprite = ({ e, actor, animate }) => {
    const dir = e
    const { sprite, frameOffset } = bearData
    const frames = {
      r: [4, 6, 5, 'add'],
      l: [4, 6, 5,'remove'],
      u: [2, 2, 3,'toggle'],
      d: [0, 0, 1, 'toggle']
    }
    let m = -cellD
    if (!frames[dir]) return
    m = animate ? m * frames[dir][0 + frameOffset] : m * frames[dir][2]
    bearData.frameOffset = frameOffset === 0 ? 1 : 0
    sprite.parentNode.classList[frames[dir][3]]('right') 
    actor.animationTimer.forEach(timer=> clearTimeout(timer))
    setSpritePos(m, actor, sprite)
  }

  const stopBear = () =>{
    turnSprite({ e: circleData.key, actor: bearData })
    circleData.key = null
  }

  const returnNextOrPrev = current =>{
    return current === -1
      ? mapElementKeys.length - 1
      : current === mapElementKeys.length
        ? 0
        : current
  }

  const returnPos = current => {
    return current === mapElementKeys.length * 180
      ? mapElementKeys.length * -180
      : current === mapElementKeys.length * -180
        ? 0
        : current
  }

  const returnVerticalPos = current =>{
    return current < -5
      ? -5
      : current > 120 
        ? 120
        : current
  }

  const populateCircle = key =>{
    const { mapIndex } = circleData
    const indexToAdd = key === 'r' ? returnNextOrPrev(mapIndex + 1) : returnNextOrPrev(mapIndex - 1)
    mapElementKeys.forEach(index =>{
      if (index !== `${mapIndex}`) mapElements[index].forEach(element => element.placed?.remove())
    })
    placeElements(indexToAdd)
  }

  const currentPos = pos =>{
    return pos === 0 
      ? 0
      : pos > 0 
        ? (pos / -180) + mapElementKeys.length
        : pos / -180
  }

  const movePointer = pos =>{
    const { width } = circleWrapper.getBoundingClientRect()
    const pointerPos = (currentPos(pos - 90) / mapElementKeys.length) * width
    pointer.style.transform = `translateX(${(pointerPos > width ? pointerPos - width : pointerPos) - 12}px)`
  }

  const changeBackground = pos =>{
    background.classList[Math.floor(pos) % 2 === 0 ? 'add' : 'remove']('light')
  }

  const withinBuffer = ({ a, b, buffer }) => Math.abs(a - b) < buffer

  const updateElements = () =>{
    const trigger = [ 89, 269, 91, 271 ]
    const { key } = circleData

    circleData.pos += config[key]
    circleData.pos = returnPos(circleData.pos)

    circleData.mapIndex = Math.round(currentPos(circleData.pos))
    circleData.mapIndex = returnNextOrPrev(circleData.mapIndex)

    if (trigger.includes(Math.abs(circleData.angle))) populateCircle(key)

    movePointer(circleData.pos)
    changeBackground(circleData.mapIndex)
    if (Math.abs(circleData.angle) === 360) circleData.angle = 0

    indicator.innerHTML = `angle: ${circleData.angle} pos:${circleData.pos} prev: ${returnNextOrPrev(circleData.mapIndex - 1)} current: ${circleData.mapIndex} next:${returnNextOrPrev(circleData.mapIndex + 1)}`
  }
  
  const positionBear = angle => {
    bearData.bear.style.transformOrigin = `center ${220 - (bearData.vertPos)}px`
    bearData.bear.style.transform = `translate(${220 - 16}px, ${bearData.vertPos}px) rotate(${angle}deg)`
  }

  const rotateCircle = () =>{
    if (['l','r'].includes(circleData.key)) {
      circleData.angle += config[circleData.key]
      circle.style.transform = `rotate(${circleData.angle}deg)`

      positionBear(-circleData.angle)
      updateElements()
    }
  }

  const moveBearVertically = () => {
    bearData.bear.style.zIndex = bearData.vertPos + 32
    positionBear(-circleData.angle)
  }
  

  const elementInContact = () => {
    const angleWithinCurrentMap = Math.round((currentPos(circleData.pos - 90) % 1) * 180) 

    return mapElements[circleData.mapIndex].map(element => {
      const { zIndex: elementPos } = element.placed.style
      const { zIndex: bearPos } = bearData.bear.style
      if (
        withinBuffer({ 
          a:element.angle, b:angleWithinCurrentMap, 
          buffer:(elements[element.element].width / halfCircumference(220 - elementPos)) * 90
          }) &&
        withinBuffer({
          a:elementPos, b:bearPos, 
          buffer: 15
        }) && 
        (circleData.key === 'u' && +elementPos < +bearPos || circleData.key === 'd' && +elementPos > +bearPos)
      ) return element
        return null
    }).filter(element => element)[0]
  }

  const handleKey = ({ e, letter, enter }) =>{
    if ((e?.key === 'Enter' || enter) && circleData.activeEvent?.art && bearData.direction === 'u') { 
      bearData.pause = !bearData.pause
      artWrapper.classList.toggle('display')
      const artDisplay = artWrapper.childNodes[1]
      const { width: w, height: h } = artData[circleData.activeEvent.art]
      artDisplay.style.transition = bearData.pause ? '0.3s' : '0s'
      setTargetParams({ target: artDisplay, w, h })
      artDisplay.style.backgroundSize = `${w}px ${h}px`
      setTimeout(()=>{
        artDisplay.classList.toggle(circleData.activeEvent.art)
      }, bearData.pause ? 0 : 300)
      artDisplay.style.transition = '0.3s'
    } else if(!bearData.pause) {
      const key = e?.key.replace('Arrow','').toLowerCase()[0] || letter
      bearData.direction = key
      if (circleData.key !== key){
        clearInterval(circleData.interval)
        circleData.key = key
        circleData.interval = setInterval(()=> {
          if (!circleData.key) {
            clearInterval(circleData.interval)
          } else {
            circleData.activeEvent = elementInContact()
            if (['l','r'].includes(key)) {
              rotateCircle()
            } else if (['u','d'].includes(key)) {
              if (!circleData.activeEvent){
                bearData.vertPos += config[key]
                bearData.vertPos = returnVerticalPos(bearData.vertPos)
                moveBearVertically()
                actionButton.classList.add('display_none')
              } else if(key === 'u') {
                actionButton.classList.remove('display_none')
                console.log(circleData.activeEvent) // TODO this only needs to be triggered when clicking something, so can be taken somewhere else
              }
            }
          }
        }, 1000 / 60)
        clearInterval(bearData.interval)
        bearData.interval = setInterval(()=> {
          if (!circleData.key) {
            clearInterval(bearData.interval)
          } else {
            turnSprite({ e: circleData.key, actor: bearData, animate: true })
          }
        }, 100)
      } 
    }
  }

  const addBear = () =>{
    bearData.bear = document.createElement('div')
    const { bear } = bearData
    circle.append(bear)
    bear.classList.add('bear_wrapper')
    bear.innerHTML = '<div><div class="bear"></div></div>'
    bearData.sprite = bear.childNodes[0].childNodes[0]
    bear.style.transform = `translate(${220 - 16}px, ${10}px) rotate(0deg)`
    bear.style.transformOrigin = `center ${220 - 10}px`
  }

  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))

  const drag = (target, pos, x, y) =>{
    pos.a = pos.c - x
    pos.b = pos.d - y
    const newX = target.offsetLeft - pos.a
    const newY = target.offsetTop - pos.b
    if (distanceBetween({ x: 0, y: 0 }, { x: newX, y: newY }) < 35) {
      setTargetParams({ target, x: newX, y: newY })
      touchControl.direction = Math.abs(newX) < Math.abs(newY)
        ? newY < 0 ? 'u' : 'd'
        : newX < 0 ? 'l' : 'r'
    }  
  }

  const client = (e, type) => e.type[0] === 'm' ? e[`client${type}`] : e.touches[0][`client${type}`]
  const roundedClient = (e, type) => Math.round(client(e, type))

  const addTouchAction = (target, handleKeyAction) =>{
    const pos = { a: 0, b: 0, c: 0, d: 0 }
    
    const onGrab = e =>{
      pos.c = roundedClient(e, 'X')
      pos.d = roundedClient(e, 'Y')  
      mouse.up(document, 'add', onLetGo)
      mouse.move(document, 'add', onDrag)
      touchControl.active = true
      touchControl.timer = setInterval(()=> {
        if (touchControl.active) handleKeyAction({ letter: touchControl.direction })
      }, 200)
    }
    const onDrag = e =>{
      const x = roundedClient(e, 'X')
      const y = roundedClient(e, 'Y')
      drag(target, pos, x, y)
      pos.c = x
      pos.d = y
    }
    const onLetGo = () => {
      mouse.up(document, 'remove', onLetGo)
      mouse.move(document,'remove', onDrag)
      target.style.transition = '0.2s'
      setTargetParams({ target, x: 0, y: 0 })
      setTimeout(()=>{
        target.style.transition = '0s'
      }, 200)
      clearInterval(touchControl.timer)
      touchControl.active = false
      stopBear()
    }
    mouse.down(target,'add', onGrab)
  }

  const resize = () => {
    const { innerWidth } = window
    circleWrapper.style.transform = innerWidth < 400 ? `scale(${innerWidth / 400})` : 'scale(1)'
    moveBearVertically()
    movePointer(circleData.pos)
  }

  document.querySelector('.location_mark').innerHTML = mapElementKeys.map(()=> `<div class="location_link"></div>`).join('')

  document.querySelectorAll('.location_link').forEach((link, i) => {
    link.addEventListener('click', ()=>{
      circleData.pos = i * -180 + 1
      circleData.angle = i === 0 
        ? 270
        : i === 1
          ? 90
          : i % 2 === 0
            ? -90
            : -270     
      bearData.vertPos = 10 //? different default could be set per map    
      positionBear(-circleData.angle)      
      circle.style.transform = `rotate(${circleData.angle - 270}deg)`
      circle.style.transition = '0.2s'
      setTimeout(()=> circle.style.transition = '0s', 200)
      circle.style.transform = `rotate(${circleData.angle}deg)`
      circleData.mapIndex = i
      mapElementKeys.forEach(i => mapElements[i].forEach(element => element.placed?.remove()))
      placeElements(i)
      movePointer(circleData.pos)
      populateCircle('r')
      changeBackground(i)
      stopBear()
    })
  })

  window.addEventListener('keydown', e => handleKey({ e }))
  window.addEventListener('keyup', ()=> {
    turnSprite({ e: circleData.key, actor: bearData })
    circleData.key = null
  })
  actionButton.addEventListener('click', ()=> handleKey({ enter: true }))
  
  window.addEventListener('resize', resize)
  addTouchAction(control, handleKey)
  placeElements(0)
  addBear()
  rotateCircle()
  handleKey({ letter: 'd'})
  stopBear()
  resize()


}

window.addEventListener('DOMContentLoaded', init)


