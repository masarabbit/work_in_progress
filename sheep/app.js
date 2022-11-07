function init() {  
  const svgs = {
    sheep: '<path fill="#fff" d="M 107 1 h 3 v 1 h 1 v -1 h 4 v 1 h 4 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 2 h -1 v 2 h -1 v 2 h -2 v -1 h -2 v 1 h -1 v 1 h -7 v -1 h -1 v -1 h -4 v -3 h 2 v -2 h -3 v -1 h -1 v -2 h 1 v -1 h 2 v -1 h 1 v -1"/> <path fill="#fff" d="M 11 2 h 3 v 1 h 2 v -1 h 5 v 1 h 4 v 1 h 1 v 3 h 1 v 6 h -2 v 1 h -1 v 2 h -2 v 1 h -4 v 1 h -3 v -1 h -3 v -2 h -4 v -1 h -3 v -1 h 2 v -1 h 1 v -1 h 1 v -2 h 2 v -2 h -3 v -1 h -1 v -2 h 3 v -1 h 1 v -1"/> <path fill="#fff" d="M 48 2 h 2 v 1 h 5 v 2 h 2 v 1 h 1 v 7 h -3 v 1 h -1 v 1 h -1 v 1 h -7 v -1 h -8 v -1 h 2 v -1 h 1 v -2 h 1 v -1 h 1 v -2 h -2 v 1 h -1 v -1 h -2 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 6 v -1"/> <path fill="#fff" d="M 78 2 h 4 v 1 h 1 v -1 h 4 v 1 h 1 v 2 h 2 v 2 h 1 v 4 h -1 v 2 h -4 v 1 h -1 v 1 h -1 v 1 h -4 v 1 h -2 v -1 h -1 v -1 h -4 v 1 h -2 v -1 h 1 v -1 h 1 v -1 h 3 v -2 h -1 v -1 h -5 v -3 h 1 v -1 h 2 v -2 h 1 v -1 h 2 v 1 h 1 v -1 h 1 v -1"/> <path fill="#000" d="M 4 6 h 4 v 1 h 3 v 2 h -2 v 2 h -1 v 1 h -1 v 1 h -5 v -1 h -1 v -2 h 1 v -2 h 1 v -1 h 1 v -1"/> <path fill="#000" d="M 99 6 h 5 v 1 h 3 v 2 h -2 v 3 h 4 v 3 h -1 v 1 h -1 v 1 h -2 v 1 h -2 v -1 h -1 v -2 h -2 v -3 h 1 v -1 h -3 v -1 h -1 v -1 h 1 v -2 h 1 v -1"/> <path fill="#000" d="M 36 8 h 4 v 1 h 1 v -1 h 2 v 2 h -1 v 1 h -1 v 2 h -1 v 1 h -2 v 1 h -4 v -1 h -1 v -2 h 1 v -2 h 1 v -1 h 1 v -1"/> <path fill="#000" d="M 69 10 h 6 v 1 h 1 v 2 h -3 v 1 h -1 v 1 h -1 v 1 h -4 v -1 h -1 v -2 h 1 v -1 h 1 v -1 h 1 v -1"/> <path fill="#000" d="M 27 12 h 3 v 1 h 1 v 2 h -2 v 3 h -1 v 1 h -1 v -1 h -2 v -1 h -1 v -3 h 1 v -1 h 2 v -1"/> <path fill="#000" d="M 118 12 h 2 v 1 h 1 v 1 h 1 v 5 h -4 v -1 h -1 v -1 h -1 v -3 h 1 v -1 h 1 v -1"/> <path fill="#000" d="M 55 13 h 4 v 1 h 1 v 2 h -1 v 1 h -1 v 2 h -2 v -1 h -1 v -1 h -1 v -3 h 1 v -1"/> <path fill="#000" d="M 86 13 h 3 v 3 h -1 v 2 h -1 v 1 h -3 v -1 h -1 v -2 h 1 v -1 h 1 v -1 h 1 v -1"/> <path fill="#fefefe" d="M 109 13 h 1 v 1 h -1 v -1"/> <path fill="#000" d="M 5 14 h 3 v 1 h 4 v 3 h -1 v 1 h -1 v 1 h -3 v -2 h -3 v -2 h 1 v -2"/> <path fill="#000" d="M 38 15 h 3 v 1 h 1 v -1 h 4 v 1 h -1 v 2 h -1 v 3 h -3 v -1 h -2 v 1 h -1 v -1 h -1 v -3 h 1 v -2"/> <path fill="#000" d="M 73 15 h 4 v 1 h 1 v 2 h 1 v 1 h 1 v 1 h -1 v 1 h -3 v -1 h -1 v 1 h -2 v -1 h -1 v -4 h 1 v -1"/>'
  }


  
  const elements = {
    wrapper: document.querySelector('.wrapper'),
    sheepRoute: document.querySelector('.sheep-route'),
    indicator: document.querySelector('.indicator')
  }
  
  let sheepCount = -1
  const sheepData = []


  const isNum = x => typeof x === 'number'
  const px = num => `${num}px`

  const setStyles = ({ target, h, w, x, y, deg }) =>{
    if (h) target.style.height = h
    if (w) target.style.width = w
    if (y) target.style.top = y
    if (x) target.style.left = x
    if (isNum(deg)) target.style.transform = `rotate(${deg}deg)` // TODO maybe not required for this app
  }

  const singleSvgWrapper = ({ content, color, w, h }) =>{
    return `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 ${w} ${h}" fill="${color ? color : 'black'}">${content}</svg>`
  }


  const transformPos = ({ target, x, y, value }) => {
    target.style.transform = `translate(${x}${value || 'px'},${y}${value || 'px'})`
  }

  const animateCell = ({ target, frameW, end, data, speed }) => {
    let i = 0
    clearInterval(data.interval)
    data.interval = setInterval(()=> {
      target.style.transform = `translateX(${px(i * -frameW)})`
      i = i >= end
        ? 0
        : i + 1
    }, speed || 150)
  }

  const createSheep = () =>{
    const sheep = document.createElement('div')
    sheep.classList.add('sheep')
    sheepData.push({
      sheep,
      interval: 'test',
    })
    sheepCount++
    // console.log('sheep', sheepCount)
    setStyles({
      target: sheep,
      w: px(64),
      h: px(44)
    })
    sheep.innerHTML = `
      <div class="sprite">
        ${singleSvgWrapper({
          content: svgs.sheep,
          w: 4 * 32,
          h: 22
        })}
      </div>
    `
    setStyles({
      target: sheep.childNodes[1],
      w: px(64 * 4),
      h: px(44)
    })
    animateCell({
      target: sheep.childNodes[1],
      frameW: 64,
      end: 3,
      data: sheepData[sheepCount]
    })

    elements.sheepRoute.append(sheep)
    transformPos({
      target: sheep,
      x: elements.sheepRoute.getBoundingClientRect().width,
      y: elements.sheepRoute.getBoundingClientRect().height - 44,
    })
    console.log(elements.sheepRoute.getBoundingClientRect().width)

    setTimeout(()=> {
      sheep.style.transition = '7s'
      transformPos({
        target: sheep,
        x: -64,
        y: elements.sheepRoute.getBoundingClientRect().height - 44,
      })
    })

    setTimeout(()=>{
      sheep.style.transition = '2s'
      transformPos({
        target: sheep,
        x: (elements.sheepRoute.getBoundingClientRect().width / 2) - 64,
        y: elements.sheepRoute.getBoundingClientRect().height - 150,
      })
    }, 1800)

    setTimeout(()=>{
      sheep.style.transition = '1.5s'
      transformPos({
        target: sheep,
        x: (elements.sheepRoute.getBoundingClientRect().width / 2) - 100,
        y: elements.sheepRoute.getBoundingClientRect().height - 44,
      })
    }, 2200)

    setTimeout(()=>{
      sheep.style.transition = '7s'
      transformPos({
        target: sheep,
        x: -80,
        y: elements.sheepRoute.getBoundingClientRect().height - 44,
      })
    }, 3000)

    setTimeout(()=>{
      elements.sheepRoute.removeChild(sheep)
      // sheepData.pop()
    }, 8000)
  }
  
  setInterval(()=>{
    createSheep()
    elements.indicator.innerHTML = sheepCount
    // console.log(sheepData)
  }, 1000 * 2)

  // TODO vertical movement should be separate animation.

  console.log('test')
}

window.addEventListener('DOMContentLoaded', init)



