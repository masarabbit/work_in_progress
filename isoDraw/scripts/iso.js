import { elements, tiles, settings } from './data.js'

function init() { 
  
  // TODO add ways to download layers into one sheet

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
    })
  })

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
    const { width, height } = elements.canvas.el
    elements.canvas.ctx().clearRect(0, 0, width, height)

    state.cells.forEach(layer => {
      const { factor } = settings
      layer.forEach(c => {
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

    const x = (sX - left) / factor
    const y = (sY - top) / factor
  
    state.cells[layer] = state.cells[layer].filter(c => c.x !== x || c.y !== y)

    if (!settings.erase) {
      state.cells[layer].push({
        img: settings.tile,
        x, y
      })
      state.cells[layer].sort((a, b) => a.y - b.y)
    }

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

  elements.canvas.el.addEventListener('mouseover', ()=> elements.stamp.classList.remove('d-none'))
  elements.canvas.el.addEventListener('mouseleave', ()=> elements.stamp.classList.add('d-none'))

  window.addEventListener('mousemove', e => {
    const { left, top } = elements.canvas.el.getBoundingClientRect()
    const { pageX: pX, pageY: pY } = e

    const cX = 18 * 2
    const cY = 9 * 2
    const x = nearestN(pX - left - window.scrollX, cX) - cX + left + window.scrollX
    const y = nearestN(pY - top - window.scrollY, cY) - cY + top + window.scrollY
    setStyles({
      el: elements.stamp,
      x, y
    })

    elements.stamp.setAttribute(
      'data-coord', 
      `${(x - left - window.scrollX) / settings.factor}-${(y - top - window.scrollY) / settings.factor}`
      )
    elements.stamp.innerHTML = `<img src="${tiles[settings.tile]}">`
  })

  const download = () => {
    const link = document.createElement('a')
    link.download = `iso_${new Date().getTime()}.png`
    link.href = elements.canvas.el.toDataURL()
    link.click()
  }



  elements.btns.forEach(btn => {
    const addBtnAction = (actionName, action) => {
      if (btn.dataset.action === actionName) {
        btn.addEventListener('click', action)
      }
    }
    
    addBtnAction('download', download)
    addBtnAction('add-layer', ()=> {
      state.cells.push([])
      elements.max.innerHTML = state.cells.length - 1

      const cellsInput = Object.assign(document.createElement('textarea'), {
        value: state.cells.length - 1,
        className: 'cells',
        spellcheck: false,
      })
      cellsInput.setAttribute('data-index', state.cells.length - 1)
      elements.layers.appendChild(cellsInput)
      elements.cellData = document.querySelectorAll('.cells')
      settings.layer = state.cells.length - 1
      input.layer.value = settings.layer  
    })
    addBtnAction('layer-up', ()=> {
      settings.layer = settings.layer < state.cells.length - 1 
        ? settings.layer + 1 
        : 0
      input.layer.value = settings.layer  
    })
    addBtnAction('layer-down', ()=> {
      settings.layer = settings.layer === 0 
        ? state.cells.length - 1
        : settings.layer - 1
      input.layer.value = settings.layer  
    })
    addBtnAction('erase', ()=> {
      settings.erase = !settings.erase
      elements.stamp.classList[settings.erase ? 'add' : 'remove']('erase-mode')
    })
  })


}

window.addEventListener('DOMContentLoaded', init)




