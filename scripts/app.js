function init() {

  // const decodeRef = { a: ' h 1', b: ' h 2', e: ' h 3', g: ' h 4', j: ' h 5', A: ' v 1', B: ' v 2', E: ' v 3', G: ' v 4', J: ' v 5', n: 'h -1', u: ' h -2', k: ' h -3', x: ' h -4', i: ' h -5', N: ' v -1', U: ' v -2', K: ' v -3', X: ' v -4', I: ' v -5', w: ' v ', W: ' h ', D: '<path d="M', o: '<path fill="pink" d="M', F: '<path fill="#fff" d="M', '/': '/>', d: '<path d="M', f: '<path fill="#fff" d="M'}
  // const decode = arr => arr.split('').map(c=> !decodeRef[c] ? c : decodeRef[c]).join('')

  // TODO need to adjust penguin within the wrapper
  // TODO change turning direction (clockwise, anti clockwise)
  //TODO stop penguiin once at destination

  const indicator = document.querySelector('.indicator')
  const body = document.querySelector('.wrapper')
  const animationFrames = {
    walk: [0, 1, 2, 1, 3, 4],
    stop: [0],
    // fall: [3, 4, 5, 6, 5, 7],
    // fallen: [7],
    // standUp: [7, 8, 9, 10, 11, 12]
  }
  const cellSize = 96
  const directions = {
    up: 0,
    dUp: 1,
    side: 2,
    dDown: 3,
    down: 4,
  }
  const sprites = {
    up: 'up',
    upright: 'dUp',
    right: 'side',
    downright: 'dDown',
    down: 'down',
    downleft: 'dDown',
    left: 'side',
    upleft: 'dUp',
  }
  let turnDirections = Object.keys(sprites)
  const penguins = {}
  const frameSpeed = 100
  let penguinCount = 0
  const control = {
    x: null,
    y: null,
    angle: 360,
  }

  const directionConversions = {
    360: 'up',
    45: 'upright',
    90: 'right',
    135: 'downright',
    180: 'down',
    225: 'downleft',
    270: 'left',
    315: 'upleft',
  }

  const reverseDirectionConversions = () =>{
    const obj = {}
    Object.keys(directionConversions).forEach( k =>{
      obj[directionConversions[k]] = k
    })
    return obj
  }
  
  const animatePenguin = (penguin, penguinObj) =>{
    const { frame:i, animation, frameSpeed} = penguinObj
    const penguinSprite = penguin.childNodes[1].childNodes[1]
    penguinSprite.style.marginLeft = `-${animationFrames[animation][i] * cellSize}px`
    penguinSprite.style.marginTop = `-${cellSize * directions[sprites[penguinObj.direction]]}px`
    penguinObj.frame = i === animationFrames[animation].length - 1 ? 0 : i + 1
    penguinObj.frameTimer = setTimeout(()=> animatePenguin(penguin, penguinObj), frameSpeed)
  }

  // const testArray = [0, 1, 2, 3, 4, 5, 6, 7]

  const shuffleArray = (arr, center) =>{
    const copyArr = [...arr]
    while(copyArr.indexOf(center) !== Math.round(copyArr.length / 2)){
      const last = copyArr.pop()
      copyArr.unshift(last)
    }
    return copyArr
  }

  

  // console.log(shuffleArray(testArray, 7))
  const oppositeAngle = angle =>{
    return angle < 225 ? angle + 180 : angle - 180
  }

  // console.log(Object.keys(directionConversions))
  // console.log(
  //   shuffleArray(
  //     Object.keys(directionConversions).map(n => +n),
  //     oppositeAngle(180)
  //     ).map(n => directionConversions[n])
  // )

  // turnDirections = shuffleArray(Object.keys(sprites), )

  const radToDeg = rad => Math.round(rad * (180 / Math.PI))

  const nearestN = (n, denom) =>{
    return n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % denom) - denom)
  }


  const overlap = (a, b) =>{
    const buffer = 20
    return Math.abs(a - b) < buffer
  }

  const clickedAngle = () =>{
    const angle = radToDeg(Math.atan2(penguins[0].pos.y - control.y, penguins[0].pos.x - control.x)) - 90
    const adjustedAngle = angle < 0 ? angle + 360 : angle
    return nearestN(adjustedAngle, 45)
  }

  const changeAnimation = (penguinObj, animation) => {
    penguinObj.frame = 0
    penguinObj.animation = animation
  }

  const stopPenguin = (penguin, penguinObj) =>{
    changeAnimation(penguinObj, 'stop')
    penguin.classList.add('stop')
    const { offsetTop, offsetLeft } = penguin.style
    penguin.style.marginLeft = offsetLeft
    penguin.style.marginTop = offsetTop
    penguin.style.zIndex = offsetTop
    penguinObj.stop = true
  }

  const startPenguin = (penguin, penguinObj) =>{
    animatePenguin(penguin, penguinObj)
    penguinObj.stop = false
  }

  const penguinMarginLeft = penguin => +penguin.style.marginLeft.replace('px', '')
  const penguinMarginTop = penguin => +penguin.style.marginTop.replace('px', '')
  const randomP = max => Math.ceil(Math.random() * max)

  const checkBoundaryAndUpdatePenguinPos = (x, y, penguin, penguinObj) =>{
    const lowerLimit = -40
    const upperLimit = 40

    if (x > lowerLimit && x < (body.clientWidth - upperLimit)){
      penguin.style.marginLeft = `${x}px`
      penguinObj.prev[0] = x
    } 
    if (y > lowerLimit && y < (body.clientHeight - upperLimit)){
      penguin.style.marginTop = `${y}px`
      penguin.style.zIndex = y
      penguinObj.prev[1] = y
    }
  }







  const createMark = (penguin, penguinObj) => {
    const { width, height, left, top } = penguin.getBoundingClientRect()
    const mark = document.createElement('div')
    mark.classList.add('mark')
    penguinObj.pos.x = left + (width / 2)
    penguinObj.pos.y = top + (height / 2)
    mark.style.left = `${penguinObj.pos.x}px`
    mark.style.top = `${penguinObj.pos.y}px`
    body.append(mark)
  }


  const moveAbout = (penguin, penguinObj) =>{
    if (penguinObj.hit) return
  
    // TODO turn according to control.x and control.y
    // console.log(penguinObj)
    createMark(penguin, penguinObj)

    const penguinDir = +reverseDirectionConversions()[penguinObj.direction]
    const angle = clickedAngle()


    indicator.innerHTML = `penguinDir: ${directionConversions[penguinDir]} angle:${directionConversions[angle]} turnDirections: ${turnDirections.join('-')}`

    const turnValue = penguinDir === angle
      ? 0 
      : turnDirections.indexOf(directionConversions[penguinDir]) < turnDirections.indexOf(directionConversions[angle])
        ? 1
        : -1
    
    penguinObj.turnIndex += turnValue

    // indicator.innerHTML = `penguinDir: ${penguinDir} angle:${angle} turnValue: ${turnValue}`

    if (penguinObj.turnIndex < 0) penguinObj.turnIndex = 7
    if (penguinObj.turnIndex > 7) penguinObj.turnIndex = 0
    penguinObj.direction = turnDirections[penguinObj.turnIndex]
    const { direction: dir } = penguinObj
    penguin.childNodes[1].className = `penguin_inner_wrapper facing_${dir}`
    
    let x = penguinMarginLeft(penguin)
    let y = penguinMarginTop(penguin)
    
    const distance = 10
    if (dir !== 'up' && dir !== 'down') x += (dir.includes('left')) ? -distance : distance
    if (dir !== 'left' && dir !== 'right') y += (dir.includes('up')) ? -distance : distance

    if (
      x === penguinObj.prev[0] && y === penguinObj.prev[1] || 
      overlap(control.x, penguinObj.pos.x) && overlap(control.y, penguinObj.pos.y)
    ){
      console.log('trigger')
      stopPenguin(penguin, penguinObj)
    } 
    
    checkBoundaryAndUpdatePenguinPos(x, y, penguin, penguinObj)
    if (!penguinObj.stop) penguinObj.moveTimer = setTimeout(()=> {
      moveAbout(penguin, penguinObj)
    }, penguinObj.moveSpeed)
    
  }
  


  const randomDirection = () =>{
    return turnDirections[Math.floor(Math.random() * turnDirections.length)]
  }

  const mapPenguinAssets = () =>{
    return ['up','dUp','side','dDown','down'].map(png =>{
      return  `<img src="assets/${png}.png" alt=${png}/>`
    }).join('')
  }

  const mapHitCorners = penguinCount =>{
    return ['upleft', 'upright', 'downleft', 'downright'].map(dir =>{
      return  `<div class="hit_corner" data-pos="${dir}" data-id="${penguinCount}" ></div>`
    }).join('')
  }

  const createPenguin = (x, y) =>{
    const penguin = document.createElement('div')
    penguin.className = 'penguin_wrapper'
    penguin.innerHTML = `
    <div class="penguin_inner_wrapper">
      <div class="penguin_sprite">
        ${mapPenguinAssets()}
      </div>
      <div class="hit_wrapper">
        <div class="hit_area">
          ${mapHitCorners(penguinCount)}
        </div>
      </div>
    </div>
    `
    penguin.style.marginTop = `${y}px`
    penguin.style.marginLeft = `${x}px`
    penguin.style.zIndex = y
    body.append(penguin)
    const { width, height, left, top } = penguin.getBoundingClientRect()

    penguins[penguinCount] = { 
      penguin,
      animation: 'walk',
      frame: 0, 
      direction: randomDirection(),
      frameTimer: null,
      moveTimer: null,
      turnIndex: Math.floor(Math.random() * 7),
      frameSpeed,
      moveSpeed: 150,
      stop: true,
      prev: [penguin.style.marginLeft, penguin.style.marginTop], 
      pos: {
        x: left + (width / 2),
        y: top + (height / 2),
      }
    }
    const penguinObj = penguins[penguinCount]
    const penguinStatus = document.createElement('p')
    penguinStatus.dataset.index = penguinCount
    
    startPenguin(penguin, penguinObj)
    moveAbout(penguin, penguinObj)
    stopPenguin(penguin, penguinObj)
    penguinCount++
  }



  
  // Create penguin and set up collision check
  new Array(1).fill('').map(()=>{
    return [randomP(body.clientWidth - 100), randomP(body.clientHeight - 100)]
  }).forEach( pos => {
    createPenguin(pos[0], pos[1])
  })



  window.addEventListener('click', e =>{
    // console.log(penguins)
    control.x = e.pageX 
    control.y = e.pageY
    if (penguins[0].stop){
      changeAnimation(penguins[0], 'walk')
      penguins[0].stop = false
      turnDirections = shuffleArray(
        Object.keys(directionConversions).map(n => +n),
        oppositeAngle(clickedAngle())
        ).map(n => directionConversions[n])
        console.log(turnDirections)
      // penguins[0].penguin.classList.remove('stop')
      moveAbout(penguins[0].penguin, penguins[0])
    }
    
  })

}

window.addEventListener('DOMContentLoaded', init)



