
  function init() { 

    const elements = {
      canvas: {
        el: document.querySelector('canvas'),
        ctx: function() {
          return this.el.getContext('2d')
        }
      },
      line: document.querySelector('.line'),
      btn: document.querySelector('button')  
    }

    // const settings = {
    //   column: 21, //this is always one more than how many you want
    //   row: 90
    // }


    const settings = {
      column: 11, //this is always one more than how many you want
      row: 30
    }

    const calcX = i => i % settings.column
    const calcY = i => Math.floor(i / settings.column)

    const px = n => n + 'px'

    const resizeCanvas = ({ canvas, w, h }) =>{
      canvas.setAttribute('width', w)
      canvas.setAttribute('height', h || w)
    }

    resizeCanvas({
      canvas: elements.canvas.el,
      w: px(36 * (settings.column - 1)),
      h: px(9 * settings.row),
    })
    elements.canvas.ctx().imageSmoothingEnabled = false
    
    new Array(settings.column * settings.row).fill('').forEach((_, i) => {
      const offset = calcY(i) % 2 == 0 ? 0 : 18
      elements.canvas.ctx().drawImage(
        elements.line, 
        calcX(i) * 36 - offset, 
        calcY(i) * 9, // overlapping one square
        36, 10)
    })

    elements.btn.addEventListener('click', ()=> {
      const link = document.createElement('a')
      link.download = `iso_${new Date().getTime()}.png`
      link.href = elements.canvas.el.toDataURL()
      link.click()
    })

  }
  
  window.addEventListener('DOMContentLoaded', init)



