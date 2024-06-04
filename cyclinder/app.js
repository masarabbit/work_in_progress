
  function init() { 

    const isNum = x => typeof x === 'number'
    const px = n => `${n}px`

    const setStyles = ({ el, x, y, w, h, deg }) =>{
      if (isNum(w)) el.style.width = px(w)
      if (isNum(h)) el.style.height = px(h)
      el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
      // el.style.zIndex = y
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
      catFace: document.querySelector('.cat-face'),
      x: 0,
      y: 0,
      marker: document.querySelector('.marker')
    }


    
    cylinder.el.addEventListener('click', e => {
      // cylinder.deg += 45
      const { x, y } = cylinder.marker.getBoundingClientRect()
      // this amount should be calculated with PI in mind
      const yDiff = y < e.pageY ? 90 : -90
      const xDiff = x < e.pageX ? 90 : -90
    
      const adjustedAngle = normalisedAngle(cylinder.deg)

      if (cylinder.deg % 180 === 90) {
        cylinder.h = 100
        cylinder.y -= yDiff
    
      } else if (cylinder.deg % 180 === 0) {
        cylinder.h = 60
        cylinder.x -= xDiff
      } else {
        cylinder.h = 80
        cylinder.x -= xDiff
        cylinder.y -= yDiff
      }

      setStyles(cylinder)
      rotateX({ el: cylinder.front, deg: cylinder.deg })
      rotateX({ el: cylinder.back, deg: cylinder.deg })

      const faceAngle = cylinder.x % 360
      setStyles({ el: cylinder.catFace, deg: faceAngle * 3})

      cylinder.el.classList[
        adjustedAngle > 90 && adjustedAngle <= 270 
          ? 'add'
          : 'remove'
      ]('flip')
      
  

      document.querySelector('.indicator').innerHTML = `${adjustedAngle}deg  ${cylinder.deg % 180}deg
      `
    })
  }
  
  window.addEventListener('DOMContentLoaded', init)



