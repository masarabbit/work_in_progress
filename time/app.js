function init() {  

  // TODO add way to absorb other bots when overlapped and time is higher.
  // TODO when certain distance away from other all other bots, maybe stop motion

  const body = document.querySelector('.wrapper')
  const n = 16
  const defaultTime = 99
  const bots = []
  const botData = {
    interval: null,
    stop: true,
    frameSpeed: 100,
    animation: 'walk',
    frame: 0,
    frameTimer: null,
    mode: 'hunter',
    time: defaultTime,
  }
  const cellD = 32

  const animationFrames = {
    walk: ['n-1', 'n-2', 'n-1', 'r-1', 'r-2', 'r-1'],
    stop: ['n-0']
    // stop: [0],
    // celebrate: [5, 6, 7, 6, 3, 4],
    // turnFromup: [0, 1, 2, 3, 4],
    // turnFromdUp: [1, 2, 3, 4],
    // turnFromside: [2, 3, 4],
    // turnFromdDown: [3, 4],
    // turnFromdown: [4],
  }

  const setMargin = (target, x, y) => target.style.transform = `translate(${x}px, ${y}px)`
  const randomN = max => Math.ceil(Math.random() * max)

  const startBot = (bot, data) =>{
    animate(bot, data)
    data.stop = false
  }
  
  const animate = (bot, data) =>{
    const { frame:i, animation, frameSpeed, mode } = data
    const sprite = bot.childNodes[0].childNodes[0]
    const frame = animationFrames[animation][i].split('-')
    setMargin(sprite, `-${frame[1] * cellD}`, 0)
    bot.childNodes[0].classList[frame[0] === 'n' ? 'remove' : 'add']('flip')
    bot.className = `bot_wrapper ${mode}`
    data.frame = i === animationFrames[animation].length - 1 ? 0 : i + 1
    data.frameTimer = setTimeout(()=> animate(bot, data), frameSpeed)
  }

  const randomDirection = () =>{
    return turnDirections.filter(t => t !== 'turn')[Math.floor(Math.random() * turnDirections.length - 1)]
  }


  const createBot = (x, y) =>{
    const bot = document.createElement('div')
    bot.classList.add('bot_wrapper')
    bot.innerHTML = '<div><div class="bot"></div></div>'
    body.appendChild(bot)
    bots.push({...botData})
    const data = bots[bots.length - 1]
    data.time = randomN(defaultTime)
    data.bot = bot
    data.xy = { x, y }
    data.pos = {
        x: x + n,
        y: y + n
      }
    bot.setAttribute('index', bots.length -1)
    bot.setAttribute('time', data.time)
    setMargin(bot, x, y)
    startBot(bot, data)
  }

  const testPos = [
    [100, 100],
    [250, 250],
    [300, 100],
    [400, 100],
  ]
  
  // new Array(5).fill('').map(()=>{
  //   return [randomN(body.clientWidth - 100), randomN(body.clientHeight - 100)]
  // }).forEach( pos => {
  //   createBot(pos[0], pos[1])
  // })

  testPos.forEach( pos => {
    createBot(pos[0], pos[1])
  })


  const changeAnimation = (animation, data) => {
    data.frame = 0
    data.animation = animation
  }

  // console.log(bots)

  const stopBot = (animation, data) =>{
    changeAnimation(animation, data)
    data.stop = true
    clearTimeout(data.frameTimer)
  }
  
  const checkBoundaryAndUpdatePos = (x, y, data) =>{
    // TODO not working for some reason
    const lowerLimit = -100 // buffer from window edge
    const upperLimit = 100
    
    if (x > lowerLimit && x < (body.clientWidth - upperLimit)){
      data.xy.x = x
    } 
    if (y > lowerLimit && y < (body.clientHeight - upperLimit)){
      data.xy.y = y
    }
    setMargin(data.bot, data.xy.x, data.xy.y)
  }


  const distanceBetween = (a, b) =>{
    return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2))
  }

  const moveBots = () =>{
    bots.forEach((b, i) =>{
      if (!b.stop){
        const distances = bots.map((bot, index) =>{
          return {
            index,
            time: bot.time,
            distance: distanceBetween(b.pos, bot.pos)
          }
        })
        const closestBot = bots[[...distances.filter(d => d.index !== i)].sort((a, b) => a.distance - b.distance )[0].index]
        b.mode = b.time >= closestBot.time ? 'hunter' : 'flee'
        const seedDistance = randomN(20) + 10
        const distance = b.mode === 'hunter' ? seedDistance : -seedDistance
        const xy = {
          x: b.xy.x > closestBot.xy.x ? b.xy.x - distance : b.xy.x + distance,
          y: b.xy.y > closestBot.xy.y ? b.xy.y - distance : b.xy.y + distance
        }
  
        checkBoundaryAndUpdatePos(xy.x, xy.y, b)
        // setMargin(b.bot, b.xy.x, b.xy.y)
        // const { xy: { x, y } } = b
        b.pos = {
          x: b.xy.x + n,
          y: b.xy.y + n,
        }
      }
    })
  } 

  setInterval(()=>{
    bots.forEach(bot =>{
      if (!bot.stop) {
        bot.time--
        bot.bot.setAttribute('time', bot.time)
        if (bot.time <= 0) {
          stopBot('stop', bot)
          console.log(bot.bot)
          bot.bot.className = 'bot_wrapper'
        }
      }
    })
    moveBots()
  }, 1000)
}

window.addEventListener('DOMContentLoaded', init)



