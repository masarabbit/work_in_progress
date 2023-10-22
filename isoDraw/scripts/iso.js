import { elements, input, tiles, settings, state } from './data.js'

// maybe could have draw mode? (continuous draw)
// upload drawData

function init() { 

  const nearestN = (n, denom) =>{
    return n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % denom) - denom)
  }

  const px = n => n + 'px'

  const resizeCanvas = ({ canvas, w, h }) =>{
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h || w)

    elements.canvas.ctx().imageSmoothingEnabled = false
  }

  const setStyles = ({ el, h, w, x, y }) =>{
    if (h) el.style.height = h
    if (w) el.style.width = w
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0})`
  }

  const updateCanvas = () => {
    const { width, height } = elements.canvas.el
    elements.canvas.ctx().clearRect(0, 0, width, height)

    resizeCanvas({
      canvas: elements.canvas.el,
      w: px(36 * (settings.column - 1) * settings.factor),
      h: px(9 * settings.row * settings.factor),
    })

    elements.canvas.el.style.backgroundPositionY = px(-settings.factor)

    state.cells.forEach(layer => {
      const { factor } = settings
      layer.forEach(c => {
      elements.canvas.ctx().drawImage(
        Array.from(document.querySelectorAll('.palette-tile')).find(tile => tile.dataset.id === c.img),
        c.x * factor, 
        c.y * factor, 
        (36 * factor), (36 * factor))
      })
    })
  }

  const download = () => {
    const link = document.createElement('a')
    link.download = `iso_${new Date().getTime()}.png`
    link.href = elements.canvas.el.toDataURL()
    link.click()
  }
  
  const downloadTextFile = () =>{
    const data = new Blob([JSON.stringify(state.cells, null, 1)], { type: 'text/rtf' })
    const url = window.URL.createObjectURL(data)
    elements.downloadTextLink.download = `iso_draw_cells_${new Date().getTime()}.txt`
    elements.downloadTextLink.href = url
    elements.downloadTextLink.click()
  }
  




  // setup


  updateCanvas()

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

    // elements.indicator.innerHTML = state.cells[layer].length
    updateCanvas()
  })
  
  elements.palette.innerHTML = Object.keys(tiles).map(tile => {
    return `<img class="palette-tile" data-id="${tile}" src="${tiles[tile]}">`
  }).join('')

  const paletteTiles = document.querySelectorAll('.palette-tile')

  settings.tile = 'cube'
  elements.stamp.innerHTML = `<img src="${tiles.cube}">`

  elements.stamp.style.setProperty('--m', settings.factor)

  paletteTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      settings.tile = tile.dataset.id
      elements.stamp.innerHTML = `<img src="${tiles[settings.tile]}">`
    })
  })


  // ? maybe this could be done with inputs instead of having individual ones
  Object.keys(input).forEach(key => {
    input[key].addEventListener('change', ()=> {
      if ((state.cells.length > input[key].value) && (key === 'layer')) {
        settings[key] = +input[key].value
        input[key].value = settings[key]
      }

      if (['factor', 'column', 'row'].includes(key)) {
        settings[key] = +input[key].value
        if (key === 'factor') {
          elements.stamp.style.setProperty('--m', settings.factor)
          elements.canvas.el.style.setProperty('--m', settings.factor)
        } 

        updateCanvas()
      }
    })
  })

  elements.canvas.el.addEventListener('mouseover', ()=> elements.stamp.classList.remove('d-none'))
  elements.canvas.el.addEventListener('mouseleave', ()=> elements.stamp.classList.add('d-none'))

  window.addEventListener('mousemove', e => {
    const { left, top } = elements.canvas.el.getBoundingClientRect()
    const { pageX: pX, pageY: pY } = e

    const cX = 18 * settings.factor
    const cY = 9 * settings.factor
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
    })


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
      
      // TODO possibly break this out to another function
      settings.erase = false
      elements.stamp.classList[settings.erase ? 'add' : 'remove']('erase-mode')
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
    addBtnAction('download-data', downloadTextFile)
  })


}

window.addEventListener('DOMContentLoaded', init)




