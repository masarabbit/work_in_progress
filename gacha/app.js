
function init() { 

  const elements = {
    body: document.querySelector('.wrapper'),
    gachaMachine: document.querySelector('.gacha-machine')
    // indicator: document.querySelector('.indicator'),
  }

  const capsuleSeeds = new Array(7).fill('')
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
      data.prevX = data.x
      data.x = x
      data.cX = x + 32
      data.deg =  data.deg + data.prevX > data.x ? -10 : 10
    } 
    if (y > lowerLimit && y < (elements.gachaMachine.clientHeight - upperLimit 
    )){
      if (capsuleData.some(c => c.touchEdge && c.id !== data.id && distanceBetween(c, data) < 64)) {
        data.el.classList.add('hit')
        data.touchEdge = true
        // data.y =   data.prevY
      } else {
        data.touchEdge = false
        data.el.classList.remove('hit')

        data.prevY = data.y
        data.y = y
        data.cY = data.y + 32
      }

    } else {
      data.touchEdge = true
      data.el.classList.add('hit')
    }
  }

  const { left, top, width, height } = elements.gachaMachine.getBoundingClientRect()

  const moveApart = ({ a, b, distance, fullDistance }) => {
    const { x: aX, 
      // y: aY 
    } = getNewPosBasedOnTarget({
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
      // x: x - left, 
      // y: y - top,
      id: i,
      x: x - left + randomN(500), 
      y: y - top + randomN(500), 
    }
    data.cX = data.x + 32
    data.cY = data.y + 32

    return data
  })
  

  capsuleData.forEach(c => setStyles(c))

  const updateMotion = ({ a, b }) => {
    if (capsuleData[a].y < capsuleData[b].y) {
      // console.log('test', capsuleData[a], capsuleData[b])
      const fullDistance = distanceBetween(capsuleData[a], capsuleData[b])
      const direction = capsuleData[a].cX  > capsuleData[b].cX
        ? 'right'
        : 'left'

      const directionObj = {
        right: 10,
        left: -10
      }

      // const rotateObj = {
      //   right: 10,
      //   left: -10
      // }

      // const { x: aX } = getNewPosBasedOnTarget({
      //   start: capsuleData[a],
      //   target: capsuleData[b],
      //   distance: directionObj[direction] * 10,
      //   fullDistance: 1000,
      // })

      // console.log('hit', aX)

      // checkBoundaryAndUpdatePos({
      //   x: capsuleData[a].x + directionObj[direction],
      //   data: capsuleData[a]
      // })

      moveApart({
        a, b,
        distance: directionObj[direction] * 2,
        fullDistance,
      })

      // capsuleData[a].deg = capsuleData[a].deg + rotateObj[direction]

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
        if (cI !== i && c.touchEdge && (distanceBetween(c, capsuleToCheck) < 64)) {
          updateMotion({
            a: c.id, 
            b: capsuleToCheck.id,
          })
        }
      })

      setStyles(capsuleData[i])
    })
  }, 50)


}
  
window.addEventListener('DOMContentLoaded', init)

