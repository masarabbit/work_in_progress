
function init() { 

  
  const elements = {
    body: document.querySelector('.wrapper'),
    wrapper: document.querySelector('.wrapper'),
    indicator: document.querySelector('.indicator'),
    dog: null,
  }

  const control = {
    x: null,
    y: null,
    // angle: 360,
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
  const defaultEnd = 4
  const partPositions = [
    { //0
      1: { x: 26, y: 43 },
      2: { x: 54, y: 43 },
      3: { x: 26, y: 75 },
      4: { x: 54, y: 75 },
      tail: { x: 40, y: 70, z: 1 },
    }, 
    { //1
      1: { x: 33, y: 56 },
      2: { x: 55, y: 56 },
      3: { x: 12, y: 72 },
      4: { x: 32, y: 74 },
      tail: { x: 20, y: 64, z: 1 },
    }, 
    { //2
      1: { x: 59, y: 60 },
      2: { x: 42, y: 58 },
      3: { x: 24, y: 64 },
      4: { x: 9, y: 61 },
      tail: { x: 5, y: 52, z: 1 },
    }, 
    { //3
      1: { x: 39, y: 63 },
      2: { x: 60, y: 56 },
      3: { x: 12, y: 52 },
      4: { x: 28, y: 50 },
      tail: { x: 7, y: 21, z: 0 },
    }, 
    { //4
      1: { x: 23, y: 54 },
      2: { x: 56, y: 54 },
      3: { x: 24, y: 25 },
      4: { x: 54, y: 25 },
      tail: { x: 38, y: 2, z: 0 },
    }, 
    { //5
      1: { x: 21, y: 58 },
      2: { x: 41, y: 64 },
      3: { x: 53, y: 50 },
      4: { x: 69, y: 53 },
      tail: { x: 72, y: 22, z: 0 },
    }, 
    { //6
      1: { x: 22, y: 59 },
      2: { x: 30, y: 64 },
      3: { x: 56, y: 59 },
      4: { x: 68, y: 62 },
      tail: { x: 78, y: 40, z: 0 },
    }, 
    { //7
      1: { x: 47, y: 45 },
      2: { x: 24, y: 53 },
      3: { x: 68, y: 68 },
      4: { x: 47, y: 73 },
      tail: { x: 65, y: 65, z: 1 },
    }, 
  ]

  const positionLegs = (dog, frame) => {
    setStyles({
      target: dog.childNodes[5],
      x: px(partPositions[frame][1].x), y: px(partPositions[frame][1].y),
    })
    setStyles({
      target: dog.childNodes[7],
      x: px(partPositions[frame][2].x), y: px(partPositions[frame][2].y),
    })
    setStyles({
      target: dog.childNodes[9],
      x: px(partPositions[frame][3].x), y: px(partPositions[frame][3].y),
    })
    setStyles({
      target: dog.childNodes[11],
      x: px(partPositions[frame][4].x), y: px(partPositions[frame][4].y),
    })
  }

  const moveLegs = dog => {
    ;[5, 11].forEach(i => dog.childNodes[i].childNodes[1].classList.add('walk-1'))
    ;[7, 9].forEach(i => dog.childNodes[i].childNodes[1].classList.add('walk-2'))
  }

  const stopLegs = dog => {
    ;[5, 11].forEach(i => dog.childNodes[i].childNodes[1].classList.remove('walk-1'))
    ;[7, 9].forEach(i => dog.childNodes[i].childNodes[1].classList.remove('walk-2'))
  }

  const positionTail = (dog, frame) => { 
    setStyles({
      target: dog.childNodes[13],
      x: px(partPositions[frame].tail.x), y: px(partPositions[frame].tail.y),
    })
    dog.childNodes[13].style.zIndex = partPositions[frame].tail.z
    dog.childNodes[13].childNodes[1].classList.add('wag')
  }


  const animateDog = ({ target, frameW, currentFrame, end, data, part, speed, direction }) => {
    const offset = direction === 'clockwise' ? 1 : -1

    // ? update indicator
    elements.indicator.innerHTML = `angle: ${data.angle} | currentFrame: ${currentFrame} | direction: ${direction} | offset: ${offset} | frameOffset: ${data.animation[currentFrame][0] * frameW * offset} | ${data.facing.x} / ${data.facing.y} `

    target.style.transform = `translateX(${px(data.animation[currentFrame][0] * -frameW)})`
    if (part === 'body') {
      positionLegs(data.dog, currentFrame)
      moveLegs(data.dog)
      positionTail(data.dog, currentFrame)
    }
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
    } else {
      data.facing.x = control.x
      data.facing.y = control.y
      setTimeout(()=> {
        stopLegs(data.dog)
      }, 200)
      // setTimeout(()=> {
      //   data.dog.childNodes[13].childNodes[1].classList.remove('wag')
      // }, 5000)
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

  const getDirection = ({ pos, facing, target }) =>{
    // https://qiita.com/tydesign/items/d41ac74b5effd87141b8
    const dx2 = facing.x - pos.x
    const dy1 = pos.y - target.y
    const dx1 = target.x - pos.x
    const dy2 = pos.y - facing.y

    return dx2 * dy1 > dx1 * dy2 ? 'anit-clockwise' : 'clockwise'
  }

  const turnDog = ({ dog, start, end, direction }) => {
    triggerDogAnimation({ 
      target: dog.dog.childNodes[3].childNodes[1],
      frameW: 31 * 2,
      start, end,
      data: dog,
      speed: 100,
      direction,
      part: 'head'
    }) 
    
    setTimeout(()=>{
      triggerDogAnimation({ 
        target: dog.dog.childNodes[1].childNodes[1],
        frameW: 48 * 2,
        start, end,
        data: dog,
        speed: 100,
        direction,
        part: 'body'
      }) 
    }, 300)
  }


  //  A ---- A  ________ ________
  // |        |         |        |
  // |        |         |        |
  //  ________ _________|________|
  //           | |  | |  | |  | |
  //            1    2    3    4
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
      <div class="leg-wrapper">
        <div class="leg one img-bg"></div>
      </div>
      <div class="leg-wrapper">
        <div class="leg two img-bg"></div>
      </div>
      <div class="leg-wrapper">
        <div class="leg three img-bg"></div>
      </div>
      <div class="leg-wrapper">
        <div class="leg four img-bg"></div>
      </div>
      <div class="tail-wrapper">
        <div class="tail img-bg"></div>
      </div>
    `
    
    elements.wrapper.append(dog)
    const { width, height, left, top } = dog.getBoundingClientRect()
    positionLegs(dog, 0)

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
      facing: {
        x: left + (width / 2),
        y: top + (height / 2) + 30,
      },
      // id: 'test-id',
      animation: animationFrames.rotate,
      angle: 360,
      dog,
    }
    elements.dog = dogData
    // elements.dogs.push(dogData)
    turnDog({
      dog: dogData,
      start:0,
      end: defaultEnd,
      direction: 'clockwise'
    })
    positionTail(dog, 0)
  }

  createDog()



  elements.body.addEventListener('click', e =>{
    control.x = e.pageX 
    control.y = e.pageY

    const currentDog = elements.dog
    // console.log('test', directionConversions[clickedAngle(currentDog)], angles.indexOf(currentDog.angle), currentDog.angle)

    const direction = getDirection({ 
      pos: currentDog.pos,
      facing: currentDog.facing,
      target: control,
    })

    const start = angles.indexOf(currentDog.angle)
    const end = angles.indexOf(clickedAngle(currentDog))
    // console.log(start, end, direction)
    turnDog({
      dog: currentDog,
      start, end, direction
    })
    
    // ? override
    // const direction = 
    // const end = 
  })


}
  
window.addEventListener('DOMContentLoaded', init)

