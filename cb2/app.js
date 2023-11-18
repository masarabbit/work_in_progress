function init() {  
  
  // TODO refactor to simplify functions
  // TODO enable npc to break block
  // TODO enable npcs to be in the same pos?

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
    el: elements.player,
    sprite: document.querySelector('.player').childNodes[1].childNodes[1],
    walkingDirection: '',
    walkingInterval: '',
    pause: false,
    id: 'cb',
    d: 44,
  }

  const settings = {
    transitionTimer: null,
    isWindowActive: false,
    yOffset: 0,
    npcs: [
      {
        id: 'dog_1',
        pos: 100,
        el: Object.assign(document.createElement('div'), 
        { 
          className: 'npc sprite-container',
          innerHTML: '<div class="overflow-hidden"><div class="db sprite"></div></div>'
        }),
        x: 0,
        y: 0,
        goal: 0,
        carryOn: true,
        delay: 10,
        motionTimer: null,
        searchMemory: null,
        route: [],
        isHunting: true,
        track: [],
        pause: false,
        d: 44,
      },
      {
        id: 'mouse',
        pos: 200,
        el: Object.assign(document.createElement('div'), 
        { 
          className: 'npc sprite-container',
          innerHTML: '<div class="overflow-hidden small"><div class="mouse sprite"></div></div>'
        }),
        x: 0,
        y: 0,
        goal: 0,
        carryOn: true,
        delay: 10,
        motionTimer: null,
        searchMemory: null,
        route: [],
        isHunting: false,
        isFleeing: true,
        track: [],
        pause: false,
        d: 36,
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

  const mapX = i => i % settings.map.column
  const mapY = i => Math.floor(i / settings.map.column)
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


  setInterval(()=> {
    ;[player, ...settings.npcs].forEach(actor => {
      settings.yOffset = settings.yOffset + 1 === 4
        ? 0
        : settings.yOffset + 1
      const { sprite: el, d } = actor
      setPos({ el, y: [0, -d, -(d * 2), -d][settings.yOffset] })
    })
  }, 200)

  const outputMap = ({ i, tile }) => {
    const { d } = settings.map
    settings.mapImage.ctx.fillStyle = tile === '$' ? '#a2fcf0' : '#2e1a66'
    settings.mapImage.ctx.fillRect(mapX(i) * d, mapY(i) * d, d, d)
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
    settings.mapImage.x = mapX(player.pos) * -d + x
    settings.mapImage.y = mapY(player.pos) * -d + y
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

    settings.map.data.forEach((tile, i) => outputMap({ i, tile }))
  }

  const defaultPathMemory = arr => arr.map(()=> {
    return {
      searched: false,
      prev: null
    }
  })

  const distance = (a, b) => Math.abs(mapX(a) - mapX(b)) + Math.abs(mapY(a) - mapY(b))

  const chainMotion = ({ npc, route, index }) => {
    const newPos = route[index]
    const { column } = settings.map

    // This bit ensures npc doesn't stay in one place when it get's trapped
    npc.track.push(newPos)
    npc.track = npc.track.slice(-9)
    if (npc.track.filter(cell => cell === newPos).length > 4) {
      npc.isHunting = false
      npc.track.length = 0

      // TODO npc identifies wall close by and attacks it
      const wallCloseBy = [npc.pos + 1, npc.pos - 1, npc.pos + column, npc.pos - column].find(p => settings.map.blocks[p])
      if (wallCloseBy) {
        clearTimeout(npc.motionTimer)
        npc.el.classList.add('attacking')
        npc.el.classList.add(Math.abs(npc.pos - wallCloseBy) === 1 ? 'horizontal' : 'vertical')
        turnSprite({ actor: npc, newPos: wallCloseBy })
        npc.pause = true
        return
      }
    } else if (npc.track.length > 4) {
      npc.isHunting = true
    }

    if (settings.map.blocks[newPos]) {
      triggerNpcMotion(npc)
      return
    } 

    moveNpc({ npc, newPos })
    if (npc.pos === npc.goal || index + 1 >= route.length) {      
      clearTimeout(npc.motionTimer)
      console.log('goal')
    } else {
      npc.motionTimer = setTimeout(()=>{
        chainMotion({ npc, route, index: index + 1 })
      }, 500)
    }
  }


  const selectPath = ({ character, current }) =>{
    character.route.push(current)
    if (character.searchMemory[current].prev) {
      selectPath({ 
        character, 
        current: character.searchMemory[current].prev 
      })
    } else {
      chainMotion({
        npc: character,
        route: character.route.reverse(),
        index: 0
      })
    }
  }


  const avoidPlayer = npc => {
    const { pos: p } = npc
    const { column: w } = settings.map
    let motion = [ 1, -1, w, -w ]
    const target = settings.npcs[0]
    const checkAndRemoveDir = ({ arr, dir }) => {
      if (arr.includes(target.pos)) {
        motion = motion.filter(option => option !== dir)
      }
    }
    ;[
      {
        arr: [p + 1, p + 2, p + 3, p + 1 - w, p + 1 + w],
        dir: 1,
      },
      {
        arr: [p - 1, p - 2, p - 3, p - 1 - w, p - 1 + w],
        dir: -1,
      },
      {
        arr:[p - w, p - (2 * w), p - (3 * w), p - w - 1, p - w + 1],
        dir: -w,
      },
      {
        arr: [p + w, p + (2 * w), p + (3 * w), p + w - 1, p + w + 1],
        dir: w,
      },
    ].forEach(config => checkAndRemoveDir(config))

    motion.push(npc.x > target.x ? 1 : -1)
    motion.push(npc.y > target.y ? w : -w)
    motion = motion.filter(pos => noWall(npc.pos + pos))

    // TODO need something here to ensure there's way out?
    
    moveNpc({ npc, newPos:npc.pos + (motion[Math.floor(Math.random() * motion.length)]) })
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
    clearTimeout(npc.motionTimer)
    const target = settings.npcs[1]
    if (npc.pause || npc.pos === target.pos) return
    npc.searchMemory = defaultPathMemory(settings.map.data)
    npc.carryOn = true
    npc.goal = target.pos
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

    turnSprite({ actor: player, diff })
  
    if (noWall(actor.pos + diff)) {
      if (actor === player) { // TODO may not require this if this is only used for player
        settings.mapImage[para] += dist
        setStyles(settings.mapImage)
        player.pos += diff
        elements.indicator.innerHTML = `pos:${player.pos} dataX:${mapX(player.pos)} dataY:${mapY(player.pos)}`
      } 
    }
    settings.npcs.forEach(npc => {
      if (!npc.isHunting && !npc.isFleeing) triggerNpcMotion(npc)
    })
  }

  setInterval(()=> {
    settings.npcs.forEach(npc => {
      if (npc.isFleeing) {
        avoidPlayer(npc)
      } else if (npc.isHunting) triggerNpcMotion(npc)
    })
  }, 600)

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
      const block = {
        el: Object.assign(document.createElement('div'), { className: 'block' }),
        x: drawPos.x,
        y: drawPos.y
      }
      setPos(block)
      settings.map.blocks[index] = block
      settings.mapImage.el.appendChild(block.el)
    }
  }

  const moveCursor = e => {
    const { d } = settings.map
    const { left, top } = settings.mapImage.canvas.getBoundingClientRect()
    settings.cursor.x = nearestN(e.pageX - left - window.scrollX, d) - d + left + window.scrollX
    settings.cursor.y = nearestN(e.pageY - top - window.scrollY, d) - d + top + window.scrollY

    setStyles(settings.cursor)
  }



  const turnSprite = ({ actor, diff, newPos = 0 }) => {
    const { column } = settings.map
    const { pos, sprite: el, d } = actor
    const pDiff = diff || newPos - pos 

    if (pDiff === -1) { // left
      setPos({ el, x: -d })
      actor.el.classList.remove('flip')
    }
    if (pDiff === 1) { // right
      setPos({ el, x: -d })
      actor.el.classList.add('flip')
    }
    if (pDiff === -column) setPos({ el, x: -d * 2 }) // down
    if (pDiff === column) setPos({ el, x: 0 }) // up
  } 

  const moveNpc = ({ npc, newPos }) => {
    turnSprite({ actor: npc, newPos })
    npc.pos = newPos
    const { column, d } = settings.map
    npc.x = Math.floor(newPos % column) * d
    npc.y = Math.floor(newPos / column) * d
    setPos(npc)
  }

  const addNpcs = () => {
    settings.npcs.forEach(npc => {
      const { pos } = npc
      npc.sprite = npc.el.childNodes[0].childNodes[0]
      moveNpc({ npc, newPos:pos })
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



