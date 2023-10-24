
function init() { 

  const elements = {
    // body: document.querySelector('.wrapper'),
    // wrapper: document.querySelector('.wrapper'),
    gachaMachine: document.querySelector('.gacha-machine')
    // indicator: document.querySelector('.indicator'),
  }

  const capsuleSeeds = new Array(2).fill('')
  const px = num => `${num}px`

  const setStyles = ({ el, x, y, deg }) =>{
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
    // el.style.zIndex = y
  }

  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.cX - b.cX), 2) + Math.pow((a.cY - b.cY), 2)))

  elements.gachaMachine.innerHTML = capsuleSeeds.map(() => {
    return `<div class="capsule pix"></div>`
  }).join('')

  const capsules = document.querySelectorAll('.capsule')

  capsules.forEach(c => {
  
  })

  const { left, top, width, height } = elements.gachaMachine.getBoundingClientRect()

  

  const capsuleData = Array.from(capsules).map((c, i) => {
    const { x, y } = c.getBoundingClientRect()

    // c.style.transition = '0s'

    const data = {
      el: c,
      deg: 0,
      x: x - left, 
      y: y - top + (i * 64),
    }
    data.cX = data.x - 32
    data.cY = data.y - 32

    return data
  })

  capsuleData.forEach(c => setStyles(c))

  setInterval(()=> {
    capsuleData.forEach((c, i) => {
      c.el.style.transition = '0.2s'
      const data = {
        ...c, 
        el: c.el,
        // deg: c.y + 10 < (height - 64)
        //       ? c.deg + 10
        //       : c.deg,
        y: c.y + 10 < (height - 64)
            ? c.y + 10 
            : c.y,
      }
      data.cX = data.x - 32
      data.cY = data.y - 32
      capsuleData[i] = data

      capsuleData.forEach((capsuleToCheck, cI) => {
        if (cI !== i) console.log(distanceBetween(c, capsuleToCheck))
        if (cI !== i && (distanceBetween(c, capsuleToCheck) < 32)) {
          // console.log('test')
          // capsuleData[i].x = capsuleData[i].x + 10
        }
      })

      // Need to check collision before updating
      setStyles(capsuleData[i])


    })
  
  }, 100)

  // setTimeout(()=>{
  //   capsuleData.forEach(c => {

  //   })
  // }, 600)
  console.log('test', capsules)

}
  
window.addEventListener('DOMContentLoaded', init)

