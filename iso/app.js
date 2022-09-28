
  function init() { 
    const gridData = {
      w: 9,
      h: 9,
      c: 50.9,
      start: 0,
      goal: 81,
      carryOn: true,
      delay: 10,
      displayTimer: null,
      searchMemory: null,
    }

    const isNum = x => x * 0 === 0

    const styleTarget = ({ target, w, h, x, y }) =>{
      const t = target.style
      if (isNum(w)) t.width = `${w}px`
      if (isNum(w) && !isNum(h)) t.height = `${w}px`
      if (isNum(h)) t.height = `${h}px`
      if (isNum(x)) t.left = `${x}px`
      if (isNum(y)) t.top = `${y}px`
    }

    // const elements = {
    //   tree: { w: 48, h: 60 },
    // }

    const x = i => i % gridData.w
    const y = i => Math.floor(i / gridData.w)
    const distance = (a, b) => Math.abs(x(a) - x(b)) + Math.abs(y(a) - y(b))
    const gridToMap = (w, h) => new Array(w * h).fill('')

    // const body = document.querySelector('body')
    const spriteContainer = document.querySelector('.sprite_container')
    const indicator = document.querySelector('.indicator')
    const grid = document.querySelector('.grid')
    const gridContainer = document.querySelector('.grid_container')
    // TODO maybe change grid to array of array instead of just one array
    const createGrid = () =>{
      const { w, h, c } = gridData
      grid.innerHTML = gridToMap(w, h).map((_cell, i) => `<div class="cell" style="width:${c}px; height:${c}px;">${i}</div>`).join('')
      styleTarget({ target:grid, w: w * c, h: h * c })
    }
    indicator.innerHTML = 'test'
    const cubePositions = [27, 15, 47, 60, 61, 70]
    // const cubePositions = [0, 15, 47]

 

    // const isWall = i => mapData.mapTiles[i].classList.contains('wall')
    const isWall = i => {
      cubePositions.includes(i) 
      // &&
      // y(i + 1) <= gridData.h &&
      // x(i + 1) <= gridData.w &&
      // y(i - 1) >= 0 &&
      // x(i - 1) >= 0
    }
    

    const defaultMemory = (w, h) => gridToMap(w, h).map(()=>{
      return {
        path: null,
        searched: false,
        prev: null
      }
    })
  


    const displayPath = (current, data) =>{
      const { goal } = data
      data.searchMemory[current].path = 'path'
      // console.log('current', current, grid.childNodes[current])
      grid.childNodes[current].classList.add('path')

      data.searchMemory[current].prev
        ? data.displayTimer = setTimeout(()=> displayPath(data.searchMemory[current].prev, data), data.delay)
        : data.start = goal
      // if(!data.searchMemory[current].prev) console.log('goal', data)
    }

    const decideNextMove = (current, count, data) =>{
      const { start, goal, w, h, searchMemory } = data
      if (!data.carryOn) return
      const possibleDestination = [1, -1, -w, w].map(d => d + current) // TODO need to be edited to include diagonal
      if (!possibleDestination.some(c => c === goal)) {
        const mapInfo = []
        // TODO need to check wall / edge of map
        possibleDestination.forEach(cell =>{  
          if (
            !isWall(cell) && !searchMemory[cell]?.searched && cell !== start
            && y(cell) >= 0 && y(cell) <= h
            && x(cell) >= 0 && x(cell) <= w
            ) {
            mapInfo.push({ 
              cell, 
              prev: current, 
              distanceToGoal: distance(goal, cell) 
            })
          }
          // console.log('mapInfo', cell, mapInfo)
        })
        const minValue = Math.min(...mapInfo.map(c => c.distanceToGoal))
        mapInfo.filter(c => c.distanceToGoal === minValue).forEach(c =>{
          if (data.searchMemory[c.cell]) {
            data.searchMemory[c.cell].searched = true 
            data.searchMemory[c.cell].prev = current
            grid.childNodes[c.cell].classList.add('node')   
            setTimeout(()=> decideNextMove(c.cell, count + 1, data), data.delay)
          }
        })
      } else {
        // console.log('else')
        data.carryOn = false
        data.searchMemory[goal].prev = current
        displayPath(goal, data)
      }  
    }

    createGrid()
    const createTiles = i => {
      const tile = document.createElement('div')
      tile.classList.add('tile')
      tile.innerHTML = '<div class="cube"></div>'
      gridContainer.appendChild(tile)
      const { width, height } = gridContainer.getBoundingClientRect()
      styleTarget({ 
        target:tile, 
        x: width / 2 - 36 + (x(i) * 36) - (y(i) * 36),
        y: 67 + (x(i) * 18) + (y(i) * 18),
      })
            // TODO what is 67? (31 + 36)
      tile.style.zIndex = 32 + (x(i) * 18) + (y(i) * 18)

      styleTarget({ 
        target: spriteContainer, 
        w: width,
        h: height,
      })
    }
    cubePositions.forEach(i => createTiles(i))


    const createBear = () =>{
      const bear = document.createElement('div')
      bear.classList.add('tile')
      bear.innerHTML = '<div class="bear"><div class="bear_sprite"></div></div>'
      const { width } = spriteContainer.getBoundingClientRect()
      styleTarget({ 
        target: bear, 
        x: width / 2 - 36,
        y: 32,
      })
      spriteContainer.appendChild(bear)
    }

    const resetMotion = data =>{
      const { w, h, displayTimer } = data
      clearTimeout(displayTimer)
      grid.childNodes.forEach(tile => tile.className = 'cell')
      data.searchMemory = defaultMemory(w, h)
      data.carryOn = true
    }

    createBear()
    grid.childNodes.forEach((cell, i) => {
      cell.addEventListener('click', ()=> {
        resetMotion(gridData)
        indicator.innerHTML = `x:${x(i)} y:${y(i)}`
        gridData.goal = i
        decideNextMove(gridData.start, 0, gridData)
      })
    })



  }
  
  window.addEventListener('DOMContentLoaded', init)



