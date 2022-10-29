function init() {  
  const svgs = {
    // light: `<path fill="#f45252" d="M 0 0 h 30 v 30 h -30 v -30"/> <path fill="#fff194" d="M 12 2 h 6 v 1 h 2 v 1 h 2 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 2 h 1 v 2 h 1 v 6 h -1 v 2 h -1 v 2 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -2 v 1 h -2 v 1 h -6 v -1 h -2 v -1 h -2 v -1 h -1 v -1 h -1 v -1 h -1 v -1 h -1 v -2 h -1 v -2 h -1 v -6 h 1 v -2 h 1 v -2 h 1 v -1 h 1 v -1 h 1 v -1 h 1 v -1 h 2 v -1 h 2 v -1"/> <path fill="#c3ac83" d="M 12 4 h 6 v 1 h 2 v 1 h 2 v 1 h 1 v 1 h 1 v 2 h 1 v 2 h 1 v 6 h -1 v 2 h -1 v 2 h -1 v 1 h -1 v 1 h -2 v 1 h -2 v 1 h -6 v -1 h -2 v -1 h -2 v -1 h -1 v -1 h -1 v -2 h -1 v -2 h -1 v -6 h 1 v -2 h 1 v -2 h 1 v -1 h 1 v -1 h 2 v -1 h 2 v -1"/>`
    light: `<path fill="#21c4c12d" d="M27,12v-2h-1V8h-1V7h-1V6h-1V5h-1V4h-2V3h-2V2h-6v1h-2v1H8v1H7v1H6v1H5v1H4v2H3v2H2v6h1v2h1v2h1v1h1v1h1v1h1v1
    h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-2h1v-2h1v-6H27z M26,18h-1v2h-1v2h-1v1h-1v1h-2v1h-2v1h-6v-1h-2v-1H8v-1H7v-1H6v-2H5v-2
    H4v-6h1v-2h1V8h1V7h1V6h2V5h2V4h6v1h2v1h2v1h1v1h1v2h1v2h1V18z"/>
  <path fill="#01082ecc" d="M0,0v30h30V0H0z M28,18h-1v2h-1v2h-1v1h-1v1h-1v1h-1v1h-2v1h-2v1h-6v-1h-2v-1H8v-1H7v-1H6v-1H5v-1H4v-2H3v-2H2
    v-6h1v-2h1V8h1V7h1V6h1V5h1V4h2V3h2V2h6v1h2v1h2v1h1v1h1v1h1v1h1v2h1v2h1V18z"/>`
  }


  // TODO encryption needs to be fixed
  // const decodeRef = {
  //   a: ' h 1',
  //   b: ' h 2',
  //   e: ' h 3',
  //   g: ' h 4',
  //   j: ' h 5',
  //   A: ' v 1',
  //   B: ' v 2',
  //   E: ' v 3',
  //   G: ' v 4',
  //   J: ' v 5',
  //   n: 'h -1',
  //   u: ' h -2',
  //   k: ' h -3',
  //   x: ' h -4', 
  //   i: ' h -5',
  //   N: ' v -1',
  //   U: ' v -2', 
  //   K: ' v -3',
  //   X: ' v -4', 
  //   I: ' v -5',
  //   w: ' v ', 
  //   W: ' h ',
  //   D: '<path d="M',
  //   d: '<path d="M',
  //   o: '<path fill="#fcbbc3" d="M',
  //   F: '<path fill="#fff" d="M',
  //   f: '<path fill="#fff" d="M',
  //   '/': '/>',
  // }

  // const decode = arr =>{
  //   return arr.split('').map(c=>{
  //     if (!decodeRef[c]) return c
  //     return decodeRef[c]
  //   }).join('')
  // }

  const decode = arr =>{
    return arr.split('').map(c => {
      if (c === 'D') return '<path d="M'
      if (c === 'F') return '<path fill="#fff" d="M'
      if (c === '/') return '/>'
      if (c === 'N') return '-1' 
      if (c === 'T') return '-2'
      return c
    }).join('')
  }
  
  // const decompress = arr =>{
  //   const output = []
  //   const input = Array.isArray(arr) ? arr : arr.split(',')
  //   input.forEach(x=>{
  //     const letter = x.split('').filter(y => y * 0 !== 0).join('')
  //     const repeat = x.split('').filter(y => y * 0 === 0).join('')
  //     for (let i = 0; i < repeat; i++){
  //       output.push(letter)
  //     }
  //   })
  //   return output
  // }
  const elements = {
    wrapper: document.querySelector('.wrapper'),
    ocean: document.querySelector('.ocean'),
    oceanContent: document.querySelector('.ocean-content')
  }

  const oceanData = {
    lightPos: {
      x: null,
      y: null,
    }
  }


  const isNum = x => typeof x === 'number'
  const px = num => `${num}px`

  const setStyles = ({ target, h, w, x, y, deg }) =>{
    if (h) target.style.height = h
    if (w) target.style.width = w
    if (y) target.style.top = y
    if (x) target.style.left = x
    if (isNum(deg)) target.style.transform = `rotate(${deg}deg)` // TODO maybe not required for this app
  }

  const singleSvgWrapper = ({ content, color, frameSize }) =>{
    const size = frameSize || 16
    return `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 ${size} ${size}" fill="${color ? color : 'black'}">${content}</svg>`
  }


  transformPos = ({ target, x, y, value }) => {
    target.style.transform = `translate(${x}${value || 'px'},${y}${value || 'px'})`
  }

  const createlight = () => {
    elements.ocean.innerHTML = `
      <div class="blue lg"></div>
        <div class="light-wrapper">
          <div class="blue fill"></div>
          <div class="light">
            ${singleSvgWrapper({
              content: decode(svgs.light),
              frameSize: 30,
            })}
          </div>
          <div class="blue fill"></div>
        </div>
      <div class="blue lg"></div>
    `
    setStyles({
      target: document.querySelector('.light'),
      w: px(120),
      h: px(120)
    })
    
    const { width, height } = elements.wrapper.getBoundingClientRect()
    oceanData.lightPos = {
      x: -width,
      y: -height,
    }

    transformPos({
      target: elements.ocean,
      x: oceanData.lightPos.x,
      y: oceanData.lightPos.y,
    })


    //? test fish
    elements.oceanContent.innerHTML = '<div class="fish"></div>'
    const fish = document.querySelector('.fish')

    setInterval(()=> {
      const { width, height } = elements.wrapper.getBoundingClientRect()
      transformPos({
        target: fish,
        x: `${Math.floor(Math.random() * width)}`,
        y: `${Math.floor(Math.random() * height)}`,
      })
    }, 1000)

  }

  createlight()

  const moveAround = e => {
    e.preventDefault() //TODO maybe people would want to use arrowkeys for scrolling, so allocate different key for sub movement
    const key = e.key ? e.key.toLowerCase().replace('arrow','')[0] : e
    const dir = {
      u: -10,
      r: 10,
      l: -10,
      d: 10
    }

    if (['u', 'd'].includes(key)) oceanData.lightPos.y+= dir[key]
    if (['l', 'r'].includes(key)) oceanData.lightPos.x+= dir[key]

    transformPos({
      target: elements.ocean,
      x: oceanData.lightPos.x,
      y: oceanData.lightPos.y,
    })
  }

  window.addEventListener('keydown', moveAround)

  console.log('test')
}

window.addEventListener('DOMContentLoaded', init)



