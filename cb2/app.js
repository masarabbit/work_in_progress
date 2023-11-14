function init() {  
  console.log('cb2')
  
  // TODO need someway of drawing map
  // TODO refactor to simplify functions


  const elements = {
    wrapper: document.querySelector('.wrapper'),
    mapCover: document.querySelector('.map-cover'), 
    player: document.querySelector('.player'), 
    mapImage: {
      el: document.querySelector('.map-image'),
      // ctx: null,
    },
    indicator: document.querySelector('.indicator')
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
    // animationTimer: null,
    el: elements.player,
    sprite: document.querySelector('.player').childNodes[1],
    facingDirection: 'down',
    walkingDirection: '',
    walkingInterval: '',
    pause: false,
  }

  const settings = {
    // d: 32,
    transitionTimer: null,
    isWindowActive: false,
    npcs: [],
    mapImage: {
      el: elements.mapImage.el.parentNode,
      canvas: elements.mapImage.el,
      ctx: elements.mapImage.el.getContext('2d'),
      x: 0,
      y: 0,
      w: 0,
      h: 0
    },
    map: {
      el: elements.mapCover, 
      w: 30,
      h: 20,
      d: 32,
      column: 30,
      row: 20,
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
    // settings.map.data = new Array(column * row).fill('x')
    settings.map.data = decompress('$14,2,$17,8,$2,8,$7,1,$4,8,$2,5,$2,1,$3,1,$3,1,$2,5,$2,10,$2,9,$2,4,$4,16,$2,2,$2,4,$4,16,$2,2,$2,4,$6,18,$2,4,$6,18,$4,2,$4,20,$4,2,$1,1,$2,20,$2,28,$2,28,$2,28,$15,1,$29,1,$29,1,$135').map(t => t ||'x')
    // TODO may add walls
    settings.mapImage.w = column * d
    settings.mapImage.h = row * d

  
    setUpCanvas(settings.mapImage)
    adjustMapWidthAndHeight()

    settings.map.data.forEach((tile, i) => {
      outputMap({ i, tile })
    })

  }

  const noWall = pos =>{    
    const { map: { data } } = settings
    if (!data[pos] || player.pos === pos ) return false
    return settings.map.data[pos] !== '$'
  }

  const handleWalk = dir =>{
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
      if (actor === player) {
        settings.mapImage[para] += dist
        setStyles(settings.mapImage)
        player.pos += diff
        elements.indicator.innerHTML = `pos:${player.pos} dataX:${mapX()} dataY:${mapY()}`
      } else {
        actor[para] -= dist // note that dist needs to be flipped around
        setPos(actor)
        actor.pos += diff
      }
    }
  }

  const handleKeyAction = e => {
    const key = e.key ? e.key.toLowerCase().replace('arrow','') : e
    if (e.key && e.key[0] === 'A'){
      handleWalk(key)
    }
  }

  setupMap()

  console.log('settings', settings)
  
  window.addEventListener('resize', adjustMapWidthAndHeight)
  window.addEventListener('keyup', () => {
    player.walkingDirection = null
    clearInterval(player.walkingInterval)
  })
  window.addEventListener('keydown', handleKeyAction)


}

window.addEventListener('DOMContentLoaded', init)



