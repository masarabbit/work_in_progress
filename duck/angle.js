
function init() { 

  // TODO change duck head to sprite animation

  const marker = document.querySelectorAll('.marker')
  const indicator = document.querySelector('.indicator')

  const ducklingTargets = document.querySelectorAll('.duckling-target')
  const ducklings = document.querySelectorAll('.duckling')

  const px = num => `${num}px`
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))
  const degToRad = deg => deg / (180 / Math.PI)
  const nearestN = (x, n) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n)

  const positionMarker = (i, pos) => {
    marker[i].style.left = px(pos.x)
    marker[i].style.top = px(pos.y)
  }

   // TODO fold this
  const directionConversions = {
    360: 'up', 45: 'up right', 90: 'right', 135: 'down right', 180: 'down', 225: 'down left', 270: 'left', 315: 'up left',
  }
  

  const offsetPosition = data => {
    return {
      x: data.x + data.offset.x,
      y: data.y + data.offset.y,
    }
  }


  const setStyles = ({ el, h, w, x, y, deg }) =>{
    if (h) el.style.height = h
    if (w) el.style.width = w
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`

    el.style.zIndex = y
  }

  const moveDucklings = ({ x, y }) => {
    //TODO the position needs to be altered based on where the mother actually is
    control.ducklingTargets.forEach((duckling, i) => {
      clearTimeout(duckling.timer)
      duckling.timer = setTimeout(()=> {
        moveDuck(getOffsetPos({
          x, y, 
          angle: control.duck.angle + 180, 
          distance: 60 + (50 * i)
        }), duckling)
      }, (i + 1) * 150)
    })
  } 

  const moveDuck = ({ x, y }, duck) => {
    updateData(duck, { x, y })
    setStyles(duck)
  }

  const moveMotherDuck = ({ x, y }) => {
    moveDuck({ x, y }, control.duck)
    moveDucklings({ x, y })
  }


  const elAngle = (el, pos) =>{
    const { x, y } = pos
    const angle = radToDeg(Math.atan2(el.y - y, el.x - x)) - 90
    const adjustedAngle = angle < 0 ? angle + 360 : angle
    return nearestN(adjustedAngle, 1)
  }

  const control = {
    target: {
      x: null,
      y: null,
    },
    cursor: {
      x: null,
      y: null,
    },
    duck: {
      x: 0,
      y: 0,
      angle: null,
      offset: {
        x: 20,
        y: 14,
      },
      el: document.querySelector('.duck'),
      direction: 'down',
    },
    ducklingTargets: [ // ? this could be set with function too.
    { el: ducklingTargets[0], x: null, y: null, angle: null, timer: null, offset: 6 }, // TODO might not need angle
    { el: ducklingTargets[1], x: null, y: null, angle: null, timer: null, offset: 6 },
    { el: ducklingTargets[2], x: null, y: null, angle: null, timer: null, offset: 6 },
  ],
  ducklings: [ // ? this could be set with function too.
  { el: ducklings[0], x: null, y: null, angle: null, timer: null, offset: { x: 20, y: 14 }},
  { el: ducklings[1], x: null, y: null, angle: null, timer: null, offset: { x: 20, y: 14 }},
  { el: ducklings[2], x: null, y: null, angle: null, timer: null, offset: { x: 20, y: 14 }},
]
  }

  const { x, y } = control.duck.el.getBoundingClientRect()
  control.duck.x = x
  control.duck.y = y



  const rotateCoord = ({ deg, x, y, offset }) => {
    const rad = degToRad(deg)
    const nX = x - offset.x
    const nY = y - offset.y
    const nSin = Math.sin(rad)
    const nCos = Math.cos(rad)
    return {
      x: Math.round((nCos * nX - nSin * nY) + offset.x),
      y: Math.round((nSin * nX + nCos * nY) + offset.y)
    }
  }


  const updateData = (data, newData) => {
    Object.keys(newData).forEach(key => {
      data[key] = newData[key]
    })
  }

  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))


  const getOffsetPos = ({ x, y, distance, angle }) => {
    return {
      x: x + (distance * Math.cos(degToRad(angle - 90))),
      y: y + (distance * Math.sin(degToRad(angle - 90)))
    }
  }


  const getNewPosBasedOnTarget = ({ start, target, distance: d, fullDistance }) => {
    const { x: aX, y: aY } = start
    const { x: bX, y: bY } = target
    
    const remainingD = fullDistance - d
    return {
      x: Math.round(((remainingD * aX) + (d * bX)) / fullDistance),
      y: Math.round(((remainingD * aY) + (d * bY)) / fullDistance)
    }
  }


  const getDirection = ({ pos, facing, target }) =>{
    const dx2 = facing.x - pos.x
    const dy1 = pos.y - target.y
    const dx1 = target.x - pos.x
    const dy2 = pos.y - facing.y

    return dx2 * dy1 > dx1 * dy2 ? 'anti-clockwise' : 'clockwise'
  }

  const updateCursorPos = e => {
    control.cursor.x = e.pageX
    control.cursor.y = e.pageY

    positionMarker(0, control.cursor)
  }

  ;['click', 'mousemove'].forEach(action => window.addEventListener(action, updateCursorPos))

  // window.addEventListener('click', e => {

  // })

  // window.addEventListener('mousemove', e => {
  //   control.cursor.x = e.pageX
  //   control.cursor.y = e.pageY

  //   positionMarker(0, control.cursor)
  // })

  const returnAngleDiff = (angleA, angleB) => {
    const diff1 = Math.abs(angleA - angleB)
    const diff2 = 360 - diff1

    return diff1 > diff2 ? diff2 : diff1
  }


  const triggerMovement = () => {
    setInterval(()=> {   
      const fullDistance = distanceBetween(offsetPosition(control.duck), control.cursor)

      if (!fullDistance || fullDistance < 100) {
        control.duck.el.classList.remove('waddle')

        // TODO can even stop interval at this point
        return
      }  

      const distanceToMove = fullDistance > 100 ? 100 : fullDistance

      const { x, y } = getNewPosBasedOnTarget({
        distance: distanceToMove,
        fullDistance,
        start: offsetPosition(control.duck),
        target: control.cursor
      })

      control.duck.direction = getDirection({
        pos: offsetPosition(control.duck),
        facing: control.target,
        target: { x, y }
      })
      
      positionMarker(3, offsetPosition(control.duck)) 
      positionMarker(2, control.target)  
      positionMarker(1, { x, y })  

      const angle = elAngle(offsetPosition(control.duck), control.target)
      const newAngle = elAngle(offsetPosition(control.duck), { x, y })
      const diff = returnAngleDiff(angle, newAngle)
      const limit = 60

      indicator.innerHTML = `angle ${newAngle} diff ${diff} direction: ${control.duck.direction}`

      if (diff > limit) {
        control.target = rotateCoord({
          deg: {
            'clockwise': diff > limit ? limit : diff,
            'anti-clockwise': diff > limit ? -limit : -diff
          }[control.duck.direction],
          x: control.target.x, 
          y: control.target.y,
          offset: offsetPosition(control.duck),
        })
      
        // TODO adjusting this bit alters how much duck moves while waddling
        const nAngle = elAngle(offsetPosition(control.duck), control.target)
        moveMotherDuck(getOffsetPos({ 
          x: control.duck.x, 
          y: control.duck.y,
          distance: 50, 
          angle: nAngle
        }), control.duck)
        control.target = getOffsetPos({ 
          x: control.duck.x, 
          y: control.duck.y,
          distance: 100, 
          angle: nAngle
        })

        const n2Angle = elAngle(offsetPosition(control.duck), control.target)
        control.duck.el.className = `duck waddle ${directionConversions[nearestN(n2Angle, 45)]}`
        updateData(control.duck, { angle: n2Angle  })

        indicator.innerHTML = `duck waddle ${directionConversions[nearestN(n2Angle, 45)]}`

      } else {
        const angle =  elAngle(offsetPosition(control.duck), { x, y })
        control.duck.el.className = `duck waddle ${directionConversions[nearestN(angle, 45)]}`

        indicator.innerHTML = `duck waddle ${directionConversions[nearestN(angle, 45)]}`
        moveMotherDuck({ x, y }, control.duck)
        positionMarker(4, control.duck)  

        control.target = getOffsetPos({ 
          x: control.duck.x, 
          y: control.duck.y,
          distance: 50, 
          angle
        })
        updateData(control.duck, { angle })
        positionMarker(5, control.target)  
        // animateDuck(control.duck)

      }
    }, 500)
  }

  triggerMovement()

  control.ducklings.forEach((duckling, i) => {
    setInterval(()=> {
      const fullDistance = distanceBetween(duckling, control.ducklingTargets[i])

      if (!fullDistance || fullDistance < 40) {
        duckling.el.classList.remove('waddle')
        return
      }  
      const { x, y } = getNewPosBasedOnTarget({
        distance: 30,
        fullDistance,
        start: duckling,
        target: control.ducklingTargets[i]
      })
      moveDuck({ x, y }, duckling)
      const angle = elAngle(offsetPosition(duckling), control.ducklingTargets[i])
      duckling.el.className = `duckling waddle ${directionConversions[nearestN(angle, 45)]}`
      
    }, 300)
  })


  // TODO test code indicates that getOffsetPos needs adjustment to get the right position
  // const pos1 = { x: 100, y: 200 }
  // const pos2 = { x: 120, y: 200 }
  // positionMarker(1, pos1)  

  // positionMarker(2, pos2)  

  // positionMarker(3, getOffsetPos({ 
  //   x: pos2.x, 
  //   y: pos2.y,
  //   distance: 100, 
  //   angle: elAngle(pos1, pos2)
  // }))  

  // indicator.innerHTML = elAngle(pos1, pos2)

  // TODO update duck styling
  

  //* test code
  // indicator.innerHTML = ['up', 'up right', 'right', 'down right', 'down', 'down left', 'left', 'up left'].map(d => `<button class="direction-b">${d}</button>`)

  // document.querySelectorAll('.direction-b').forEach(b => {
  //   b.addEventListener('click', ()=> {
  //     control.duck.el.className = `duck waddle ${b.innerHTML}`
  //     ducklings[0].className = `duckling duck waddle ${b.innerHTML}`
  //   })
  // })

}
  
window.addEventListener('DOMContentLoaded', init)

