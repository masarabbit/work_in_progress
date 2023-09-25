
function init() {
  
  const wrapper = document.querySelector('.wrapper')
  const marker = document.querySelectorAll('.marker')
  const indicator = document.querySelector('.indicator')
  const createDucklingBtn = document.querySelector('.create-duckling')

  const data = {
    interval: null,
    target: { x: 0, y: 0 },
    newTarget: { x: 0, y: 0 },
    cursor: { x: 0, y: 0 },
    duck: {
      x: 0,
      y: 0,
      angle: 0,
      direction: '',
      offset: { x: 20, y: 14 },
      el: document.querySelector('.duck'),
      direction: 'down',
    },
    ducklingTargets: [],
    ducklings: []
  }

  const directionConversions = {
    360: 'up', 45: 'up right', 90: 'right', 135: 'down right', 180: 'down', 225: 'down left', 270: 'left', 315: 'up left',
  }

  const px = num => `${num}px`
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))
  const degToRad = deg => deg / (180 / Math.PI)
  const nearestN = (x, n) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n)
  const randomN = max => Math.ceil(Math.random() * max)
  const overlap = (a, b, buffer) =>{
    const bufferToApply = buffer || 20
    return Math.abs(a - b) < bufferToApply
  }

  const positionMarker = (i, pos) => {
    marker[i].style.left = px(pos.x)
    marker[i].style.top = px(pos.y)
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

  const setStyles = ({ el, x, y }) => {
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0})`
    el.style.zIndex = y
  }

  const updateData = (data, newData) => {
    Object.keys(newData).forEach(key => {
      data[key] = newData[key]
    })
  }

  const moveDucklingTargets = ({ x, y }) => {
    data.ducklingTargets.forEach((duckling, i) => {
      clearTimeout(duckling.timer)
      duckling.timer = setTimeout(() => {
        moveDuck(duckling, getOffsetPos({
          x, y,
          angle: data.duck.angle + 180,
          distance: 60 + (80 * i)
        }))
      }, 150 + randomN(40))
    })
  }

  const moveDuck = (duck, { x, y }) => {
    updateData(duck, { x, y })
    setStyles(duck)
  }

  const moveMotherDuck = ({ x, y }) => {
    moveDuck(data.duck, { x, y })
    moveDucklingTargets({ x, y })
  }

  const elAngle = (el, pos) => {
    const { x, y } = pos
    const angle = radToDeg(Math.atan2(el.y - y, el.x - x)) - 90
    const adjustedAngle = angle < 0 ? angle + 360 : angle
    return nearestN(adjustedAngle, 1)
  }

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
    data.cursor.x = e.pageX
    data.cursor.y = e.pageY

    positionMarker(0, data.cursor)
  }

  const returnAngleDiff = ({ angleA, angleB }) => {
    const diff1 = Math.abs(angleA - angleB)
    const diff2 = 360 - diff1

    return diff1 > diff2 ? diff2 : diff1
  }

  const getDirectionClass = angle => {
    return directionConversions[nearestN(angle, 45)]
  }

  const setNewTargetAndDirection = fullDistance => {
    const distanceToMove = fullDistance > 80 ? 80 : fullDistance
    data.newTarget = getNewPosBasedOnTarget({
      distance: distanceToMove,
      fullDistance,
      start: offsetPosition(data.duck),
      target: data.cursor
    })
    data.duck.direction = getDirection({
      pos: offsetPosition(data.duck),
      facing: data.target,
      target: data.newTarget
    })

    positionMarker(3, offsetPosition(data.duck))
    positionMarker(2, data.target)
    positionMarker(1, data.newTarget)
  }

  const turnMotherDuckAndUpdateDirection = ({ diff, limit }) => {
    const angle = elAngle(offsetPosition(data.duck), rotateCoord({
      deg: {
        'clockwise': diff > limit ? limit : diff,
        'anti-clockwise': diff > limit ? -limit : -diff
      }[data.duck.direction],
      x: data.target.x,
      y: data.target.y,
      offset: offsetPosition(data.duck),
    }))

    // determine how much the duck waddles
    moveMotherDuck(getOffsetPos({
      x: data.duck.x,
      y: data.duck.y,
      distance: 50,
      angle
    }), data.duck)
    data.target = getOffsetPos({
      x: data.duck.x,
      y: data.duck.y,
      distance: 100,
      angle
    })
    
    // check how much the duck turned and round to nearest 45 degrees
    const newAngle = elAngle(offsetPosition(data.duck), data.target)
    updateData(data.duck, { angle: newAngle, direction: getDirectionClass(newAngle) })
    data.duck.el.className = `duck waddle ${data.duck.direction}`
    indicator.innerHTML = `duck waddle ${data.duck.direction}`
  }
  
  moveMotherDuckTowardsTarget = () => {
    const angle = elAngle(offsetPosition(data.duck), data.newTarget)
    const direction = getDirectionClass(angle)
    data.duck.el.className = `duck waddle ${direction}`
    indicator.innerHTML = `duck waddle ${direction}`

    moveMotherDuck(data.newTarget, data.duck)
    positionMarker(4, data.duck)

    data.target = getOffsetPos({
      x: data.duck.x,
      y: data.duck.y,
      distance: 50,
      angle
    })
    updateData(data.duck, { angle, direction })
    positionMarker(5, data.target)
  }

  const triggerDuckMovement = () => {
    data.interval = setInterval(() => {
      const fullDistance = distanceBetween(offsetPosition(data.duck), data.cursor)

      if (!fullDistance || fullDistance < 80) {
        // stop waddling when close to target
        data.duck.el.classList.remove('waddle')
        return
      }
      setNewTargetAndDirection(fullDistance)

      const howMuchMotherDuckNeedsToTurn = returnAngleDiff({
        angleA: elAngle(offsetPosition(data.duck), data.target),
        angleB: elAngle(offsetPosition(data.duck), data.newTarget)
      })
      const maxAngleMotherDuckCanTurn = 60

      howMuchMotherDuckNeedsToTurn > maxAngleMotherDuckCanTurn
        ? turnMotherDuckAndUpdateDirection({ 
            diff: howMuchMotherDuckNeedsToTurn, 
            limit: maxAngleMotherDuckCanTurn 
          })
        : moveMotherDuckTowardsTarget()

    }, 500)
  }

  const moveDucklings = () => {
    data.ducklings.forEach((duckling, i) => {
      if (duckling.hit) return
      const fullDistance = distanceBetween(duckling, data.ducklingTargets[i])
  
      if (!fullDistance || fullDistance < 40) {
        duckling.el.classList.remove('waddle')
        return
      }
      moveDuck(duckling, getNewPosBasedOnTarget({
        distance: 30,
        fullDistance,
        start: duckling,
        target: data.ducklingTargets[i]
      }))
      const angle = elAngle(offsetPosition(duckling), data.ducklingTargets[i])
      updateData(duckling, { direction: getDirectionClass(angle) })
      duckling.el.className = `duckling waddle ${duckling.direction}`
    })
  }

  const collisionCheckDucklings = () => {
    data.ducklings.forEach(duckling => {
      const { x, y } = duckling.el.getBoundingClientRect()
      if (checkCollision({ 
        a: data.duck, 
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
  }

  const createDuckling = () =>{
    const newDucklingTarget = document.createElement('div')
    newDucklingTarget.classList.add('duckling-target')
    const newDuckling = document.createElement('div')
    newDuckling.classList.add('duckling')
    newDuckling.innerHTML = `
      <div class="neck-base">
        <div class="neck">
          <div class="head"></div>
        </div>
      </div>
      <div class="tail"></div>
      <div class="body"></div>
      <div class="legs">
        <div class="leg"></div>
        <div class="leg"></div>
      </div>`
    ;[newDucklingTarget, newDuckling].forEach(ele => wrapper.appendChild(ele))

    data.ducklings.push({ el: newDuckling, x: 0, y: 0, direction: 'down', offset: { x: 10, y: 7 }, hit: false },)
    data.ducklingTargets.push({ el: newDucklingTarget, x: 0, y: 0, timer: null, offset: 6 })

    moveDuck(data.ducklings[data.ducklings.length - 1], { x: -50, y: -50, })
  }


  // set up
  ;['click', 'mousemove'].forEach(action => window.addEventListener(action, updateCursorPos))

  createDucklingBtn.addEventListener('click', ()=> {
    createDuckling()

    clearInterval(data.interval)
    triggerDuckMovement()
  })

  const { width, height } = wrapper.getBoundingClientRect()
  updateData(data.cursor, { x: width / 2, y: height / 2 })
  triggerDuckMovement()
  for (let n = 0; n < 3; n++) {
    createDuckling()
  }
  setInterval(moveDucklings, 300)
  setInterval(collisionCheckDucklings, 100)

}

window.addEventListener('DOMContentLoaded', init)


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
  //       moveDuck(data.ducklings[0], {
  //         x: data.ducklings[0].x + x, 
  //         y: data.ducklings[0].y + y, 
  //       })
  //     })
  //   }else {
  //     b.addEventListener('click', ()=> {
  //       data.duck.el.className = `duck waddle ${b.innerHTML}`
  //       ducklings[0].className = `duckling duck waddle ${b.innerHTML}`
  //     })
  //   }
  // })
