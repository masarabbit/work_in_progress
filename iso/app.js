
  function init() { 

    // const elements = {
    //   tree: { w: 48, h: 60 },
    // }

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
      route: [],
    }

    const bearData = {
      bear: null,
      speed: 200,
      motionrTimer: null,
      frameOffset: 0,
      size: 72,
      animationTimer: ['', ''],
      frame: 0,
      walkCycle: [0, 1, 2, 1],
    }

    const cubePositions = [27, 15, 47, 60, 61, 70]

    const spriteContainer = document.querySelector('.sprite_container')
    const indicator = document.querySelector('.indicator')
    const grid = document.querySelector('.grid')
    const gridContainer = document.querySelector('.grid_container')

    const x = i => i % gridData.w
    const y = i => Math.floor(i / gridData.w)
    const distance = (a, b) => Math.abs(x(a) - x(b)) + Math.abs(y(a) - y(b))
    const gridToMap = (w, h) => new Array(w * h).fill('')
    const isNum = x => typeof x === 'number'

    const styleTarget = ({ target, w, h, x, y }) =>{
      const t = target.style
      if (isNum(w)) t.width = `${w}px`
      if (isNum(w) && !isNum(h)) t.height = `${w}px`
      if (isNum(h)) t.height = `${h}px`
      if (isNum(x)) t.left = `${x}px`
      if (isNum(y)) t.top = `${y}px`
    }

    // TODO maybe change grid to array of array instead of just one array
    const createGrid = () =>{
      const { w, h, c } = gridData
      grid.innerHTML = gridToMap(w, h).map((_cell, i) => `<div class="cell" style="width:${c}px; height:${c}px;">${i}</div>`).join('')
      styleTarget({ target:grid, w: w * c, h: h * c })
    }
    indicator.innerHTML = 'test'

    // const isWall = i => mapData.mapTiles[i].classList.contains('wall')
    const isWall = i => {
      return cubePositions.includes(i) 
      &&
      y(i + 1) <= gridData.h &&
      x(i + 1) <= gridData.w &&
      y(i - 1) >= 0 &&
      x(i - 1) >= 0
    }
    

    const defaultMemory = (w, h) => gridToMap(w, h).map(()=>{
      return {
        path: null,
        searched: false,
        prev: null
      }
    })

    const updateZindex = (target, i) =>{
      target.style.zIndex = 32 + (x(i) * 18) + (y(i) * 18)
    }

    const setSpritePos = (num, actor, sprite) =>{
      actor.spritePos = num
      sprite.style.marginLeft = `${num}px`
    }

    const turnSprite = ({ key, actor }) => {
      const dir = key.toLowerCase().replace('arrow','')[0]

      const { bear, frameOffset, size, frame } = bearData
      const frames = {
        r: ['add', 'remove'],
        l: ['remove' ,'add'],
        u: ['add', 'add'],
        d: ['remove' , 'remove']
      }
      bearData.frame = frame === 0 ? 2 : 0
      if (!frames[dir]) return
      bear.classList[frames[dir][0]]('right') 
      bear.childNodes[0].childNodes[0].classList[frames[dir][1]]('up') 
      setSpritePos(-size * bearData.frame, actor, bear.childNodes[0].childNodes[0])
      // actor.animationTimer = setTimeout(()=>setSpritePos(-size * 1, actor, bear.childNodes[0].childNodes[0]), 100)
    }
    
    window.addEventListener('keyup', e => {
      const { key } = e
      if (key) {
        turnSprite({ key, actor: bearData, })
      }
    })

    const moveBear = i => {
      const { width } = gridContainer.getBoundingClientRect()
      styleTarget({ 
        target: bearData.bear, 
        x: width / 2 - 36 + (x(i) * 36) - (y(i) * 36),
        y: 32 + (x(i) * 18) + (y(i) * 18),
      })
      gridData.start = i
    }
  
    const chainMotion = (route, i) => {
      if (i < route.length) {
        let dir
        if (route[i] - route[i - 1] === -1) dir = 'l'
        if (route[i] - route[i - 1] === 1) dir = 'r'
        if (y(route[i]) > y(route[i - 1])) dir = 'd'
        if (y(route[i]) < y(route[i - 1])) dir = 'u'
        
        if (dir) {
          turnSprite({ key: dir, actor: bearData })
          // ? makes bear walk faster
          // setTimeout(()=> {
          //   turnSprite({ key: dir, actor: bearData })
          // }, 100)
        }
        moveBear(route[i])
        updateZindex(bearData.bear, route[i - 1])
        bearData.motionTimer = setTimeout(()=>{
          chainMotion(route, i + 1)
        }, bearData.speed)
        
        if (!isNum(route[i + 1])) {
          setTimeout(()=> {
            setSpritePos(-bearData.size * 1, bearData, bearData.bear.childNodes[0].childNodes[0])
          }, 300)
        }
      } else {
        updateZindex(bearData.bear, route[i - 1])
      }
    }

    const displayPath = (current, data) =>{
      indicator.innerHTML = data.route
      const { prev } = data.searchMemory[current]
      data.searchMemory[current].path = 'path'
      grid.childNodes[current].classList.add('path')

      if (isNum(prev)) {
        data.route.push(prev)
        data.displayTimer = setTimeout(()=> displayPath(prev, data), data.delay)
      }
  

      // data.searchMemory[current].prev
      //   ? data.displayTimer = setTimeout(()=> displayPath(prev, data), data.delay)
      //   : data.start = goal
      // if(!data.searchMemory[current].prev) console.log('goal', data)

      if (prev === data.start) {
        chainMotion(data.route.reverse(), 0)
        return
      }
    }

    const possibleDestination = i => {
      const { w, h } = gridData
      return [1, -1, -w, w].map(d => d + i).filter(c => {
        return y(c) >= 0 && y(c) <= h
            && x(c) >= 0 && x(c) <= w
            && (x(i) === x(c) || y(i) === y(c))
      })
      // TODO only caters for straight line, need refactor for diagonal
    }

    const decideNextMove = (current, count, data) =>{
      const { start, goal, w, h, searchMemory } = data
      if (!data.carryOn) return
      if (!possibleDestination(current).some(c => c === goal)) {
        const mapInfo = []
        possibleDestination(current).forEach(cell =>{  
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
        data.carryOn = false
        data.searchMemory[goal].prev = current
        data.route.push(goal)
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
      updateZindex(tile, i)

      styleTarget({ 
        target: spriteContainer, 
        w: width,
        h: height,
      })
    }
    cubePositions.forEach(i => createTiles(i))


    const createBear = () =>{
      bearData.bear = document.createElement('div')
      const { bear } = bearData
      bear.classList.add('bear_tile')
      bear.innerHTML = '<div class="bear"><div class="bear_sprite"></div></div>'
      const { width } = spriteContainer.getBoundingClientRect()
      styleTarget({ 
        target: bear, 
        x: width / 2 - 36,
        y: 32,
      })
      spriteContainer.appendChild(bear)
      setSpritePos(-bearData.size * 1, bearData, bearData.bear.childNodes[0].childNodes[0])
    }

    const resetMotion = data =>{
      const { w, h, displayTimer } = data
      clearTimeout(displayTimer)
      grid.childNodes.forEach(tile => tile.className = 'cell')
      data.searchMemory = defaultMemory(w, h)
      data.carryOn = true
      data.route.length = 0
    }

    createBear()



    grid.childNodes.forEach((cell, i) => {
      cell.addEventListener('click', ()=> {
        resetMotion(gridData)
        indicator.innerHTML = `x:${x(i)} y:${y(i)}`
        gridData.goal = i
        if (i !== gridData.start) decideNextMove(gridData.start, 0, gridData)
      })
    })
    
    // setTimeout(()=> moveBear(33), 1000)

  }
  
  window.addEventListener('DOMContentLoaded', init)



