
  function init() { 

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
      cellData: document.querySelector('.cells')
    }

    const state = {
      cells: []
    }

    // const settings = {
    //   column: 21, //this is always one more than how many you want
    //   row: 90
    // }


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

    resizeCanvas({
      canvas: elements.canvas.el,
      w: px(36 * (settings.column - 1) * settings.factor),
      h: px(9 * settings.row * settings.factor),
    })
    elements.canvas.ctx().imageSmoothingEnabled = false
    let shade = '#c2c2c2'
    
    state.cells = new Array(settings.column * settings.row).fill('blank')
    elements.cellData.value = state.cells

    const updateCanvas = () => {
      // [...state.cells].reverse().forEach((c, i) => {
      //   const rI = state.cells.length - i - 1
      //   const { factor } = settings
      //   const offset = calcY(rI) % 2 === 0 ? 0 : (18 * factor)
  
      //   elements.canvas.ctx().drawImage(
      //     elements[c], 
      //     calcX(rI) * (36 * factor) - offset,
      //     calcY(rI) * (9 * factor) - (9 * factor), // overlapping one square
      //     (36 * factor), (37 * factor))
      // })
      state.cells.forEach((c, i) => {
        const { factor } = settings
        const offset = calcY(i) % 2 === 0 ? 0 : (18 * factor)
  
        elements.canvas.ctx().drawImage(
          elements[c], 
          calcX(i) * (36 * factor) - offset,
          calcY(i) * (9 * factor) - (9 * factor), // overlapping one square
          (36 * factor), (37 * factor))
      })
    }
    
  

    elements.btn.addEventListener('click', ()=> {
      const link = document.createElement('a')
      link.download = `iso_${new Date().getTime()}.png`
      link.href = elements.canvas.el.toDataURL()
      link.click()
    })

    elements.canvas.el.addEventListener('click', e => {
      const { left, top } = elements.canvas.el.getBoundingClientRect()
      const w = settings.factor * 36
      const h = settings.factor * 9

      const y = nearestN(e.pageY - top, h) / h
      const isEven = y % 2 === 0
      const offsetX = isEven ? w / 2 : 0
      const x = nearestN((e.pageX - left) + offsetX, w) / w
      const adjust = isEven ? y / 2 : (y - 1) / 2

      const index = x + ((y - 1) * settings.column) - adjust - 1
      elements.indicator.innerHTML = `${x} ${y} ${y % 2} [${index}]`

      state.cells[index] = 'stair'
      updateCanvas()

    })

    // state.cells[0] = 'stair'

    // state.cells[22] = 'stair'

    // state.cells[56] = 'stair'
    // state.cells[32] = 'stair' // TODO 32 isn't showing, so probably not mapping out properly
    state.cells[53] = 'stair'
    

    updateCanvas()
  }
  
  window.addEventListener('DOMContentLoaded', init)



