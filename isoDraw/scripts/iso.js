import { tiles } from './data.js'

function init() { 

  // TODO add guidelines to canvas background
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
    btns: document.querySelectorAll('.btn'),
    indicator: document.querySelector('.indicator'),
    cellData: document.querySelectorAll('.cells'),
    stamp: document.querySelector('.stamp'),
    palette: document.querySelector('.palette'),
    max: document.querySelector('.max'),
    layers: document.querySelector('.layers'),
  }


  const input = {
    layer: document.querySelector('.layer'),
  }

  const state = {
    cells: [[]]
  }

  Object.keys(input).forEach(key => {
    input[key].addEventListener('change', ()=> {
      if (state.cells.length > input[key].value) settings[key] = +input[key].value
      input[key].value = settings[key]
      console.log(settings, state.cells)
    })
  })


  const settings = {
    column: 11, //this is always one more than how many you want
    row: 30,
    factor: 2,
    tile: 'stair',
    layer: 0
  }

  // const calcX = i => i % settings.column
  // const calcY = i => Math.floor(i / settings.column)
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


  const updateCanvas = () => {
    state.cells.forEach(layer => {
      const { factor } = settings
      layer.forEach(c => {
        // const offset = calcY(i) % 2 === 0 ? 0 : (18 * factor)
      elements.canvas.ctx().drawImage(
        Array.from(document.querySelectorAll('.palette-tile')).find(tile => tile.dataset.id === c.img),
        c.x * factor, 
        c.y * factor, 
        (36 * factor), (37 * factor))
      })
    })
  }
  




  elements.canvas.el.addEventListener('click', () => {
    const { left, top } = elements.canvas.el.getBoundingClientRect()
    const { x: sX, y: sY } = elements.stamp.getBoundingClientRect()
    const { factor, layer } = settings

    console.log('layer', layer, elements.cellData, settings)

    const x = (sX - left) / factor
    const y = (sY - top) / factor
    state.cells[layer] = state.cells[layer].filter(c => c.x !== x || c.y !== y)
    state.cells[layer].push({
      img: settings.tile,
      x, y
    })
    state.cells[layer].sort((a, b) => a.y - b.y)
    elements.cellData[layer].value = state.cells[layer].map(c => `${c.img}.${c.x}-${c.y}`)
    elements.indicator.innerHTML = state.cells[layer].length
    updateCanvas()
  })
  
  elements.palette.innerHTML = Object.keys(tiles).map(tile => {
    return `<img class="palette-tile" data-id="${tile}" src="${tiles[tile]}">`
  }).join('')

  const paletteTiles = document.querySelectorAll('.palette-tile')

  paletteTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      settings.tile = tile.dataset.id
    })
  })

  window.addEventListener('mousemove', e => {
    const { left, top, width, height } = elements.canvas.el.getBoundingClientRect()
    const { pageX: pX, pageY: pY } = e

    elements.stamp.classList[
      pX < left || pY < top || pX > (left + width) || pY > (top + height) ? 'add' : 'remove'
    ]('d-none')
    const cX = 18 * 2
    const cY = 9 * 2
    const x = nearestN(pX - left - window.scrollX, cX) - cX + left
    const y = nearestN(pY - top - window.scrollY, cY) - cY + top
    setStyles({
      el: elements.stamp,
      x, y
    })
    elements.stamp.setAttribute('data-coord', `${x - left}-${y - top}`) // TODO this might not be in sync
    elements.stamp.innerHTML = `<img src="${tiles[settings.tile]}">`
  })

  const download = () => {
    const link = document.createElement('a')
    link.download = `iso_${new Date().getTime()}.png`
    link.href = elements.canvas.el.toDataURL()
    link.click()
  }

  const addBtnAction = (btn, actionName, action) => {
    if (btn.dataset.action === actionName) {
      btn.addEventListener('click', action)
    }
  }

  elements.btns.forEach(btn => {
    addBtnAction(btn, 'download', download)
    addBtnAction(btn, 'add-layer', ()=> {
      state.cells.push([])
      elements.max.innerHTML = state.cells.length - 1
      // <textarea class="cells" data-index="1" spellcheck="false"></textarea> 
      const cellsInput = Object.assign(document.createElement('textarea'), {
        value: state.cells.length - 1,
        className: 'cells',
        spellcheck: false,
      })
      cellsInput.setAttribute('data-index', state.cells.length - 1)
      elements.layers.appendChild(cellsInput)
      elements.cellData = document.querySelectorAll('.cells')
    })
  })


}

window.addEventListener('DOMContentLoaded', init)




