function init() {  

  const circleData = {
    angle: 0,
    interval: null,
    key: null,
  }
  const config = {
    'l': 10,
    'r': -10,
    'u': 0,
    'd': 0,
  }

  const bearData = {
    animationTimer: ['',''],
    sprite: null,
    frameOffset: 0
  }

  const cellD = 32
  const circle = document.querySelector('.circle')
  const circleWrapper = document.querySelector('.circle_wrapper')
  const elements = ['navy', 'black', 'white','navy', 'black', 'white','navy', 'black', 'white']
  const placeElements = elements =>{
    elements.forEach((ele, i)=>{
      const element = document.createElement('div')
      element.style.backgroundColor = ele
      element.classList.add('element')
      circle.append(element)
      setTimeout(()=>{
        element.style.transform = `translate(${200 - (50 / 2)}px, -${55}px) rotate(${i * 30}deg)`
      }, 1000)
      element.innerHTML = i
      element.style.transformOrigin = `center ${200 + 55}px`
    })
  }



  const setSpritePos = (num, actor, sprite) =>{
    actor.spritePos = num
    // this can't be set with translate, because translate is used to flip sprites too.
    sprite.style.marginLeft = `${num}px`
  }
  
  const turnSprite = ({ e, actor, animate }) => {
    const dir = e
    const { sprite, frameOffset } = bearData
    const frames = {
      r: [4, 6, 5, 'add'],
      l: [4, 6, 5,'remove'],
      u: [2, 2, 3,'toggle'],
      d: [0, 0, 1, 'toggle']
    }
    let m = -cellD
    m = animate ? m * frames[dir][0 + frameOffset] : m * frames[dir][2]
    bearData.frameOffset = frameOffset === 0 ? 1 : 0
    sprite.parentNode.classList[frames[dir][3]]('right') 
    actor.animationTimer.forEach(timer=> clearTimeout(timer))
    setSpritePos(m, actor, sprite)
  }

  const handleKey = e =>{
    const key = e.key.replace('Arrow','').toLowerCase()[0]
    if (circleData.key !== key){
      clearInterval(circleData.interval)
      circleData.key = key
      circleData.interval = setInterval(()=>{
        if (!circleData.key) {
          clearInterval(circleData.interval)
        } else {
          circleData.angle += config[key]
          circle.style.transform = `rotate(${circleData.angle}deg)`
          turnSprite({ e:circleData.key, actor: bearData, animate: true})
        }
      }, 100)
    }
  }

  const placeBear = () =>{
    const bear = document.createElement('div')
    bear.classList.add('bear_wrapper')
    circleWrapper.append(bear)
    bear.innerHTML = '<div><div class="bear"></div></div>'
    bear.style.transform = `translate(0, ${-200 - 10}px)`
    bearData.sprite = bear.childNodes[0].childNodes[0]
  }


  
  placeElements(elements)
  placeBear()

  window.addEventListener('keydown', e => handleKey(e))
  window.addEventListener('keyup', ()=> {
    turnSprite({ e:circleData.key, actor: bearData })
    circleData.key = null
  })

}

window.addEventListener('DOMContentLoaded', init)



