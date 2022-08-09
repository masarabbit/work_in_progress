function init() {  

  // TODO may need to adjust z-index


  const circleData = {
    angle: 271,
    interval: null,
    key: 'r',
    mapIndex: 0,
    pos: 0,

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
    sprite: null,
    frameOffset: 0,
    interval: null,
    vertPos: 10,
  }

  const items = {
    tree: {
      width: 48,
      height: 60,
    },
    tree_white: {
      width: 48,
      height: 60,
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
  }

  // this needs to be even number to work
  const mapItems = {
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
      // {
      //   element: 'house1',
      //   angle: 70,
      //   name: 'c',
      // },
      {
        element: 'house2',
        angle: 120,
        offset: 60
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
        element: 'tree',
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
  
  const mapItemKeys = Object.keys(mapItems)
  const indicator = document.querySelector('.indicator')
  const cellD = 32
  const circle = document.querySelector('.circle')
  const circleWrapper = document.querySelector('.circle_wrapper')
  const pointer = document.querySelector('.pointer')
  const background = document.querySelector('.background')
  const control = document.querySelector('.touch_circle')
  const halfCircumference = r => Math.PI * r
  const isNum = x => typeof x === 'number'
  let bear


  const setTargetParams = ({ target, x, y, w, h }) =>{
    const { style } = target
    if (isNum(x)) style.left = `${x}px`
    if (isNum(w)) style.width = `${w}px`
    if (isNum(y)) style.top = `${y}px`
    if (isNum(h)) style.height = `${h}px`
  }
  
  
  const placeElements = index => mapItems[index].forEach(item => placeElement(item, index))


  const placeElement = (item, i) => {
    const element = document.createElement('div')
    const offset = i % 2 === 0 ? 0 : 180
    element.classList.add('element')
    element.classList.add(item.element)
    circle.append(element)
    const { width: w, height: h, offset: o } = items[item.element]
    const vertOffset = h - (item.offset || o || 5)

    setTargetParams({ target: element, w, h })
    element.innerHTML = item.element + i
    element.style.transform = `translate(${220 - (w / 2)}px, ${-vertOffset}px) rotate(${item.angle + offset}deg)`

    element.style.zIndex = item.offset || o || 5
    element.style.backgroundSize = `${w}px ${h}px !important`
    element.style.transformOrigin = `center ${220 + vertOffset}px`
    item.placed = element
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
      ? mapItemKeys.length - 1
      : current === mapItemKeys.length
        ? 0
        : current
  }

  const returnPos = current => {
    return current === mapItemKeys.length * 180
      ? mapItemKeys.length * -180
      : current === mapItemKeys.length * -180
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
    mapItemKeys.forEach(index =>{
      if (index !== `${mapIndex}`) mapItems[index].forEach(item => item.placed?.remove())
    })
    placeElements(indexToAdd)
  }

  const currentPos = pos =>{
    return pos === 0 
      ? 0
      : pos > 0 
        ? (pos / -180) + mapItemKeys.length
        : pos / -180
  }

  const currentIndex = pos => {
    const index = currentPos(pos)
    return Number.isInteger(index) && index
  }

  const movePointer = pos =>{
    const { width } = circleWrapper.getBoundingClientRect()
    const pointerPos = (currentPos(pos - 90) / mapItemKeys.length) * width
    pointer.style.transform = `translateX(${(pointerPos > width ? pointerPos - width : pointerPos) - 10}px)`
  }

  const changeBackground = pos =>{
    background.classList[Math.floor(pos) % 2 === 0 ? 'add' : 'remove']('light')
  }

  const withinBuffer = (a, b, buffer) => Math.abs(a - b) < buffer

  const updateElements = () =>{
    const trigger = [ 89, 269, 91, 271 ]
    const { key } = circleData

    circleData.pos += config[key]
    circleData.pos = returnPos(circleData.pos)
    const index = currentIndex(circleData.pos)
    circleData.mapIndex = isNum(index) ? index : circleData.mapIndex
    circleData.mapIndex = returnNextOrPrev(circleData.mapIndex)

    if (trigger.includes(Math.abs(circleData.angle))) populateCircle(key)

    movePointer(circleData.pos)
    changeBackground(circleData.mapIndex)
    if (Math.abs(circleData.angle) === 360) circleData.angle = 0

    indicator.innerHTML = `angle: ${circleData.angle} pos:${circleData.pos} prev: ${returnNextOrPrev(circleData.mapIndex - 1)} current: ${circleData.mapIndex} next:${returnNextOrPrev(circleData.mapIndex + 1)}`
  }
  
  const positionBear = angle => {
    bear.style.transformOrigin = `center ${220 - (bearData.vertPos)}px`
    bear.style.transform = `translate(${220 - 16}px, ${bearData.vertPos}px) rotate(${angle}deg)`
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
    bear.style.zIndex = bearData.vertPos + 32
    positionBear(-circleData.angle)
  }
  

  const hitItem = () => {
    const angleWithinCurrentMap = Math.round((currentPos(circleData.pos - 90) % 1) * 180)
    return mapItems[circleData.mapIndex].map(item => {
      const { zIndex: itemPos } = item.placed.style
      const { zIndex: bearPos } = bear.style
      if (
        withinBuffer(item.angle, angleWithinCurrentMap, (items[item.element].width / halfCircumference(220 - itemPos)) * 90 ) && // TODO this buffer needs adjusting
        withinBuffer(itemPos, bearPos, 15) && 
        (circleData.key === 'u' && +itemPos < +bearPos || circleData.key === 'd' && +itemPos > +bearPos)
      ) return item
        return null
    }).filter(item => item)[0]
  }

  const handleKey = ({ e, letter }) =>{
    const key = e?.key.replace('Arrow','').toLowerCase()[0] || letter

    if (circleData.key !== key){
      clearInterval(circleData.interval)
      circleData.key = key
      circleData.interval = setInterval(()=> {
        if (!circleData.key) {
          clearInterval(circleData.interval)
        } else {
          if (['l','r'].includes(key)) {
            rotateCircle()
          } else if (['u','d'].includes(key)) {
            if (!hitItem()){
              bearData.vertPos += config[key]
              bearData.vertPos = returnVerticalPos(bearData.vertPos)
              moveBearVertically()
            } else {
              console.log(hitItem()) // TODO this only needs to be triggered when clicking something, so can be taken somewhere else
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

  const addBear = () =>{
    bear = document.createElement('div')
    bear.classList.add('bear_wrapper')
    circle.append(bear)
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

  document.querySelector('.location_mark').innerHTML = mapItemKeys.map(()=> `<div class="location_link"></div>`).join('')

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
      positionBear(-circleData.angle)      
      circle.style.transform = `rotate(${circleData.angle - 270}deg)`
      circle.style.transition = '0.2s'
      setTimeout(()=> circle.style.transition = '0s', 200)
      circle.style.transform = `rotate(${circleData.angle}deg)`
      circleData.mapIndex = i
      mapItemKeys.forEach(i => mapItems[i].forEach(item => item.placed?.remove()))
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


