function init() {  

  // TODO what to do with bot with zero?
  // TODO change how many bots to create based on screen size

  const body = document.querySelector('.wrapper')
  const indicator = document.querySelector('.indicator')
  const log = document.querySelector('.log')
  const n = 16
  const defaultTime = 99
  let bots = []
  const botData = {
    interval: null,
    stop: true,
    frameSpeed: 200,
    animation: 'walk',
    frame: 0,
    frameTimer: null,
    mode: 'hunter',
    time: defaultTime,
  }
  const cellD = 32
  let count = 0

  const animationFrames = {
    walk: ['n-1', 'n-2', 'n-1', 'r-1', 'r-2', 'r-1'],
    stop: ['n-0'],
    break: ['n-3', 'n-4', 'n-5']
  }

  const setMargin = (target, x, y) => {
    target.style.transform = `translate(${x}px, ${y}px)`
    target.style.zIndex = y
  }

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

  // const randomDirection = () =>{
  //   return turnDirections.filter(t => t !== 'turn')[Math.floor(Math.random() * turnDirections.length - 1)]
  // }


  const createBot = (x, y) =>{
    const bot = document.createElement('div')
    bot.classList.add('bot_wrapper')
    bot.innerHTML = '<div><div class="bot"></div></div>'
    body.appendChild(bot)
    bots.push({...botData})
    const data = bots[bots.length - 1]
    data.time = randomN(defaultTime)
    if (data.time < 30) data.time = 30
    data.bot = bot
    data.xy = { x, y }
    data.pos = {
        x: x + n,
        y: y + n
      }
    count++
    data.id = `x-${count}`
    bot.setAttribute('index', bots.length -1)
    bot.setAttribute('time', data.time)
    setMargin(bot, x, y)
    startBot(bot, data)
  }

  // const testPos = [
  //   [100, 100],
  //   [250, 250],
  //   [300, 100],
  //   [400, 100],
  // ]
  
  new Array(40).fill('').map(()=>{
    return [randomN(body.clientWidth - 100), randomN(body.clientHeight - 100)]
  }).forEach( pos => {
    createBot(pos[0], pos[1])
  })

  // testPos.forEach( pos => {
  //   createBot(pos[0], pos[1])
  // })


  const changeAnimation = (animation, data) => {
    data.frame = 0
    data.animation = animation
  }

  // console.log(bots)

  const stopBot = (animation, data) => {
    changeAnimation(animation, data)
    data.stop = true
    data.bot.className = 'bot_wrapper'
    clearTimeout(data.frameTimer)
  }
  
  // TODO add within Buffer
  const checkBoundaryAndUpdatePos = (x, y, data) => {
    const buffer = 50
    const checkBoundaryAndUpdate = (p, n, elem) => {
      if (n > buffer && n < (body[elem] - buffer)){
        data.xy[p] = n
      } else if (n > (body[elem] - buffer)) {
        data.xy[p] = body[elem] - buffer
      } else if (n < buffer) {
        data.xy[p] = buffer
      }
    }
    checkBoundaryAndUpdate('x', x, 'clientWidth')
    checkBoundaryAndUpdate('y', y, 'clientHeight')
    setMargin(data.bot, data.xy.x, data.xy.y)
  }

  // const overlap = (a, b) =>{
  //   const buffer = 20
  //   return Math.abs(a - b) < buffer
  // }


  const distanceBetween = (a, b) => Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2))
  const withinBuffer = (a, b) => Math.abs(a, b) < 50

  const distanceToMove = (a, b, distance) => {
    const randomAccuracy = Math.random < 0.4
    return withinBuffer(a, b) 
      ? a    
      : a > b 
        ? (a - distance) < b && randomAccuracy ? b : a - distance 
        : (a + distance) > b && randomAccuracy ? b : a + distance
  }

  const displayTimeAdded = (b, closestBot) =>{
    const timeAdded = document.createElement('div')
    timeAdded.classList.add('added')
    body.append(timeAdded)
    setMargin(timeAdded, b.xy.x, b.xy.y - 20)
    setTimeout(()=> {
      setMargin(timeAdded, b.xy.x, b.xy.y - 40)
    }, 10)
    setTimeout(()=> {
      body.removeChild(timeAdded)
    }, 1000)
    timeAdded.innerHTML = `+${closestBot.time}`
  }

  const updateBotTime = (b, closestBot) => {
    b.time = b.time + closestBot.time
    closestBot.time = 0
    b.bot.setAttribute('time', b.time)
    closestBot.bot.setAttribute('time', closestBot.time)
  }

  const moveBots = logs => {
    bots.forEach((b, i) => {
      if (!b.stop){
        const distances = bots.map((bot, index) => {
          return {
            index,
            time: bot.time,
            stop: bot.stop,
            distance: distanceBetween(b.pos, bot.pos)
          }
        })
        const closestBotData = [...distances.filter(d => d.index !== i && !d.stop)].sort((a, b) => a.distance - b.distance )[0]
        const closestBot = closestBotData && bots[closestBotData.index]
        if (!closestBot) {
          logs.push(`${b.id} survived`)
          new Array(40).fill('').map(()=> {
            return [randomN(body.clientWidth - 100), randomN(body.clientHeight - 100)]
          }).forEach( pos => {
            createBot(pos[0], pos[1])
          })
          return
        }
        b.mode = b.time >= closestBot.time ? 'hunter' : 'flee'
        
        // fleeing bot rests if there are no bots nearby
        if (b.mode === 'flee' && closestBotData.distance > 200) {
          b.mode = 'charging'
          b.bot.className = 'bot_wrapper'
        
        // if hunter bot finds bot nearby, destroy and steal time   
        } else if (b.mode === 'hunter' && closestBotData.distance < 24) {
          displayTimeAdded(b, closestBot)
          logs.push(`${b.id} destroyed ${closestBot.id} and gained ${closestBot.time} sec`)
          updateBotTime(b, closestBot)
          changeAnimation('break', closestBot)
          closestBot.frameSpeed = 100
          setTimeout(()=>{
            stopBot('stop', closestBot)
            closestBot.mode = 'destroyed'
            closestBot.bot.classList.add('fade')
          }, closestBot.frameSpeed * 3)
        
        // else, move about
        } else {
          let seedDistance = randomN(20) + closestBotData.distance < 50 ? Math.round(randomN(b.time / 20)) : Math.round(randomN(b.time / 5))
          if (seedDistance > closestBotData.distance) seedDistance = closestBotData.distance
          const distance = b.mode === 'hunter' ? seedDistance : -(seedDistance + Math.round(randomN(20)))
          
          if (closestBot) {
            const xy = {
              x: distanceToMove(b.xy.x, closestBot.xy.x, distance),
              y: distanceToMove(b.xy.y, closestBot.xy.y, distance),
            }
      
            checkBoundaryAndUpdatePos(xy.x, xy.y, b)
            b.pos = {
              x: b.xy.x + n,
              y: b.xy.y + n,
            }
          }
        }
      }
    })
  } 

  setInterval(()=> {
    const logs = []
    bots.forEach(bot => {
      if (bot.mode === 'charging' && !bot.stop) {
        bot.time++
        bot.bot.setAttribute('time', bot.time)
      } else if (!bot.stop) {
        bot.time--
        bot.bot.setAttribute('time', bot.time)
        if (bot.time <= 0) {
          stopBot('stop', bot)
          bot.bot.className = 'bot_wrapper stop'
          logs.push(`${bot.id} has stopped`)
        }
      }
    })
    moveBots(logs)
    bots = bots.filter(bot => bot.mode !== 'destroyed') 
    logs.forEach(newLog =>{
      const p = document.createElement('p')
      p.innerHTML = newLog
      log.append(p)
      setTimeout(()=> {
        log.removeChild(p) 
      }, 3000)
    })
    console.log(log.childNodes.length, log.childNodes.length - 9)
    // if (log.innerHTML) {
    //   log.style.height = `${log.childNodes.length * log.childNodes[0].clientHeight}px`
    // }
    indicator.innerText = bots.length
  }, 1000)

  
}

window.addEventListener('DOMContentLoaded', init)



