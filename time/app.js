function init() {  

  // TODO what to do with bot with zero?
  // TODO add clickevent to check bot status
  // TODO record bot activity (hunt, flee, destroy etc) to collect stats

  // TODO change animation for incubate

  const body = document.querySelector('.wrapper')
  const indicator = document.querySelector('.indicator')
  const log = document.querySelector('.log')
  const n = 16
  const defaultTime = 99
  let bots = []
  const botData = {
    interval: null,
    stop: true,
    // TODO maybe add 'destroyed' as status instead of defining it as mode
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
    walk: ['n-1','n-0','r-1', 'n-0'],
    charge: ['n-3', 'n-4', 'n-5', 'a-charging'],
    charging: ['n-5'],
    stop: ['n-1'],
    wake: ['n-4', 'n-3', 'n-0', 'a-walk'],
    // sleep: ['n-0','n-3','n-4', 'n-5'], // probably should rename
    break: ['n-6', 'n-7', 'n-8'],
    transform_a: ['n-3','n-4','n-5', 'a-transform_b'],
    transform_b: ['n-9', 'n-10', 'a-incubate'],
    incubate: ['n-11', 'r-11'],
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
    if (frame[0] === 'a') {
      changeAnimation(frame[1], data)
      if (frame[1] === 'charging') data.mode = 'sleep'
    } else {
      setMargin(sprite, `-${frame[1] * cellD}`, 0)
      bot.childNodes[0].classList[frame[0] === 'n' ? 'remove' : 'add']('flip')
      data.frame = i === animationFrames[animation].length - 1 ? 0 : i + 1
    }
    bot.className = `bot_wrapper ${mode}`
    data.frameTimer = setTimeout(()=> animate(bot, data), frameSpeed)
  }


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
    bot.setAttribute('index', count)
    bot.setAttribute('time', data.time)
    setMargin(bot, x, y)
    startBot(bot, data)
  }

  const createBots = no => {
    new Array(no).fill('').map(()=> {
      return [randomN(body.clientWidth), randomN(body.clientHeight)]
    }).forEach( pos => {
      createBot(pos[0], pos[1])
    })
  }
  const botNo = () => Math.round((body.clientWidth * body.clientHeight) / (100 * 100))
  // const botNo = () => 5 
  createBots(botNo())
　　

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
  

  const checkBoundaryAndUpdatePos = (x, y, data) => {
    const buffer = 50
    const checkBoundaryAndUpdate = (p, n, elem) => {
      data.xy[p] = n > (body[elem] - buffer)
        ? body[elem] - buffer
        : n < buffer
          ? buffer
          : n
    }      
    checkBoundaryAndUpdate('x', x, 'clientWidth')
    checkBoundaryAndUpdate('y', y, 'clientHeight')
    setMargin(data.bot, data.xy.x, data.xy.y)
  }


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

  const displayTimeChange = (b, closestBot, prefix) =>{
    const time = document.createElement('div')
    time.className = prefix === '+' ? 'time added' : 'time reduced'
    body.append(time)
    setMargin(time, b.xy.x, b.xy.y - 20)
    if (prefix === '+') {
      setTimeout(()=> {
        setMargin(time, b.xy.x, b.xy.y - 40)
      }, 10)
    }
    setTimeout(()=> {
      body.removeChild(time)
    }, 1000)
    time.innerHTML = `${prefix}${closestBot.time}`
  }

  const updateBotTime = (b, closestBot) => {
    b.time = b.time + closestBot.time
    closestBot.time = 0
    b.bot.setAttribute('time', b.time)
    closestBot.bot.setAttribute('time', closestBot.time)
  }

  const moveBots = logs => {
    bots.forEach((b, i) => {
      if (!b.stop && !['incubate', 'destroyed'].includes(b.mode)){
        const distances = bots.map((bot, index) => {
          return {
            index,
            time: bot.time,
            stop: bot.stop,
            mode: bot.mode,
            distance: distanceBetween(b.pos, bot.pos)
          }
        })
        const closestBotData = [...distances.filter(d => d.index !== i && !d.stop && !['incubate', 'destroyed'].includes(d.mode))].sort((a, b) => a.distance - b.distance )[0]
        const closestBot = closestBotData && bots[closestBotData.index]
        if (!closestBot) {
          logs.push(`${b.id} survived`)
          createBots(botNo())
          return
        }
        if (b.time > 200) {
          changeAnimation(b.mode === 'sleep' ? 'transform_b' : 'transform_a', b)
          b.mode = 'incubate'
          return
        }
        if (b.mode !== 'sleep') {
          b.mode = b.time >= closestBot.time ? 'hunter' : 'flee'
        }
        if (b.mode === 'sleep') {
          if (closestBotData.distance < 100) {
            changeAnimation('wake', b)
            b.mode = b.time >= closestBot.time ? 'hunter' : 'flee'
          }
        // fleeing bot rests if there are no bots nearby
        } else if (b.mode === 'flee' && closestBotData.distance > 100) {
          b.mode = 'charging'
          changeAnimation('charge', b)
          b.bot.className = 'bot_wrapper charge'

        // if hunter bot finds bot nearby, destroy and steal time   
        } else if (b.mode === 'hunter' && closestBotData.distance < 24) {
          displayTimeChange(b, closestBot, '+')
          displayTimeChange(closestBot, closestBot, '-')
          logs.push(`${b.id} destroyed ${closestBot.id} and gained ${closestBot.time} sec`)
          updateBotTime(b, closestBot)
          changeAnimation('break', closestBot)
          closestBot.frameSpeed = 100
          setTimeout(()=> {
            closestBot.mode = 'destroyed'
            stopBot('stop', closestBot)
            closestBot.bot.classList.add('fade_away')
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
      if (bot.mode === 'incubate') {
        
      } else if (bot.mode === 'sleep' && !bot.stop) {
        bot.time += 50
        bot.bot.setAttribute('time', bot.time)
      } else if (!bot.stop) {
        bot.time--
        bot.bot.setAttribute('time', bot.time)
        if (bot.time <= 0) {
          bot.stop = true
          stopBot('stop', bot)
          bot.bot.className = 'bot_wrapper stop'
          logs.push(`${bot.id} has stopped`)
        }
      }
    })
    moveBots(logs)
    bots.forEach(bot =>{
      if (bot.mode === 'destroyed') body.removeChild(bot.bot)
    })
    bots = bots.filter(bot => bot.mode !== 'destroyed') 
    if (logs.length) {
      const newLog = document.createElement('div')
      newLog.innerHTML = logs.map(l => `<p>${l}</p>`).join('')
      log.append(newLog)
      setTimeout(()=> {
        newLog.style.height = `${11 * logs.length}px`
      }, 100)
      log.childNodes.forEach((node, i) =>{
        if (i < (log.childNodes.length - 1)) node.classList.add('light_fade')
      })
    }
    if (log.childNodes[4]) {
      log.childNodes[0].classList.add('fade')
      setTimeout(()=> {
        log.removeChild(log.childNodes[0])
      }, 500)
    }
    indicator.innerText = `active bots: ${bots.filter(bot => !bot.stop).length}`
  }, 1000)

  
}

window.addEventListener('DOMContentLoaded', init)



