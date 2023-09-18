
function init() { 

  const marker = document.querySelectorAll('.marker')
  const box = document.querySelector('.box')
  const indicator = document.querySelector('.indicator')

  const px = num => `${num}px`
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))
  const degToRad = deg => deg / (180 / Math.PI)
  const nearestN = (x, n) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n)

  const positionMarker = (i, pos) => {
    marker[i].style.left = px(pos.x)
    marker[i].style.top = px(pos.y)
  }


  const directionConversions = {
    360: 'up',
    45: 'up right',
    90: 'right',
    135: 'down right',
    180: 'down',
    225: 'down left',
    270: 'left',
    315: 'up left',
  }
  

  const offsetPosition = data => {
    return {
      x: data.x + data.offset.x,
      y: data.y + data.offset.y,
    }
  }


  const setStyles = ({ el, h, w, x, y, angle }) =>{
    if (h) el.style.height = h
    if (w) el.style.width = w
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${angle || 0}deg)`

    el.style.zIndex = y
  }

  const moveDuck = ({ x, y }, duck) => {
    updateData(duck, {
      x, y
    })
    setStyles(duck)
  }

  const adjustedAngle = angle => {
    return angle < 0 
      ? angle + 360 
      : angle > 360
      ? angle - 360
      : angle
  }

  const elAngle = (el, pos) =>{
    const { x, y } = pos
    const angle = radToDeg(Math.atan2(el.y - y, el.x - x)) - 90
    const adjustedAngle = angle < 0 ? angle + 360 : angle
    return nearestN(adjustedAngle, 1)
    // return nearestN(angle, 1)
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
      el: box,
      direction: 'up',
    },
  }

  const { x, y } = box.getBoundingClientRect()
  control.duck.x = x
  control.duck.y = y
  positionMarker(3, control.duck)


  positionMarker(1, control.target)  
  // control.duck.angle = elAngle(control.duck, control.target)



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
      x: x + (distance * Math.cos(degToRad(angle))),
      y: y + (distance * Math.sin(degToRad(angle)))
    }
  }


  const getNewPosBasedOnTarget = ({ start, target, distance: d, fullDistance }) => {
    const { x: aX, y: aY } = start
    const { x: bX, y: bY } = target
    
    const leftD = fullDistance - d
    return {
      x: Math.round(((leftD * aX) + (d * bX)) / fullDistance),
      y: Math.round(((leftD * aY) + (d * bY)) / fullDistance)
    }
  }


  const getDirection = ({ pos, facing, target }) =>{
    const dx2 = facing.x - pos.x
    const dy1 = pos.y - target.y
    const dx1 = target.x - pos.x
    const dy2 = pos.y - facing.y

    return dx2 * dy1 > dx1 * dy2 ? 'anti-clockwise' : 'clockwise'
  }




  const animateDuck = () => {
    indicator.innerHTML = `${control.duck.angle} - ${directionConversions[nearestN(control.duck.angle, 45)]}`
  }

  window.addEventListener('mousemove', e => {
    control.cursor.x = e.pageX
    control.cursor.y = e.pageY

    positionMarker(0, {
      x: e.pageX,
      y: e.pageY
    })
  })

  const returnSmallerDiff = (angleA, angleB) => {
    const diff1 = Math.abs(angleA - angleB)
    const diff2 = 360 - diff1

    return diff1 > diff2 ? diff2 : diff1
  }


  const triggerMovement = () => {
    setInterval(()=> {   
      const fullDistance = distanceBetween(offsetPosition(control.duck), control.cursor)
      const distanceToMove = fullDistance > 50 ? 50 : fullDistance

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
      const diff = returnSmallerDiff(angle, newAngle)
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
      
        const nAngle = elAngle(offsetPosition(control.duck), control.target)
        box.className = `box ${directionConversions[nearestN(nAngle, 45)]}`
      } else {
        const angle =  elAngle(offsetPosition(control.duck), { x, y })
        box.className = `box ${directionConversions[nearestN(angle, 45)]}`
        moveDuck({ x, y }, control.duck)
        positionMarker(4, control.duck)  


        //* get offsetPos seems to be 90 degrees off (or elAngle is?)
        control.target = getOffsetPos({ 
          x: control.duck.x, 
          y: control.duck.y,
          distance: 50, 
          angle: angle - 90
        })
        positionMarker(5, control.target)  

      }
    }, 600)
  }

  triggerMovement()


  // TODO test code indicates that getOffsetPos needs adjustment to get the right position
  // const pos1 = { x: 100, y: 200 }
  // const pos2 = { x: 120, y: 200 }
  // positionMarker(1, pos1)  

  // positionMarker(2, pos2)  

  // positionMarker(3, getOffsetPos({ 
  //   x: pos2.x, 
  //   y: pos2.y,
  //   distance: 100, 
  //   angle: elAngle(pos1, pos2) - 90
  // }))  

  // indicator.innerHTML = elAngle(pos1, pos2)

  // TODO update duck styling

}
  
window.addEventListener('DOMContentLoaded', init)

