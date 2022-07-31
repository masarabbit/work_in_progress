function init() {  


  const circleData = {
    angle: 270,
    interval: null,
    key: 'u',
    mapIndex: 0,
    pos: 0,
  }
  
  const config = {
    'l': 1,
    'r': -1,
    'u': 0,
    'd': 0,
  }

  const touchControl = {
    active: false,
    timer: null,
    direction: null,
  }
  

  const setTargetPos = (target, x, y) => Object.assign(target.style, { left: `${x}px`, top: `${y}px` })
  

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
    line: {
      width: 1,
      height: 100,
    }
  }

  // this needs to be even number to work
  const mapItems = {
    0: [
      {
        element: 'tree',
        angle: 30,
        name: 'a',
        color: 'color-0'
      },
      {
        element: 'tree_white',
        angle: 60,
        name: 'b',
        color: 'color-0'
      },
      {
        element: 'mountain',
        angle: 70,
        name: 'c',
        color: 'color-0'
      },
      // {
      //   element: 'line',
      //   angle: 180,
      //   name: ''
      // },
    ],
    1: [     
      {
        element: 'tree',
        angle: 10,
        name: 'd',
        color: 'color-1'
      },
      {
        element: 'tree',
        angle: 60,
        name: 'e',
        color: 'color-1'
      },
      {
        element: 'tree',
        angle: 90,
        name: 'f',
        color: 'color-1'
      },
    ],
    2: [
      {
        element: 'tree',
        angle: 10,
        name: 'g',
        color: 'color-2'
      },
      {
        element: 'tree',
        angle: 60,
        name: 'h',
        color: 'color-2'
      },
      {
        element: 'tree',
        angle: 120,
        name: 'i',
        color: 'color-2'
      },
    ],
    3: [
      {
        element: 'tree',
        angle: 10,
        name: 'g',
        color: 'color-3'
      },
      {
        element: 'tree',
        angle: 60,
        name: 'h',
        color: 'color-3'
      },
      {
        element: 'tree',
        angle: 120,
        name: 'i',
        color: 'color-3'
      },
    ],
    4: [
      {
        element: 'tree',
        angle: 10,
        name: 'g',
        color: 'color-4'
      },
      {
        element: 'tree',
        angle: 60,
        name: 'h',
        color: 'color-4'
      },
      {
        element: 'tree',
        angle: 120,
        name: 'i',
        color: 'color-4'
      },
    ],
    5: [
      {
        element: 'tree',
        angle: 10,
        name: 'g',
        color: 'color-5'
      },
      {
        element: 'tree',
        angle: 60,
        name: 'h',
        color: 'color-5'
      },
      {
        element: 'tree',
        angle: 120,
        name: 'i',
        color: 'color-5'
      },
    ],
  }
  
  const mapItemKeys = Object.keys(mapItems)

  mapItemKeys.forEach(index => {
    mapItems[index].forEach(item => item.triggerAngle = item.angle - 90)
  })
  const isNum = x => typeof x === 'number'

  
  const indicator = document.querySelector('.indicator')
  const cellD = 32
  const circle = document.querySelector('.circle')
  const circleWrapper = document.querySelector('.circle_wrapper')
  const pointer = document.querySelector('.pointer')
  

  const placeElements = (mapItems, index) => {
    mapItems.forEach(item => placeElement(item, index))
  }
  
  document.querySelector('.location_mark').innerHTML = mapItemKeys.map(()=> `<div></div>`).join('')
  

  const placeElement = (item, i) => {
    const element = document.createElement('div')
    const offset = i % 2 === 0 ? 0 : 180
    element.classList.add('element')
    element.classList.add(item.element)
    circle.append(element)
    const { width, height } = items[item.element]
    element.style.transform = `translate(${200 - (width / 2)}px, -${height - 5}px) rotate(${item.angle + offset}deg)`
    element.innerHTML = item.element + item.color
    element.style.transformOrigin = `center ${200 + (height - 5)}px`
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
  
  const returnNextOrPrev = current =>{
    return current === -1
    ? mapItemKeys.length - 1
    : current === mapItemKeys.length
      ? 0
      : current
  }

  const returnPos = current => {
    return current === mapItemKeys.length * 180
    ? mapItemKeys.length * -180 // 0 ?
    : current === mapItemKeys.length * -180
      ? 0
      : current
  }

  const populateCircle = key =>{
    const { mapIndex } = circleData
    const indexToAdd = key === 'r' ? returnNextOrPrev(mapIndex + 1) : returnNextOrPrev(mapIndex - 1)
    mapItemKeys.forEach(index =>{
      if (index !== `${mapIndex}`) mapItems[index].forEach(item => item.placed?.remove())
    })
    // mapItems[indexToAdd].forEach(item => placeElement(item, indexToAdd))
    placeElements(mapItems[indexToAdd], indexToAdd)
  }

  const currentPos = pos =>{
    if (pos === 0) return 0

    return pos > 0 
      ? (pos / -180) + mapItemKeys.length
      : pos / -180
  }

  const currentIndex = pos => {
    const index = currentPos(pos)
    return Number.isInteger(index) && index
  }

  const movePointer = pos =>{
    console.log('pos', currentPos(pos))
    const { width } = circleWrapper.getBoundingClientRect()
    const pointerPos = (currentPos(pos -90) / mapItemKeys.length) * width
    pointer.style.transform = `translateX(${(pointerPos > 600 ? pointerPos - 600 : pointerPos) - 10}px)`
  }



  const updateElements = () =>{
    const trigger = [ 89, 269, 91, 271 ]
    const { key } = circleData

    circleData.pos += config[key]
    circleData.pos = returnPos(circleData.pos)
    const index = currentIndex(circleData.pos)
    circleData.mapIndex = isNum(index) ? index : circleData.mapIndex
    circleData.mapIndex = returnNextOrPrev(circleData.mapIndex)

    if (trigger.includes(Math.abs(circleData.angle))) populateCircle(key)
    
    indicator.innerHTML = `pos:${circleData.pos} current: ${circleData.mapIndex}`

    // indicator.innerHTML = `pos:${circleData.pos} ${circleData.angle} prev: ${returnNextOrPrev(mapIndex - 1)} current: ${mapIndex} next:${returnNextOrPrev(mapIndex + 1)}`
    movePointer(circleData.pos)
    if (Math.abs(circleData.angle) === 360) {
      circleData.angle = 0
    }
  }

  const rotateCircle = key =>{
    circleData.angle += config[key]
    circle.style.transform = `rotate(${circleData.angle}deg)`
    updateElements()
  }

  const handleKey = ({ e, letter }) =>{
    const key = e?.key.replace('Arrow','').toLowerCase()[0] || letter
    if (!['l','r','u','d'].includes(key)) return
    if (circleData.key !== key){
      clearInterval(circleData.interval)
      circleData.key = key
      circleData.interval = setInterval(()=>{
        if (!circleData.key) {
          clearInterval(circleData.interval)
        } else {
          rotateCircle(key)
        }
      }, 1000 / 60)
      clearInterval(bearData.interval)
      bearData.interval = setInterval(()=>{
        if (!circleData.key) {
          clearInterval(bearData.interval)
        } else {
          turnSprite({ e:circleData.key, actor: bearData, animate: true})
        }
      }, 100)
    }
  }

  const placeBear = () =>{
    const bear = document.createElement('div')
    bear.classList.add('bear_wrapper')
    circleWrapper.append(bear)
    bear.innerHTML = '<div><div class="bear"></div></div>'

    // bear.style.transform = `translate(0, ${40 - 10}px)`
    bearData.sprite = bear.childNodes[0].childNodes[0]
  }


  
  placeElements(mapItems[0], 0)
  rotateCircle('u')
  placeBear()

  window.addEventListener('keydown', e => handleKey({ e }))
  window.addEventListener('keyup', ()=> {
    turnSprite({ e:circleData.key, actor: bearData })
    circleData.key = null
  })

  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))

