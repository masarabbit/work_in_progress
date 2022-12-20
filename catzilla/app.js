
  function init() { 

    const elements = {
      indicator: document.querySelector('.indicator'),
      wrapper: document.querySelector('.wrapper')
    }

    const px = num => `${num}px`
    
    const setStyles = ({ target, h, w, x, y, deg }) =>{
      if (isNum(w)) target.style.width = px(w)
      if (isNum(h)) target.style.height = px(h)
      if (isNum(x)) target.style.left = px(x)
      if (isNum(y)) target.style.top = px(y)
      if (isNum(deg)) target.style.transform = `rotate(${deg}deg)`
    }


    const isNum = x => typeof x === 'number'

    elements.indicator.innerHTML = 'test'
    console.log('test')
    
    window.addEventListener('keydown', e => {
      console.log(e.key)
      if (e.key === 'Enter') {
        const missile = document.createElement('div')
        missile.classList.add('missile')
        missile.style.transition = '1s'
        const { height, width } = elements.wrapper.getBoundingClientRect()
        console.log(height, width)
        const missileData = {
          deg: -45,
          x: 0,
          y: height - 30,
        }
        const { x, y, deg } = missileData 
        setStyles({
          target: missile,
          x, y, deg
        })
        setInterval(()=>{
          missileData.x = missileData.x + 20
          missileData.y = missileData.y - 10
          missileData.deg = missileData.deg - 5
          const { x, y, deg } = missileData 
          elements.indicator.innerHTML = `x: ${x} y: ${y} deg: ${deg}`
          setStyles({
            target: missile,
            x, y, deg
          })
        }, 100)
        elements.wrapper.append(missile)
      }
    })
  }
  
  window.addEventListener('DOMContentLoaded', init)



