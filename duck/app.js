
function init() { 

  // TODO add collision logic for the ducklings
  // TODO add eyes
  // TODO add logic to limit how much the duck walks (currently just based on 1s)
  // TODO make leg webbed

  // TODO waddle should trigger every interval until the duck reach the target.

  const elements = {
    duck: document.querySelector('.duck'),
    ducklingTargets: document.querySelectorAll('.duckling-target'),
    ducklings: document.querySelectorAll('.duckling'),

    indicator: document.querySelector('.indicator'),
    marker: document.querySelectorAll('.marker'),
  }

  const px = num => `${num}px`
  const radToDeg = rad => Math.round(rad * (180 / Math.PI))
  const degToRad = deg => deg / (180 / Math.PI)
  const nearestN = (x, n) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n)

  const positionMarker = (i, pos) => {
    elements.marker[i].style.left = px(pos.x)
    elements.marker[i].style.top = px(pos.y)
  }


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
    target: {
      x: 0,
      y: 0,
    },
    cursor: {
      x: null,
      y: null,
    },
    duck: {
      el: elements.duck,
      x: 0,
      y: 0,
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
    ducklingTargets: [ // ? this could be set with function too.
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
    ],
    ducklings: [ // ? this could be set with function too.
    {
      el: elements.ducklings[0],
      x: null,
      y: null,
      angle: null,
      timer: null,
      offset: 6,
    },
    {
      el: elements.ducklings[1],
      x: null,
      y: null,
      angle: null,
      timer: null,
      offset: 6,
    },
    {
      el: elements.ducklings[2],
      x: null,
      y: null,
      angle: null,
      timer: null,
      offset: 6,
    },
  ]
  }


  const getValueWithinBound = ({ value, min, max, buffer }) => {
    return value = value < (min - buffer)
    ? min - buffer
    : value > (max + buffer)
    ? max + buffer
    : value
  }

  const moveWithinBound = ({ el, boundary, pos, buffer }) => {
    const { left: hX, top: hY, width, height } = boundary.getBoundingClientRect()

    setStyles({ 
      el, 
      x: getValueWithinBound({
          value: pos.x - (el.clientWidth / 2),
          min: hX,
          max: hX + width - el.clientWidth,
          buffer: buffer.x
        }) - hX, 
      y: getValueWithinBound({
          value: pos.y - (el.clientHeight / 2),
          min: hY,
          max: hY + height - el.clientHeight,
          buffer: buffer.y
        }) - hY, 
    })
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

  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))


  const getOffsetPos = ({ x, y, distance, angle }) => {
    return {
      x: x + (distance * Math.cos(degToRad(angle))),
      y: y + (distance * Math.sin(degToRad(angle)))
    }
  }



  // https://mathwords.net/naibunzahyo

  const getNewPosBasedOnTarget = ({ start, target, distance: d, fullDistance }) => {

    const { x: aX, y: aY } = start
    const { x: bX, y: bY } = target
    
    const leftD = fullDistance - d
    return {
      x: Math.round(((leftD * aX) + (d * bX)) / fullDistance),
      y: Math.round(((leftD * aY) + (d * bY)) / fullDistance)
    }
  }

  const moveDucklings = ({ x, y }) => {
    //TODO the position needs to be altered based on where the mother actually is
    control.ducklingTargets.forEach((duckling, i) => {
      clearTimeout(duckling.timer)
      duckling.timer = setTimeout(()=> {
        moveDuck(getOffsetPos({
          x, y, 
          angle: control.duck.angle + 90, 
          distance: 60 + (50 * i)
        }), duckling)
      }, (i + 1) * 150)
    })
  } 

  const moveDuck = ({ x, y }, duck) => {
    updateData(duck, {
      x: x - duck.offset, 
      y: y - duck.offset,
    })
    setStyles(duck)
  }

  const moveMotherDuck = ({ x, y }) => {
    moveDuck({ x, y }, control.duck)
    moveDucklings({ x, y })
  }

  window.addEventListener('click', e => {
    control.target = {
      x: e.pageX,
      y: e.pageY
    }
    positionMarker(0, {
      x: e.pageX,
      y: e.pageY
    })
  })


  const animateDuck = () => {

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

    //TODO temp
    // TODO maybe this should track things diffrently
    ;[
      { 
        el: document.querySelector('.beak'), 
        boundary: document.querySelector('.duck-head'),
      },
    ].forEach(item => {
        moveWithinBound({
          el: item.el,
          boundary: item.boundary,
          pos: control.duck,
          buffer: item.buffer || { x: 5, y: 5 } 
        })
      })

  }

  window.addEventListener('mousemove', e => {
    control.cursor.x = e.pageX
    control.cursor.y = e.pageY

    // control.target = {
    //   x: e.pageX,
    //   y: e.pageY
    // }

    positionMarker(0, {
      x: e.pageX,
      y: e.pageY
    })
  })

  const triggerMovement = () => {

    setInterval(()=> {
      const fullDistance = distanceBetween(control.duck, control.cursor)

      console.log(fullDistance)
      if (!fullDistance || fullDistance < 100) {
        control.duck.el.classList.remove('waddle')

        // TODO can even stop interval at this point
        return
      }  

      const { x, y } = getNewPosBasedOnTarget({
        distance: 100,
        fullDistance,
        start: control.duck,
        target: control.cursor
      })
      
      // TODO need to add logic to adjust angle

      moveMotherDuck({ x, y })
  
      positionMarker(1, { x, y })
      animateDuck()
    }, 1000)
    
    control.ducklings.forEach((duckling, i) => {
      setInterval(()=> {
        const fullDistance = distanceBetween(duckling, control.ducklingTargets[i])

        // const otherDucks = control.ducklings.map((ducklings, n) => {
        //   return i !== n ? ducklings : control.duck
        // })
        
        // const distanceFromOthers = otherDucks.map(otherDuck => distanceBetween(duckling, otherDuck))

        // console.log(i, distanceFromOthers)

        if (
          !fullDistance 
          || fullDistance < 40
          ) {
          // control.duck.el.classList.remove('waddle')
          // TODO add logic to make it move around?
          return
        }  
        const { x, y } = getNewPosBasedOnTarget({
          distance: 30,
          fullDistance,
          start: duckling,
          target: control.ducklingTargets[i]
        })
        moveDuck({ x, y }, duckling)
        
        // console.log(fullDistance)
      }, 300)
    })
  
  }

  triggerMovement()

  // TODO getOffSetPos isn't the right way to get this answer

}
  
window.addEventListener('DOMContentLoaded', init)

