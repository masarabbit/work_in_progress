
function init() { 

  const settings = {
    capsuleNo: 8,
    lineNo: 1,
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



  const elements = {
    body: document.querySelector('.wrapper'),
    gachaMachine: document.querySelector('.gacha-machine')
    // indicator: document.querySelector('.indicator'),
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
        y: 200,
      },
      end: {
        x: 300,
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
    setStyles({ 
      el: lineStarts[i], 
      x: l.start.x, y: l.start.y,
      deg: radToDeg(angleTo({
        a: l.start,
        b: l.end,
      })) 
    })
    l.length = distanceBetween(l.start, l.end)
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

      // const line = lineData[0]
      // const ca = capsuleData[0]
      // const x1 = line.end.x - line.start.x
      // const y1 = line.end.y - line.start.y
  
      // const x2 = ca.x - line.start.x
      // const y2 = ca.y - line.start.y

      // console.log('test', x1, y1, x2, y2)

      // setStyles({
      //   el: marker,
      //   x: x1 + x2,
      //   y: y1 + y2
      // })

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


      if (Math.abs(c.prevX - c.x)) {
        // rotate capsule
        c.deg += Math.abs(c.prevX - c.x) * 2
      }

      if (Math.abs(c.prevX - c.x) < 3 && Math.abs(c.prevY - c.y) < 3) {
        c.velocity.setXy({
          x: 0,
          y: 0,
        })
      }




      lineData.forEach(line => {
        // const capsuleToStart = distanceBetween(c, line.start)
        // const capsuleToEnd = distanceBetween(c, line.end )
        // if ((capsuleToStart + capsuleToEnd) <= line.length) {
   
        // const dot = ((c.x - line.start.x) * (line.end.x - line.start.x)) + ((c.y - line.start.y) * (line.end.y - line.start.y)) / Math.pow(line.length, 2)
        // const closestXy = {
        //   x: line.start.x + (dot * (line.end.x - line.start.x)),
        //   y: line.start.y + (dot * (line.end.y - line.start.y))
        // }
        // // const fullDistance = distanceBetween(c, closetXy)

        

        // setStyles({
        //   el: marker,
        //   x: px(closestXy.x),
        //   y: px(closestXy.y)
        // })

        // console.log('check', closestXy)
        

        // if (fullDistance < (c.radius * 2)) {
        //   // c.velocity.multiplyBy(-0.6)

        //   const overlap = fullDistance - (c.radius * 2)
        //   c.setXy(
        //     getNewPosBasedOnTarget({
        //       start: c,
        //       target: closetXy,
        //       distance: overlap / 2, 
        //       fullDistance
        //     })
        //   )
        // }
      // }

      })


      
      setStyles(capsuleData[i])
    })


  }, 30)


  // window.addEventListener('mousemove', e => {
  //   const check = {
  //     x: e.pageX - left,
  //     y: e.pageY - top
  //   }
  //   setStyles({
  //     el: marker,
  //     x: check.x,
  //     y: check.y
  //   })

  //   // if (angleTo({ a: lineData[0].start, b: check }) < 0 || angleTo({ a: lineData[0].end, b: check }) < 0) {
  //   //   marker.classList.add('hit')
  //   // } else {
  //   //   marker.classList.remove('hit')
  //   // }




    

  //   if (dotProduct({ a:lineData[0].start, b: check}) > 0 && dotProduct({ a:lineData[0].end, b: check}) > 0) {
  //     marker.classList.add('hit')
  //   } else {
  //     marker.classList.remove('hit')
  //   }
  // })


}
  
window.addEventListener('DOMContentLoaded', init)

