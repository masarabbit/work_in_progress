
function init() { 

  const elements = {
    indicator: document.querySelector('.indicator'),
    wrapper: document.querySelector('.wrapper'),
    target: document.querySelector('.target'),
    mark: document.querySelector('.mark')
  }

  let missileData = {}


  const px = num => `${num}px`
    
  const setStyles = ({ target, h, w, x, y, deg }) =>{
    if (isNum(w)) target.style.width = px(w)
    if (isNum(h)) target.style.height = px(h)
    if (isNum(x)) target.style.left = px(x)
    if (isNum(y)) target.style.top = px(y)
    if (isNum(deg)) target.style.transform = `rotate(${deg}deg)`
  }

  const overBuffer = ({ a, b, buffer }) => Math.abs(a - b) > buffer
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))
  const degToRad = deg => deg / (180 / Math.PI)
  const isNum = x => typeof x === 'number'

  const rotateCoord = ({ angle, oX, oY, x, y }) =>{
    const a = degToRad(angle)
    const aX = x - oX
    const aY = y - oY
    return {
      x: (aX * Math.cos(a)) - (aY * Math.sin(a)) + oX,
      y: (aX * Math.sin(a)) + (aY * Math.cos(a)) + oY,
    }
  }

  const control = {
    x: null,
    y: null,
    angle: 0,
  }

  const nearestN = (n, denom) =>{
    return n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % denom) - denom)
  }
    
  const adjustAngle = angle => {
    const adjustedAngle = angle % 360
    return adjustedAngle < 0 
      ? adjustedAngle + 360 
      : adjustedAngle
  }

  const clickedAngle = ({ x, y }) =>{
    if (!missileData) return
    const angle = radToDeg(Math.atan2(y - control.y, x - control.x)) - 90
    console.log('click test', x, y)
    // const adjustedAngle = angle < 0 ? angle + 360 : angle
    return adjustAngle(angle)
  }

const getDirection = ({ pos, facing, target }) =>{
  const dx2 = facing.x - pos.x
  const dy1 = pos.y - target.y
  const dx1 = target.x - pos.x
  const dy2 = pos.y - facing.y

  return dx2 * dy1 > dx1 * dy2 ? 'anti-clockwise' : 'clockwise'
}


const config = {
  'anti-clockwise': -20,
  clockwise: 20
}

  elements.indicator.innerHTML = 'test'
    
  window.addEventListener('keydown', e => {
    // console.log(e.key)
    if (e.key === 'Enter') {
      const missile = document.createElement('div')
      missile.classList.add('missile')
      missile.style.transition = '1s'
      const { height, width } = elements.wrapper.getBoundingClientRect()
      missileData = {
        deg: 0,
        // x: 0,
        pos: {
          // y: height - 30,
          y: height / 2,
          x: width / 2,
        },
        facing: {
          // y: height - 60,
          y: height / 2 - 60,
          x: width / 2,
        }
      }
      const { pos: { x, y }, deg } = missileData 
      setStyles({
        target: missile,
        x, y, deg
      })
      setStyles({
        target: elements.mark,
        x, y: y - 30
      })
      setInterval(()=>{
        // if (overBuffer({ a: missileData.pos.x, b:control.x, buffer: 10})) missileData.pos.x = missileData.pos.x + (control.x > missileData.pos.x ? 20 : -20)
        // if (overBuffer({ a: missileData.pos.y, b:control.y, buffer: 10})) missileData.pos.y = missileData.pos.y + (control.y > missileData.pos.y ? 20 : -20)

        const direction = getDirection({
          target: control,
          pos: missileData.pos,
          facing: missileData.facing,
        })

        const angle = radToDeg(Math.atan2(missileData.pos.y - control.y, missileData.pos.x - control.x)) - 90
        const adjustedAngle = adjustAngle(angle)
        const diff = Math.abs((adjustedAngle) - adjustAngle(missileData.deg))

        // TODO need logic similar to angle logic in dog
        if (diff >= 20) {
          missileData.deg = missileData.deg += config[direction]

          // const { x, y } = rotateCoord({
          //   angle: control.angle,
          //   oX: missileData.pos.x, 
          //   oY: missileData.pos.y,
          //   x: missileData.facing.x,
          //   y: missileData.facing.y,
          // })
          // console.log('test', control.angle)

          // setStyles({
          //   target: elements.mark,
          //   x, y
          // })

          // missileData.facing.x = x
          // missileData.facing.y = y
        } else {
          
          missileData.facing.x = control.x
          missileData.facing.y = control.y
    
        }

        // target
        elements.indicator.innerHTML = `targetAngle: ${adjustedAngle} | missileAngle: ${missileData.deg} |adjustedMissileAngle: ${adjustAngle(missileData.deg)} | diff: ${diff} | config: ${config[direction]} | ${direction}`

        const { pos: { x, y }, deg } = missileData 
        setStyles({
          target: missile,
          x, y, deg
        })
      }, 100)
      elements.wrapper.append(missile)
    }
  })

  elements.wrapper.addEventListener('click', e =>{
    if (!missileData.pos) return

    control.x = e.clientX - 20
    control.y = e.clientY - 20
    setStyles({
      target: elements.target,
      x: control.x,
      y: control.y
    })
    control.angle = clickedAngle({ x: missileData.pos.x, y: missileData.pos.y })
    console.log('click', clickedAngle({ x: missileData.pos.x, y: missileData.pos.y }))
  
  })
}
  
window.addEventListener('DOMContentLoaded', init)



