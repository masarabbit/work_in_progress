
function init() { 


  const settings = {
    capsuleNo: 10,
    lineNo: 1,
    isTurningLever: false,
    leverPrevDeg: 0,
    leverDeg: 0,
  }

  const vector = {
    x: 0,
    y: 0,
    xY: function() {
      return {
        x: this.x,
        y: this.y
      }
    },
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
    get: function(elem) {
      return this[elem]
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
      return this.create(this.x + v2.get('x'), this.y + v2.get('y'))
    },
    subtract: function(v2) {
      return this.create(this.x - v2.get('x'), this.y - v2.get('y'))
    },
    multiply: function(n) {
      return this.create(this.x * n, this.y * n)
    },
    divide: function(n) {
      return this.create(this.x / n, this.y / n)
    },
    addTo: function(v2) {
      this.x += v2.get('x')
      this.y += v2.get('y')
    },
    subtractFrom: function(v2) {
      this.x -= v2.get('x')
      this.y -= v2.get('y')
    },
    multiplyBy: function(n) {
      this.x *= n
      this.y *= n
    },
    divideBy: function(n) {
      this.x /= n
      this.y /= n
    },
  }

  const rotateCoord = ({ angle, origin, x, y }) =>{
    const a = degToRad(angle)
    const aX = x - origin.x
    const aY = y - origin.y
    return {
      x: (aX * Math.cos(a)) - (aY * Math.sin(a)) + origin.x,
      y: (aX * Math.sin(a)) + (aY * Math.cos(a)) + origin.y,
    }
  }



  const elements = {
    body: document.querySelector('.wrapper'),
    gachaMachine: document.querySelector('.gacha-machine'),
    lever: document.querySelector('.lever'),
    leverHandles: document.querySelectorAll('.lever-handle'),
    indicator: document.querySelector('.indicator'),
    shakeButton: document.querySelector('.shake'),
  }

  const capsuleSeeds = new Array(settings.capsuleNo).fill('')
  const lineSeeds = new Array(settings.lineNo).fill('')
  const px = num => `${num}px`
  const randomN = max => Math.ceil(Math.random() * max)
  const degToRad = deg => deg / (180 / Math.PI)
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))

  const setStyles = ({ el, x, y, w, h, deg }) =>{
    if (h) el.style.height = h
    if (w) el.style.width = w
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
    el.style.zIndex = y
  }

  const angleTo = ({ a, b }) => {
    return Math.atan2(b.y - a.y, b.x - a.x)
  }



  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))

  // const distanceBetween = (a, b) => {
  //   const x = b.x - a.x
  //   const y = b.y - a.y
  //   return Math.sqrt((x * x) + (y * y))
  // }




  const { 
    left, top, 
    width, height } = elements.gachaMachine.getBoundingClientRect()

  // const width = window.innerWidth
  // const height = window.innerHeight

  const lineData = lineSeeds.map((_, i) => {
    return {
      start: {
        x: 10,
        y: 50,
      },
      end: {
        x: 250,
        y: 300
      },
      id: i
    }
  })


  elements.gachaMachine.innerHTML = capsuleSeeds.map(() => {
    return `<div class="capsule pix"></div>`
  }).join('') + lineData.map(() => {
    return`<div class="line-start"><div class="line"></div></div><div class="line-end"></div>`
  }).join('') + '<div class="marker"></div>'

  const capsules = document.querySelectorAll('.capsule')
  const lineStarts = document.querySelectorAll('.line-start')
  const lines = document.querySelectorAll('.line')
  const lineEnds = document.querySelectorAll('.line-end')
  const marker = document.querySelector('.marker')

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


  const capsuleData = Array.from(capsules).map((c, i) => {
    const data = {
      ...vector,
      el: c,
      id: i,
      deg: 0,
      mass: 1,
      radius: 32,
      bounce: -0.3, // this reduces the velocity gradually
      friction: 0.99
    }

    data.velocity = data.create(0, 1)  //? velocity is another vector
    data.velocity.setLength(10)
    // data.velocity.setAngle(-Math.PI / 2)
    data.velocity.setAngle(degToRad(90))

    data.setXy({
      x: randomN(width - 32), 
      // y: 0,
      y: randomN(height - 32), 
    })


    // if (i === 0) {
    //   data.setXy({
    //     x: width / 2 + 200, 
    //     y: height / 2, 
    //   })
    // } 

    // if (i === 1) {
    //   data.setXy({
    //     x: width / 2, 
    //     y: height / 2, 
    //   })
    // } 

    //? acceleration is another vector. 
    // this one is like gravity
    data.acceleration = data.create(0, 4)  
    // data.acceleration.setAngle(degToRad(270))
    data.accelerate = function(acceleration) {
      this.velocity.addTo(acceleration)
    }
    return data
  })


  // window.addEventListener('keydown', e => {
  //   const dir = {
  //     ArrowRight: ['x', 0.1],
  //     ArrowLeft: ['x', -0.1],
  //     ArrowUp: ['y', -0.1],
  //     ArrowDown: ['y', 0.1]
  //   }
  //   if (dir[e.key]?.length) {
  //     capsuleData[0].acceleration.set(dir[e.key][0],(dir[e.key][1]))
  //   }
  // })

  // window.addEventListener('keyup', e => {
  //   const dir = {
  //     ArrowRight: ['x', 0],
  //     ArrowLeft: ['x', 0],
  //     ArrowUp: ['y', 0],
  //     ArrowDown: ['y', 0]
  //   }
  //   if (dir[e.key]?.length) {
  //     capsuleData[0].acceleration.set(dir[e.key][0],(dir[e.key][1]))
  //   }
  // })

  const gravitateTo = ({ a, b }) => {
    const gravity = vector.create(0, 0)
    const d = distanceBetween(a, b)

    b.mass = 20000

    gravity.setLength(b.mass / (d * d))
    gravity.setAngle(angleTo({ a, b }))
    
    a.velocity.addTo(gravity)
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


  capsuleData.forEach(c => {
    c.el.addEventListener('click', ()=> {
      console.log('test', c, Math.abs(c.prevX - c.x))
    })
    setStyles(c)
  })

    const dotProduct = ({ a, b }) => {
      return (a.x * b.x) + (a.y * b.y)
    }
  

  setInterval(()=> {
    capsuleData.forEach((c, i) => {
      c.el.style.transition = '0.05s'

      c.prevX = c.x
      c.prevY = c.y

      // if (i === 0) {
      //   gravitateTo({
      //     a: capsuleData[0],
      //     b: capsuleData[1]
      //   })
      // }


      c.accelerate(c.acceleration)
      c.velocity.multiplyBy(c.friction)
      c.addTo(c.velocity)

      // appears from opposite side
      // if (c.get('x') - c.radius > width) {
      //   c.set('x', 0)
      // }

      // if (c.get('x') + c.radius < 0) {
      //   c.set('x', width)
      // }

      // if (c.get('y') - c.radius > height) {
      //   c.set('y', 0)
      // }

      // if (c.get('y') + c.radius < 0) {
      //   c.set('y', height)
      // }

      // https://www.youtube.com/watch?v=NZHzgXFKfuY
      if (c.x + c.radius > width) {
        c.set('x', width - c.radius)
        c.velocity.set('x', c.velocity.x * c.bounce)
      }
      if (c.x - c.radius < 0) {
        c.set('x', c.radius)
        c.velocity.set('x', c.velocity.x * c.bounce)
      }
      if (c.y + c.radius > height) {
        c.set('y', height - c.radius)
        c.velocity.set('y', c.velocity.y * c.bounce)
      }
      if (c.y - c.radius < 0) {
        c.set('y', c.radius)
        c.velocity.set('y', c.velocity.y * c.bounce)
      }


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
  
          setStyles({
            el: marker,
            x: closestXy.x,
            y: closestXy.y
          })
  
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

      if (Math.abs(c.prevX - c.x) < 2 && Math.abs(c.prevY - c.y) < 2) {
        c.velocity.setXy({
          x: 0,
          y: 0,
        })
        c.setXy({
          x: c.prevX,
          y: c.prevY,
        })
        // c.acceleration.setXy({
        //   x: 0,
        //   y: 0,
        // })
      } else {
        if (Math.abs(c.prevX - c.x)) {
          // rotate capsule
          c.deg += (c.x - c.prevX) * 2
        }
      }
      setStyles(capsuleData[i])
    })
  }, 30)



  elements.leverHandles.forEach(lever => {
    console.log('test', lever)
    lever.addEventListener('mousedown', e => {
      settings.isTurningLever = true
      settings.leverDeg = radToDeg(angleTo({
        a: {
          x: e.pageX,
          y: e.pageY
        },
        b: {
          x: 100,
          y: 100
        }
      }))
    })
    lever.addEventListener('mouseup', ()=> settings.isTurningLever = false)
    lever.addEventListener('mouseout', ()=> settings.isTurningLever = false)
  })

  window.addEventListener('mousemove', e => {
    if (!settings.isTurningLever) return

    settings.prevLeverDeg = settings.leverDeg 
    const deg = radToDeg(angleTo({
      a: {
        x: e.pageX,
        y: e.pageY
      },
      b: {
        x: 100,
        y: 100
      }
    }))
    settings.leverDeg = deg

    const diff = settings.leverDeg - settings.prevLeverDeg

    elements.indicator.innerHTML = `deg: ${deg} diff:${diff} leverDeg:${settings.leverDeg} prevLeverDeg:${settings.prevLeverDeg}`
    

    if (settings.prevLeverDeg === 0 || diff >= 1) {
      setStyles({
        el: elements.lever,
        deg: settings.prevLeverDeg + diff
      })


      lineData[0].end = rotateCoord({ 
        angle: diff, 
        origin: lineData[0].start,
        x: lineData[0].end.x,
        y: lineData[0].end.y,
      })


      // TODO this doesn't need to loop around if it's the only one
      lineData.forEach((l, i) => {
        setStyles({ 
          el: lineStarts[i],
          x: l.start.x, y: l.start.y,
          deg: radToDeg(angleTo({
            a: l.start,
            b: l.end,
          })) 
        })
        setStyles({ el: lines[i], w: px(l.length) })
        setStyles({ el: lineEnds[i], x: l.end.x, y: l.end.y })
      })


    }
  })


  // TODO shsake (can improve...)
  elements.shakeButton.addEventListener('click', ()=> {
    capsuleData.forEach(c => {

      // c.velocity.multiplyBy(1.5)
      c.velocity.setAngle(degToRad(randomN(360)))
      c.velocity.setXy({ x: 10, y: 10})      
      c.accelerate(c.acceleration)
    })
  })



  // window.addEventListener('mousemove', e=> {
  //   capsuleData[0].setXy({
  //     x: e.pageX - left,
  //     y: e.pageY - top
  //   })
  // })


}
  
window.addEventListener('DOMContentLoaded', init)

