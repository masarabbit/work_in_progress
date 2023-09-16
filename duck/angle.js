
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


  const setStyles = ({ el, angle }) =>{
    el.style.transform = `rotate(${angle || 0}deg)`

    el.style.zIndex = y
  }


  const control = {
    target: {
      x: 0,
      y: 0,
    },
    limitedTarget: {
      x: 0,
      y: 0,
    },
    cursor: {
      x: null,
      y: null,
    },
    duck: {
      x: 0,
      y: 0,
      angle: null,
      offset: 24,
      el: box
    },
  }

  const { x, y } = box.getBoundingClientRect()
  control.duck.x = x + 25
  control.duck.y = y + 25
  positionMarker(3, control.duck)


  const rotateCoord = ({ deg, x, y, offset }) => {
    const rad = degToRad(deg)
    const nX = x - offset.x
    const nY = y - offset.y
    const nSin = Math.sin(rad)
    const nCos = Math.cos(rad)
    return {
      x: (nCos * nX - nSin * nY) + offset.x,
      y: (nSin * nX + nCos * nY) + offset.y
    }
  }


  const elAngle = el =>{
    const { x, y } = control.limitedTarget
    const angle = radToDeg(Math.atan2(el.y - y, el.x - x)) - 90
    const adjustedAngle = angle < 0 ? angle + 360 : angle
    return nearestN(adjustedAngle, 1)
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



  // https://mathwords.net/naibunzahyo

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
    // https://qiita.com/tydesign/items/d41ac74b5effd87141b8
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
      const fullDistance = distanceBetween(control.duck, control.cursor)

      const { x, y } = getNewPosBasedOnTarget({
        distance: 100,
        fullDistance,
        start: control.duck,
        target: control.cursor
      })
  
      const direction = getDirection({
        pos: control.duck,
        facing: control.target,
        target: { x, y },
      })
  
      
  
      control.target = { x, y }

      control.limitedTarget = rotateCoord({
        deg: {
          'clockwise': 30,
          'anti-clockwise': -30
        }[direction],
        x, y,
        offset: control.duck
      })

      console.log('1.5', direction, control.limitedTarget)
  
      positionMarker(1, control.target)
      positionMarker(2, control.limitedTarget)  

      updateData(control.duck, {
        angle: elAngle(control.duck),
      })

      setStyles(control.duck)
      animateDuck()

    }, 1000)
      
  }

  triggerMovement()

  // TODO getOffSetPos isn't the right way to get this answer

}
  
window.addEventListener('DOMContentLoaded', init)

