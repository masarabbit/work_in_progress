function init() {  

  const circleData = {
    angle: -90,
    interval: null,
    key: null,
    mapIndex: 0,
    flipped: null
  }
  const config = {
    'l': 1,
    'r': -1,
    'u': 0,
    'd': 0,
  }
  const indexConfig = {
    'l': -1,
    'r': 1
  }

  const elements = {
    elements: null
  }

  const indexs = {}
  

  const bearData = {
    animationTimer: ['',''],
    sprite: null,
    frameOffset: 0,
    interval: null,
  }

  const items = {
    tree: {
      width: 50,
      height: 60,
    },
    mountain: {
      width: 80,
      height: 30,
    },
    line: {
      width: 1,
      height: 100,
    }
  }

  const mapItemsTwo = {
    0: [
      {
        element: 'line',
        angle: 0,
        name: ''
      },
      {
        element: 'line',
        angle: 180,
        name: ''
      },
      {
        element: 'tree',
        angle: 30,
        name: 'a',
        color: 'color-0'
      },
      {
        element: 'tree',
        angle: 60,
        name: 'b',
        color: 'color-0'
      },
      {
        element: 'mountain',
        angle: 70,
        name: 'c',
        color: 'color-0'
      },
      // {
      //   element: 'line',
      //   angle: 180,
      //   name: ''
      // },
    ],
    1: [
      {
        element: 'line',
        angle: 0,
        name: ''
      },
      {
        element: 'line',
        angle: 180,
        name: ''
      },      
      {
        element: 'tree',
        angle: 10,
        name: 'd',
        color: 'color-1'
      },
      {
        element: 'tree',
        angle: 60,
        name: 'e',
        color: 'color-1'
      },
      {
        element: 'tree',
        angle: 90,
        name: 'f',
        color: 'color-1'
      },
    ],
    2: [
      {
        element: 'line',
        angle: 0,
        name: ''
      },
      {
        element: 'line',
        angle: 180,
        name: ''
      },
      {
        element: 'tree',
        angle: 10,
        name: 'g',
        color: 'color-2'
      },
      {
        element: 'tree',
        angle: 60,
        name: 'h',
        color: 'color-2'
      },
      {
        element: 'tree',
        angle: 120,
        name: 'i',
        color: 'color-2'
      },
    ],
    3: [
      {
        element: 'line',
        angle: 0,
        name: ''
      },
      {
        element: 'line',
        angle: 180,
        name: ''
      },
      {
        element: 'tree',
        angle: 10,
        name: 'g',
        color: 'color-3'
      },
      {
        element: 'tree',
        angle: 60,
        name: 'h',
        color: 'color-3'
      },
      {
        element: 'tree',
        angle: 120,
        name: 'i',
        color: 'color-3'
      },
    ],
  }
  Object.keys(mapItemsTwo).forEach(index =>{
    mapItemsTwo[index].forEach(item => item.triggerAngle = item.angle - 90)
  })
  console.log(mapItemsTwo)
  
  const indicator = document.querySelector('.indicator')
  const cellD = 32
  const circle = document.querySelector('.circle')
  const circleWrapper = document.querySelector('.circle_wrapper')
  const mapItems = ['navy', 'black', 'white','navy', 'black', 'white','navy', 'black', 'white','navy', 'black', 'white']

  const placeElements = (mapItems, index) =>{
    mapItems.forEach(item =>{
      placeElement(item, index)

      // TODO offset and z-index could be specified per items
    })
    // elements.elements = document.querySelectorAll('.element')
    // updateElements()
  }

  const placeElement = (item, i) =>{
    const element = document.createElement('div')
    // element.style.backgroundColor = ele
    const offset = i % 2 === 0 ? 0 : 180
    element.classList.add('element')
    element.classList.add(item.element)
    element.classList.add(item.color)
    circle.append(element)
    const { width, height } = items[item.element]
    element.style.transform = `translate(${200 - (width / 2)}px, -${height - 5}px) rotate(${item.angle + offset}deg)`
    // setTimeout(()=>{
    //   element.style.transform = `translate(${200 - (width / 2)}px, -${height - 5}px) rotate(${item.angle}deg)`
    // }, 1000)
    element.innerHTML = item.element + item.color
    element.style.transformOrigin = `center ${200 + (height - 5)}px`
    item.placed = element
  }

  // mapItems.forEach((_,i) => indexs[i] = i < 6 ? 0 : 2)
  mapItems.forEach((_,i) => indexs[i] = 0)


  const setSpritePos = (num, actor, sprite) =>{
    actor.spritePos = num
    // this can't be set with translate, because translate is used to flip sprites too.
    sprite.style.marginLeft = `${num}px`
  }
  
  const turnSprite = ({ e, actor, animate }) => {
    const dir = e
    const { sprite, frameOffset } = bearData
    const frames = {
      r: [4, 6, 5, 'add'],
      l: [4, 6, 5,'remove'],
      u: [2, 2, 3,'toggle'],
      d: [0, 0, 1, 'toggle']
    }
    let m = -cellD
    if (!frames[dir]) return
    m = animate ? m * frames[dir][0 + frameOffset] : m * frames[dir][2]
    bearData.frameOffset = frameOffset === 0 ? 1 : 0
    sprite.parentNode.classList[frames[dir][3]]('right') 
    actor.animationTimer.forEach(timer=> clearTimeout(timer))
    setSpritePos(m, actor, sprite)
  }
  
  const returnNextOrPrev = current =>{
    return current === -1
    ? 3
    : current === 4
      ? 0
      : current
  }

  const updateElements = () =>{

    const trigger ={ // TODO maybe this trigger needs to change
      'l': [ 89, 269 ],
      'r': [ 91, 271 ],
    } 

    const { key } = circleData
    const currentIndex = circleData.mapIndex
    
    if (trigger[key]?.includes(Math.abs(circleData.angle))) {

      const indexToAdd = key === 'r' ? returnNextOrPrev(currentIndex + 1) : returnNextOrPrev(currentIndex - 1)
      const indexToRemove = key === 'r' ? returnNextOrPrev(currentIndex - 1) : returnNextOrPrev(currentIndex + 1)
      mapItemsTwo[indexToRemove].forEach(item => {
        item.placed?.remove()
      })
      mapItemsTwo[indexToAdd].forEach(item => {
        placeElement(item, indexToAdd)
      })

      if([0, -362, -453, 269].includes(circleData.flipped)) {
        circleData.mapIndex = indexToAdd
        if ([-453, 269].includes(circleData.flipped)) circleData.flipped = null
      } 
      circleData.flipped += circleData.angle
      console.log(circleData.flipped)
    }


    indicator.innerHTML = `${circleData.angle} prev: ${returnNextOrPrev(currentIndex - 1)} current: ${currentIndex} next:${returnNextOrPrev(currentIndex + 1)}`
    if (Math.abs(circleData.angle) === 360) {
      circleData.angle = 0
    }
  }

  const rotateCircle = key =>{
    circleData.angle += config[key]
    circle.style.transform = `rotate(${circleData.angle}deg)`
    updateElements()
  }

  const handleKey = e =>{
    const key = e.key.replace('Arrow','').toLowerCase()[0]
    if (!['l','r','u','d'].includes(key)) return
    if (circleData.key !== key){
      clearInterval(circleData.interval)
      circleData.key = key
      circleData.interval = setInterval(()=>{
        if (!circleData.key) {
          clearInterval(circleData.interval)
        } else {
          rotateCircle(key)
        }
      }, 1000 / 60)
      clearInterval(bearData.interval)
      bearData.interval = setInterval(()=>{
        if (!circleData.key) {
          clearInterval(bearData.interval)
        } else {
          turnSprite({ e:circleData.key, actor: bearData, animate: true})
        }
      }, 100)
    }
  }

  const placeBear = () =>{
    const bear = document.createElement('div')
    bear.classList.add('bear_wrapper')
    circleWrapper.append(bear)
    bear.innerHTML = '<div><div class="bear"></div></div>'
    bear.style.transform = `translate(0, ${-200 - 10}px)`
    bearData.sprite = bear.childNodes[0].childNodes[0]
  }


  
  placeElements(mapItemsTwo[0], 0)
  rotateCircle('u')
  placeBear()

  window.addEventListener('keydown', e => handleKey(e))
  window.addEventListener('keyup', ()=> {
    turnSprite({ e:circleData.key, actor: bearData })
    circleData.key = null
  })
  


}

