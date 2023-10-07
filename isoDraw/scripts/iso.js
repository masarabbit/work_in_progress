import { tiles } from './data.js'

function init() { 

  // TODO add guidelines to canvas background
  // TODO how to control layers? might need more canvas layers (either make cells array of arrays, or object with multiple keys, each one for each level). Or, could be same canvas but higher layer gets drawn later.
  // TODO add eraser (filter if x and y matches)

  const elements = {
    canvas: {
      el: document.querySelector('canvas'),
      ctx: function() {
        return this.el.getContext('2d')
      }
    },
    line: document.querySelector('.line'),
    cube: document.querySelector('.cube'),
    stair: document.querySelector('.stair'),
    blank: document.querySelector('.blank'),
    btn: document.querySelector('button'),
    indicator: document.querySelector('.indicator'),
    cellData: document.querySelector('.cells'),
    stamp: document.querySelector('.stamp'),
    palette: document.querySelector('.palette')
  }

  const state = {
    cells: []
  }


  const settings = {
    column: 11, //this is always one more than how many you want
    row: 30,
    factor: 2,
    tile: 'stair'
  }

  const calcX = i => i % settings.column
  const calcY = i => Math.floor(i / settings.column)
  const nearestN = (n, denom) =>{
    return n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % denom) - denom)
  }

  const px = n => n + 'px'

  const resizeCanvas = ({ canvas, w, h }) =>{
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h || w)
  }

  const setStyles = ({ el, h, w, x, y }) =>{
    if (h) el.style.height = h
    if (w) el.style.width = w
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0})`
  }
  

  resizeCanvas({
    canvas: elements.canvas.el,
    w: px(36 * (settings.column - 1) * settings.factor),
    h: px(9 * settings.row * settings.factor),
  })
  elements.canvas.ctx().imageSmoothingEnabled = false
  let shade = '#c2c2c2'
  
  // state.cells = new Array(settings.column * settings.row).fill('blank')
  elements.cellData.value = state.cells

  const updateCanvas = () => {
    state.cells.forEach(c => {
      const { factor } = settings
      // const offset = calcY(i) % 2 === 0 ? 0 : (18 * factor)
      elements.canvas.ctx().drawImage(
        elements[c.img], 
        c.x * factor, 
        c.y * factor, 
        (36 * factor), (37 * factor))
    })
  }
  


  elements.btn.addEventListener('click', ()=> {
    const link = document.createElement('a')
    link.download = `iso_${new Date().getTime()}.png`
    link.href = elements.canvas.el.toDataURL()
    link.click()
  })

  elements.canvas.el.addEventListener('click', () => {
    const { left, top } = elements.canvas.el.getBoundingClientRect()
    const { x: sX, y: sY } = elements.stamp.getBoundingClientRect()

    const x = (sX - left) / settings.factor
    const y = (sY - top) / settings.factor
    state.cells = state.cells.filter(c => c.x !== x || c.y !== y)
    state.cells.push({
      img: settings.tile,
      x, y
    })
    state.cells.sort((a, b) => a.y - b.y)
    elements.cellData.value = state.cells.map(c => `${c.img}.${c.x}-${c.y}`)
    elements.indicator.innerHTML = state.cells.length
    updateCanvas()
  })
  
  elements.palette.innerHTML = Object.keys(tiles).map(tile => {
    return `<img class="palette-tile" data-id="${tile}" src="${tiles[tile]}">`
  }).join('')

  const paletteTiles = document.querySelectorAll('.palette-tile')

  paletteTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      console.log('test', tile.dataset)
      settings.tile = tile.dataset.id
    })
  })

  window.addEventListener('mousemove', e => {
    const { left, top, width, height } = elements.canvas.el.getBoundingClientRect()
    const { pageX: pX, pageY: pY } = e

    elements.stamp.classList[pX < left || pY < top || pX > (left + width) || pY > (top + height) ? 'add' : 'remove']('d-none')
    // const cellD = 18 * 2
    const cX = 18 * 2
    const cY = 9 * 2
    const x = nearestN(pX - left - window.scrollX, cX) - cX + left
    const y = nearestN(pY - top - window.scrollY, cY) - cY + top
    setStyles({
      el: elements.stamp,
      x, y
    })
    elements.stamp.setAttribute('data-coord', `${x - left}-${y - top}`)
    elements.stamp.innerHTML = `<img src="${tiles[settings.tile]}">`
  })
}

window.addEventListener('DOMContentLoaded', init)




