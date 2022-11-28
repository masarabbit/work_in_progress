function init() {  

  const sheepData = {
    svg: ({ fur, body }) => {
      return `<path fill="${fur}" d="M 107 1 h 3 v 1 h 1 v -1 h 4 v 1 h 4 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 2 h -1 v 2 h -1 v 2 h -2 v -1 h -2 v 1 h -1 v 1 h -7 v -1 h -1 v -1 h -4 v -3 h 2 v -2 h -3 v -1 h -1 v -2 h 1 v -1 h 2 v -1 h 1 v -1"/> <path fill="${fur}" d="M 11 2 h 3 v 1 h 2 v -1 h 5 v 1 h 4 v 1 h 1 v 3 h 1 v 6 h -2 v 1 h -1 v 2 h -2 v 1 h -4 v 1 h -3 v -1 h -3 v -2 h -4 v -1 h -3 v -1 h 2 v -1 h 1 v -1 h 1 v -2 h 2 v -2 h -3 v -1 h -1 v -2 h 3 v -1 h 1 v -1"/> <path fill="${fur}" d="M 48 2 h 2 v 1 h 5 v 2 h 2 v 1 h 1 v 7 h -3 v 1 h -1 v 1 h -1 v 1 h -7 v -1 h -8 v -1 h 2 v -1 h 1 v -2 h 1 v -1 h 1 v -2 h -2 v 1 h -1 v -1 h -2 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 6 v -1"/> <path fill="${fur}" d="M 78 2 h 4 v 1 h 1 v -1 h 4 v 1 h 1 v 2 h 2 v 2 h 1 v 4 h -1 v 2 h -4 v 1 h -1 v 1 h -1 v 1 h -4 v 1 h -2 v -1 h -1 v -1 h -4 v 1 h -2 v -1 h 1 v -1 h 1 v -1 h 3 v -2 h -1 v -1 h -5 v -3 h 1 v -1 h 2 v -2 h 1 v -1 h 2 v 1 h 1 v -1 h 1 v -1"/> <path fill="${body}" d="M 4 6 h 4 v 1 h 3 v 2 h -2 v 2 h -1 v 1 h -1 v 1 h -5 v -1 h -1 v -2 h 1 v -2 h 1 v -1 h 1 v -1"/> <path fill="${body}" d="M 99 6 h 5 v 1 h 3 v 2 h -2 v 3 h 4 v 3 h -1 v 1 h -1 v 1 h -2 v 1 h -2 v -1 h -1 v -2 h -2 v -3 h 1 v -1 h -3 v -1 h -1 v -1 h 1 v -2 h 1 v -1"/> <path fill="${body}" d="M 36 8 h 4 v 1 h 1 v -1 h 2 v 2 h -1 v 1 h -1 v 2 h -1 v 1 h -2 v 1 h -4 v -1 h -1 v -2 h 1 v -2 h 1 v -1 h 1 v -1"/> <path fill="${body}" d="M 69 10 h 6 v 1 h 1 v 2 h -3 v 1 h -1 v 1 h -1 v 1 h -4 v -1 h -1 v -2 h 1 v -1 h 1 v -1 h 1 v -1"/> <path fill="${body}" d="M 27 12 h 3 v 1 h 1 v 2 h -2 v 3 h -1 v 1 h -1 v -1 h -2 v -1 h -1 v -3 h 1 v -1 h 2 v -1"/> <path fill="${body}" d="M 118 12 h 2 v 1 h 1 v 1 h 1 v 5 h -4 v -1 h -1 v -1 h -1 v -3 h 1 v -1 h 1 v -1"/> <path fill="${body}" d="M 55 13 h 4 v 1 h 1 v 2 h -1 v 1 h -1 v 2 h -2 v -1 h -1 v -1 h -1 v -3 h 1 v -1"/> <path fill="${body}" d="M 86 13 h 3 v 3 h -1 v 2 h -1 v 1 h -3 v -1 h -1 v -2 h 1 v -1 h 1 v -1 h 1 v -1"/> <path fill="${fur}" d="M 109 13 h 1 v 1 h -1 v -1"/> <path fill="${body}" d="M 5 14 h 3 v 1 h 4 v 3 h -1 v 1 h -1 v 1 h -3 v -2 h -3 v -2 h 1 v -2"/> <path fill="${body}" d="M 38 15 h 3 v 1 h 1 v -1 h 4 v 1 h -1 v 2 h -1 v 3 h -3 v -1 h -2 v 1 h -1 v -1 h -1 v -3 h 1 v -2"/> <path fill="${body}" d="M 73 15 h 4 v 1 h 1 v 2 h 1 v 1 h 1 v 1 h -1 v 1 h -3 v -1 h -1 v 1 h -2 v -1 h -1 v -4 h 1 v -1"/>`
    },
    data: [],
    count: 0,
  }

  const sheepColours = [
    { fur: '#fff', body: '#100c45' },
    { fur: '#fff', body: '#100c45' },
    { fur: '#fff', body: '#100c45' },
    { fur: '#fff', body: '#100c45' },
    { fur: '#fff', body: '#100c45' },
    { fur: '#fff', body: '#100c45' },
    { fur: '#fff', body: '#100c45' },
    { fur: '#fff', body: '#100c45' },
    { fur: '#100c45', body: '#fff' },
    { fur: '#fff', body: '#ecdbb6' },
    { fur: '#fff', body: '#ecdbb6' },
    { fur: '#fff5e0', body: '#c3a479' },
  ]

  const elements = {
    wrapper: document.querySelector('.wrapper'),
    sheepRoute: document.querySelector('.sheep-route'),
    counter: document.querySelector('.counter'),
  }

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

  const singleSvgWrapper = ({ content, color, w, h }) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 ${w} ${h}" fill="${color ? color : 'black'}">${content}</svg>`
  }

  const transformPos = ({ target, x, y, value }) => {
    target.style.transform = `translate(${x || 0}${value || 'px'},${y || 0}${value || 'px'})`
  }

  const animateCell = ({ target, frameW, end, data, speed }) => {
    let i = 0
    clearInterval(data?.interval)
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

  const animationTiming = () => {
    const total = nearestN(elements.sheepRoute.getBoundingClientRect().width * 10, 1000)
    return {
      jump: total * 0.26 - 200,
      stopRun: total * 0.26,
      land: total * 0.26 + 400,
      resumeRun: total * 0.26 + 750,
      total,
    }
  }

  const populateSheepHtml = (sheep, sheepNo) => {
    const { fur, body } = sheepColours[randomN(sheepColours.length - 1)]
    sheep.innerHTML = `
    <div class="sheep" sheep_id="${sheepNo + 1}" baa="" >  
      <div class="sheep-inner-wrapper">
        <div class="sprite">
          ${singleSvgWrapper({
            content: sheepData.svg({ fur, body }),
            w: 4 * 32, h: 22
          })}
        </div>
      </div>
    </div>  
    `
  }

  const filteredSheepData = n => sheepData.data.filter(s => s.sheepId === n)[0]
  const baaa = () => `b` + new Array(1 + randomN(3)).fill('').map(_ => 'a').join('')
  const setBaaa = (sheep, baa) => sheep.setAttribute('baa', baa)

  const triggerBaa = (sheep, delay) => {
    setTimeout(()=> {
      setBaaa(sheep, baaa())
      setTimeout(()=>{
        setBaaa(sheep, '')
      }, 1500)
    }, randomN(delay))
  }

  const stopSheep = (sheep, sheepNo) => {
    if (!sheep.parentNode.classList.contains('hide')) {
      clearInterval(filteredSheepData(sheepNo)?.interval)
      elements.counter.innerHTML = sheepNo + 1
      elements.counter.classList.add('enlarge')
      if (Math.random() < 0.1) {
        sheep.classList.add('roll')
        sheep.childNodes[1].style.transform = `translateX(${px(2 * -64)})`
      } else {
        sheep.childNodes[1].style.transform = `translateX(${px(0 * -64)})`
      }
    } 
  }

  const createSheep = () => {
    const sheepWrapper = document.createElement('div')
    sheepWrapper.classList.add('sheep-wrapper')

    const sheepNo = sheepData.count
    sheepData.count++

    sheepData.data.push({
      sheep: sheepWrapper,
      interval: null,
      sheepId: sheepNo
    })

    setStyles({
      target: sheepWrapper,
      w: px(64), h: px(44 * 3)
    })
    populateSheepHtml(sheepWrapper, sheepNo)
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
    const sheepTiming = animationTiming()

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
      y: height - 180 - randomN(100),
      delay: sheepTiming.jump
    })

    if (Math.random() < 0.5) triggerBaa(sheep, sheepTiming.total)

    setTimeout(()=> { // stopRun
      stopSheep(sheepInnerWrapper, sheepNo)
    }, sheepTiming.stopRun)

    timeoutTransform({ // land
      target: sheep,
      transition: 1.8,
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
      sheepInnerWrapper.classList.remove('roll')
    }, sheepTiming.resumeRun)

    setTimeout(()=> {
      elements.sheepRoute.removeChild(sheepWrapper)
      sheepData.data = sheepData.data.filter(s => s.sheepId !== sheepNo)
    }, sheepTiming.total)
  }

  createSheep()
  setInterval(()=>{
    createSheep()
  }, 1000 * 2)

  window.addEventListener('resize', ()=>{
    // resets sheep on resize because resizing messes up timing for sheep jump
    sheepData.count = 0
    elements.counter.innerHTML = 0
    document.querySelectorAll('.sheep-wrapper').forEach(s => {
      const sheep = s.childNodes[1]
      sheep.style.transition = '0s'
      sheep.classList.add('hide')
    })
  })


}

window.addEventListener('DOMContentLoaded', init)



