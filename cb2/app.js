function init() {  

  
  // TODO need someway of drawing map
  // TODO refactor to simplify functions


  const elements = {
    wrapper: document.querySelector('.wrapper'),
    mapCover: document.querySelector('.map-cover'), 
    player: document.querySelector('.player'), 
    mapImage: document.querySelector('.map-image'),
    indicator: document.querySelector('.indicator'),
    cursor: document.querySelector('.cursor')
  }

  const decompress = arr =>{
    const output = []
    const input = arr.split(',')
    input.forEach(x =>{
      const letter = x.split('').filter(y => y * 0 !== 0).join('')
      const repeat = x.split('').filter(y => y * 0 === 0).join('') || 1
      for (let i = 0; i < repeat; i++){
        output.push(letter)
      }
    })
    return output
  }

  const player = {
    pos: 314,
    frameOffset: 0,
    el: elements.player,
    sprite: document.querySelector('.player').childNodes[1],
    facingDirection: 'down',
    walkingDirection: '',
    walkingInterval: '',
    pause: false,
  }

  const settings = {
    transitionTimer: null,
    isWindowActive: false,
    npcs: [
      {
        id: 'dog_1',
        el: Object.assign(document.createElement('div'), 
        { className: 'db',
        }),
        x: 0,
        y: 0,
        pos: 100,
        // start: 31,
        goal: 0,
        carryOn: true,
        delay: 10,
        // displayTimer: null,
        motionTimer: null,
        searchMemory: null,
        route: [],
      }
    ],
    mapImage: {
      el: elements.mapImage.parentNode,
      canvas: elements.mapImage,
      ctx: elements.mapImage.getContext('2d'),
      x: 0, y: 0, w: 0, h: 0
    },
    map: {
      el: elements.mapCover, 
      w: 30, h: 20,
      d: 32,
      column: 30,
      row: 20,
      data: [],
      blocks: [],
    }, 
    cursor: {
      el: elements.cursor,
      x: 0, y: 0,
    },
  }


  const mapX = () => player.pos % settings.map.column 
  const mapY = () => Math.floor(player.pos / settings.map.column)
  const getMapCoord = para => (Math.floor(settings.map[para] / 2) - 1) * settings.map.d
  const clampMax = (n, max) =>  n < max ? n : max
  const px = n => `${n}px`
  const setPos = ({ el, x, y }) => Object.assign(el.style, { left: `${x}px`, top: `${y}px` })
  const setStyles = ({ el, x, y, w, h, d }) => {
    const m = d || 1
    if (w) el.style.width = px(w * m)
    if (h) el.style.height = px(h * m)
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0})`
  }
  const nearestN = (n, denom) => n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % denom) - denom)


  const outputMap = ({ i, tile }) => {
    const { column, d } = settings.map
    const mapX = (i % column) * d
    const mapY = Math.floor(i / column) * d
    settings.mapImage.ctx.fillStyle = tile === '$' ? '#a2fcf0' : '#06a1a1'
    settings.mapImage.ctx.fillRect(mapX, mapY, d, d)
  }

  const adjustMapWidthAndHeight = () =>{
    const { offsetWidth: w, offsetHeight: h } = elements.wrapper
    const { d } = settings.map
  
    settings.map.w = 2 * Math.floor((clampMax(w, 800) / d) / 2)
    settings.map.h = 2 * Math.floor((clampMax(h, 600) / d) / 2)
    setStyles(settings.map)
  
    const x = getMapCoord('w')
    const y = getMapCoord('h')
    
    setPos({ el: elements.player, x, y })

    // adjust mapPosition
    settings.mapImage.x = mapX() * -d + x
    settings.mapImage.y = mapY() * -d + y
    setStyles(settings.mapImage)
    
    settings.mapImage.el.classList.add('transition')
    clearTimeout(settings.transitionTimer)
    settings.transitionTimer = setTimeout(()=> {
      settings.mapImage.el.classList.remove('transition')
    }, 500)
  }
  
  const setUpCanvas = ({ canvas, w, h, ctx }) => {
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h || w)
    ctx.imageSmoothingEnabled = false
  }

  const setupMap = () => {
    const { d, column, row } = settings.map
    settings.map.data = decompress('$14,2,$17,8,$2,8,$7,1,$4,8,$2,5,$2,1,$3,1,$3,1,$2,5,$2,10,$2,9,$2,4,$4,16,$2,2,$2,4,$4,16,$2,2,$2,4,$6,18,$2,4,$6,18,$4,2,$4,20,$4,2,$1,1,$2,20,$2,28,$2,28,$2,28,$15,1,$29,1,$29,1,$135').map(t => t ||'x')
    settings.mapImage.w = column * d
    settings.mapImage.h = row * d

    setUpCanvas(settings.mapImage)
    adjustMapWidthAndHeight()

    settings.map.data.forEach((tile, i) => {
      outputMap({ i, tile })
    })
  }

  const defaultPathMemory = arr => arr.map(()=>{
    return {
      path: null,
      searched: false,
      prev: null
    }
  })

  const y = i => Math.floor(i / settings.map.column)
  const x = i => i % settings.map.column
  const distance = (a, b) => Math.abs(x(a) - x(b)) + Math.abs(y(a) - y(b))

  const chainMotion = ({ npc, instruction, index }) => {
    if (index >= instruction.length) return
    npc.pos = instruction[index]
    moveNpc({ npc, pos: instruction[index] })
    npc.motionTimer = setTimeout(()=>{
      chainMotion({ npc, instruction, index: index + 1 })
    }, 500)
  }


  const selectPath = ({ character, current }) =>{
    character.searchMemory[current].path = 'path'
    character.route.push(current)
  
    if (character.searchMemory[current].prev) {
      selectPath({ 
        character, 
        current: character.searchMemory[current].prev 
      })
    } else {
      chainMotion({
        npc: character,
        instruction: character.route.reverse(),
        index: 0
      })
    }
  }

  const decideNextMove = ({ character, current, count }) =>{
    const { pos, goal, searchMemory } = character
    const { column: w } = settings.map
    if (!character.carryOn) return
    const possibleDestination = [1, -1, -w, w].map(d => d + current)
    if (!possibleDestination.some(c => c === goal)) {
      const mapInfo = []
      possibleDestination.forEach(cell =>{  
        if (noWall(cell) && !searchMemory[cell].searched && cell !== pos) {
          mapInfo.push({ 
            cell, 
            prev: current, 
            distanceToGoal: distance(goal, cell) 
          })
        }
      })
      const minValue = Math.min(...mapInfo.map(c => c.distanceToGoal))
      mapInfo.filter(c => c.distanceToGoal === minValue).forEach(c =>{
        character.searchMemory[c.cell].searched = true 
        character.searchMemory[c.cell].prev = current 
        decideNextMove({ 
          character, 
          current: c.cell, 
          count: count + 1 
        })
      })
    } else {
      character.carryOn = false
      character.searchMemory[goal].prev = current
      clearTimeout(character.motionTimer)
      selectPath({ character, current: goal })
    }  
  }

  const triggerNpcMotion = npc => {
    // console.log('trigger', npc)
    npc.searchMemory = defaultPathMemory(settings.map.data)
    npc.carryOn = true
    // clearTimeout(npc.displayTimer)
    // clearTimeout(npc.motionTimer)
    npc.goal = player.pos
    decideNextMove({ character: npc, current: npc.pos })
  }
  

  const noWall = pos =>{    
    const { map: { data, blocks }, npcs } = settings
    if (!data[pos] || blocks[pos] || player.pos === pos || npcs.some(npc => npc.pos === pos)) return false
    return settings.map.data[pos] !== '$'
  }

  const handleWalk = dir => {
    if (player.walkingDirection !== dir){
      clearInterval(player.walkingInterval)
      player.walkingDirection = dir
      player.walkingInterval = setInterval(()=>{
        player.walkingDirection
          ? walk({ actor: player, dir })
          : clearInterval(player.walkingInterval)
      }, 150)
    }
  }

  const getWalkConfig = dir => {
    const { column , d } = settings.map
    return {
      right: { diff: 1, para: 'x', dist: -d },
      left: { diff: -1, para: 'x', dist: d },
      up: { diff: -column, para: 'y', dist: d },
      down: { diff: column, para: 'y', dist: -d }
    }[dir] 
  }
  
  const walk = ({ actor, dir }) => {
    if (!dir || player.pause) return
    const { diff, para, dist } = getWalkConfig(dir) 
    // TODO add logic for turning animation
  
    if (noWall(actor.pos + diff)) {
      if (actor === player) { // TODO may not require this if this is only used for player
        settings.mapImage[para] += dist
        setStyles(settings.mapImage)
        player.pos += diff
        elements.indicator.innerHTML = `pos:${player.pos} dataX:${mapX()} dataY:${mapY()}`
      } 
    }

    settings.npcs.forEach(npc => {
      // clearTimeout(npc.displayTimer)
      triggerNpcMotion(npc)
    })
  }

  const handleKeyAction = e => {
    const key = e.key ? e.key.toLowerCase().replace('arrow','') : e
    if (e.key && e.key[0] === 'A') handleWalk(key)
  }

  const placeBlock = () => {
    const { d, column } = settings.map
    const { x, y } = settings.cursor
    const { left, top } = settings.mapImage.canvas.getBoundingClientRect()
    const drawPos = {
      x: x - left + window.scrollX,
      y: y - top + window.scrollY
    }
    const index = (((drawPos.y) / d) * column) + drawPos.x / d

    if (noWall(index)) {
      settings.map.blocks[index] = 'b'
      settings.mapImage.ctx.fillStyle = '#ffffff'
      settings.mapImage.ctx.fillRect(drawPos.x, drawPos.y, d, d) 
    }
  }

  const moveCursor = e => {
    const { d } = settings.map
    const { left, top } = settings.mapImage.canvas.getBoundingClientRect()
    settings.cursor.x = nearestN(e.pageX - left - window.scrollX, d) - d + left + window.scrollX
    settings.cursor.y = nearestN(e.pageY - top - window.scrollY, d) - d + top + window.scrollY

    setStyles(settings.cursor)
  }

  const moveNpc = ({ npc, pos }) => {
    const { column, d } = settings.map
    npc.x = Math.floor(pos % column) * d
    npc.y = Math.floor(pos / column) * d
    setPos(npc)
  }

  const addNpcs = () => {
    settings.npcs.forEach(npc => {
      const { pos } = npc
      moveNpc({ npc, pos })
      settings.mapImage.el.appendChild(npc.el)
      triggerNpcMotion(npc)
    })
  }


  setupMap()
  addNpcs()

  console.log('settings', settings)
  
  window.addEventListener('resize', adjustMapWidthAndHeight)
  window.addEventListener('mousemove', moveCursor )
  settings.map.el.addEventListener('click', placeBlock)
  window.addEventListener('keyup', () => {
    player.walkingDirection = null
    clearInterval(player.walkingInterval)
  })
  window.addEventListener('keydown', handleKeyAction)


}

window.addEventListener('DOMContentLoaded', init)



