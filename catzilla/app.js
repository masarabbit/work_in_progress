
  function init() { 

    const elements = {
      indicator: document.querySelector('.indicator'),
      wrapper: document.querySelector('.wrapper'),
      target: document.querySelector('.target')
    }

    const px = num => `${num}px`
    
    const setStyles = ({ target, h, w, x, y, deg }) =>{
      if (isNum(w)) target.style.width = px(w)
      if (isNum(h)) target.style.height = px(h)
      if (isNum(x)) target.style.left = px(x)
      if (isNum(y)) target.style.top = px(y)
      if (isNum(deg)) target.style.transform = `rotate(${deg}deg)`
    }

    const radToDeg = rad => Math.round(rad * (180 / Math.PI))
    const isNum = x => typeof x === 'number'

    const control = {
      x: null,
      y: null,
      angle: 360,
    }

    const nearestN = (n, denom) =>{
      return n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % denom) - denom)
    }
    
    // const clickedAngle = () =>{
    //   const angle = radToDeg(Math.atan2(penguinData.pos.y - control.y, penguinData.pos.x - control.x)) - 90
    //   const adjustedAngle = angle < 0 ? angle + 360 : angle
    //   return nearestN(adjustedAngle, 45)
    // }



    elements.indicator.innerHTML = 'test'
    console.log('test')
    
    window.addEventListener('keydown', e => {
      // console.log(e.key)
      if (e.key === 'Enter') {
        const missile = document.createElement('div')
        missile.classList.add('missile')
        missile.style.transition = '1s'
        const { height, width } = elements.wrapper.getBoundingClientRect()
        const missileData = {
          deg: 0,
          x: width / 2,
          y: height - 15,
        }
        const { x, y, deg } = missileData 
        setStyles({
          target: missile,
          x, y, deg
        })
        setInterval(()=>{
          // missileData.x = missileData.x + 20
          // missileData.y = missileData.y - 10
          missileData.x = missileData.x + (control.x > (missileData.x + 40) ? 20 : -20)
          missileData.y = missileData.y + (control.y > (missileData.y - 15) ? 20 : -20)
          const angle = radToDeg(Math.atan2(missileData.y - control.y, missileData.x - control.x)) + 180
          const adjustedAngle = angle < 0 ? angle + 360 : angle
          //! maybe adjust based on current deg and new deg, and work out what the easiest way to adjust it is
          missileData.deg = adjustedAngle

          // adjust based on target?
          const { x, y, deg } = missileData 
          elements.indicator.innerHTML = `x: ${x} y: ${y} deg: ${deg}`
          setStyles({
            target: missile,
            x: x + 40, 
            y: y - 15, 
            deg
          })
        }, 10)
        elements.wrapper.append(missile)
      }
    })

    // elements.wrapper.addEventListener('click', e =>{
    //   // const target = document.createElement('div')
    //   control.x = e.clientX 
    //   control.y = e.clientY 
    //   setStyles({
    //     target: elements.target,
    //     x: control.x - 20,
    //     y: control.y - 20
    //   })
    //   console.log(e)
  
    // })

    elements.wrapper.addEventListener('mousemove', e =>{
      // const target = document.createElement('div')
      control.x = e.clientX 
      control.y = e.clientY 
      setStyles({
        target: elements.target,
        x: control.x - 20,
        y: control.y - 20
      })
      console.log(e)
  
    })
  }
  
  window.addEventListener('DOMContentLoaded', init)