const drag = (target, pos, x, y) =>{
  pos.a = pos.c - x
  pos.b = pos.d - y
  const newX = target.offsetLeft - pos.a
  const newY = target.offsetTop - pos.b
  if (distanceBetween({x: 0,y: 0}, {x: newX, y: newY}) < 35) {
    setTargetPos(target, newX, newY)
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
      if (touchControl.active) handleKeyAction({ letter:touchControl.direction })
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
    setTargetPos(target, 0 ,0)
    setTimeout(()=>{
      target.style.transition = '0s'
    }, 200)
    clearInterval(touchControl.timer)
    touchControl.active = false

    turnSprite({ e:circleData.key, actor: bearData })
    circleData.key = null
  }
  mouse.down(target,'add', onGrab)
}

const control = document.querySelector('.touch_circle')
addTouchAction(control, handleKey)

const resize = () => {
  const { innerWidth } = window
  const { width } = circleWrapper.getBoundingClientRect()
  circleWrapper.style.transform = innerWidth < width ? `scale(${innerWidth / width})` : 'scale(1)'
  
  // TODO possibly move entire logic here rather than relying partially on css media query
  document.querySelector('.bear_wrapper').style.transform = `translate(0, ${innerWidth < 600 ? 20 : 30}px)`
}

resize()
window.addEventListener('resize', resize)


}

window.addEventListener('DOMContentLoaded', init)


