
  function init() { 

    const isNum = x => typeof x === 'number'
    const px = n => `${n}px`

    const setStyles = ({ el, x, y, w, h, deg }) =>{
      if (isNum(w)) el.style.width = px(w)
      if (isNum(h)) el.style.height = px(h)
      el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
      // el.style.zIndex = y
    }

    const rotateX = ({ el, deg }) => {
      el.style.transform = `rotateX(${deg}deg)`
    }
  
    const cylinder = {
      el: document.querySelector('.cylinder'),
      deg: 0,
      front: document.querySelector('.front'),
      back: document.querySelector('.back'),
    }

    const normalisedAngle = deg => {
      return deg % 360
    }
    
    cylinder.el.addEventListener('click', ()=> {
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
      rotateX({ el: cylinder.front, deg: cylinder.deg })
      rotateX({ el: cylinder.back, deg: cylinder.deg })

      cylinder.el.classList[
        adjustedAngle > 90 && adjustedAngle <= 270 
          ? 'add'
          : 'remove'
      ]('flip')


      document.querySelector('.indicator').innerHTML = `${adjustedAngle}deg  ${cylinder.deg % 180}deg`
    })
  }
  
  window.addEventListener('DOMContentLoaded', init)



