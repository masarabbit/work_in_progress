
function init() {
  
  const wrapper = document.querySelector('.wrapper')
  const marker = document.querySelectorAll('.marker')
  const indicator = document.querySelector('.indicator')
  let ducklingTargets = document.querySelectorAll('.duckling-target')
  let ducklings = document.querySelectorAll('.duckling')
  const addDucklingButton = document.querySelector('.add-duckling')

  const px = num => `${num}px`
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))
  const degToRad = deg => deg / (180 / Math.PI)
  const nearestN = (x, n) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n)
  const overlap = (a, b, buffer) =>{
    const bufferToApply = buffer || 20
    return Math.abs(a - b) < bufferToApply
  }

  const positionMarker = (i, pos) => {
    marker[i].style.left = px(pos.x)
    marker[i].style.top = px(pos.y)
  }

  const directionConversions = {
    360: 'up', 45: 'up right', 90: 'right', 135: 'down right', 180: 'down', 225: 'down left', 270: 'left', 315: 'up left',
  }


  const offsetPosition = data => {
    return {
      x: data.x + data.offset.x,
      y: data.y + data.offset.y,
    }
  }

  const checkCollision = ({ a, b, buffer }) =>{
    return overlap(a.x, b.x, buffer) && overlap(a.y, b.y, buffer)
  }


  const setStyles = ({ el, x, y, deg }) => {
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`

    el.style.zIndex = y
  }

  const moveDucklings = ({ x, y }) => {
    control.ducklingTargets.forEach((duckling, i) => {
      clearTimeout(duckling.timer)
      duckling.timer = setTimeout(() => {
        moveDuck(duckling, getOffsetPos({
          x, y,
          angle: control.duck.angle + 180,
          distance: 60 + (80 * i)
        }))
      }, 150)
    })
  }

  const moveDuck = (duck, { x, y }) => {
    updateData(duck, { x, y })
    setStyles(duck)
  }

  const moveMotherDuck = ({ x, y }) => {
    moveDuck(control.duck, { x, y })
    moveDucklings({ x, y })
  }


  const elAngle = (el, pos) => {
    const { x, y } = pos
    const angle = radToDeg(Math.atan2(el.y - y, el.x - x)) - 90
    const adjustedAngle = angle < 0 ? angle + 360 : angle
    return nearestN(adjustedAngle, 1)
  }

  const updateData = (data, newData) => {
    Object.keys(newData).forEach(key => {
      data[key] = newData[key]
    })
  }

  const control = {
    interval: null,
    target: { x: 0, y: 0, },
    cursor: { x: 0, y: 0, },
    duck: {
      x: 0,
      y: 0,
      angle: 0,
      direction: '',
      offset: { x: 20, y: 14, },
      el: document.querySelector('.duck'),
      direction: 'down',
    },
    ducklingTargets: [
      { el: ducklingTargets[0], x: 0, y: 0, timer: null, offset: 6 },
      { el: ducklingTargets[1], x: 0, y: 0, timer: null, offset: 6 },
      { el: ducklingTargets[2], x: 0, y: 0, timer: null, offset: 6 },
      { el: ducklingTargets[3], x: 0, y: 0, timer: null, offset: 6 },
    ],
    ducklings: [ // ? this could be set with function too.
      { el: ducklings[0], x: 0, y: 0, angle: 0, direction: 'down', interval: null, offset: { x: 20, y: 14 }, hit: false },
      { el: ducklings[1], x: 0, y: 0, angle: 0, direction: 'down', interval: null, offset: { x: 20, y: 14 }, hit: false },
      { el: ducklings[2], x: 0, y: 0, angle: 0, direction: 'down', interval: null, offset: { x: 20, y: 14 }, hit: false },
      { el: ducklings[3], x: 0, y: 0, angle: 0, direction: 'down', interval: null, offset: { x: 20, y: 14 }, hit: false },
    ]
  }



  const { x, y } = control.duck.el.getBoundingClientRect()
  updateData(control.duck, { x, y })



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


  const getDirection = ({ pos, facing, target }) => {
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



  const returnAngleDiff = (angleA, angleB) => {
    const diff1 = Math.abs(angleA - angleB)
    const diff2 = 360 - diff1

    return diff1 > diff2 ? diff2 : diff1
  }

  const getDirectionClass = angle => {
    return directionConversions[nearestN(angle, 45)]
  }


  const triggerMovement = () => {
    control.interval = setInterval(() => {
      const fullDistance = distanceBetween(offsetPosition(control.duck), control.cursor)

      if (!fullDistance || fullDistance < 80) {
        control.duck.el.classList.remove('waddle')
        return
      }

      const distanceToMove = fullDistance > 80 ? 80 : fullDistance

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

      // indicator.innerHTML = `angle ${newAngle} diff ${diff} direction: ${control.duck.direction}`

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


        const angle = elAngle(offsetPosition(control.duck), control.target)
        moveMotherDuck(getOffsetPos({
          x: control.duck.x,
          y: control.duck.y,
          distance: 50,
          angle
        }), control.duck)
        control.target = getOffsetPos({
          x: control.duck.x,
          y: control.duck.y,
          distance: 100,
          angle
        })

        const n2Angle = elAngle(offsetPosition(control.duck), control.target)
        updateData(control.duck, { angle: n2Angle, direction: getDirectionClass(n2Angle) })
        control.duck.el.className = `duck waddle ${control.duck.direction}`

        indicator.innerHTML = `duck waddle ${control.duck.direction}`

      } else {
        const angle = elAngle(offsetPosition(control.duck), { x, y })
        const direction = getDirectionClass(angle)
        control.duck.el.className = `duck waddle ${direction}`

        indicator.innerHTML = `duck waddle ${direction}`
        moveMotherDuck({ x, y }, control.duck)
        positionMarker(4, control.duck)

        control.target = getOffsetPos({
          x: control.duck.x,
          y: control.duck.y,
          distance: 50,
          angle
        })
        updateData(control.duck, { angle, direction })
        positionMarker(5, control.target)

      }
    }, 500)
  }

  triggerMovement()

  setInterval(() => {
    control.ducklings.forEach((duckling, i) => {
      if (duckling.hit) return
      const fullDistance = distanceBetween(duckling, control.ducklingTargets[i])
  
      if (!fullDistance || fullDistance < 40) {
        duckling.el.classList.remove('waddle')
        return
      }
      moveDuck(duckling, getNewPosBasedOnTarget({
        distance: 30,
        fullDistance,
        start: duckling,
        target: control.ducklingTargets[i]
      }))
      const angle = elAngle(offsetPosition(duckling), control.ducklingTargets[i])
      updateData(duckling, { angle, direction: getDirectionClass(angle) })
      duckling.el.className = `duckling waddle ${duckling.direction}`
    })
  }, 300)

  setInterval(() => {
    control.ducklings.forEach(duckling => {
      const { x, y } = duckling.el.getBoundingClientRect()
      if (checkCollision({ 
        a: control.duck, 
        b: { x, y },
        buffer: 40  
      })) {
        duckling.el.classList.add('hit')
        duckling.hit = true
  
        const { direction } = duckling
        const x = direction.includes('right') 
          ? -20 
          : direction.includes('left') 
          ? 20
          : 0
  
        const y = direction.includes('up') 
          ? 20 
          : direction.includes('down')
          ? -20
          : 0 
  
        moveDuck(duckling, {
          x: duckling.x + x, 
          y: duckling.y + y, 
        })
  
        setTimeout(()=> {
          duckling.el.classList.remove('hit')
          duckling.hit = false
        }, 900)
      }
    })
  }, 100)



  addDucklingButton.addEventListener('click', ()=> {
    const newDucklingTarget = document.createElement('div')
    newDucklingTarget.classList.add('duckling-target')
    const newDuckling = document.createElement('div')
    newDuckling.classList.add('duckling')
    newDuckling.innerHTML = `
      <div class="neck-base">
        <div class="neck">
          <div class="head">
          </div>
        </div>
      </div>
      <div class="tail"></div>
      <div class="body"></div>
      <div class="legs">
        <div class="leg"></div>
        <div class="leg"></div>
      </div>`

    ;[newDucklingTarget, newDuckling].forEach(ele => wrapper.appendChild(ele))

    ducklingTargets = document.querySelectorAll('.duckling-target')
    ducklings = document.querySelectorAll('.duckling')
    control.ducklings.push({ el: newDuckling, x: 0, y: 0, angle: 0, direction: 'down', interval: null, offset: { x: 20, y: 14 }, hit: false },)
    control.ducklingTargets.push({ el: newDucklingTarget, x: 0, y: 0, timer: null, offset: 6 })

    clearInterval(control.interval)
    triggerMovement()
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
  // indicator.innerHTML = ['up', 'up right', 'right', 'down right', 'down', 'down left', 'left', 'up left', 'hit'].map(d => `<button class="direction-b">${d}</button>`).join('')

  // document.querySelectorAll('.direction-b').forEach(b => {
  //   if(b.innerHTML ==='hit') {
  //     b.addEventListener('click', ()=> {
  //       const direction = 'left down'
  //       const x = direction.includes('right') 
  //         ? -50 
  //         : direction.includes('left') 
  //         ? 50
  //         : 0
  //       const y = direction.includes('up') 
  //         ? 50 
  //         : direction.includes('down')
  //         ? -50
  //         : 0 
  //       ducklings[0].className = `duckling duck ${direction} hit`
  //       console.log('direction', direction)
  //       moveDuck(control.ducklings[0], {
  //         x: control.ducklings[0].x + x, 
  //         y: control.ducklings[0].y + y, 
  //       })
  //     })
  //   }else {
  //     b.addEventListener('click', ()=> {
  //       control.duck.el.className = `duck waddle ${b.innerHTML}`
  //       ducklings[0].className = `duckling duck waddle ${b.innerHTML}`
  //     })
  //   }
  // })

}

window.addEventListener('DOMContentLoaded', init)

