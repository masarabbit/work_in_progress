
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
    angle: 0,
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
        x: 0,
        y: height - 30,
        // x: width / 2,
        // y: height / 2,
      }
      const { x, y, deg } = missileData 
      setStyles({
        target: missile,
        x, y, deg
      })
      setInterval(()=>{
        // missileData.x = missileData.x + 20
        // missileData.y = missileData.y - 10
        missileData.x = missileData.x + (control.x > missileData.x ? 20 : -20)
        missileData.y = missileData.y + (control.y > missileData.y ? 20 : -20)
        const angle = radToDeg(Math.atan2(missileData.y - control.y, missileData.x - control.x)) - 90
        const adjustedAngle = angle < 0 ? angle + 360 : angle
        console.log('test', Math.abs(adjustedAngle - missileData.deg))
        // if ( )
        // TODO need some way to rotate the correct way when turning between number close to 0 and number close to 360
        // missileData.deg = Math.abs(adjustedAngle - missileData.deg) > 270 
        //   ? 360 - adjustedAngle
        //   : adjustedAngle
        missileData.deg = adjustedAngle

        // adjust based on target?
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

  elements.wrapper.addEventListener('click', e =>{
    // const target = document.createElement('div')
    control.x = e.clientX - 20
    control.y = e.clientY - 20
    setStyles({
      target: elements.target,
      x: control.x,
      y: control.y
    })
    console.log(e)
  
  })
}
  
window.addEventListener('DOMContentLoaded', init)



