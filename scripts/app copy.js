function init() {

  // const decodeRef = { a: ' h 1', b: ' h 2', e: ' h 3', g: ' h 4', j: ' h 5', A: ' v 1', B: ' v 2', E: ' v 3', G: ' v 4', J: ' v 5', n: 'h -1', u: ' h -2', k: ' h -3', x: ' h -4', i: ' h -5', N: ' v -1', U: ' v -2', K: ' v -3', X: ' v -4', I: ' v -5', w: ' v ', W: ' h ', D: '<path d="M', o: '<path fill="pink" d="M', F: '<path fill="#fff" d="M', '/': '/>', d: '<path d="M', f: '<path fill="#fff" d="M'}
  // const decode = arr => arr.split('').map(c=> !decodeRef[c] ? c : decodeRef[c]).join('')

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
  const turnDirections = Object.keys(sprites)
  const penguins = {}
  const penguinImpact = 10
  const frameSpeed = 150
  let penguinCount = 0
  
  const animatePenguin = (penguin, penguinObj) =>{
    const { frame:i, animation, frameSpeed} = penguinObj
    const penguinSprite = penguin.childNodes[1].childNodes[1]
    penguinSprite.style.marginLeft = `-${animationFrames[animation][i] * cellSize}px`
    penguinSprite.style.marginTop = `-${cellSize * directions[sprites[penguinObj.direction]]}px`
    penguinObj.frame = i === animationFrames[animation].length - 1 ? 0 : i + 1
    penguinObj.frameTimer = setTimeout(()=> animatePenguin(penguin, penguinObj), frameSpeed)
  }

  const randomMoveSpeed = () =>{
    // const range = [850, 900, 950, 1000, 1100]
    const range = [ 900, 900, 1800]
    return range[Math.floor(Math.random() * range.length)]
  }

  const changeAnimation = (penguinObj, animation) => {
    penguinObj.frame = 0
    penguinObj.animation = animation
  }

  const stopPenguin = (penguin, penguinObj) =>{
    changeAnimation(penguinObj, 'stop')
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

  const moveOrStopPenguin = (penguin, penguinObj) =>{
    const option = ['move','stop','stop']
    const status = option[Math.floor(Math.random() * option.length)]
    if (status === 'move') {
      penguinObj.stop = false
      changeAnimation(penguinObj, 'walk')
      moveAbout(penguin, penguinObj)
    } else if (!penguinObj.knocked) {
      stopPenguin(penguin, penguinObj)
      penguinObj.moveTimer = setTimeout(()=> {
        moveOrStopPenguin(penguin, penguinObj)
      }, penguinObj.moveSpeed)
    }
  }

  const moveAbout = (penguin, penguinObj) =>{
    if (penguinObj.hit) return
    const turnOptions = [1, 1, -1, -1, 0]
    const turnValue = turnOptions[Math.floor(Math.random() * turnOptions.length)]
    penguinObj.turnIndex += turnValue
    if (penguinObj.turnIndex < 0) penguinObj.turnIndex = 7
    if (penguinObj.turnIndex > 7) penguinObj.turnIndex = 0
    penguinObj.direction = turnDirections[penguinObj.turnIndex]
    const { direction: dir } = penguinObj
    penguin.childNodes[1].className = `penguin_inner_wrapper facing_${dir}`
    
    let x = penguinMarginLeft(penguin)
    let y = penguinMarginTop(penguin)
    
    const distance = 10
    if (dir !== 'up' && 'dir' !== 'down') x += (dir.includes('left')) ? -distance : distance
    if (dir !== 'left' && 'dir' !== 'right') y += (dir.includes('up')) ? -distance : distance

    if (x === penguinObj.prev[0] && y === penguinObj.prev[1]){
      console.log('trigger')
      stopPenguin(penguin, penguinObj)
    } 
    
    checkBoundaryAndUpdatePenguinPos(x, y, penguin, penguinObj)
    if (!penguinObj.stop) penguinObj.moveTimer = setTimeout(()=> {
      // moveAbout(penguin, penguinObj)
      moveOrStopPenguin(penguin, penguinObj)
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

    penguins[penguinCount] = { 
      penguin,
      animation: 'walk',
      frame: 0, 
      direction: randomDirection(),
      frameTimer: null,
      moveTimer: null,
      turnIndex: Math.floor(Math.random() * 7),
      frameSpeed,
      defaultFallDirection: randomDirection(),
      moveSpeed: randomMoveSpeed(),
      prev: [penguin.style.marginLeft, penguin.style.marginTop], 
    }
    const penguinObj = penguins[penguinCount]
    const penguinStatus = document.createElement('p')
    penguinStatus.dataset.index = penguinCount
    
    startPenguin(penguin, penguinObj)
    moveAbout(penguin, penguinObj)
    penguinCount++
  }


    const slidepenguin = (penguin, penguinObj) =>{
    let x = penguinMarginLeft(penguin)
    let y = penguinMarginTop(penguin)

    if (penguinObj.hit.includes('left')) x += penguinImpact
    if (penguinObj.hit.includes('right')) x -= penguinImpact
    if (penguinObj.hit.includes('up')) y += penguinImpact
    if (penguinObj.hit.includes('down')) y -= penguinImpact
    
    checkBoundaryAndUpdatePenguinPos(x, y, penguin, penguinObj)
  } 

  const knockPenguin = (penguin, penguinObj) =>{
    if (penguinObj.knocked) return
    penguinObj.knocked = true 
    penguinObj.stop = true
    slidepenguin(penguin, penguinObj)
    // changeAnimation(penguinObj, 'stop')

    const a = frameSpeed * 6
    // const b = 1000 * (Math.ceil(Math.random() * 4) + 1)
    // const c = frameSpeed * 6

    // penguinObj.frameTimer = setTimeout(()=>{
    //   changeAnimation(penguinObj, 'fallen')
    // }, a)

    // penguinObj.frameTimer = setTimeout(()=>{
    //   changeAnimation(penguinObj, 'standUp')
    // }, a + b)

    penguinObj.frameTimer = setTimeout(()=>{
      changeAnimation(penguinObj, 'walk')
      penguinObj.hit = false
      penguinObj.knocked = false
      penguinObj.stop = false
      penguin.classList.remove('stop')
      moveAbout(penguin, penguinObj)
    }, a)
  }




const hitObj = n =>{
    let obj = {}
    for(let i = 0; i < n; i++){
      obj[i] = {
        upleft: false,
        upright: false,
        downleft: false,
        downright: false,
      }
    }
    return obj
  }

  const hitCheck = (hitDirection, penguinObj, penguinDirection) =>{
    if (hitDirection) { 
      penguinObj.direction = penguinDirection 
      penguinObj.hit = penguinDirection
    }
  }

  const overlap = (a, b) =>{
    const buffer = 20
    return Math.abs(a - b) < buffer
  }

  const collisionCheck = () =>{
    const hitCorners = document.querySelectorAll('.hit_corner')
    const hit = hitObj(penguinCount)
    // hitCorners.forEach(h=>h.style.backgroundColor = 'transparent')
    hitCorners.forEach(a=>{
      const { x:aX, y:aY, width:aW, height:aH } = a.getBoundingClientRect()
      const { id:aId, pos:aPos } = a.dataset
      hitCorners.forEach(b=>{
        const { id:bId, pos:bPos } = b.dataset
        if (aId === bId) return
        const { x:bX, y:bY, width:bW, height:bH } = b.getBoundingClientRect()
        if (overlap(aX, bX) && overlap(aX + aW, bX + bW) && overlap(aY, bY) && overlap(aY + aH, bY + bH)
          ) {
            hit[aId][aPos] = true
            hit[bId][bPos] = true
            // a.style.backgroundColor = 'orange'
            // b.style.backgroundColor = 'orange'
          }
      })
    })
    for (let i = 0; i < penguinCount; i++){
      const { upleft, upright, downleft, downright } = hit[i]
      const penguin = penguins[i]

      hitCheck(upleft, penguin, 'upleft')
      hitCheck(downleft, penguin, 'downleft')
      hitCheck(upright, penguin, 'upright')
      hitCheck(downright, penguin, 'downright')
      hitCheck(upleft && downleft, penguin, 'left')
      hitCheck(upright && downright, penguin, 'right')
      hitCheck(upleft && upright, penguin, 'up')
      hitCheck(downleft && downright, penguin, 'down')
      hitCheck(upleft && upright && downleft && downright, penguin, penguin.defaultFallDirection )

      if ( upleft || upright || downleft || downright && !penguin.knocked) {
        // penguins[i].penguin.classList.add('stop')
        const { direction } = penguin
        penguin.penguin.childNodes[1].className = `penguin_inner_wrapper facing_${direction}`
        knockPenguin(penguin.penguin, penguin)
      }
    }
  }
  
 
  
  // Create penguin and set up collision check
  new Array(15).fill('').map(()=>{
    return [randomP(body.clientWidth - 100), randomP(body.clientHeight - 100)]
  }).forEach( pos => {
    createPenguin(pos[0], pos[1])
  })

  setInterval(collisionCheck, 50)


  // window.addEventListener('keyup',(e)=>{
  //   const hitAreas = document.querySelectorAll('.hit_area')
  //   const k = e.key.toLowerCase().replace('arrow','')[0]
  //   const pObj = penguins[0]
  //   // console.log(penguin)
  //   const { turnIndex:t, penguin:p } = pObj
  //   if (k === 'x') pObj.turnIndex = t === 7 ? 0 : t + 1
  //   if (k === 'z') pObj.turnIndex = t === 0 ? 7 : t - 1
    
  //   hitAreas[0].style.backgroundColor = 'transparent'
  //   if (pObj.stop) startPenguin(p, pObj)

  //   pObj.direction = turnDirections[pObj.turnIndex]
  //   const { direction: dir } = pObj
  //   p.childNodes[1].className = `penguin_inner_wrapper facing_${dir}`

  //   const { marginLeft, marginTop } = p.style
  //   let x = +marginLeft.replace('px','')
  //   let y = +marginTop.replace('px','')

  //   if (k === 'u') p.style.marginTop = `${y - 10}px`
  //   if (k === 'd') p.style.marginTop = `${y + 10}px`
  //   if (k === 'r') p.style.marginLeft = `${x + 10}px`
  //   if (k === 'l') p.style.marginLeft = `${x - 10}px`

  //   console.log(penguins)
  // })

}

window.addEventListener('DOMContentLoaded', init)



//   for (let x = 0; x < penguinCount; x++){
//     const p = penguins[`penguin-${x}`]
//     makeDraggable(p.penguin, p)
//   }
// }


  // const makeDraggable = (penguin, penguinObj) =>{

  //   const onDrag = e => {
  //     // const { x: offSetX, y: offSetY } = body.getBoundingClientRect()
  //     const newX = e.clientX
  //     const newY = e.clientY
  //     penguin.style.marginLeft = `${newX - 50}px`
  //     penguin.style.marginTop = `${newY - 50}px`
  //   }
  //   const onLetGo = () => {
  //     document.removeEventListener('mousemove', onDrag)
  //     document.removeEventListener('mouseup', onLetGo)

  //     if (!penguinObj.hit) {
  //       penguinObj.stop = false
  //       moveAbout(penguin, penguinObj)
  //       penguin.classList.remove('stop')
  //     }
      
  //   } 
  //   const onGrab = () => {
  //     // if (!penguinObj.hit) return
  //     document.addEventListener('mousemove', onDrag)
  //     document.addEventListener('mouseup', onLetGo)
  //     penguinObj.stop = true
  //     penguin.classList.add('stop')
  //   }
  //   penguin.addEventListener('mousedown', onGrab)
  // }









