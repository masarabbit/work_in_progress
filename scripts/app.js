function init() {

  // const decodeRef = { a: ' h 1', b: ' h 2', e: ' h 3', g: ' h 4', j: ' h 5', A: ' v 1', B: ' v 2', E: ' v 3', G: ' v 4', J: ' v 5', n: 'h -1', u: ' h -2', k: ' h -3', x: ' h -4', i: ' h -5', N: ' v -1', U: ' v -2', K: ' v -3', X: ' v -4', I: ' v -5', w: ' v ', W: ' h ', D: '<path d="M', o: '<path fill="pink" d="M', F: '<path fill="#fff" d="M', '/': '/>', d: '<path d="M', f: '<path fill="#fff" d="M'}
  // const decode = arr => arr.split('').map(c=> !decodeRef[c] ? c : decodeRef[c]).join('')

  // TODO need to adjust penguin within the wrapper
  // TODO change turning direction (clockwise, anti clockwise)

  const indicator = document.querySelector('.indicator')
  const body = document.querySelector('.wrapper')
  const animationFrames = {
    walk: [0, 1, 2, 1, 3, 4],
    stop: [0],
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
  const turnDirections = Object.keys(sprites)
  const frameSpeed = 100
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

  const setPos = (target, x, y) =>{
    target.style.left = `${x}px`
    target.style.top = `${y}px`
  }

  const setMargin = (target, x, y) =>{
    target.style.marginLeft = `${x}px`
    target.style.marginTop = `${y}px`
    target.style.zIndex = y
  }

  const reverseDirectionConversions = () =>{
    const obj = {}
    Object.keys(directionConversions).forEach( k =>{
      obj[directionConversions[k]] = k
    })
    return obj
  }

  // const shuffleArray = (arr, center) =>{
  //   const copyArr = [...arr]
  //   while(copyArr.indexOf(center) !== Math.round(copyArr.length / 2)){
  //     const last = copyArr.pop()
  //     copyArr.unshift(last)
  //   }
  //   return copyArr
  // }

  
  const animatePenguin = penguin =>{
    const { frame:i, animation, frameSpeed} = penguinData
    const penguinSprite = penguin.childNodes[1].childNodes[1]
    penguinSprite.style.marginLeft = `-${animationFrames[animation][i] * cellSize}px`
    penguinSprite.style.marginTop = `-${cellSize * directions[sprites[penguinData.direction]]}px`
    penguinData.frame = i === animationFrames[animation].length - 1 ? 0 : i + 1
    penguinData.frameTimer = setTimeout(()=> animatePenguin(penguin), frameSpeed)
  }

  const randomDirection = () =>{
    return turnDirections[Math.floor(Math.random() * turnDirections.length)]
  }

  
  const penguinData = { 
    penguin: null,
    animation: 'walk',
    frame: 0, 
    direction: randomDirection(),
    frameTimer: null,
    moveTimer: null,
    turnIndex: Math.floor(Math.random() * 7),
    frameSpeed,
    moveSpeed: 150,
    stop: true,
    prev: [0, 0], 
    pos: {
      x: 0,
      y: 0,
    }
  }


  const radToDeg = rad => Math.round(rad * (180 / Math.PI))

  const nearestN = (n, denom) =>{
    return n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % denom) - denom)
  }


  const overlap = (a, b) =>{
    const buffer = 20
    return Math.abs(a - b) < buffer
  }

  const clickedAngle = () =>{
    const angle = radToDeg(Math.atan2(penguinData.pos.y - control.y, penguinData.pos.x - control.x)) - 90
    const adjustedAngle = angle < 0 ? angle + 360 : angle
    return nearestN(adjustedAngle, 45)
  }

  const changeAnimation = animation => {
    penguinData.frame = 0
    penguinData.animation = animation
  }

  const stopPenguin = penguin =>{
    changeAnimation('stop')
    const { offsetTop, offsetLeft } = penguin.style
    setMargin(penguin, offsetLeft, offsetTop)
    penguinData.stop = true
  }

  const startPenguin = penguin =>{
    animatePenguin(penguin)
    penguinData.stop = false
  }

  const penguinMarginLeft = penguin => +penguin.style.marginLeft.replace('px', '')
  const penguinMarginTop = penguin => +penguin.style.marginTop.replace('px', '')
  const randomP = max => Math.ceil(Math.random() * max)

  const checkBoundaryAndUpdatePenguinPos = (x, y, penguin, penguinData) =>{
    const lowerLimit = -40
    const upperLimit = 40

    if (x > lowerLimit && x < (body.clientWidth - upperLimit)){
      penguin.style.marginLeft = `${x}px`
      penguinData.prev[0] = x
    } 
    if (y > lowerLimit && y < (body.clientHeight - upperLimit)){
      penguin.style.marginTop = `${y}px`
      penguin.style.zIndex = y
      penguinData.prev[1] = y
    }
  }



  const createMark = penguin => {
    const { width, height, left, top } = penguin.getBoundingClientRect()
    const mark = document.createElement('div')
    mark.classList.add('mark')
    penguinData.pos.x = left + (width / 2)
    penguinData.pos.y = top + (height / 2)
    setPos(mark, penguinData.pos.x, penguinData.pos.y)
    body.append(mark)
  }
  
  // const turnDirectionIndex = angle =>{
  //   return turnDirections.indexOf(directionConversions[angle])
  // }

  const moveAbout = penguin =>{
    if (penguinData.hit) return //TODO this might become redundant

    createMark(penguin)

    const penguinDir = +reverseDirectionConversions()[penguinData.direction]
    const angle = clickedAngle()
    // if (angle === 0) console.log('zero') //TODO this is here for testing

    // turnDirections = shuffleArray(
    //   Object.keys(directionConversions).map(n => +n),
    //   clickedAngle()
    //   ).map(n => directionConversions[n])


    const turnValue = penguinDir === angle
      ? 0 
      // : turnDirectionIndex(penguinDir) < turnDirectionIndex(angle) //TODO refactor
      : penguinDir < angle //TODO refactor
        ? 1
        : -1
    
    penguinData.turnIndex += turnValue
    indicator.innerHTML = `penguinDir: ${penguinDir} angle:${angle} turnValue: ${turnValue}`

    if (penguinData.turnIndex < 0) penguinData.turnIndex = 7
    if (penguinData.turnIndex > 7) penguinData.turnIndex = 0
    penguinData.direction = turnDirections[penguinData.turnIndex]
    const { direction: dir } = penguinData
    penguin.childNodes[1].className = `penguin_inner_wrapper facing_${dir}`
    
    let x = penguinMarginLeft(penguin)
    let y = penguinMarginTop(penguin)
    
    const distance = 10
    if (dir !== 'up' && dir !== 'down') x += (dir.includes('left')) ? -distance : distance
    if (dir !== 'left' && dir !== 'right') y += (dir.includes('up')) ? -distance : distance

    if (
      x === penguinData.prev[0] && y === penguinData.prev[1] || 
      overlap(control.x, penguinData.pos.x) && overlap(control.y, penguinData.pos.y)
    ){
      console.log('stop')
      stopPenguin(penguin)
    } 
    
    checkBoundaryAndUpdatePenguinPos(x, y, penguin, penguinData)
    if (!penguinData.stop) penguinData.moveTimer = setTimeout(()=> {
      moveAbout(penguin)
    }, penguinData.moveSpeed)
    
  }
  



  const mapPenguinAssets = () =>{
    return ['up','dUp','side','dDown','down'].map(png =>{
      return  `<img src="assets/${png}.png" alt=${png}/>`
    }).join('')
  }

  const mapHitCorners = () =>{
    return ['upleft', 'upright', 'downleft', 'downright'].map(dir =>{
      return  `<div class="hit_corner" data-pos="${dir}" ></div>`
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
          ${mapHitCorners()}
        </div>
      </div>
    </div>
    `
    setMargin(penguin, x, y)
    body.append(penguin)
    const { width, height, left, top } = penguin.getBoundingClientRect()

    Object.assign(penguinData, {
      penguin: penguin,
      prev: [penguin.style.marginLeft, penguin.style.marginTop], 
      pos: {
        x: left + (width / 2),
        y: top + (height / 2),
      }
    })
    
    startPenguin(penguin)
    stopPenguin(penguin)
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
    if (penguinData.stop){
      changeAnimation('walk')
      penguinData.stop = false
      moveAbout(penguinData.penguin, penguinData)
    }
    
  })

}

window.addEventListener('DOMContentLoaded', init)



