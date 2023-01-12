
function init() { 

  
  const element = {
    wrapper: document.querySelector('.wrapper'),
    dogs: [],
  }

  // const nearestN = (x, n) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n)
  const px = num => `${num}px`
  // const randomN = max => Math.ceil(Math.random() * max)

  const setStyles = ({ target, h, w, x, y }) =>{
    if (h) target.style.height = h
    if (w) target.style.width = w
    if (y) target.style.top = y
    if (x) target.style.left = x
  }

  const animationFrames = {
    rotate: [[0], [1], [2], [3], [4], [3, 'f'], [2, 'f'], [1, 'f']]
  }

  // TODO maybe get part of the logic from penguin
  // const animationFrames = {
  //   walk: [0, 1, 2, 1, 3, 4],
  //   stop: [0],
  //   celebrate: [5, 6, 7, 6, 3, 4],
  //   turnFromup: [0, 1, 2, 3, 4],
  //   turnFromdUp: [1, 2, 3, 4],
  //   turnFromside: [2, 3, 4],
  //   turnFromdDown: [3, 4],
  //   turnFromdown: [4],
  // }

  const animateCell = ({ target, frameW, end, data, speed, interval }) => {
    let i = 0
    clearInterval(interval)
    interval = setInterval(()=> {
      target.style.transform = `translateX(${px(data.animation[i][0] * -frameW)})`
      target.parentNode.classList.remove('flip')
      if (data.animation[i][1] === 'f') target.parentNode.classList.add('flip')
      i = i >= end
        ? 0
        : i + 1
    }, speed || 150)
  }


  const createDog = () => {
    const dog = document.createElement('div')
    dog.classList.add('dog')
    dog.innerHTML = `
      <div class="body-wrapper">
        <div class="body img-bg"></div>
      </div>
      <div class="head-wrapper flip">
        <div class="head img-bg"></div>
      </div>
    `
    const body = dog.childNodes[1].childNodes[1]
    const head = dog.childNodes[3].childNodes[1]
    setStyles({
      target: body,
      x: px(-(2 * 48)),
    })
    setStyles({
      target: head,
      x: px(-(3 * 2 * 31)),
    })
    const dogData = {
      headInterval: null,
      interval: {
        head: null,
        body: null,
        all: null,
      },
      x: 0,
      y: 0,
      id: 'test-id',
      animation: animationFrames.rotate,
    }
    element.dogs.push(dogData)
    element.wrapper.append(dog)
    // animateCell({ 
    //   target: head,
    //   frameW: 31 * 2,
    //   end: animationFrames.rotate.length - 1,
    //   data: dogData,
    //   interval: dogData.interval.head
    // }) 
    // animateCell({ 
    //   target: body,
    //   frameW: 48 * 2,
    //   end: animationFrames.rotate.length - 1,
    //   data: dogData,
    //   interval: dogData.interval.body
    // }) 
  }

  createDog()


}
  
window.addEventListener('DOMContentLoaded', init)



