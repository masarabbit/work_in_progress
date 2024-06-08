
  function init() { 
    const px = n => `${n}px`

    const setStyles = ({ el, x, y, deg }) =>{
      el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
    }

    const nearest360 = deg =>{
      const nearestN = n => (n - 1) + Math.abs(((n - 1) % 360) - 360)
      if (deg < 0) {
        return -nearestN(deg * -1)
      }
      return deg === 0 ? 0 : nearestN(deg)
    }

    const moduloN = (deg, n) => {
      if (deg < 0) {
        return (deg % n) + n
      }
      return deg % n
    }

    const rotateX = ({ el, deg }) => {
      const zKey = {
        0: -deg,
        45: -deg,
        90: -deg,
        135: -deg + 90,
        180: -deg + 180,
        225: -deg - 90,
        270: -deg,
        315: -deg,
        360: -deg
      }
      el.style.transform = `rotateX(${deg}deg) rotateZ(${zKey[moduloN(deg, 360)]}deg)`
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
      images: {
        els: document.querySelectorAll('.img'),
        deg: 0
      },
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
      spinDeg: 45
    }

    const drag = (el, pos, x, y) =>{
      pos.a.x = pos.b.x - x
      pos.a.y = pos.b.y - y
      const newX = el.offsetLeft - pos.a.x
      const newY = el.offsetTop - pos.a.y
      const rollD = 7
      cat.roll.x = newX > el.offsetLeft ? -rollD : rollD
      cat.roll.y = newY > el.offsetTop ? -rollD : rollD
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

    const rollCatImage = () => {
      cat.images.els.forEach(el => setStyles({ el, deg: cat.images.deg }))
    }

    const getBound = () => {
      const { width, height } = wrapper.getBoundingClientRect()
      return {
        x: (width / 2) - 100,
        y: (height / 2) - 100
      }
    }

    const isOutsideBound = () => {
      const bound = getBound()

      return  cat.x < -bound.x || 
              cat.x > bound.x ||
              cat.y > bound.y ||
              cat.y < -bound.y
    }

    const roll = () => {
      const { roll } = cat
        // angle: -
      if (moduloN(cat.deg, 180) === 90) {
        cat.y -= roll.y
        // angle: |
      } else if (moduloN(cat.deg, 180) === 0) {
        cat.x -= roll.x
      } else {
        //  angle: \
        if (moduloN(cat.deg, 180) === 135
            && (
                (roll.x < 0 && roll.y > 0) ||
                (roll.x > 0 && roll.y < 0)
              )){
                  cat.x -= roll.x
                  cat.y -= roll.y
                }
        //  angle: /
        if (moduloN(cat.deg, 180) === 45 
          && (
              (roll.x > 0 && roll.y > 0) ||
              (roll.x < 0 && roll.y < 0)
            )){
                cat.x -= roll.x
                cat.y -= roll.y
              }
      }

      setStyles(cat)
      const diff = moduloN(cat.deg, 180) === 90 
        ? roll.y * 3
        : roll.x * 3

      const normalisedAngle = moduloN(cat.deg, 360)
      cat.images.deg += normalisedAngle > 90 && normalisedAngle <= 270  ? diff : -diff
      rollCatImage()
    }

    const walk = () => {
      cat.images.deg = nearest360(cat.images.deg)
      rollCatImage()

      const d = isOutsideBound() ? 60: 20 
      const distanceKey = {
        0: { x: 0, y: d },
        45: { x: -d, y: d },
        90: { x: -d, y: 0 },
        135: { x: -d, y: -d },
        180: { x: 0, y: -d },
        225: { x: d, y: -d },
        270: { x: d, y: 0 },
        315: { x: d, y: d },
        360: { x: 0, y: d },
      }

      const bound = getBound()
      const distance = distanceKey[moduloN(cat.deg, 360)]
      let shouldSpin
      if (
        distance.x < 0 && (cat.x + distance.x > -bound.x) || 
        distance.x > 0 && (cat.x + distance.x < bound.x)
      ) {
        cat.x += distance.x
      } else {
        shouldSpin = true
      }

      if (
        distance.y < 0 && (cat.y + distance.y > -bound.y) || 
        distance.y > 0 && (cat.y + distance.y < bound.y)
      ) {
        cat.y += distance.y
      } else {
        shouldSpin = true
      }

      shouldSpin
        ? spin()
        : setStyles(cat)
    }


    const spin = () => {
      cat.deg += cat.spinDeg
      cat.el.style.setProperty('--h', px(
        moduloN(cat.deg, 180) === 90
        ? 100
        : moduloN(cat.deg, 180) === 0
        ? 60
        : 80
      ))

      setStyles(cat)
      cat.panels.forEach(el => {
        rotateX({ el, deg: cat.deg })
      })

      const normalisedAngle = moduloN(cat.deg, 360)
      let action

      if (cat.spinDeg === 45) {
        action = normalisedAngle > 90 && normalisedAngle <= 270
          ? 'add'
          : 'remove'
      } else {
        action = normalisedAngle >= 90 && normalisedAngle < 270
          ? 'add'
          : 'remove'
      }
      cat.el.classList[action]('flip')  
      // console.log(`${normalisedAngle}deg ${moduloN(cat.deg, 180)}deg`)      
    }
    
    addTouchAction(cat.el)
    ;[cat.front, cat.back].forEach(el => {
      el.addEventListener('click', spin)
    })

    setInterval(()=> {
      cat.idleCount = isOutsideBound() ? -1 : cat.idleCount - 1

      if (cat.idleCount < 0) {
        cat.el.classList.add('walk')
        walk()
        if (cat.idleCount < -10) {
          cat.spinDeg *= -1
          // console.log(cat.spinDeg)
          cat.idleCount = 4
        }
        // console.log(cat.idleCount)
      } else {
        cat.el.classList.remove('walk')
      }
      
    }, 1000)

    // cat.el.addEventListener('click', ()=> {
    //   console.log(cat.deg, cat.spinDeg)
    //   spin()
    //   document.querySelector('.indicator').innerHTML = JSON.stringify(cat)
    // })

    // window.addEventListener('keydown' , e=> {
    //   if (e.key === ' ') {
    //     cat.spinDeg *= -1
    //   }
    // })

  }
  
  window.addEventListener('DOMContentLoaded', init)



