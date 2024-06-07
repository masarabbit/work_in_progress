
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

    const cylinder = {
      el: document.querySelector('.cylinder'),
      front: document.querySelector('.front'),
      back: document.querySelector('.back'),
      catElements: document.querySelectorAll('.cat-el'),
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

      cylinder.roll.x = newX > el.offsetLeft ? -7 : 7
      cylinder.roll.y = newY >el.offsetTop ? -7 : 7
    }

    const client = (e, type) => e.type[0] === 'm' ? e[`client${type}`] : e.touches[0][`client${type}`]
    const roundedClient = (e, type) => Math.round(client(e, type))

    const addTouchAction = el =>{
      const pos = { 
        a: { x: 0, y: 0 },
        b: { x: 0, y: 0 },
      }
      const onGrab = e =>{
        cylinder.idleCount = 4
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
        rollCylinder(e)
      }
      const onLetGo = () => {
        mouse.up(document, 'remove', onLetGo)
        mouse.move(document,'remove', onDrag)
      }
      mouse.down(el,'add', onGrab)
    }


    const rollCylinder = () => {
      const { roll } = cylinder
        // angle: -
      if (cylinder.deg % 180 === 90) {
        cylinder.y -= roll.y
        // angle: |
      } else if (cylinder.deg % 180 === 0) {
        cylinder.x -= roll.x
      } else {
        //  angle: \
        if (cylinder.deg % 180 === 135
            && (
                (roll.x < 0 && roll.y > 0) ||
                (roll.x > 0 && roll.y < 0)
              )){
                  cylinder.x -= roll.x
                  cylinder.y -= roll.y
                }
        //  angle: /
        if (cylinder.deg % 180 === 45 
          && (
              (roll.x > 0 && roll.y > 0) ||
              (roll.x < 0 && roll.y < 0)
            )){
                cylinder.x -= roll.x
                cylinder.y -= roll.y
              }
      }

      setStyles(cylinder)
      const elAngle = cylinder.deg % 180 === 90 
        ? cylinder.y % 360
        : cylinder.x % 360

      //TODO maybe this roll distance should be calulated based on pi (I think the distance is perhaps not matching because I'm not setting this properly)

      const adjustedAngle = normalisedAngle(cylinder.deg)
      cylinder.catElements.forEach(el => {
        setStyles({ el, deg: adjustedAngle > 90 && adjustedAngle <= 270  ? elAngle * -3 : elAngle * 3})
      })
    }

    const cylinderWalk = () => {
      cylinder.catElements.forEach(el => {
        setStyles({ el, deg: nearest360(cylinder.deg)})
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
    
      const distance = distanceKey[normalisedAngle(cylinder.deg)]
      let shouldSpin
      if (
        distance.x < 0 && (cylinder.x + distance.x > -xBound) || 
        distance.x > 0 && (cylinder.x + distance.x < xBound)
      ) {
        cylinder.x += distance.x
      } else {
        shouldSpin = true
      }

      if (
        distance.y < 0 && (cylinder.y + distance.y > -yBound) || 
        distance.y > 0 && (cylinder.y + distance.y < yBound)
      ) {
        cylinder.y += distance.y
      } else {
        shouldSpin = true
      }

      shouldSpin
        ? spinCat()
        : setStyles(cylinder)

    }


    const spinCat = () => {
      cylinder.deg += 45
      const adjustedAngle = normalisedAngle(cylinder.deg)

      cylinder.el.style.setProperty('--h', px(
        cylinder.deg % 180 === 90
        ? 100
        : cylinder.deg % 180 === 0
        ? 60
        : 80
      ))

      setStyles(cylinder)
      cylinder.panels.forEach(el => {
        rotateX({ el, deg: cylinder.deg })
      })

      cylinder.el.classList[
        adjustedAngle > 90 && adjustedAngle <= 270 
          ? 'add'
          : 'remove'
      ]('flip')

      // console.log(`${adjustedAngle}deg ${cylinder.deg % 180}deg`)      
    }
    

    addTouchAction(cylinder.el)
    ;[cylinder.front, cylinder.back].forEach(el => {
      el.addEventListener('click', spinCat)
    })

    setInterval(()=> {
      cylinder.idleCount -= 1

      if (cylinder.idleCount < 0) {
        cylinder.el.classList.add('walk')
        cylinderWalk()
        if (cylinder.idleCount < -10) {
          cylinder.idleCount = 4
        }
        console.log(cylinder.idleCount)
      } else {
        cylinder.el.classList.remove('walk')
      }
    }, 1000)
  }
  
  window.addEventListener('DOMContentLoaded', init)



