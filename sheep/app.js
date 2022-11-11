function init() {  
  const svgs = {

    sheep: ({ furColour, bodyColour }) => {
      const fur = furColour || '#fff'
      const body = bodyColour || '#000'
      return `<path fill="${fur}" d="M 107 1 h 3 v 1 h 1 v -1 h 4 v 1 h 4 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 2 h -1 v 2 h -1 v 2 h -2 v -1 h -2 v 1 h -1 v 1 h -7 v -1 h -1 v -1 h -4 v -3 h 2 v -2 h -3 v -1 h -1 v -2 h 1 v -1 h 2 v -1 h 1 v -1"/> <path fill="${fur}" d="M 11 2 h 3 v 1 h 2 v -1 h 5 v 1 h 4 v 1 h 1 v 3 h 1 v 6 h -2 v 1 h -1 v 2 h -2 v 1 h -4 v 1 h -3 v -1 h -3 v -2 h -4 v -1 h -3 v -1 h 2 v -1 h 1 v -1 h 1 v -2 h 2 v -2 h -3 v -1 h -1 v -2 h 3 v -1 h 1 v -1"/> <path fill="${fur}" d="M 48 2 h 2 v 1 h 5 v 2 h 2 v 1 h 1 v 7 h -3 v 1 h -1 v 1 h -1 v 1 h -7 v -1 h -8 v -1 h 2 v -1 h 1 v -2 h 1 v -1 h 1 v -2 h -2 v 1 h -1 v -1 h -2 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 6 v -1"/> <path fill="${fur}" d="M 78 2 h 4 v 1 h 1 v -1 h 4 v 1 h 1 v 2 h 2 v 2 h 1 v 4 h -1 v 2 h -4 v 1 h -1 v 1 h -1 v 1 h -4 v 1 h -2 v -1 h -1 v -1 h -4 v 1 h -2 v -1 h 1 v -1 h 1 v -1 h 3 v -2 h -1 v -1 h -5 v -3 h 1 v -1 h 2 v -2 h 1 v -1 h 2 v 1 h 1 v -1 h 1 v -1"/> <path fill="${body}" d="M 4 6 h 4 v 1 h 3 v 2 h -2 v 2 h -1 v 1 h -1 v 1 h -5 v -1 h -1 v -2 h 1 v -2 h 1 v -1 h 1 v -1"/> <path fill="${body}" d="M 99 6 h 5 v 1 h 3 v 2 h -2 v 3 h 4 v 3 h -1 v 1 h -1 v 1 h -2 v 1 h -2 v -1 h -1 v -2 h -2 v -3 h 1 v -1 h -3 v -1 h -1 v -1 h 1 v -2 h 1 v -1"/> <path fill="${body}" d="M 36 8 h 4 v 1 h 1 v -1 h 2 v 2 h -1 v 1 h -1 v 2 h -1 v 1 h -2 v 1 h -4 v -1 h -1 v -2 h 1 v -2 h 1 v -1 h 1 v -1"/> <path fill="${body}" d="M 69 10 h 6 v 1 h 1 v 2 h -3 v 1 h -1 v 1 h -1 v 1 h -4 v -1 h -1 v -2 h 1 v -1 h 1 v -1 h 1 v -1"/> <path fill="${body}" d="M 27 12 h 3 v 1 h 1 v 2 h -2 v 3 h -1 v 1 h -1 v -1 h -2 v -1 h -1 v -3 h 1 v -1 h 2 v -1"/> <path fill="${body}" d="M 118 12 h 2 v 1 h 1 v 1 h 1 v 5 h -4 v -1 h -1 v -1 h -1 v -3 h 1 v -1 h 1 v -1"/> <path fill="${body}" d="M 55 13 h 4 v 1 h 1 v 2 h -1 v 1 h -1 v 2 h -2 v -1 h -1 v -1 h -1 v -3 h 1 v -1"/> <path fill="${body}" d="M 86 13 h 3 v 3 h -1 v 2 h -1 v 1 h -3 v -1 h -1 v -2 h 1 v -1 h 1 v -1 h 1 v -1"/> <path fill="${fur}" d="M 109 13 h 1 v 1 h -1 v -1"/> <path fill="${body}" d="M 5 14 h 3 v 1 h 4 v 3 h -1 v 1 h -1 v 1 h -3 v -2 h -3 v -2 h 1 v -2"/> <path fill="${body}" d="M 38 15 h 3 v 1 h 1 v -1 h 4 v 1 h -1 v 2 h -1 v 3 h -3 v -1 h -2 v 1 h -1 v -1 h -1 v -3 h 1 v -2"/> <path fill="${body}" d="M 73 15 h 4 v 1 h 1 v 2 h 1 v 1 h 1 v 1 h -1 v 1 h -3 v -1 h -1 v 1 h -2 v -1 h -1 v -4 h 1 v -1"/>`
    }
  }


  
  const elements = {
    // wrapper: document.querySelector('.wrapper'),
    sheepRoute: document.querySelector('.sheep-route'),
    counter: document.querySelector('.counter')
  }
  
  let sheepCount = -1
  let sheepData = []

  const nearestN = (x, n) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n)
  const isNum = x => typeof x === 'number'
  const px = num => `${num}px`
  const randomN = max => Math.ceil(Math.random() * max)

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

  const timing = () => {
    const total = nearestN(elements.sheepRoute.getBoundingClientRect().width * 10, 1000)
    return {
      jump: total * 0.25 - 100,
      stopRun: total * 0.25,
      land: total * 0.25 + 500,
      resumeRun: total * 0.25 + 600,
      total,
    }
  }

  const filteredSheepData = n => {
    return sheepData.filter(s => s.sheepId === n)[0]
  }


  const createSheep = () =>{
    const sheepWrapper = document.createElement('div')
    sheepWrapper.classList.add('sheep-wrapper')
    sheepCount++
    const sheepNo = sheepCount

    sheepData.push({
      sheep: sheepWrapper,
      interval: null,
      sheepId: sheepNo
    })

    setStyles({
      target: sheepWrapper,
      w: px(64), h: px(44 * 3)
    })
    sheepWrapper.innerHTML = `
    <div class="sheep" sheep_id="${sheepNo + 1}" >  
      <div class="sheep-inner-wrapper">
        <div class="sprite">
          ${singleSvgWrapper({
            content: svgs.sheep({ furColour: '#ffff88' }),
            w: 4 * 32, h: 22
          })}
        </div>
      </div>
    </div>  
    `
    const sheep = sheepWrapper.childNodes[1]
    const sheepInnerWrapper = sheep.childNodes[1]
    setStyles({
      target: sheep,
      w: px(64), h: px(44)
    })
    setStyles({
      target: sheepInnerWrapper.childNodes[1],
      w: px(64 * 4), h: px(44)
    })
    animateCell({
      target: sheepInnerWrapper.childNodes[1],
      frameW: 64,
      end: 3,
      data: filteredSheepData(sheepNo)
    })

    const { width, height } = elements.sheepRoute.getBoundingClientRect()
    const sheepTiming = timing()
    console.log(sheepTiming, sheepTiming.total / 1000)



    elements.sheepRoute.append(sheepWrapper)
    transformPos({
      target: sheepWrapper,
      x: width, y: 0,
    })
    transformPos({
      target: sheep,
      x: 0, y: height - 44,
    })

    timeoutTransform({
      target: sheepWrapper,
      transition: sheepTiming.total / 1000,
      x: -64,
      delay: 100,
    })

    timeoutTransform({ // jump
      target: sheep,
      transition: 2,
      y: height - 200 - randomN(100),
      delay: sheepTiming.jump
    })

    setTimeout(()=> { // stopRun
      clearInterval(filteredSheepData(sheepNo).interval)
      sheepInnerWrapper.childNodes[1].style.transform = `translateX(${px(0 * -64)})`
      elements.counter.innerHTML = sheepNo + 1
      elements.counter.classList.add('enlarge')
      if (Math.random() < 0.5) sheepInnerWrapper.classList.add('roll')
    }, sheepTiming.stopRun)

    timeoutTransform({ // land
      target: sheep,
      transition: 1.5,
      y: height - 44,
      delay: sheepTiming.land
    })

    setTimeout(()=> { // resumeRun
      animateCell({
        target: sheepInnerWrapper.childNodes[1],
        frameW: 64,
        end: 3,
        data: filteredSheepData(sheepNo)
      })
      elements.counter.classList.remove('enlarge')
      // sheepInnerWrapper.style.transition = '0s'
      sheepInnerWrapper.classList.remove('roll')
    }, sheepTiming.resumeRun)


    setTimeout(()=> {
      elements.sheepRoute.removeChild(sheepWrapper)
      sheepData = sheepData.filter(s => s.sheepId !== sheepNo)
    }, sheepTiming.total)
  }
  
  createSheep()
  setInterval(()=>{
    createSheep()
    // elements.counter.innerHTML = sheepCount
  }, 1000 * 2)

}

window.addEventListener('DOMContentLoaded', init)



