
  function init() { 

    // TODO add guidelines to canvas background

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
      palette: document.querySelector('palette')
    }

    const state = {
      cells: []
    }


    const settings = {
      column: 11, //this is always one more than how many you want
      row: 30,
      factor: 2,
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
          c.x, c.y,
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

      const x = sX - left
      const y = sY - top
      state.cells = state.cells.filter(c => c.x !== x || c.y !== y)
      state.cells.push({
        img: 'stair',
        x, y
      })
      state.cells.sort((a, b) => a.y - b.y)
      elements.cellData.value = state.cells.map(c => `${c.img}.${c.x}-${c.y}`)
      elements.indicator.innerHTML = state.cells.length
      updateCanvas()
    })



    window.addEventListener('mousemove', e => {
      const { left, top } = elements.canvas.el.getBoundingClientRect()
      // const cellD = 18 * 2
      const cX = 18 * 2
      const cY = 9 * 2
      setStyles({
        el: elements.stamp,
        x: nearestN(e.pageX - left - window.scrollX, cX) - cX + left,
        y: nearestN(e.pageY - top - window.scrollY, cY) - cY + top
      })
    })
  }
  
  window.addEventListener('DOMContentLoaded', init)



