function init() {  
  const svgs = {
    sheep: '<path fill="#fff" d="M 107 1 h 3 v 1 h 1 v -1 h 4 v 1 h 4 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 2 h -1 v 2 h -1 v 2 h -2 v -1 h -2 v 1 h -1 v 1 h -7 v -1 h -1 v -1 h -4 v -3 h 2 v -2 h -3 v -1 h -1 v -2 h 1 v -1 h 2 v -1 h 1 v -1"/> <path fill="#fff" d="M 11 2 h 3 v 1 h 2 v -1 h 5 v 1 h 4 v 1 h 1 v 3 h 1 v 6 h -2 v 1 h -1 v 2 h -2 v 1 h -4 v 1 h -3 v -1 h -3 v -2 h -4 v -1 h -3 v -1 h 2 v -1 h 1 v -1 h 1 v -2 h 2 v -2 h -3 v -1 h -1 v -2 h 3 v -1 h 1 v -1"/> <path fill="#fff" d="M 48 2 h 2 v 1 h 5 v 2 h 2 v 1 h 1 v 7 h -3 v 1 h -1 v 1 h -1 v 1 h -7 v -1 h -8 v -1 h 2 v -1 h 1 v -2 h 1 v -1 h 1 v -2 h -2 v 1 h -1 v -1 h -2 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 6 v -1"/> <path fill="#fff" d="M 78 2 h 4 v 1 h 1 v -1 h 4 v 1 h 1 v 2 h 2 v 2 h 1 v 4 h -1 v 2 h -4 v 1 h -1 v 1 h -1 v 1 h -4 v 1 h -2 v -1 h -1 v -1 h -4 v 1 h -2 v -1 h 1 v -1 h 1 v -1 h 3 v -2 h -1 v -1 h -5 v -3 h 1 v -1 h 2 v -2 h 1 v -1 h 2 v 1 h 1 v -1 h 1 v -1"/> <path fill="#000" d="M 4 6 h 4 v 1 h 3 v 2 h -2 v 2 h -1 v 1 h -1 v 1 h -5 v -1 h -1 v -2 h 1 v -2 h 1 v -1 h 1 v -1"/> <path fill="#000" d="M 99 6 h 5 v 1 h 3 v 2 h -2 v 3 h 4 v 3 h -1 v 1 h -1 v 1 h -2 v 1 h -2 v -1 h -1 v -2 h -2 v -3 h 1 v -1 h -3 v -1 h -1 v -1 h 1 v -2 h 1 v -1"/> <path fill="#000" d="M 36 8 h 4 v 1 h 1 v -1 h 2 v 2 h -1 v 1 h -1 v 2 h -1 v 1 h -2 v 1 h -4 v -1 h -1 v -2 h 1 v -2 h 1 v -1 h 1 v -1"/> <path fill="#000" d="M 69 10 h 6 v 1 h 1 v 2 h -3 v 1 h -1 v 1 h -1 v 1 h -4 v -1 h -1 v -2 h 1 v -1 h 1 v -1 h 1 v -1"/> <path fill="#000" d="M 27 12 h 3 v 1 h 1 v 2 h -2 v 3 h -1 v 1 h -1 v -1 h -2 v -1 h -1 v -3 h 1 v -1 h 2 v -1"/> <path fill="#000" d="M 118 12 h 2 v 1 h 1 v 1 h 1 v 5 h -4 v -1 h -1 v -1 h -1 v -3 h 1 v -1 h 1 v -1"/> <path fill="#000" d="M 55 13 h 4 v 1 h 1 v 2 h -1 v 1 h -1 v 2 h -2 v -1 h -1 v -1 h -1 v -3 h 1 v -1"/> <path fill="#000" d="M 86 13 h 3 v 3 h -1 v 2 h -1 v 1 h -3 v -1 h -1 v -2 h 1 v -1 h 1 v -1 h 1 v -1"/> <path fill="#fefefe" d="M 109 13 h 1 v 1 h -1 v -1"/> <path fill="#000" d="M 5 14 h 3 v 1 h 4 v 3 h -1 v 1 h -1 v 1 h -3 v -2 h -3 v -2 h 1 v -2"/> <path fill="#000" d="M 38 15 h 3 v 1 h 1 v -1 h 4 v 1 h -1 v 2 h -1 v 3 h -3 v -1 h -2 v 1 h -1 v -1 h -1 v -3 h 1 v -2"/> <path fill="#000" d="M 73 15 h 4 v 1 h 1 v 2 h 1 v 1 h 1 v 1 h -1 v 1 h -3 v -1 h -1 v 1 h -2 v -1 h -1 v -4 h 1 v -1"/>'
  }


  
  const elements = {
    wrapper: document.querySelector('.wrapper'),
    sheepRoute: document.querySelector('.sheep-route'),
    counter: document.querySelector('.counter')
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
    target.style.transform = `translate(${x || 0}${value || 'px'},${y || 0}${value || 'px'})`
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

  const timeoutTransform = ({ target, transition, x, y, delay }) => {
    setTimeout(()=> {
      target.style.transition = `${transition}s`
      transformPos({ target, x, y })
    }, delay || 0)
  }

  const createSheep = () =>{
    const sheepWrapper = document.createElement('div')
    sheepWrapper.classList.add('sheep-wrapper')
    sheepData.push({
      sheep: sheepWrapper,
      interval: null,
    })
    sheepCount++
    const sheepNo = sheepCount
    setStyles({
      target: sheepWrapper,
      w: px(64), h: px(44 * 3)
    })
    sheepWrapper.innerHTML = `
    <div class="sheep" sheep_id="${sheepNo + 1}" >  
      <div class="sprite">
        ${singleSvgWrapper({
          content: svgs.sheep,
          w: 4 * 32,
          h: 22
        })}
      </div>
    </div>  
    `
    const sheep = sheepWrapper.childNodes[1]
    setStyles({
      target: sheep,
      w: px(64), h: px(44)
    })
    setStyles({
      target: sheep.childNodes[1],
      w: px(64 * 4), h: px(44)
    })
    animateCell({
      target: sheep.childNodes[1],
      frameW: 64,
      end: 3,
      data: sheepData[sheepNo]
    })

    const { width, height } = elements.sheepRoute.getBoundingClientRect()

    elements.sheepRoute.append(sheepWrapper)
    transformPos({
      target: sheepWrapper,
      x: width,
      y: 0,
    })
    transformPos({
      target: sheep,
      x: 0,
      y: height - 44,
    })

    timeoutTransform({
      target: sheepWrapper,
      transition: 7,
      x: -64,
      // id: sheepNo,
      delay: 200,
    })

    timeoutTransform({
      target: sheep,
      transition: 2,
      y: height - 200,
      delay: 1700
    })

    setTimeout(()=> {
      clearInterval(sheepData[sheepNo].interval)
      elements.counter.innerHTML = sheepNo + 1
    }, 1800)

    timeoutTransform({
      target: sheep,
      transition: 1.5,
      y: height - 44,
      delay: 2200
    })

    setTimeout(()=> {
      animateCell({
        target: sheep.childNodes[1],
        frameW: 64,
        end: 3,
        data: sheepData[sheepNo]
      })
    }, 2400)


    setTimeout(()=>{
      // console.log(sheepNo)
      elements.sheepRoute.removeChild(sheepWrapper)
      // sheepData.pop()
    }, 7000)
  }
  
  createSheep()
  setInterval(()=>{
    createSheep()
    // elements.counter.innerHTML = sheepCount
  }, 1000 * 2)

}

window.addEventListener('DOMContentLoaded', init)



