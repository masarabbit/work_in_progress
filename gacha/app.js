
function init() { 

  const elements = {
    body: document.querySelector('.wrapper'),
    // wrapper: document.querySelector('.wrapper'),
    gachaMachine: document.querySelector('.gacha-machine')
    // indicator: document.querySelector('.indicator'),
  }

  const capsuleSeeds = new Array(4).fill('')
  const px = num => `${num}px`

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
      data.x = x
    } 
    if (y > lowerLimit && y < (elements.gachaMachine.clientHeight - upperLimit)){
      data.y = y
    }
  }

  const { left, top, width, height } = elements.gachaMachine.getBoundingClientRect()

  

  const capsuleData = Array.from(capsules).map((c, i) => {
    const { x, y } = c.getBoundingClientRect()

    // c.style.transition = '0s'

    const data = {
      el: c,
      deg: 0,
      x: x - left, 
      y: y - top,
      id: i
      // x: x - left + i * 200, 
      // y: y - top + i * 200, 
    }
    data.cX = data.x - 32
    data.cY = data.y - 32

    return data
  })
  

  capsuleData.forEach(c => setStyles(c))

  const moveApart = ({ a, b, distance }) => {
    const fullDistance = distanceBetween(capsuleData[a], capsuleData[b])

    const { x: aX, y: aY } = getNewPosBasedOnTarget({
      start: capsuleData[a],
      target: capsuleData[b],
      distance,
      fullDistance,
    })

    checkBoundaryAndUpdatePos({
      x: aX, y: aY,
      data: capsuleData[a]
    })
  
    const { x: bX, y: bY } = getNewPosBasedOnTarget({
      start: capsuleData[b],
      target: capsuleData[a],
      distance,
      fullDistance,
    })

    checkBoundaryAndUpdatePos({
      x: bX, y: bY,
      data: capsuleData[b]
    })
  }


  setInterval(()=> {
    capsuleData.forEach((c, i) => {
      c.el.style.transition = '0.2s'

      checkBoundaryAndUpdatePos({
        x: c.x + 2, // TODO if I could set these according to gravity and velocity, then this would be work
        // TODO or, adjust this based on where and how the capsules hit each other
        y: c.y + 10,
        data: capsuleData[i]
      })
      capsuleData[i].cX = capsuleData[i].x - 32
      capsuleData[i].cY = capsuleData[i].y - 32
      capsuleData[i].deg = capsuleData[i].deg + 10

      capsuleData.forEach((capsuleToCheck, cI) => {
        // if (cI !== i) console.log(distanceBetween(c, capsuleToCheck))
        if (cI !== i && (distanceBetween(c, capsuleToCheck) < 64)) {
          // console.log('hit')
          moveApart({
            a: c.id, 
            b: capsuleToCheck.id,
            distance: -16
          })
        }
      })

      setStyles(capsuleData[i])
    })
  }, 100)

  console.log('test', capsuleData)

}
  
window.addEventListener('DOMContentLoaded', init)