window.addEventListener('DOMContentLoaded', init)



  // const placeElements = mapItems =>{
  //   mapItems.forEach((ele, i)=>{
  //     const element = document.createElement('div')
  //     element.style.backgroundColor = ele
  //     element.classList.add('element')
  //     circle.append(element)

  //     // element.style.transform = `translate(${200 - (50 / 2)}px, -${55}px) rotate(${i * 30}deg)`
  //     setTimeout(()=>{
  //       element.style.transform = `translate(${200 - (50 / 2)}px, -${55}px) rotate(${i * 30}deg)`
  //     }, 1000)
  //     element.innerHTML = i
  //     element.style.transformOrigin = `center ${200 + 55}px`
  //   })
  //   elements.elements = document.querySelectorAll('.element')
  //   updateElements()
  // }

    // Object.keys(mapItemsTwo).forEach(index =>{
    //   mapItemsTwo[index].forEach(item => {
    //     if (
    //       (circleData.key === 'r' && checkAngle < item.triggerAngle) ||
    //       (circleData.key === 'l' && checkAngle > item.triggerAngle)
    //     ){
    //       if (!item.placed) placeElement(item)
    //     } else {
    //       // console.log(item.placed)
    //       if (item.placed) {
    //         item.placed.remove()
    //         item.placed = null
    //       }
    //     }
    //   })
    // })    

        // elements.elements.forEach((element, i)=> {
    //   const angle = i * 30 + circleData.angle
    //   const newAngle = angle >= 360 
    //     ? angle - (Math.floor(angle / 360) * 360)
    //     : angle < 0
    //       ? angle - (Math.floor(angle / 360) * 360)
    //       : angle

    //   if ((newAngle === 180) && ['l', 'r'].includes(circleData.key)) {
    //     indexs[i] += indexConfig[circleData.key]
    //   }
      // indexs[i] + Math.floor(circleData.angle / -360)
    //   indexs[i] = indexs[i] === -1 
    //     ? 2
    //     : indexs[i] === 3
    //       ? 0
    //       : indexs[i]

    //   // TODO adjust index based on angle    

    //   element.innerHTML = `<p>[${i}]</p><p>${newAngle}</p><p><${indexs[i]}></p>`
    //   element.className = `element color-${indexs[i]}`
    // })
    // const checkAngle = circleData.angle < 0 ? (circleData.angle + (360 * 3)) : circleData.angle