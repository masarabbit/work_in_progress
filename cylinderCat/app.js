
  function init() { 
    const px = n => `${n}px`

    const setStyles = ({ el, x, y, deg }) =>{
      el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
    }

    const nearest360 = n =>{
      return n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % 360) - 360)
    }

    const normalisedAngle = deg => {
      return deg % 360
    }

    const rotateX = ({ el, deg }) => {
      el.style.transform = `rotateX(${deg}deg) rotateZ(-${deg}deg)`
    }

    const addEvents = (target, event, action, array) => {
      array.forEach(a => event === 'remove' ? target.removeEventListener(a, action) : target.addEventListener(a, action))
    }

    const mouse = {
      up: (t, e, a) => addEvents(t, e, a, ['mouseup', 'touchend']),
      move: (t, e, a) => addEvents(t, e, a, ['mousemove', 'touchmove']),
      down: (t, e, a) => addEvents(t, e, a, ['mousedown', 'touchstart']),
      enter: (t, e, a) => addEvents(t, e, a, ['mouseenter', 'touchstart']),
      leave: (t, e, a) => addEvents(t, e, a, ['mouseleave'])
    }

    const wrapper = document.querySelector('.wrapper')

    const cat = {
      el: document.querySelector('.cat'),
      front: document.querySelector('.front'),
      back: document.querySelector('.back'),
      images: document.querySelectorAll('.img'),
      panels: document.querySelectorAll('.panel'),
      deg: 0,
      x: 0,
      y: 0,
      roll: {
        x: 0,
        y: 0,
      },
      isWalking: false,
      idleCount: 4,
    }

    const drag = (el, pos, x, y) =>{
      pos.a.x = pos.b.x - x
      pos.a.y = pos.b.y - y
      const newX = el.offsetLeft - pos.a.x
      const newY = el.offsetTop - pos.a.y
      const rollD = 7
      cat.roll.x = newX > el.offsetLeft ? -rollD : rollD
      cat.roll.y = newY >el.offsetTop ? -rollD : rollD
    }

    const client = (e, type) => e.type[0] === 'm' ? e[`client${type}`] : e.touches[0][`client${type}`]
    const roundedClient = (e, type) => Math.round(client(e, type))

    const addTouchAction = el =>{
      const pos = { 
        a: { x: 0, y: 0 },
        b: { x: 0, y: 0 },
      }
      const onGrab = e =>{
        cat.idleCount = 4
        pos.b.x = roundedClient(e, 'X')
        pos.b.y = roundedClient(e, 'Y')  
        mouse.up(document, 'add', onLetGo)
        mouse.move(document, 'add', onDrag)
      }
      const onDrag = e =>{
        const x = roundedClient(e, 'X')
        const y = roundedClient(e, 'Y')
        drag(el, pos, x, y)
        pos.b.x = x
        pos.b.y = y
        roll(e)
      }
      const onLetGo = () => {
        mouse.up(document, 'remove', onLetGo)
        mouse.move(document,'remove', onDrag)
      }
      mouse.down(el,'add', onGrab)
    }


    const roll = () => {
      const { roll } = cat
        // angle: -
      if (cat.deg % 180 === 90) {
        cat.y -= roll.y
        // angle: |
      } else if (cat.deg % 180 === 0) {
        cat.x -= roll.x
      } else {
        //  angle: \
        if (cat.deg % 180 === 135
            && (
                (roll.x < 0 && roll.y > 0) ||
                (roll.x > 0 && roll.y < 0)
              )){
                  cat.x -= roll.x
                  cat.y -= roll.y
                }
        //  angle: /
        if (cat.deg % 180 === 45 
          && (
              (roll.x > 0 && roll.y > 0) ||
              (roll.x < 0 && roll.y < 0)
            )){
                cat.x -= roll.x
                cat.y -= roll.y
              }
      }

      setStyles(cat)
      const elAngle = cat.deg % 180 === 90 
        ? cat.y % 360
        : cat.x % 360

      const adjustedAngle = normalisedAngle(cat.deg)
      cat.images.forEach(el => {
        setStyles({ el, deg: adjustedAngle > 90 && adjustedAngle <= 270  ? elAngle * -3 : elAngle * 3})
      })
    }

    const walk = () => {
      cat.images.forEach(el => {
        setStyles({ el, deg: nearest360(cat.deg)})
      })
      const d = 20
      const distanceKey = {
        0: { x: 0, y: d },
        45: { x: -d, y: d },
        90: { x: -d, y: 0 },
        135: { x: -d, y: -d },
        180: { x: 0, y: -d },
        225: { x: d, y: -d },
        270: { x: d, y: 0 },
        315: { x: d, y: d },
      }

      const { width, height } = wrapper.getBoundingClientRect()
      const xBound = (width / 2) - 100
      const yBound = (height / 2) - 100
    
      const distance = distanceKey[normalisedAngle(cat.deg)]
      let shouldSpin
      if (
        distance.x < 0 && (cat.x + distance.x > -xBound) || 
        distance.x > 0 && (cat.x + distance.x < xBound)
      ) {
        cat.x += distance.x
      } else {
        shouldSpin = true
      }

      if (
        distance.y < 0 && (cat.y + distance.y > -yBound) || 
        distance.y > 0 && (cat.y + distance.y < yBound)
      ) {
        cat.y += distance.y
      } else {
        shouldSpin = true
      }

      shouldSpin
        ? spinCat()
        : setStyles(cat)

    }


    const spinCat = () => {
      cat.deg += 45
      const adjustedAngle = normalisedAngle(cat.deg)

      cat.el.style.setProperty('--h', px(
        cat.deg % 180 === 90
        ? 100
        : cat.deg % 180 === 0
        ? 60
        : 80
      ))

      setStyles(cat)
      cat.panels.forEach(el => {
        rotateX({ el, deg: cat.deg })
      })

      cat.el.classList[
        adjustedAngle > 90 && adjustedAngle <= 270 
          ? 'add'
          : 'remove'
      ]('flip')

      // console.log(`${adjustedAngle}deg ${cat.deg % 180}deg`)      
    }
    
    addTouchAction(cat.el)
    ;[cat.front, cat.back].forEach(el => {
      el.addEventListener('click', spinCat)
    })

    setInterval(()=> {
      cat.idleCount -= 1
      if (cat.idleCount < 0) {
        cat.el.classList.add('walk')
        walk()
        if (cat.idleCount < -10) {
          cat.idleCount = 4
        }
        // console.log(cat.idleCount)
      } else {
        cat.el.classList.remove('walk')
      }
    }, 1000)
  }
  
  window.addEventListener('DOMContentLoaded', init)



