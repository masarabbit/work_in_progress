
function init() { 

  const elements = {
    body: document.querySelector('.wrapper'),
    gachaMachine: document.querySelector('.gacha-machine')
    // indicator: document.querySelector('.indicator'),
  }

  const capsuleSeeds = new Array(2).fill('')
  const px = num => `${num}px`
  const randomN = max => Math.ceil(Math.random() * max)

  const setStyles = ({ el, x, y, deg }) =>{
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
    el.style.zIndex = y
  }

  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.cX - b.cX), 2) + Math.pow((a.cY - b.cY), 2)))

  elements.gachaMachine.innerHTML = capsuleSeeds.map(() => {
    return `<div class="capsule pix"></div>`
  }).join('')

  const capsules = document.querySelectorAll('.capsule')


  const getNewPosBasedOnTarget = ({ start, target, distance: d, fullDistance }) => {
    const { x: aX, y: aY } = start
    const { x: bX, y: bY } = target
    // let d = fullDistance / 2
    // if (d < 1) return { x: aX, y: aY }
    // d = d * -1

    const remainingD = fullDistance - d
    return {
      x: Math.round(((remainingD * aX) + (d * bX)) / fullDistance),
      y: Math.round(((remainingD * aY) + (d * bY)) / fullDistance)
    }
  }

  const checkBoundaryAndUpdatePos = ({ x, y, data }) =>{
    const lowerLimit = 0
    const upperLimit = 64

    if (x > lowerLimit && x < (elements.gachaMachine.clientWidth - upperLimit)){
      data.x = x
      data.cX = x + 32
    } 
    if (y > lowerLimit && y < (elements.gachaMachine.clientHeight - upperLimit 
    //   && 
    //   !capsuleData.some(c => {
    //   return c.id !== data.id && distanceBetween(c, data) < 64
    // })
    )){
      data.prevY = data.y
      data.y = y
      data.cY = y + 32
    }
  }

  const { left, top, width, height } = elements.gachaMachine.getBoundingClientRect()

  const moveApart = ({ a, b, distance, fullDistance }) => {
    const { x: aX, y: aY } = getNewPosBasedOnTarget({
      start: capsuleData[a],
      target: capsuleData[b],
      distance,
      fullDistance,
    })

    checkBoundaryAndUpdatePos({
      x: aX, 
      // y: aY,
      data: capsuleData[a]
    })
  }

  

  const capsuleData = Array.from(capsules).map((c, i) => {
    const { x, y } = c.getBoundingClientRect()

    const data = {
      el: c,
      deg: 0,
      x: x - left, 
      // y: y - top,
      id: i,
      // x: x - left + i * 40, 
      y: y - top + i * 100, 
    }
    data.cX = data.x + 32
    data.cY = data.y + 32

    return data
  })
  

  capsuleData.forEach(c => setStyles(c))

  const updateMotion = ({ a, b }) => {
    if (capsuleData[a].cY > capsuleData[b].cY) {
      const fullDistance = distanceBetween(capsuleData[a], capsuleData[b])
      const direction = capsuleData[a].cX + (randomN(10))> capsuleData[b].cX + (randomN(10))
        ? 'right'
        : 'left'

      const directionObj = {
        right: -10,
        left: 10
      }

      const rotateObj = {
        right: 10,
        left: -10
      }

      const { x: aX } = getNewPosBasedOnTarget({
        start: capsuleData[a],
        target: capsuleData[b],
        distance: directionObj[direction],
        fullDistance,
      })

      checkBoundaryAndUpdatePos({
        x: aX,
        y: fullDistance < 65 ? capsuleData[a].prevY : capsuleData[a].y,
        data: capsuleData[a]
      })

      capsuleData[a].deg = capsuleData[a].deg + rotateObj[direction]

      if (fullDistance < 32) {
        console.log('test')
        moveApart({
          a, b,
          distance: directionObj[direction],
          fullDistance,
        })
      }
    }
  }


  setInterval(()=> {
    capsuleData.forEach((c, i) => {
      c.el.style.transition = '0.2s'

      checkBoundaryAndUpdatePos({
        y: c.y + 10,
        data: capsuleData[i]
      })
      // capsuleData[i].cX = capsuleData[i].x + 32
      // capsuleData[i].cY = capsuleData[i].y + 32

      capsuleData.forEach((capsuleToCheck, cI) => {
        if (cI !== i && (distanceBetween(c, capsuleToCheck) < 64)) {
          updateMotion({
            a: c.id, 
            b: capsuleToCheck.id,
          })
        }
      })

      setStyles(capsuleData[i])
    })
  }, 100)


}
  
window.addEventListener('DOMContentLoaded', init)

