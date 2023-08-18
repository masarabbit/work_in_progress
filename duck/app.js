
function init() { 

  const elements = {
    duck: document.querySelector('.duck'),
    ducklings: document.querySelectorAll('.duckling'),
    // body: document.querySelector('.wrapper'),
    // wrapper: document.querySelector('.wrapper'),
    // dog: document.querySelector('.dog'),
    // marker: document.querySelectorAll('.marker'),
    // indicator: document.querySelector('.indicator'),
  }

  const px = num => `${num}px`
  const setStyles = ({ target, h, w, x, y }) =>{
    if (h) target.style.height = h
    if (w) target.style.width = w
    target.style.transform = `translate(${x || 0}, ${y || 0})`
  }

  const control = {
    duck: {
      target: elements.duck,
      x: null,
      y: null,
      angle: null,
      offset: 24
    },
    Ducklings: [ // ? this could be set with function too.
      {
        target: elements.ducklings[0],
        x: null,
        y: null,
        angle: null,
        timer: null,
        offset: 6,
      },
      {
        target: elements.ducklings[1],
        x: null,
        y: null,
        angle: null,
        timer: null,
        offset: 6,
      },
      {
        target: elements.ducklings[2],
        x: null,
        y: null,
        angle: null,
        timer: null,
        offset: 6,
      },
    ]
  }

  const updateData = (data, newData) => {
    Object.keys(newData).forEach(key => {
      data[key] = newData[key]
    })
  }

  // const updateDuckData = data => {
  //   const { target, x, y } = data
  //   setStyles(data)
  // }

  const moveDucklings = e => {
    //TODO the position needs to be altered based on where the mother actually is
    control.Ducklings.forEach((baby, i) => {
      clearTimeout(baby.timer)
      baby.timer = setTimeout(()=> {
        moveDuck(e, baby)
      }, i * 200)
    })
  } 

  const moveDuck = (e, duck) => {
    updateData(duck, {
      x: px(e.pageX - duck.offset), 
      y: px(e.pageY - duck.offset),
    })
    setStyles(duck)
  }

  const moveMotherDuck = e => {
    moveDuck(e, control.duck)
    moveDucklings(e)
  }

  window.addEventListener('click', moveMotherDuck)

}
  
window.addEventListener('DOMContentLoaded', init)

