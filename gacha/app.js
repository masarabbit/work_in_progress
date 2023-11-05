
function init() { 

  //TODO adjust position for release
  // add tutorial on how to operate
  // add toys

  const settings = {
    capsuleNo: 20,
    isTurningHandle: false,
    isHandleLocked: false,
    handlePrevDeg: 0,
    handleDeg: 0,
    handleRotate: 0,
    flapRotate: 0,
    slopeRotate: 0,
    collectedNo: 0,
  }

  const elements = {
    body: document.querySelector('.wrapper'),
    gachaMachine: document.querySelector('.gacha-machine'),
    indicator: document.querySelector('.indicator'),
    shakeButton: document.querySelector('.shake'),
    releaseButton: document.querySelector('.release'),
    seeInsideButton: document.querySelector('.see-inside'),
    circle: document.querySelector('.circle'),
    handle: document.querySelector('.handle'),
    toyBox: document.querySelector('.toy-box'),
    // exit: document.querySelector('.exit'),
  }

  const vector = {
    x: 0,
    y: 0,
    create: function(x, y) {
      const obj = Object.create(this)
      obj.x = x
      obj.y = y
      return obj
    },
    // set: function(elem, n) {
    //   this[elem] = n
    // },
    setXy: function({ x, y }) {
      this.x = x
      this.y = y
    },
    setAngle: function(angle) {
      const length = this.magnitude()
      this.x = Math.cos(angle) * length
      this.y = Math.sin(angle) * length
    },
    setLength: function(length) {
      const angle = Math.atan2(this.y, this.x)
      this.x = Math.cos(angle) * length
      this.y = Math.sin(angle) * length
    },
    magnitude: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    },
    multiply: function(n) {
      return this.create(this.x * n, this.y * n)
    },
    addTo: function(v2) {
      this.x += v2.x
      this.y += v2.y
    },
    multiplyBy: function(n) {
      this.x *= n
      this.y *= n
    },
  }

  const rotatePoint = ({ angle, axis, point }) =>{
    const a = degToRad(angle)
    const aX = point.x - axis.x
    const aY = point.y - axis.y
    return {
      x: (aX * Math.cos(a)) - (aY * Math.sin(a)) + axis.x,
      y: (aX * Math.sin(a)) + (aY * Math.cos(a)) + axis.y,
    }
  }

  const px = num => `${num}px`
  const randomN = max => Math.ceil(Math.random() * max)
  const degToRad = deg => deg / (180 / Math.PI)
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))
  const angleTo = ({ a, b }) => Math.atan2(b.y - a.y, b.x - a.x)
  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))
  const getPage = (e, type) => e.type[0] === 'm' ? e[`page${type}`] : e.touches[0][`page${type}`]
  const calcCollectedX = () => settings.collectedNo % 10 * 32
  const calcCollectedY = () => Math.floor(settings.collectedNo / 10) * 32

  const setStyles = ({ el, x, y, w, deg }) =>{
    if (w) el.style.width = w
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
  }

  const lineData = [
    {
      start: { x: 0, y: 280 },
      end: { x: 160, y: 360 },
      point: 'end', 
      axis: 'start',
      id: 'flap_1'
    },
    {
      start: { x: 160, y: 360 },
      end: { x: 320, y: 280, },
      point: 'start', 
      axis: 'end',
      id: 'flap_2'
    },
    {
      start: { x: 70, y: 340 },
      end: { x: 230, y: 490 },
      point: 'start', 
      axis: 'end',
      id: 'ramp'
    }
  ]


  const getRandomToy = () => {
    return ['bunny', 'duck-yellow', 'duck-pink', 'star', 'water-melon', 'panda', 'dino', 'roboto-san', 'penguin'][randomN(9) - 1]
  }

  // const toyTypes = 'water-melon'

  new Array(settings.capsuleNo).fill('').forEach(() => {
    const capsule = Object.assign(document.createElement('div'), 
      { className: 'capsule-wrapper pix',
        innerHTML: `<div class="capsule">
                      <div class="lid"></div>
                      <div class="${getRandomToy()} toy pix"></div>
                      <div class="base ${['red', 'pink', 'white', 'blue'][randomN(4) - 1]}"></div>
                    </div>`
    })
    elements.gachaMachine.appendChild(capsule)
  })
  lineData.forEach(() => {
    ;[
      Object.assign(document.createElement('div'), 
        { className: 'line-start', innerHTML: '<div class="line"></div>'}),
      Object.assign(document.createElement('div'), { className: 'line-end' })
    ].forEach(ele => {
      elements.gachaMachine.appendChild(ele)
    })
  })

  const lineStarts = document.querySelectorAll('.line-start')
  const lines = document.querySelectorAll('.line')
  const lineEnds = document.querySelectorAll('.line-end')
  const toys = document.querySelectorAll('.toy')
  const { left: toyBoxLeft, top: toyBoxTop } = elements.toyBox.getBoundingClientRect()
  const { width, height, top, left } = elements.gachaMachine.getBoundingClientRect()

  const handleAxis = () => {
    const { left: handleX, top: handleY } = elements.circle.getBoundingClientRect()
    return {
      x: handleX - left + 80,
      y: handleY - top + 80
    }
  }

  const updateLines = () => {
    lineData.forEach((l, i) => {
      l.length = distanceBetween(l.start, l.end)
      setStyles({ 
        el: lineStarts[i],
        x: l.start.x, 
        y: l.start.y,
        deg: radToDeg(angleTo({
          a: l.start,
          b: l.end
        })) 
      })
      setStyles({ el: lines[i], w: px(l.length) })
      setStyles({ el: lineEnds[i], x: l.end.x, y: l.end.y })
    })
  }

  const capsuleData = Array.from(document.querySelectorAll('.capsule-wrapper')).map((c, i) => {
    const data = {
      ...vector,
      el: c,
      id: i,
      deg: 0,
      mass: 1,
      radius: 36, // actual radius should be 32, but setting it higher
      bounce: -0.3, // this reduces the velocity gradually
      friction: 0.99,
      toy: toys[i]
    }

    data.velocity = data.create(0, 1)  //? velocity is another vector
    data.velocity.setLength(10)
    data.velocity.setAngle(degToRad(90))
    data.setXy({
      x: randomN(width - 32), 
      y: randomN(height - 250), 
    })

    // gravity
    data.acceleration = data.create(0, 4)  
    data.accelerate = function(acceleration) {
      this.velocity.addTo(acceleration)
    }
    return data
  })

  const getNewPosBasedOnTarget = ({ start, target, distance: d, fullDistance }) => {
    const { x: aX, y: aY } = start
    const { x: bX, y: bY } = target
    const remainingD = fullDistance - d
    return {
      x: Math.round(((remainingD * aX) + (d * bX)) / fullDistance),
      y: Math.round(((remainingD * aY) + (d * bY)) / fullDistance)
    }
  }

  // const isCapsuleAvailable = c => {
  //   if (c.selected) return
  //   const { x: exitX, y: exitY, width: exitWidth, height: exitHeight } = elements.exit.getBoundingClientRect()
  //   return (c.x + c.radius) > (exitX - left)
  //   && (c.x - c.radius) < (exitX + exitWidth - left)
  //   && (c.y + c.radius) > (exitY - top)
  //   && (c.y - c.radius) < (exitY + exitHeight - top)
  // }

  const shake = () => {
    capsuleData.forEach(c => {
      c.velocity.setAngle(degToRad(randomN(270)))
      c.velocity.setXy({ x: 10, y: 10})        
      c.accelerate(c.acceleration)
    })
  }

  const rotateLines = angles => {
    angles.forEach((angle, i) => {
      const { axis, point } = lineData[i]
      lineData[i][point] = rotatePoint({ 
        angle,
        axis: lineData[i][axis],
        point: lineData[i][point]
      })
    })
  }

  const openFlap = () => {
    if (settings.flapRotate > -20) {
      settings.flapRotate-= 2
      rotateLines([ 2, -2, -4 ])
      updateLines()
      setTimeout(openFlap, 30)
    } else {
      setTimeout(closeFlap, 800)
    }
  }

  // const checkCapsuleRelease = () => {
  //   elements.exit.classList[capsuleData.some(c => !c.selected && isCapsuleAvailable(c)) ? 'add' : 'remove']('available')
  // }

  const closeFlap = () => {
    if (settings.flapRotate < 0) {
      settings.flapRotate+= 1
      if (settings.flapRotate === 0) {
        [
          { x: 160, y: 360 },
          { x: 160, y: 360 },
          { x: 70, y: 340 },
        ].forEach((item, i) => {
          lineData[i][lineData[i].point].x = item.x
          lineData[i][lineData[i].point].y = item.y
        })
        settings.isHandleLocked = false
      } else {
        rotateLines([ -1, 1, 2 ])
        // checkCapsuleRelease()
      }
      updateLines()
      setTimeout(closeFlap, 30)
    }
  }

  const release = () => {
    settings.flapRotate = 0
    settings.isHandleLocked = true
    setTimeout(openFlap, 30)
  }

  capsuleData.forEach(c => {
    c.el.addEventListener('click', ()=> {
      const { width: bodyWidth, height: bodyHeight } = elements.body.getBoundingClientRect()

      // if (isCapsuleAvailable(c)) {
        elements.body.classList.add('lock')
        c.el.classList.add('enlarge')
        c.selected = true
        // checkCapsuleRelease()
        setStyles({
          el : c.el,
          x: (bodyWidth / 2) - left,
          y: (bodyHeight / 2) - top,
          deg: 0
        })
        setStyles({ el: c.toy, deg: 0 })
        setTimeout(()=> c.el.classList.add('open'), 700)
        setTimeout(()=> {
          elements.body.classList.remove('lock')
          c.toy.classList.add('collected')
          setStyles({
            el : c.el,
            x: toyBoxLeft - left + 16 + calcCollectedX(),
            y: toyBoxTop - top + 16 + calcCollectedY(),
          })
          settings.collectedNo++
        }, 1800)
        // }
    })
    setStyles(c)
  })

  const spaceOutCapsules = c => {
    capsuleData.forEach(c2 =>{
      if (c.id === c2.id || c2.selected) return
      const distanceBetweenCapsules = distanceBetween(c, c2)
      if (distanceBetweenCapsules < (c.radius * 2)) {
        c.velocity.multiplyBy(-0.6)
        const overlap = distanceBetweenCapsules - (c.radius * 2)
        c.setXy(
          getNewPosBasedOnTarget({
            start: c,
            target: c2,
            distance: overlap / 2, 
            fullDistance: distanceBetweenCapsules
          })
        )
      }
    })
  }

  const hitCheckLines = c => {
    lineData.forEach(l => {
      // this only works when velocity is from above
      if ((c.x + c.radius > l.start.x) && (c.x - c.radius < l.end.x)) {
        const dot = (((c.x - l.start.x) * (l.end.x - l.start.x)) + ((c.y - l.start.y) * (l.end.y - l.start.y))) / Math.pow(l.length, 2)
        const closestXy = {
          x: l.start.x + (dot * (l.end.x - l.start.x)),
          y: l.start.y + (dot * (l.end.y - l.start.y))
        }
        const fullDistance = distanceBetween(c, closestXy)

        if (fullDistance < c.radius) {
          c.velocity.multiplyBy(-0.6)

          const overlap = fullDistance - (c.radius)
          c.setXy(
            getNewPosBasedOnTarget({
              start: c,
              target: closestXy,
              distance: overlap / 2, 
              fullDistance
            })
          )
        }
      }
    })
  }

  const hitCheckGachaMachineWalls = c => {
    const buffer = 5
    if (c.x + c.radius + buffer > width) {
      c.x = width - (c.radius + buffer)
      c.velocity.x = c.velocity.x * c.bounce
    }
    if (c.x - (c.radius + buffer) < 0) {
      c.x = c.radius
      c.velocity.x = c.velocity.x * c.bounce
    }
    if (c.y + c.radius + buffer > height) {
      c.y = height - c.radius - buffer
      c.velocity.y = c.velocity.y * c.bounce
    }
    if (c.y - c.radius < 0) {
      c.y = c.radius
      c.velocity.y = c.velocity.y * c.bounce
    }
  }


  const animateCapsules = () => {
    capsuleData.forEach((c, i) => {
      if (c.selected) return
      c.prevX = c.x
      c.prevY = c.y

      c.accelerate(c.acceleration)
      c.velocity.multiplyBy(c.friction)
      c.addTo(c.velocity)

      spaceOutCapsules(c)
      hitCheckLines(c)
      hitCheckGachaMachineWalls(c)

      if (Math.abs(c.prevX - c.x) < 2 && Math.abs(c.prevY - c.y) < 2) {
        c.velocity.setXy({ x: 0, y: 0 })
        c.setXy({ x: c.prevX, y: c.prevY })
      } else {
        if (Math.abs(c.prevX - c.x)) {
          // rotate capsule
          setStyles({
            el: c.toy,
            deg: c.deg + (c.x - c.prevX) * 2
          })
          c.deg += (c.x - c.prevX) * 2
        }
      }
      setStyles(capsuleData[i])
    })
  }


  const grabHandle = e => {
    if (settings.isHandleLocked) return
    settings.isTurningHandle = true
    settings.handleDeg = radToDeg(angleTo({
      a: {
        x: getPage(e, 'X') - left,
        y: getPage(e, 'Y') - top
      },
      b: handleAxis()
    }))
    settings.handleRotate = 0
  }

  const releaseHandle = () => {
    settings.isTurningHandle = false
    setStyles({
      el: elements.handle,
      deg: 0
    })
  }

  const rotateHandle = e => {
    if (!settings.isTurningHandle || settings.isHandleLocked) return
  
    settings.prevHandleDeg = settings.handleDeg 
    const deg = radToDeg(angleTo({
      a: { x: getPage(e, 'X') - left, y: getPage(e, 'Y') - top },
      b: handleAxis()
    }))
    settings.handleDeg = deg

    const diff = settings.handleDeg - settings.prevHandleDeg

    // elements.indicator.innerHTML = `rotate: ${settings.handleRotate} deg: ${deg} diff:${diff} leverDeg:${settings.handleDeg} prevHandleDeg:${settings.prevHandleDeg}`
    
    if (diff >= 1) {
      setStyles({
        el: elements.handle,
        deg: settings.handleRotate
      })
    }

    if (diff > 0 && diff < 50) settings.handleRotate += diff
    if (settings.handleRotate > 350) {
      setStyles({
        el: elements.handle,
        deg: 0
      })
      release()
      settings.isTurningHandle = false
    }
  }


  ;['mousedown', 'touchstart'].forEach(action => {
    elements.handle.addEventListener(action, grabHandle)
  })

  ;['mouseup', 'mouseleave', 'touchend'].forEach(action => {
    elements.handle.addEventListener(action, releaseHandle)
  })

  ;['mousemove', 'touchmove'].forEach(action => {
    window.addEventListener(action, rotateHandle) 
  })

  elements.releaseButton.addEventListener('click', release)
  elements.shakeButton.addEventListener('click', shake)
  elements.seeInsideButton.addEventListener('click', ()=> {
    elements.gachaMachine.classList.toggle('see-through')
    elements.seeInsideButton.innerHTML = elements.gachaMachine.classList.contains('see-through') ? 'hide' : 'see inside'
  })

  updateLines()
  setInterval(animateCapsules, 30)

}
  
window.addEventListener('DOMContentLoaded', init)

