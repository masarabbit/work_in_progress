
function init() { 

  
  const elements = {
    body: document.querySelector('.wrapper'),
    wrapper: document.querySelector('.wrapper'),
    indicator: document.querySelector('.indicator'),
    dogs: [],
  }

  const control = {
    x: null,
    y: null,
    angle: 360,
  }

  const nearestN = (x, n) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n)
  const px = num => `${num}px`
  // const randomN = max => Math.ceil(Math.random() * max)
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))

  const setStyles = ({ target, h, w, x, y }) =>{
    if (h) target.style.height = h
    if (w) target.style.width = w
    target.style.transform = `translate(${x || 0}, ${y || 0})`
  }

  const clickedAngle = dog =>{
    if (!dog) return
    const angle = radToDeg(Math.atan2(dog.pos.y - control.y, dog.pos.x - control.x)) - 90
    const adjustedAngle = angle < 0 ? angle + 360 : angle
    return nearestN(adjustedAngle, 45)
  }

  const animationFrames = {
    rotate: [[0], [1], [2], [3], [4], [3, 'f'], [2, 'f'], [1, 'f']]
  }

  const angles = [360, 45, 90, 135, 180, 225, 270, 315]
  const legPositions = [
    {
      1: { x: 25, y: 43 },
      2: { x: 57, y: 43 },
      3: { x: 25, y: 83 },
      4: { x: 57, y: 83 },
    }, //0
    {
      1: { x: 36, y: 56 },
      2: { x: 59, y: 56 },
      3: { x: 12, y: 75 },
      4: { x: 32, y: 80 },
    }, //1
    {
      1: { x: 61, y: 65 },
      2: { x: 44, y: 62 },
      3: { x: 28, y: 71 },
      4: { x: 9, y: 65 },
    }, //2
    {
      1: { x: 0, y: 0 },
      2: { x: 0, y: 0 },
      3: { x: 0, y: 0 },
      4: { x: 0, y: 0 },
    }, //3
    {
      1: { x: 0, y: 0 },
      2: { x: 0, y: 0 },
      3: { x: 0, y: 0 },
      4: { x: 0, y: 0 },
    }, //4
    {
      1: { x: 20, y: 63 },
      2: { x: 40, y: 67 },
      3: { x: 52, y: 57 },
      4: { x: 72, y: 60 },
    }, //5
    {
      1: { x: 0, y: 0 },
      2: { x: 0, y: 0 },
      3: { x: 0, y: 0 },
      4: { x: 0, y: 0 },
    }, //6
    {
      1: { x: 0, y: 0 },
      2: { x: 0, y: 0 },
      3: { x: 0, y: 0 },
      4: { x: 0, y: 0 },
    }, //7
  ]

  // const directionConversions = {
  //   360: 'up',
  //   45: 'upright',
  //   90: 'right',
  //   135: 'downright',
  //   180: 'down',
  //   225: 'downleft',
  //   270: 'left',
  //   315: 'upleft',
  // }

  const positionLegs = (dog, frame) => {
    setStyles({
      target: dog.childNodes[5],
      x: px(legPositions[frame][1].x), y: px(legPositions[frame][1].y),
    })
    setStyles({
      target: dog.childNodes[7],
      x: px(legPositions[frame][2].x), y: px(legPositions[frame][2].y),
    })
    setStyles({
      target: dog.childNodes[9],
      x: px(legPositions[frame][3].x), y: px(legPositions[frame][3].y),
    })
    setStyles({
      target: dog.childNodes[11],
      x: px(legPositions[frame][4].x), y: px(legPositions[frame][4].y),
    })
  }


  const animateDog = ({ target, frameW, currentFrame, end, data, part, speed, direction }) => {
    const offset = direction === 'right' ? 1 : -1

    // ? update indicator
    elements.indicator.innerHTML = `angle: ${data.angle} | currentFrame: ${currentFrame} | direction: ${direction} | offset: ${offset} | frameOffset: ${data.animation[currentFrame][0] * frameW * offset}`

    target.style.transform = `translateX(${px(data.animation[currentFrame][0] * -frameW)})`
    positionLegs(data.dog, currentFrame)
    data.angle = angles[currentFrame]

    target.parentNode.classList.remove('flip')
    if (data.animation[currentFrame][1] === 'f') target.parentNode.classList.add('flip')

    let nextFrame = currentFrame + offset
    nextFrame = nextFrame === -1 
      ? data.animation.length - 1
      : nextFrame === data.animation.length
        ? 0
        : nextFrame
    if (currentFrame !== end) {
      data.timer[part] = setTimeout(()=> animateDog({
        target, data, part, frameW, 
        currentFrame: nextFrame, end, direction,
        speed,
      }), speed || 150)
    }
  }

  const triggerDogAnimation = ({ target, frameW, start, end, data, speed, part, direction }) => {
    clearTimeout(data.timer[part])
    data.timer[part] = setTimeout(()=> animateDog({
      target, data, part, frameW,
      currentFrame: start, end, direction,
      speed,
    }), speed || 150)
  }

  const getDirection = ({ x, y, targetX, targetY }) => {
    const cross = (targetY - y) - (targetX - x)
    return cross > 0 ? 'left' : 'right'
  }

  //  A ---- A  ________ __________
  // |        |         |          |
  // |        |         |          |
  //  ________ _________|__________|
  //           | |  | |   | |   | |
  //            1    2     3     4
  //           red blue yellow green
  const createDog = () => {
    const dog = document.createElement('div')
    dog.classList.add('dog')
    dog.innerHTML = `
      <div class="body-wrapper">
        <div class="body img-bg"></div>
      </div>
      <div class="head-wrapper">
        <div class="head img-bg"></div>
      </div>
      <div class="leg red img-bg"></div>
      <div class="leg blue img-bg"></div>
      <div class="leg yellow img-bg"></div>
      <div class="leg green img-bg"></div>
    `
    // console.log(dog.childNodes[5], dog.childNodes[7], dog.childNodes[9], dog.childNodes[11])
    // 1: { x: 61, y: 65 },
    // 2: { x: 44, y: 62 },
    // 3: { x: 28, y: 71 },
    // 4: { x: 9, y: 65 },
    const body = dog.childNodes[1].childNodes[1]
    const head = dog.childNodes[3].childNodes[1]
    setStyles({
      target: dog.childNodes[5],
      x: px(61), y: px(65),
    })
    setStyles({
      target: dog.childNodes[7],
      x: px(44), y: px(62),
    })
    setStyles({
      target: dog.childNodes[9],
      x: px(28), y: px(71),
    })
    setStyles({
      target: dog.childNodes[11],
      x: px(9), y: px(65),
    })
    
    // frame 2 * 31
    setStyles({
      target: head,
      x: px(-(3 * 2 * 31)),
    })
    setStyles({
      target: body,
      x: px(-(3 * 2 * 48)),
    })
    elements.wrapper.append(dog)
    const { width, height, left, top } = dog.getBoundingClientRect()


    const dogData = {
      timer: {
        head: null,
        body: null,
        all: null,
      },
      pos: {
        x: left + (width / 2),
        y: top + (height / 2),
      },
      id: 'test-id',
      animation: animationFrames.rotate,
      angle: 360,
      dog,
    }
    elements.dogs.push(dogData)
  }

  createDog()

  elements.body.addEventListener('click', e =>{
    control.x = e.pageX 
    control.y = e.pageY

    const currentDog = elements.dogs[0]
    // console.log('test', directionConversions[clickedAngle(currentDog)], angles.indexOf(currentDog.angle), currentDog.angle)

    const direction = getDirection({ 
      x: currentDog.pos.x,
      y: currentDog.pos.y,
      targetX: control.x,
      targetY: control.y
    })

    const start = angles.indexOf(currentDog.angle)
    const end = angles.indexOf(clickedAngle(currentDog))

    triggerDogAnimation({ 
      target: currentDog.dog.childNodes[3].childNodes[1],
      frameW: 31 * 2,
      start, end,
      data: currentDog,
      speed: 100,
      direction,
      part: 'head'
    }) 
    
    setTimeout(()=>{
      triggerDogAnimation({ 
        target: currentDog.dog.childNodes[1].childNodes[1],
        frameW: 48 * 2,
        start, end,
        data: currentDog,
        speed: 100,
        direction,
        part: 'body'
      }) 
    }, 300)
    // TODO frames of the body need to be updated to correspond with head (it's the wrong way round)
  })


}
  
window.addEventListener('DOMContentLoaded', init)



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

  // const animateCell = ({ target, frameW, end, data, speed, interval }) => {
  //   let i = 0
  //   clearInterval(interval)
  //   interval = setInterval(()=> {
  //     target.style.transform = `translateX(${px(data.animation[i][0] * -frameW)})`
  //     target.parentNode.classList.remove('flip')
  //     if (data.animation[i][1] === 'f') target.parentNode.classList.add('flip')
  //     i = i >= end
  //       ? 0
  //       : i + 1
  //   }, speed || 150)
  // }