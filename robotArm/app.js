
function init() { 
  console.log('test')

  const isNum = x => typeof x === 'number'
  const px = num => `${num}px`
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))

  const setStyles = ({ target, h, w, x, y, deg }) =>{
    if (isNum(w)) target.style.width = px(w)
    if (isNum(h)) target.style.height = px(h)
    if (isNum(x)) target.style.left = px(x)
    if (isNum(y)) target.style.top = px(y)
    if (isNum(deg)) target.style.transform = `rotate(${deg}deg)`
  }

  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))

  const armData = {
    arm1Deg: 10,
    arm2Deg: 30,
    pos: {
      x: null,
      y: null
    }
  }

  const elements = {
    arm1: document.querySelector('.joint-1'),
    arm2: document.querySelector('.joint-2'),
    indicator: document.querySelector('indicator'),
    body: document.querySelector('body')
  }

  
  const control = {
    x: null,
    y: null
  }


  const { left, top } = elements.arm1.getBoundingClientRect()

  armData.pos.x = left + 25
  armData.pos.y = top + 25

  setInterval(()=> {
    const deg1 = armData.arm1Deg += 10
    const deg2 = armData.arm2Deg -= 20

    setStyles({
      target: elements.arm1,
      deg: deg1
    })
    setStyles({
      target: elements.arm2,
      deg: deg2
    })
  
  }, 200)
  
  elements.body.addEventListener('click', e => {
    control.x = e.pageX
    control.y = e.pageY
    console.log(distanceBetween(control, armData.pos))

    // const length0 = 300
    // const length1 = 200
    // const length2 = distanceBetween(control, armData.pos)

    // // Inner angle alpha
    // const cosAngle0 = ((length2 * length2) + (length0 * length0) - (length1 * length1)) / (2 * length2 * length0);
    // const angle0 = radToDeg(Math.acos(cosAngle0))
    
    // // Inner angle beta
    // const cosAngle1 = ((length1 * length1) + (length0 * length0) - (length2 * length2)) / (2 * length1 * length0);
    // const angle1 = radToDeg(Math.acos(cosAngle1))
    
    // setStyles({
    //   target: elements.arm1,
    //   deg: angle0 
    // })
    // setStyles({
    //   target: elements.arm2,
    //   deg: angle1
    // })
  })

  const animateCell = ({ target, frameW, start, end, interval, speed }) => {
    const startFrame = start || 0
    let i = startFrame
    clearInterval(interval)
    interval = setInterval(()=> {
      target.style.transform = `translateX(${px(i * -frameW)})`
      i = i >= end
        ? startFrame
        : i + 1
    }, speed || 100)
  }

  const createBelt = () => {
    const belt = document.createElement('div')
    belt.classList.add('belt_wrapper')
    belt.innerHTML = `
      <div class="conveyor_belt_edge_wrapper">
        <div class="conveyor_belt_edge img-bg">
        </div>
      </div>
      <div class="conveyor_belt_wrapper">
        <div class="conveyor_belt img-bg">
        </div>
      </div>
      <div class="conveyor_belt_wrapper">
        <div class="conveyor_belt img-bg">
        </div>
      </div>
      <div class="conveyor_belt_wrapper">
        <div class="conveyor_belt img-bg">
        </div>
      </div>
      <div class="conveyor_belt_edge_wrapper flip">
        <div class="conveyor_belt_edge img-bg">
        </div>
      </div>
    `
    elements.body.append(belt)
    const beltData = [null, null, null, null]
    console.log('test', belt.childNodes[1].childNodes[1])
    animateCell({ 
      target: belt.childNodes[1].childNodes[1],
      end: 4,
      frameW: 36,
      interval: beltData[0] 
    })
    animateCell({ 
      target: belt.childNodes[3].childNodes[1],
      end: 4,
      frameW: 20,
      interval: beltData[1] 
    })
    animateCell({ 
      target: belt.childNodes[5].childNodes[1],
      end: 4,
      frameW: 20,
      interval: beltData[2] 
    })
    animateCell({ 
      target: belt.childNodes[7].childNodes[1],
      end: 4,
      frameW: 20,
      interval: beltData[2] 
    })
    animateCell({ 
      target: belt.childNodes[9].childNodes[1],
      end: 4,
      frameW: 36,
      interval: beltData[3] 
    })
    // setStyles({
    //   target: belt,
    // })
  }

  createBelt()
  
}
  
window.addEventListener('DOMContentLoaded', init)

