
function init() { 

  const settings = {
    capsuleNo: 2,
  }

  const vector = {
    x: 0,
    y: 0,
    pos: function() {
      return {
        x: this.x,
        y: this.y
      }
    },
    create: function(x, y) {
      const obj = Object.create(this)
      obj.setPos({ x, y })
      return obj
    },
    set: function(elem, n) {
      this[elem] = n
    },
    setPos: function({ x, y }) {
      this.set('x', x)
      this.set('y', y)
    },
    get: function(elem) {
      return this[elem]
    },
    setAngle: function(angle) {
      const length = this.magnitude()
      this.setPos({
        x: Math.cos(angle) * length,
        y: Math.sin(angle) * length
      })
      // this.x = Math.cos(angle) * length
      // this.y = Math.sin(angle) * length
    },
    getAngle: function() {
      return Math.atan2(this.y, this.x)
    },
    setLength: function(length) {
      const angle = this.getAngle()
      this.setPos({
        x: Math.cos(angle) * length,
        y: Math.sin(angle) * length
      })
      // this.x = Math.cos(angle) * length
      // this.y = Math.sin(angle) * length
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
  const px = num => `${num}px`
  const randomN = max => Math.ceil(Math.random() * max)
  const degToRad = deg => deg / (180 / Math.PI)

  const setStyles = ({ el, x, y, deg }) =>{
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

  elements.gachaMachine.innerHTML = capsuleSeeds.map(() => {
    return `<div class="capsule pix"></div>`
  }).join('')

  const capsules = document.querySelectorAll('.capsule')


  const { left, top, width, height } = elements.gachaMachine.getBoundingClientRect()

  // const width = window.innerWidth
  // const height = window.innerHeight


  const capsuleData = Array.from(capsules).map((c, i) => {
    // const { x, y } = c.getBoundingClientRect()

    const data = {
      ...vector,
      el: c,
      deg: 0,
      id: i,
      mass: 1,
      radius: 32,
      bounce: -0.9, // this reduces the velocity gradually
      friction: 0.97
    }

    data.velocity = data.create(0, 0)  //? velocity is another vector
    data.velocity.setLength(10)
    // data.velocity.setAngle(-Math.PI / 2)
    data.velocity.setAngle(degToRad(90))


    if (i === 0) {
      data.setPos({
        x: width / 2 + 200, 
        y: height / 2, 
      })
    } 

    if (i === 1) {
      data.setPos({
        x: width / 2, 
        y: height / 2, 
      })
    } 

    //? acceleration is another vector. 
    // this one is like gravity
    data.acceleration = data.create(0, 1)  
    // data.acceleration.setAngle(degToRad(270))
    data.accelerate = function(acceleration) {
      this.velocity.addTo(acceleration)
    }
    return data
  })


  window.addEventListener('keydown', e => {
    const dir = {
      ArrowRight: ['x', 0.1],
      ArrowLeft: ['x', -0.1],
      ArrowUp: ['y', -0.1],
      ArrowDown: ['y', 0.1]
    }
    if (dir[e.key]?.length) {
      capsuleData[0].acceleration.set(dir[e.key][0],(dir[e.key][1]))
    }
  })

  window.addEventListener('keyup', e => {
    const dir = {
      ArrowRight: ['x', 0],
      ArrowLeft: ['x', 0],
      ArrowUp: ['y', 0],
      ArrowDown: ['y', 0]
    }
    if (dir[e.key]?.length) {
      capsuleData[0].acceleration.set(dir[e.key][0],(dir[e.key][1]))
    }
  })

  const gravitateTo = ({ a, b }) => {
    const gravity = vector.create(0, 0)
    const d = distanceBetween(a, b)

    // b.mass = 20000

    gravity.setLength(b.mass / (d * d))
    gravity.setAngle(angleTo({ a, b }))
    
    a.velocity.addTo(gravity)
  }

  

  capsuleData.forEach(c => setStyles(c))


  // const getNewPosBasedOnTarget = ({ start, target, distance: d, fullDistance }) => {
  //   const { x: aX, y: aY } = start
  //   const { x: bX, y: bY } = target

  //   const remainingD = fullDistance - d
  //   return {
  //     x: Math.round(((remainingD * aX) + (d * bX)) / fullDistance),
  //     y: Math.round(((remainingD * aY) + (d * bY)) / fullDistance)
  //   }
  // }

  // const moveApart = ({ a, b, distance, fullDistance }) => {
  //   const { x: aX, y: aY } = getNewPosBasedOnTarget({
  //     start: a,
  //     target: b,
  //     distance,
  //     fullDistance,
  //   })

  //   a.setPos({
  //     x: aX,
  //     y: aY
  //   })
  // }



  setInterval(()=> {
    capsuleData.forEach((c, i) => {
      c.el.style.transition = '0.05s'

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
      if (c.get('x') + c.radius > width) {
        c.set('x', width - c.radius)
        c.velocity.set('x', c.velocity.get('x') * c.bounce)
      }
      if (c.get('x') - c.radius < 0) {
        c.set('x', c.radius)
        c.velocity.set('x', c.velocity.get('x') * c.bounce)
      }
      if (c.get('y') + c.radius > height) {
        c.set('y', height - c.radius)
        c.velocity.set('y', c.velocity.get('y') * c.bounce)
      }
      if (c.get('y') - c.radius < 0) {
        c.set('y', c.radius)
        c.velocity.set('y', c.velocity.get('y') * c.bounce)
      }

      capsuleData.forEach((c2, cI) => {
        if (c.id === cI) return

        if (distanceBetween(c, c2) < (c.radius * 2)) {
          // console.log('hit')
          // c2.acceleration.multiplyBy(-1)
          // c2.accelerate(c.acceleration)
          // console.log(c.id, c.acceleration)

          c.velocity.multiplyBy(c.bounce)
        

          // moveApart({
          //   a: c,
          //   b: c2,
          //   distance: c.x > c2.x ? -10 : 10,
          //   fullDistance: distanceBetween(c, c2)
          // })
      

        }
      })
  

      setStyles(capsuleData[i])
    })


  }, 50)


}
  
window.addEventListener('DOMContentLoaded', init)

