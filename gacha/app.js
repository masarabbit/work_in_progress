
function init() { 

  const settings = {
    capsuleNo: 1,
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
    },
    magnitude: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    },
    add: function(v2) {
      return vector.create(this.x + v2.get('x'), this.y + v2.get('y'))
    },
    subtract: function(v2) {
      return vector.create(this.x - v2.get('x'), this.y - v2.get('y'))
    },
    multiply: function(n) {
      return vector.create(this.x * n, this.y * n)
    },
    divide: function(n) {
      return vector.create(this.x / n, this.y / n)
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

  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))

  elements.gachaMachine.innerHTML = capsuleSeeds.map(() => {
    return `<div class="capsule pix"></div>`
  }).join('')

  const capsules = document.querySelectorAll('.capsule')


  const { left, top, width, height } = elements.gachaMachine.getBoundingClientRect()


  const capsuleData = Array.from(capsules).map((c, i) => {
    const { x, y } = c.getBoundingClientRect()

    const offset = 32

    const data = {
      ...vector,
      el: c,
      deg: 0,
      id: i,
    }
    data.setPos({
      x: x - left + offset, 
      y: y - top + offset,
    })
    // data.setPos({
    //   x: x - left + randomN(300), 
    //   y: y - top + randomN(200), 
    // })
    data.velocity = data.create(0, 0)
    data.velocity.setLength(2)
    data.velocity.setAngle(degToRad(90))
    // console.log(data.velocity.get('x'))

    return data
  })


  

  capsuleData.forEach(c => setStyles(c))


  const collisionDamper = 0.5

  setInterval(()=> {
    capsuleData.forEach((c, i) => {
      c.el.style.transition = '0.2s'

      // // checkBoundaryAndUpdatePos({
      // //   y: c.y + 10,
      // //   data: capsuleData[i]
      // // })

      // let newY = c.y + 10

      // if (newY > (height - 64)) {
      //   newY -= 50
      // }

      // capsuleData[i].y = newY

      c.addTo(c.velocity)


      // capsuleData.forEach((capsuleToCheck, cI) => {
      //   if (cI !== i && c.touchEdge && (distanceBetween(c, capsuleToCheck) < 64)) {
      //     updateMotion({
      //       a: c.id, 
      //       b: capsuleToCheck.id,
      //     })
      //   }
      // })

      setStyles(capsuleData[i])
    })
  }, 100)


}
  
window.addEventListener('DOMContentLoaded', init)

