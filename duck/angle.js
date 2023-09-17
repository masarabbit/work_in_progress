
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
  
  // TODO could apply this in opposit way when setting duck position, since or embed in setStyles since we only need the unoffsetted position for setStyles
  const offsetPosition = data => {
    return {
      x: data.x + data.offset,
      y: data.y + data.offset,
    }
  }

  // const setStyles = ({ el, angle }) =>{
  //   el.style.transform = `rotate(${angle || 0}deg)`
  //   el.style.zIndex = y
  // }

  const setStyles = ({ el, h, w, x, y, angle }) =>{
    if (h) el.style.height = h
    if (w) el.style.width = w
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${angle || 0}deg)`

    el.style.zIndex = y
  }

  const moveDuck = ({ x, y }, duck) => {
    updateData(duck, {
      // x: x - duck.offset, 
      // y: y - duck.offset,
      x, y 
    })
    // console.log(x, y, duck)
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
    // limitedTarget: {
    //   x: 0,
    //   y: 0,
    // },
    cursor: {
      x: null,
      y: null,
    },
    duck: {
      x: 0,
      y: 0,
      angle: null,
      offset: 24,
      el: box,
      direction: 'up',
    },
  }

  const { x, y } = box.getBoundingClientRect()
  control.duck.x = x
  control.duck.y = y
  positionMarker(3, control.duck)
  control.target = {
    x: control.duck.x + control.duck.offset,
    y: control.duck.y + control.duck.offset + 100
  }
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


  const triggerMovement = () => {
    setInterval(()=> {
        
      positionMarker(3, control.duck) 
      const fullDistance = distanceBetween(offsetPosition(control.duck), control.cursor)

      const { x, y } = getNewPosBasedOnTarget({
        distance: 100,
        fullDistance,
        start: offsetPosition(control.duck),
        target: control.cursor
      })

      control.duck.direction = getDirection({
        pos: offsetPosition(control.duck),
        facing: control.target,
        target: { x, y }
      })

      positionMarker(1, { x, y })  

      // if (distanceBetween(control.target, { x, y }) > 20) {
  
        // positionMarker(1, { x, y }) 
        console.log(control.target)

        const angle = elAngle(offsetPosition(control.duck), control.target)
        const newAngle = elAngle(offsetPosition(control.duck), { x, y })
        
        const diff = Math.abs(angle - newAngle)
        const actualDiff = Math.abs(adjustedAngle(angle) - adjustedAngle(newAngle))
        // TODO the diff appears much larget than it is when 

        const limit = 60

        if (actualDiff > limit) {
          control.target = rotateCoord({ // TODO I think something isn't right with this bit
            deg: {
              'clockwise': diff > limit ? limit : diff,
              'anti-clockwise': diff > limit ? -limit : -diff
            }[control.duck.direction],
            x: control.target.x, 
            y: control.target.y,
            offset: offsetPosition(control.duck),
          })
        
          
          const angle = elAngle(offsetPosition(control.duck), control.target)
          box.className = `box ${directionConversions[nearestN(angle, 45)]}`
          indicator.innerHTML = `rotate ${actualDiff} ${diff} ${directionConversions[nearestN(angle, 45)]}`
          positionMarker(2, control.target)  
          

          // TODO it would be good if there was some way to move closer even while rotating
          // moveDuck(getOffsetPos({ 
          //   x: control.duck.x, 
          //   y: control.duck.y, 
          //   distance: 30, 
          //   angle: newAngle
          // }), control.duck)


        } else {
          control.target = rotateCoord({
            deg: {
              'clockwise': diff,
              'anti-clockwise': -diff
            }[control.duck.direction],
            x, y,
            offset: offsetPosition(control.duck),
          })
          // control.target = { x, y }

          const angle = elAngle(offsetPosition(control.duck), control.target)
          // updateData(control.duck, { angle })
          box.className = `box ${directionConversions[nearestN(angle, 45)]}`
          indicator.innerHTML = `${diff} ${directionConversions[nearestN(angle, 45)]}`
          moveDuck(control.target, control.duck)
        }

   

    }, 700)
  }

  triggerMovement()


  // TODO getOffSetPos isn't the right way to get this answer

}
  
window.addEventListener('DOMContentLoaded', init)

