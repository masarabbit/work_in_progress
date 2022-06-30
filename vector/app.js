import vector from './vector.js'

function init() {  
  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')
  const indicator = document.querySelector('.indicator')
  
  const w = 800
  const h = 500
  const testSmile = [
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAbdJREFUeF7tmcEOgkAMRPX/P1pj4kE2sO3rTjGE8WqZtq/TBfH5uPnnefP+HwZgB/QTeIlTSF0rFTto1ADsAC0BqWsrYtTSlRwzZFF+lA8Ff6uKChiLr+QwgAmBaAAIOAq+qwNG4hVo2mNwrobqzTSDBM/sNPncMe3RABITswMGSBnXJLi2haCBZZpBgm1t5YVRvQaQAIuIJvS6Q1C9ew5AAt3dCPSn/RjADmE74GK3vWhL2lfgbMfQfAYwc7TiEKQTiSwbfU/z2QGRAyjRcUKr10cTV+fb1PtZgdUGVq83AEhgFbgd8AtcsQJwgH8Plzvg7x3BAgzAK/BD4ApnwOqpP32OMADBgxA8g3C4HSB+P9F+F4j+vaUWyLy5JpoG0H0btAOIHxOx7Sug/r2d6OnUkPY3Qqd2U0hmANErMa/AQED95FVwrfQSr4BXYEtgc1tV/DEi9WuDGF6Bqx+K6AzLPGUhwYYJUklUrwEk8CKiCb3uEFRvxgHRmRA1VMkx04x+baJ8KPhbVVTAWHwlhwFMCEQDQMBRsB0Qbfv+99HEqGplaIc5pGIHWQyAjjiIlw5NKnZFB7wBWU2IMZJ83DwAAAAASUVORK5CYII=',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAahJREFUeF7tmW0TgjAMg/H//2g9T84XDpaGJYC3+JWZtk/TOcdtGvxzG7z+KQDigMEJZAQGN0A2QccI3MWucuT4TtEhHgBxgJaAw6VdI4Asrk4YxVvipuJTi+dIKKE9mi3PoHgBsCBANYBaPKoDlhbcA027LbbVqHwrxVCCR1a6EYvKNwAKHaOIFvTcS6h81xxACbirEeg36wmAFcJxQM/BQmBZtYR9BI52DBsvAFqOVmyCbEd6Lc7GiwOQA1iiyw72fp91RG+8n+8/R0AqOE32m2ZpvgEQB/SPADvDZ6+X7wFnF8TGD4BvYopNkO3A2evtDuj9mXKfMwLAPQJxgPg+wQpU8W8QbWrsq62uV13sDVcAsMRQuwt6rETl3UVL034fgAoafgQQIPfz0x3gLhDpBwC6EnMfPVGH3M9pB/w7EOrgVPmJoQTd7SzoU/kGgJpoQc+9RO4AtCeggiouQxrfz9HBiopHLZ6zQAmo/8ywDaBqohYHwIvA8A5g5nUPMKS/x7WbmlKxjSisYwIAEJA2TSoWByDzXvD5EQ64YNmflALg0u05ILkHzIB8Nax/7NUAAAAASUVORK5CYII='
]

  const resizeCanvas = ({ canvas, w, h }) =>{
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h || w)
  }

  resizeCanvas({ canvas, w, h})

  const drawImage = ({ src, x, y, w, h }) =>{
    const img = new Image()      
    img.onload = () => {
      ctx.drawImage(img, x || 0, y || 0, w, h)
    }
    img.src = src
  }

  drawImage({ src: testSmile[0], w: 32, h: 32})
  const frames = []
  const storeImage = (src, frame) =>{
    const img = document.createElement('img')   
    img.src = src
    frame.push(img)
  }
  
  testSmile.forEach(f => storeImage(f, frames))

  const smily = {
    ...vector, 
    frames: [], 
    count: 0, 
    i: 0, 
    s: { x: 0.5, y: 3 },
    accelerate: function() {
      //* this needs improvement. Too linear
      //* need to add gravity
      // this.s.x = this.s.x < 0 ? this.s.x - 0.001 : this.s.x + 0.001
      // this.s.y = this.s.y < 0 ? this.s.y - 0.001 : this.s.y + 0.001
      this.s.x *= 1.001
      this.s.y *= 1.001
    },
    bounce: function({elem, key, axis}) {
      if (elem < 0 || (elem + 32) > axis) {
        // this.s[key] = this.s[key] < 0 ? -3 : 3
        this.s[key] *= -0.95
      }  
    }, 
  }
  testSmile.forEach(f => storeImage(f, smily.frames))
  console.log(smily.get('x'))


	const update = () => {
		ctx.clearRect(0, 0, w, h)

    smily.count++
    smily.incrementFrame()
    const x = smily.get('x')
    const y = smily.get('y')

    smily.bounce({ elem: x, key: 'x', axis: w})
    smily.bounce({ elem: y, key: 'y', axis: h})
    smily.accelerate()
    smily.set('x', x + smily.s.x)
    smily.set('y', y + smily.s.y) 

    ctx.drawImage(smily.frames[smily.i], smily.get('x'), smily.get('y'), 32, 32)

    // indicator.innerHTML = `s: ${smily.s.x} / ${smily.s.y}`
		requestAnimationFrame(update)
	}

  update()

  // ctx.fillStyle = '#000000'
  // ctx.fillRect(5, 5, 30, 20)

}

window.addEventListener('DOMContentLoaded', init)



