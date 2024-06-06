
  function init() { 

    const isNum = x => typeof x === 'number'
    const px = n => `${n}px`

    const setStyles = ({ el, x, y, w, h, deg }) =>{
      if (isNum(w)) el.style.width = px(w)
      if (isNum(h)) el.style.height = px(h)
      el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
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

    const normalisedAngle = deg => {
      return deg % 360
    }

    const rotateX = ({ el, deg }) => {
      el.style.transform = `rotateX(${deg}deg) rotateZ(-${deg}deg)`
    }
  
    const cylinder = {
      el: document.querySelector('.cylinder'),
      deg: 0,
      front: document.querySelector('.front'),
      back: document.querySelector('.back'),
      catElements: document.querySelectorAll('.cat-el'),
      x: 0,
      y: 0,
      panels: document.querySelectorAll('.panel'),
      roll: {
        x: 0,
        y: 0,
      }
    }

    const drag = (el, pos, x, y) =>{
      pos.a = pos.c - x
      pos.b = pos.d - y
      const newX = el.offsetLeft - pos.a
      const newY = el.offsetTop - pos.b

      cylinder.roll.x = newX > el.offsetLeft ? -4 : 4
      cylinder.roll.y = newY >el.offsetTop ? -4 : 4
    }

    const client = (e, type) => e.type[0] === 'm' ? e[`client${type}`] : e.touches[0][`client${type}`]
    const roundedClient = (e, type) => Math.round(client(e, type))

    const addTouchAction = el =>{
      const pos = { a: 0, b: 0, c: 0, d: 0 }
      
      const onGrab = e =>{
        pos.c = roundedClient(e, 'X')
        pos.d = roundedClient(e, 'Y')  
        mouse.up(document, 'add', onLetGo)
        mouse.move(document, 'add', onDrag)
      }
      const onDrag = e =>{
        const x = roundedClient(e, 'X')
        const y = roundedClient(e, 'Y')
        drag(el, pos, x, y)
        pos.c = x
        pos.d = y
        moveCylinder(e)
      }
      const onLetGo = () => {
        mouse.up(document, 'remove', onLetGo)
        mouse.move(document,'remove', onDrag)
      }
      mouse.down(el,'add', onGrab)
    }


    const moveCylinder = () => {
      console.log('moveCylinder')

    
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

      const adjustedAngle = normalisedAngle(cylinder.deg)
      cylinder.catElements.forEach(el => {
        setStyles({ el, deg: adjustedAngle > 90 && adjustedAngle <= 270  ? elAngle * -3 : elAngle * 3})
      })

    }

    addTouchAction(cylinder.el)

    const spinCat = () => {
      cylinder.deg += 45
      const adjustedAngle = normalisedAngle(cylinder.deg)

      if (cylinder.deg % 180 === 90) {
        cylinder.h = 100
      } else if (cylinder.deg % 180 === 0) {
        cylinder.h = 60
      } else {
        cylinder.h = 80
      }
      setStyles(cylinder)
      cylinder.panels.forEach(el => {
        rotateX({ el, deg: cylinder.deg })
      })

      cylinder.el.classList[
        adjustedAngle > 90 && adjustedAngle <= 270 
          ? 'add'
          : 'remove'
      ]('flip')

      document.querySelector('.indicator').innerHTML = `${adjustedAngle}deg  ${cylinder.deg % 180}deg
      `
    }
    
    ;[cylinder.front, cylinder.back].forEach(el => {
      el.addEventListener('click', spinCat)
    })
    document.querySelector('button').addEventListener('click', spinCat)
  }
  
  window.addEventListener('DOMContentLoaded', init)



