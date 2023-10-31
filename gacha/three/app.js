
function init() { 


  const settings = {
    capsuleNo: 20,
    lineNo: 1,
    isTurningLever: false,
    leverPrevDeg: 0,
    leverDeg: 0,
    rotate: 0
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
    getAngle: function() {
      return Math.atan2(this.y, this.x)
    },
    setLength: function(length) {
      const angle = this.getAngle()
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


  const capsuleSeeds = new Array(settings.capsuleNo).fill('')

  const rotateCoord = ({ angle, origin, x, y }) =>{
    const a = degToRad(angle)
    const aX = x - origin.x
    const aY = y - origin.y
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


  const setStyles = ({ el, x, y, w, deg }) =>{
    if (w) el.style.width = w
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
    el.style.zIndex = y
  }




  const lineData = [
    {
      start: {
        x: 80,
        y: 370
      },
      end: {
        x: 312,
        y: 330,
      },
      id: 'flap'
    },
    {
      start: {
        x: 0,
        y: 300
      },
      end: {
        x: 100,
        y: 360,
      },
      id: 'divider'
    },
    {
      start: {
        x: 0,
        y: 300
      },
      end: {
        x: 230,
        y: 490,
      },
      id: 'slope'
    }
  ]

  const elements = {
    body: document.querySelector('.wrapper'),
    gachaMachine: document.querySelector('.gacha-machine'),
    indicator: document.querySelector('.indicator'),
    shakeButton: document.querySelector('.shake'),
    releaseButton: document.querySelector('.release'),
  }

  const { width, height, top, left } = elements.gachaMachine.getBoundingClientRect()

  elements.gachaMachine.innerHTML = capsuleSeeds.map(() => {
    return `<div class="capsule pix"></div>`
  }).join('') + lineData.map(() => {
    return`<div class="line-start"><div class="line"></div></div><div class="line-end"></div>`
  }).join('') + '<div class="cover"></div><div class="cover right"></div> <div class="marker"></div>' + 
  `<div class="lever-box">
      <div class="circle">
        <div class="lever">
          <div class="lever-handle"></div>
          <div class="lever-handle"></div>
        </div>
      </div>
    </div>`

  elements.circle = document.querySelector('.circle')
  elements.lever = document.querySelector('.lever')
  elements.leverHandles = document.querySelectorAll('.lever-handle')
  elements.marker = document.querySelector('.marker')

  const capsules = document.querySelectorAll('.capsule')
  const lineStarts = document.querySelectorAll('.line-start')
  const lines = document.querySelectorAll('.line')
  const lineEnds = document.querySelectorAll('.line-end')

  const { left: handleX, top: handleY } = elements.circle.getBoundingClientRect()
  const handlePos = {
    x: handleX - left + 80,
    y: handleY - top + 80
  }


  lineData.forEach((l, i) => {
    l.length = distanceBetween(l.start, l.end)
    l.deg = radToDeg(angleTo({
      a: l.start,
      b: l.end,
    }))
    setStyles({ 
      el: lineStarts[i], 
      x: l.start.x, y: l.start.y,
      deg: l.deg
    })

    setStyles({ el: lines[i], w: px(l.length) })
    setStyles({ el: lineEnds[i], x: l.end.x, y: l.end.y })
  })




  let capsuleData = Array.from(capsules).map((c, i) => {
    const data = {
      ...vector,
      el: c,
      id: i,
      deg: 0,
      mass: 1,
      radius: 36,
      bounce: -0.3, // this reduces the velocity gradually
      friction: 0.99
    }

    data.velocity = data.create(0, 1)  //? velocity is another vector
    data.velocity.setLength(10)
    data.velocity.setAngle(degToRad(90))

    data.setXy({
      x: randomN(width - 32), 
      y: randomN(height - 200), 
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
      console.log('test', c, Math.abs(c.prevX - c.x))
      if (
        (c.x + c.radius) > 230 
        && c.y + c.radius > (height - 80)
        ) {
          console.log('get!')
          elements.gachaMachine.removeChild(c.el)
          capsuleData = capsuleData.filter(capsule => capsule.id !== c.id)
        }
    })
    setStyles(c)
  })

  setInterval(()=> {
    capsuleData.forEach((c, i) => {
      c.el.style.transition = '0.05s'

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
          // c.velocity.addTo(c.velocity)
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


      lineData.forEach(line => {
        // this only works when velocity is from above
        if ((c.x + c.radius > line.start.x) && (c.x - c.radius < line.end.x)) {
          const dot = (((c.x - line.start.x) * (line.end.x - line.start.x)) + ((c.y - line.start.y) * (line.end.y - line.start.y))) / Math.pow(line.length, 2)
          const closestXy = {
            x: line.start.x + (dot * (line.end.x - line.start.x)),
            y: line.start.y + (dot * (line.end.y - line.start.y))
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

  setStyles({
    el: elements.marker,
    x: handlePos.x,
    y: handlePos.y
  })

  // const mouse = {
  //   up: (t, e, a) => addEvents(t, e, a, ['mouseup', 'touchend']),
  //   move: (t, e, a) => addEvents(t, e, a, ['mousemove', 'touchmove']),
  //   down: (t, e, a) => addEvents(t, e, a, ['mousedown', 'touchstart']),
  //   enter: (t, e, a) => addEvents(t, e, a, ['mouseenter', 'touchstart']),
  //   leave: (t, e, a) => addEvents(t, e, a, ['mouseleave', 'touchmove'])
  // }

  elements.leverHandles.forEach(lever => {
    ;['mousedown', 'touchstart'].forEach(action => {
      lever.addEventListener(action, e => {
        settings.isTurningLever = true
        settings.leverDeg = radToDeg(angleTo({
          a: {
            x: e.pageX - left,
            y: e.pageY - top
          },
          b: handlePos
        }))
        settings.rotate = 0
      })
    })
    ;['mouseup', 'touchend'].forEach(action => {
      lever.addEventListener(action, ()=> {
        settings.isTurningLever = false
        setStyles({
          el: elements.lever,
          deg: 0
        })
      })
    })
  })

  // TODO possibly need touch alternative for mouseleave
  elements.circle.addEventListener('mouseleave', ()=> {
    settings.isTurningLever = false
    setStyles({
      el: elements.lever,
      deg: 0
    })
  })

  ;['mousemove', 'touchmove'].forEach(action => {
    window.addEventListener(action, e => {
      if (!settings.isTurningLever) return
  
      settings.prevLeverDeg = settings.leverDeg 
      const deg = radToDeg(angleTo({
        a: { x: e.pageX - left, y: e.pageY - top },
        b: handlePos
      }))
      settings.leverDeg = deg
  
      const diff = settings.leverDeg - settings.prevLeverDeg

      // elements.indicator.innerHTML = `rotate: ${settings.rotate} deg: ${deg} diff:${diff} leverDeg:${settings.leverDeg} prevLeverDeg:${settings.prevLeverDeg}`
      
      if (settings.prevLeverDeg === 0 || diff >= 1) {
        setStyles({
          el: elements.lever,
          deg: settings.prevLeverDeg + diff
        })
      }
  
      if (diff > 0) settings.rotate += diff
      if (settings.rotate > 360) {
        setStyles({
          el: elements.lever,
          deg: 0
        })
        release()
        settings.isTurningLever = false
      }
    }) 
  })


  const updateLine = () => {
    setStyles({ 
      el: lineStarts[0],
      x: lineData[0].start.x, 
      y: lineData[0].start.y,
      deg: radToDeg(angleTo({
        a: lineData[0].start,
        b: lineData[0].end
      })) 
    })
    setStyles({ el: lines[0], w: px(lineData[0].length) })
    setStyles({ el: lineEnds[0], x: lineData[0].end.x, y: lineData[0].end.y })
  }

  const shake = () => {
    capsuleData.forEach(c => {
      c.velocity.setAngle(degToRad(randomN(270)))
      c.velocity.setXy({ x: 10, y: 10})        
      c.accelerate(c.acceleration)
    })
  }


  // TODO shsake (can improve...)
  elements.shakeButton.addEventListener('click', shake)

  const release = () => {
    lineData[0].start = rotateCoord({ 
      angle: -15, 
      origin: lineData[0].end,
      x: lineData[0].start.x,
      y: lineData[0].start.y,
    })
    
    updateLine()
    shake()
  

    setTimeout(()=> {
      lineData[0].start.x = 80
      lineData[0].start.y = 370
      updateLine()
    }, 500)
  }

  elements.releaseButton.addEventListener('click', release)


}
  
window.addEventListener('DOMContentLoaded', init)

