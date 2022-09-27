
  function init() { 
    const gridData = {
      w: 9,
      h: 9,
      c: 50.9,
    }

    const isNum = x => x * 0 === 0

    const styleTarget = ({ target, w, h, x, y }) =>{
      const t = target.style
      if (isNum(w)) t.width = `${w}px`
      if (isNum(w) && !isNum(h)) t.height = `${w}px`
      if (isNum(h)) t.height = `${h}px`
      if (isNum(x)) t.left = `${x}px`
      if (isNum(y)) t.top = `${y}px`
      // if (isNum(bY)) t.bottom = `${bY}px`
    }

    const elements = {
      tree: { w: 48, h: 60 },
    }

    // const body = document.querySelector('body')
    const indicator = document.querySelector('.indicator')
    const grid = document.querySelector('.grid')
    const gridContainer = document.querySelector('.grid_container')
    // TODO maybe change grid to array of array instead of just one array
    const createGrid = () =>{
      const { w, h, c } = gridData
      grid.innerHTML = new Array(w * h).fill('').map((_cell, i) => `<div class="cell" style="width:${c}px; height:${c}px;">${i}</div>`).join('')
      styleTarget({ target:grid, w: w * c, h: h * c })
      grid.childNodes.forEach((cell, i) => {
        cell.addEventListener('click', ()=> console.log(i))
      })
    }
    indicator.innerHTML = 'test'
    const cubePositions = [0, 15, 47, 60, 61, 70]
    // const cubePositions = [0, 15, 47]

    const calcX = i => i % gridData.w
    const calcY = i => Math.floor(i / gridData.w)

    createGrid()
    const createTiles = i => {
      const tile = document.createElement('div')
      tile.classList.add('tile')
      tile.innerHTML = '<div class="cube"></div>'
      gridContainer.appendChild(tile)
      const { width } = gridContainer.getBoundingClientRect()
      styleTarget({ 
        target:tile, 
        x: width / 2 - 36 + (calcX(i) * 36) - (calcY(i) * 36),
        y: 67 + (calcX(i) * 18) + (calcY(i) * 18),
      })
            // TODO what is 67? (31 + 36)
      // const { w, h } = gridData 
      // const nI = w * h - i
      // styleTarget({ 
      //   target:cube, 
      //   x: width / 2 - 36 + calcX(i) * 36 - calcY(i) * 36,
      //   bY: 32 + calcY(nI) * 36 - calcX(nI) * 18,
      //   //- calcX(nI) * 18,
      // })
      // console.log(nI, 'xNi:',calcX(nI), 'yNi', calcY(nI), 'x:',calcX(i), 'y:',calcY(i))
      tile.style.zIndex = 32 + (calcX(i) * 18) + (calcY(i) * 18)

    }
    cubePositions.forEach(i => createTiles(i))
    // console.log(cubePositions.map(i => [calcX(i), calcY(i)]))

  }
  
  window.addEventListener('DOMContentLoaded', init)



