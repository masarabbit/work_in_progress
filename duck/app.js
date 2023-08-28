
function init() { 

  // TODO add collision logic for the ducklings
  // TODO add eyes
  // TODO add logic to limit how much the duck walks (currently just based on 1s)
  // TODO make leg webbed

  // TODO waddle should trigger every interval until the duck reach the target.

  const elements = {
    duck: document.querySelector('.duck'),
    ducklingTargets: document.querySelectorAll('.duckling-target'),
    // body: document.querySelector('.wrapper'),
    // wrapper: document.querySelector('.wrapper'),
    // dog: document.querySelector('.dog'),
    // marker: document.querySelectorAll('.marker'),
    indicator: document.querySelector('.indicator'),
  }

  const px = num => `${num}px`
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))
  const nearestN = (x, n) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n)



  const directionConversions = {
    360: 'up',
    45: 'up right',
    90: 'right',
    135: 'down right',
    180: 'down',
    225: 'down left',
    270: 'left',
    315: 'up left',
  }



  const setStyles = ({ el, h, w, x, y, deg }) =>{
    if (h) el.style.height = h
    if (w) el.style.width = w
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`

    el.style.zIndex = y
  }

  const control = {
    cursor: {
      x: null,
      y: null,
    },
    duck: {
      el: elements.duck,
      x: null,
      y: null,
      angle: null,
      offset: 24,
      neck: {
        el: document.querySelector('.duck-head-wrapper'),
        angle: 0
      },
      body: {
        el: elements.duck.childNodes[1],
        angle: 0
      }
    },
    ducklings: [ // ? this could be set with function too.
      {
        el: elements.ducklingTargets[0],
        x: null,
        y: null,
        angle: null,
        timer: null,
        offset: 6,
      },
      {
        el: elements.ducklingTargets[1],
        x: null,
        y: null,
        angle: null,
        timer: null,
        offset: 6,
      },
      {
        el: elements.ducklingTargets[2],
        x: null,
        y: null,
        angle: null,
        timer: null,
        offset: 6,
      },
    ]
  }





  const elAngle = el =>{
    const { x, y } = control.cursor
    const angle = radToDeg(Math.atan2(el.y - y, el.x - x)) - 90
    const adjustedAngle = angle < 0 ? angle + 360 : angle
    return nearestN(adjustedAngle, 1)
  }

  const updateData = (data, newData) => {
    Object.keys(newData).forEach(key => {
      data[key] = newData[key]
    })
  }


  const getOffsetPos = ({ x, y, distance, angle }) => {
    return {
      pageX: x + distance * Math.cos( angle * (Math.PI / 180) ),
      pageY: y + distance * Math.sin( angle * (Math.PI / 180) )
    }
  }

  const moveDucklings = e => {
    //TODO the position needs to be altered based on where the mother actually is
    control.ducklings.forEach((baby, i) => {
      clearTimeout(baby.timer)
      baby.timer = setTimeout(()=> {
      const { pageX: x, pageY: y } = e
        moveDuck(getOffsetPos({
          x, y, angle: control.duck.angle + 90, distance: 60 + (50 * i)
        }), baby)
      }, (i + 1) * 150)
    })
  } 

  const moveDuck = (e, duck) => {
    updateData(duck, {
      x: e.pageX - duck.offset, 
      y: e.pageY - duck.offset,
    })
    setStyles(duck)

    setTimeout(()=> {
      el.classList.remove('waddle') // TODO should remove this when reached destination
    }, 1000)
  }

  const moveMotherDuck = e => {
    moveDuck(e, control.duck)
    moveDucklings(e)
  }

  window.addEventListener('click', moveMotherDuck)




  window.addEventListener('mousemove', e => {
    control.cursor.x = e.pageX
    control.cursor.y = e.pageY
    // console.log(targetAngle(control.duck), control.cursor, control.duck)

    updateData(control.duck, {
      angle: elAngle(control.duck),
    })

    setStyles({
      el: control.duck.body.el,
      deg: elAngle(control.duck) + 180
    })

    setStyles({
      el: control.duck.neck.el,
      deg: elAngle(control.duck)
    })
    setStyles({
      el: control.duck.neck.el.childNodes[1],
      deg: -elAngle(control.duck)
    })
    
    elements.indicator.innerHTML = directionConversions[nearestN(control.duck.angle, 45)]
    control.duck.el.className = `duck ${directionConversions[nearestN(control.duck.angle, 45)]} waddle`
    
  })

}
  
window.addEventListener('DOMContentLoaded', init)

