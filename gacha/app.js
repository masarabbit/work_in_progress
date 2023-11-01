
function init() { 

  //TODO adjust position for release
  // add logic to open capsule
  // add tutorial on how to operate
  // add way to make inside visible

  const settings = {
    capsuleNo: 20,
    isTurningHandle: false,
    handlePrevDeg: 0,
    handleDeg: 0,
    handleRotate: 0,
    flapRotate: 0,
    slopeRotate: 0
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
    set: function(elem, n) {
      this[elem] = n
    },
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
    add: function(v2) {
      return this.create(this.x + v2.x, this.y + v2.y)
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


  const rotateCoord = ({ angle, origin, coord }) =>{
    const a = degToRad(angle)
    const aX = coord.x - origin.x
    const aY = coord.y - origin.y
    return {
      x: (aX * Math.cos(a)) - (aY * Math.sin(a)) + origin.x,
      y: (aX * Math.sin(a)) + (aY * Math.cos(a)) + origin.y,
    }
  }


  const px = num => `${num}px`
  const randomN = max => Math.ceil(Math.random() * max)
  const degToRad = deg => deg / (180 / Math.PI)
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))
  const angleTo = ({ a, b }) => Math.atan2(b.y - a.y, b.x - a.x)
  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))
  const getPage = (e, type) => e.type[0] === 'm' ? e[`page${type}`] : e.touches[0][`page${type}`]

  const setStyles = ({ el, x, y, w, deg }) =>{
    if (w) el.style.width = w
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
    el.style.zIndex = y
  }


  const lineData = [
    {
      start: { x: 0, y: 280 },
      end: { x: 160, y: 360 },
      id: 'flap_1'
    },
    {
      start: { x: 160, y: 360 },
      end: { x: 320, y: 280, },
      id: 'flap_2'
    },
    {
      start: { x: 70, y: 340 },
      end: { x: 230, y: 490 },
      id: 'slope'
    }
  ]

  const elements = {
    body: document.querySelector('.wrapper'),
    gachaMachine: document.querySelector('.gacha-machine'),
    indicator: document.querySelector('.indicator'),
    shakeButton: document.querySelector('.shake'),
    releaseButton: document.querySelector('.release'),
    circle: document.querySelector('.circle'),
    handle: document.querySelector('.handle'),
  }


  const { width, height, top, left } = elements.gachaMachine.getBoundingClientRect()

  new Array(settings.capsuleNo).fill('').forEach(() => {
    const capsule = Object.assign(document.createElement('div'), { className: 'capsule pix' })
    elements.gachaMachine.appendChild(capsule)
  })
  lineData.forEach(() => {
    const lineStart =  Object.assign(document.createElement('div'), { className: 'line-start' })
    lineStart.appendChild(Object.assign(document.createElement('div'), { className: 'line' }),)
    ;[
      lineStart,
      Object.assign(document.createElement('div'), { className: 'line-end' })
    ].forEach(ele => {
      elements.gachaMachine.appendChild(ele)
    })
  })


  const lineStarts = document.querySelectorAll('.line-start')
  const lines = document.querySelectorAll('.line')
  const lineEnds = document.querySelectorAll('.line-end')

  const { left: handleX, top: handleY } = elements.circle.getBoundingClientRect()
  const handlePos = {
    x: handleX - left + 80,
    y: handleY - top + 80
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


  let capsuleData = Array.from(document.querySelectorAll('.capsule')).map((c, i) => {
    const data = {
      ...vector,
      el: c,
      id: i,
      deg: 0,
      mass: 1,
      radius: 36, // actual radius should be 32, but setting it higher
      bounce: -0.3, // this reduces the velocity gradually
      friction: 0.99
    }

    data.velocity = data.create(0, 1)  //? velocity is another vector
    data.velocity.setLength(10)
    data.velocity.setAngle(degToRad(90))

    data.setXy({
      x: randomN(width - 32), 
      y: randomN(height - 250), 
    })

    //? acceleration is another vector. 
    // this one is like gravity
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


  capsuleData.forEach(c => {
    c.el.addEventListener('click', ()=> {
      // console.log('test', c, Math.abs(c.prevX - c.x))
      if (
        (c.x + c.radius) > 230 
        && c.y + c.radius > (height - 80)
        ) {
          elements.gachaMachine.removeChild(c.el)
          capsuleData = capsuleData.filter(capsule => capsule.id !== c.id)
        }
    })
    setStyles(c)
  })

  setInterval(()=> {
    capsuleData.forEach((c, i) => {
      c.prevX = c.x
      c.prevY = c.y

      c.accelerate(c.acceleration)
      c.velocity.multiplyBy(c.friction)
      c.addTo(c.velocity)

      capsuleData.forEach(c2 =>{
        if (c.id === c2.id) return
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

      const buffer = 5
      if (c.x + (c.radius + buffer) > width) {
        c.x = width - (c.radius + buffer)
        c.velocity.x = c.velocity.x * c.bounce
      }
      if (c.x - (c.radius + buffer) < 0) {
        c.x = c.radius
        c.velocity.x = c.velocity.x * c.bounce
      }
      if (c.y + c.radius > height) {
        c.y = height - c.radius
        c.velocity.y = c.velocity.y * c.bounce
      }
      if (c.y - c.radius < 0) {
        c.y = c.radius
        c.velocity.y = c.velocity.y * c.bounce
      }

      if (Math.abs(c.prevX - c.x) < 2 && Math.abs(c.prevY - c.y) < 2) {
        c.velocity.setXy({ x: 0, y: 0 })
        c.setXy({ x: c.prevX, y: c.prevY })
      } else {
        if (Math.abs(c.prevX - c.x)) {
          // rotate capsule
          c.deg += (c.x - c.prevX) * 2
        }
      }

      setStyles(capsuleData[i])
    })
  }, 30)


  ;['mousedown', 'touchstart'].forEach(action => {
    elements.handle.addEventListener(action, e => {
      settings.isTurningHandle = true
      settings.handleDeg = radToDeg(angleTo({
        a: {
          x: getPage(e, 'X') - left,
          y: getPage(e, 'Y') - top
        },
        b: handlePos
      }))
      settings.handleRotate = 0
    })
  })
  ;['mouseup', 'touchend'].forEach(action => {
    elements.handle.addEventListener(action, ()=> {
      settings.isTurningHandle = false
      setStyles({
        el: elements.handle,
        deg: 0
      })
    })
  })

  elements.circle.addEventListener('mouseleave', ()=> {
    settings.isTurningHandle = false
    setStyles({
      el: elements.handle,
      deg: 0
    })
  })

  ;['mousemove', 'touchmove'].forEach(action => {
    window.addEventListener(action, e => {
      if (!settings.isTurningHandle) return
  
      settings.prevHandleDeg = settings.handleDeg 
      const deg = radToDeg(angleTo({
        a: { x: getPage(e, 'X') - left, y: getPage(e, 'Y') - top },
        b: handlePos
      }))
      settings.handleDeg = deg
  
      const diff = settings.handleDeg - settings.prevHandleDeg

      // elements.indicator.innerHTML = `rotate: ${settings.handleRotate} deg: ${deg} diff:${diff} leverDeg:${settings.handleDeg} prevHandleDeg:${settings.prevHandleDeg}`
      
      if (settings.prevHandleDeg === 0 || diff >= 1) {
        setStyles({
          el: elements.handle,
          deg: settings.prevHandleDeg + diff
        })
      }
  
      if (diff > 0) settings.handleRotate += diff
      if (settings.handleRotate > 365) {
        setStyles({
          el: elements.handle,
          deg: 0
        })
        release()
        settings.isTurningHandle = false
      }
    }) 
  })

  const shake = () => {
    capsuleData.forEach(c => {
      c.velocity.setAngle(degToRad(randomN(270)))
      c.velocity.setXy({ x: 10, y: 10})        
      c.accelerate(c.acceleration)
    })
  }

  const openFlap = () => {
    if (settings.flapRotate > -20) {
      settings.flapRotate-= 2
      lineData[0].end = rotateCoord({ 
        angle: 2, 
        origin: lineData[0].start,
        coord: lineData[0].end
      })

      lineData[1].start = rotateCoord({ 
        angle: -2, 
        origin: lineData[1].end,
        coord: lineData[1].start
      })

      lineData[2].start = rotateCoord({ 
        angle: -4, 
        origin: lineData[2].end,
        coord: lineData[2].start
      })
      
      updateLines()

      setTimeout(()=> {
        openFlap()
      }, 30)
    } else {
      setTimeout(()=> {
        closeFlap()
      }, 800)
    }
  }

  const closeFlap = () => {
    if (settings.flapRotate < 0) {
      settings.flapRotate+= 1
      if (settings.flapRotate === 0) {
        lineData[0].end.x = 160
        lineData[0].end.y = 360

        lineData[1].start.x = 160
        lineData[1].start.y = 360

        lineData[2].start.x = 70
        lineData[2].start.y = 340
      } else {
        lineData[0].end = rotateCoord({ 
          angle: -1, 
          origin: lineData[0].start,
          coord: lineData[0].end
        })
        lineData[1].start = rotateCoord({ 
          angle: 1, 
          origin: lineData[1].end,
          coord: lineData[1].start
        })
        lineData[2].start = rotateCoord({ 
          angle: 2, 
          origin: lineData[2].end,
          coord: lineData[2].start
        })
      }
      updateLines()

      setTimeout(()=> {
        closeFlap()
      }, 30)
    }
  }


  // TODO shsake (can improve...)
  elements.shakeButton.addEventListener('click', shake)

  const release = () => {
    // shake()
    settings.flapRotate = 0
    setTimeout(()=> {
      openFlap()
    }, 30)
  }

  elements.releaseButton.addEventListener('click', release)

  updateLines()


}
  
window.addEventListener('DOMContentLoaded', init)

