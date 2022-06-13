function init() {  

  const body = document.querySelector('.wrapper')
  const indicator = document.querySelector('.indicator')
  const log = document.querySelector('.log')
  const info = document.querySelector('.info')
  const infoCard = document.querySelector('.info_card')
  const cellD = 32
  const n = cellD / 2
  const defaultTime = 99
  const animationFrames = {
    walk: ['n-1','n-0','r-1', 'n-0'],
    charge: [3, 4, 5, 'a-charging'],
    charging: [5],
    stop: [1],
    wake: [4, 3, 0, 'a-walk'],
    break: [6, 7, 8],
    transform: [3, 4, 5, 'a-multiply'],
    multiply: ['n-9','n-10','r-10','r-9','r-10','n-10'],
    load: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 'a-wake'],
  }
  const botData = {
    interval: null,
    stop: true,
    frameSpeed: 90,
    animation: 'load',
    frame: 0,
    frameTimer: null,
    mode: 'new',
    time: defaultTime,
  }
  let infoToDisplay = {}
  let bots = []
  let count = 0

  const randomN = max => Math.ceil(Math.random() * max)
  const distanceBetween = (a, b) => Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)))
  const withinBuffer = (a, b) => Math.abs(a, b) < 50
  const activeBotsNo = () => bots.filter(bot => !bot.stop).length

  const setMargin = (target, x, y) => {
    target.style.transform = `translate(${x}px, ${y}px)`
    target.style.zIndex = y
  }

  const startBot = (bot, data) =>{
    animate(bot, data)
    data.stop = false
  }

  const displayInfo = data => {
    info.classList.add('open')
    if (data) infoToDisplay = data
  }

  const populateInfo = () => {
    if (!infoToDisplay.mode) return
    const { mode, pos:{ x, y }, id, time, animation, log, history, edge } = infoToDisplay 
    infoCard.innerHTML = `
      <div class="top_part">
        <div>
          <p>id: ${id}</p>
          <p>mode: ${mode}</p>
          <p>x: ${x} y:${y}</p>
        </div>  
        <div>
          <p>time: ${time}</p>
          <p>animation: ${animation}</p>
        </div>  
      </div>
      <div class="log_bar"><p>log:</p>${log.map(l => `<div class="${l}"></div>`).join('')}</div>
      ${history ? `<p>${history.join(' > ')}</p>` : ''}
    `
  }
  
  const animate = (bot, data) =>{
    const { frame:i, animation, frameSpeed, mode } = data
    const sprite = bot.childNodes[0].childNodes[0]
    const item = animationFrames[animation][i]
    const frame = !Number.isInteger(item) && item.split('-')
    const number = frame[1] || item
    if (frame[0] === 'a') {
      changeAnimation(frame[1], data)
      if (frame[1] === 'charging') data.mode = 'sleep'
    } else {
      setMargin(sprite, `-${number * cellD}`, 0)
      bot.childNodes[0].classList[frame[0] === 'n' ? 'remove' : 'add']('flip')
      data.frame = i === animationFrames[animation].length - 1 ? 0 : i + 1
    }
    bot.className = `bot_wrapper ${mode}`
    data.frameTimer = setTimeout(()=> animate(bot, data), frameSpeed)
  }

  const createBot = ({ x, y, x2, y2, time, history }) =>{
    const bot = document.createElement('div')
    bot.classList.add('bot_wrapper')
    bot.innerHTML = '<div><div class="bot"></div></div>'
    body.appendChild(bot)
    bots.push({...botData})
    count++
    const data = bots[bots.length - 1]
    data.time = time || randomN(defaultTime)
    if (data.time < 30) data.time = 30
    data.bot = bot
    data.xy = { x, y }
    // data.edge = { x: null, y: null }
    data.id = `x-${count}`
    data.log = []
    bot.setAttribute('index', count)
    bot.setAttribute('time', data.time)
    setMargin(bot, x, y)
    if (time) {
      data.history = [...history]
      data.mode = 'new'   
      data.animation = 'load'
      data.xy = { x: x2, y: y2 }
      setTimeout(()=> {
        setMargin(bot, data.xy.x, data.xy.y)
      })
    }
    data.pos = {
      x: (x2 || x) + n,
      y: (y2 || y) + n
    }
    startBot(bot, data)
    bot.addEventListener('click', ()=> displayInfo(data))
  }

  const createBots = no => {
    new Array(no).fill('').map(()=> {
      return [randomN(body.clientWidth), randomN(body.clientHeight)]
    }).forEach( pos => {
      createBot({ x:pos[0], y: pos[1] })
    })
  }
  const botNo = () => Math.round((body.clientWidth * body.clientHeight) / (200 * 200))
  // const botNo = () => 5 

  const changeAnimation = (animation, data) => {
    data.frame = 0
    data.animation = animation
  }

  const stopBot = (animation, data) => {
    changeAnimation(animation, data)
    data.stop = true
    data.bot.className = 'bot_wrapper'
    clearTimeout(data.frameTimer)
  }

  // const checkPosition = data => {
  //   const buffer = 50
  //   data.edge.x = data.xy.x > body.clientWidth - buffer
  //     ? 'veryRight'
  //     : data.xy.x < buffer
  //       ? 'veryLeft'
  //       : null 
  //   data.edge.y = data.xy.y > body.clientHeight - buffer
  //     ? 'veryBottom'
  //     : data.xy.y < buffer
  //       ? 'veryUp'
  //       : null     
  // }

  const randomShift = () => {
    const variation = [0, 20, 50, 70]
    return variation[Math.floor(Math.random() * 4)]
  }
  
  const checkBoundaryAndUpdatePos = (x, y, data) => {
    const buffer = 50
    const checkBoundaryAndUpdate = (p, n, elem) => {
      data.xy[p] = n > (body[elem] - buffer)
        ? body[elem] - randomShift()
        : n < buffer
          ? randomShift()
          : n
    }      
    checkBoundaryAndUpdate('x', x, 'clientWidth')
    checkBoundaryAndUpdate('y', y, 'clientHeight')
    
    setMargin(data.bot, data.xy.x, data.xy.y)
  }

  const distanceToMove = (a, b, distance) => {
    const randomAccuracy = Math.random < 0.6
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
    closestBot.bot.setAttribute('time', 0)
  }

  const distances = bot => {
    return bots.map((b, index) => {
      return {
        index,
        time: b.time,
        stop: b.stop,
        mode: b.mode,
        distance: distanceBetween(bot.pos, b.pos)
      }
    })
  }
  
  const charge = (bot, logs) => {
    bot.frameSpeed = 200
    bot.log.push('charge')
    bot.mode = 'charging'
    changeAnimation('charge', bot)
    bot.bot.className = 'bot_wrapper charge'
    logs.push(`${bot.id} is charging`)
  }

  const explodeBot = bot => {
    changeAnimation('break', bot)
    bot.frameSpeed = 100
    setTimeout(()=> {
      bot.mode = 'destroyed'
      bot.log = 'destroyed'
      stopBot('stop', bot)
      bot.bot.classList.add('fade_away')
    }, bot.frameSpeed * 3)
  }

  const huntAndDestroy = (bot, closestBot, logs) => {
    displayTimeChange(bot, closestBot, '+')
    displayTimeChange(closestBot, closestBot, '-')
    logs.push(`${bot.id} destroyed ${closestBot.id} and gained ${closestBot.time} sec`)
    bot.log.push('destroy')
    updateBotTime(bot, closestBot)
    explodeBot(closestBot)
  }

  const moveAbout = (bot, closestBot, closestBotData) => {
    let seedDistance = randomN(20) + closestBotData.distance < 50 ? Math.round(randomN(bot.time / 20)) : Math.round(randomN(bot.time / 5))
    if (seedDistance > closestBotData.distance) seedDistance = closestBotData.distance
    const distance = bot.mode === 'hunter' ? seedDistance : -(seedDistance + Math.round(randomN(20)))
    
    if (closestBot) {
      const xy = {
        x: distanceToMove(bot.xy.x, closestBot.xy.x, distance),
        y: distanceToMove(bot.xy.y, closestBot.xy.y, distance),
      }
      checkBoundaryAndUpdatePos(xy.x, xy.y, bot)
      bot.pos = {
        x: bot.xy.x + n,
        y: bot.xy.y + n,
      }
    }
  }

  const decideHuntOrFlee = (bot, closestBot) => {

    bot.mode = ['multiply', 'sleep'].includes(closestBot.mode)
      ? 'hunter'
      : bot.time > closestBot.time ? 'hunter' : 'flee'
    if (bot.animation !== 'load') bot.frameSpeed = 200
  }

  const moveBots = logs => {
    bots.forEach((b, i) => {
      if (!b.stop && !['multiply', 'destroyed', 'load'].includes(b.mode)){
        const closestBotData = [...distances(b, bots).filter(d => d.index !== i && !['load','destroyed'].includes(d.mode))].sort((a, b) => a.distance - b.distance )[0]
        const closestBot = closestBotData && bots[closestBotData.index]
        if (!closestBot) {
          logs.push(`${b.id} survived`)
          // createBots(botNo())
          return
        } else if ((b.time > 180 && activeBotsNo() < 40 && b.animation !== 'break')) {
          logs.push(`${b.id} is in multiply mode`)
          changeAnimation(b.mode === 'sleep' ? 'multiply' : 'transform', b)
          b.mode = 'multiply'
        } else if (!['sleep', 'multiply'].includes(b.mode)) {
          decideHuntOrFlee(b, closestBot)
        }

        if (['sleep', 'multiply'].includes(b.mode)) {
          if (closestBotData.distance < 50 && b.time < 300) {
            changeAnimation('wake', b)
            decideHuntOrFlee(b, closestBot)
          }
        } else if (
          (b.mode === 'flee' && closestBotData.distance > 100)  
          || (b.time > 200 && activeBotsNo() > 40)
          ) {
          charge(b, logs)
        } else if (b.mode === 'hunter' && closestBotData.distance < 24) {
          huntAndDestroy(b, closestBot, logs)
        } else {
          b.log.push(b.mode.slice(0, 4))
          moveAbout(b, closestBot, closestBotData)
        }
      }
    })
  } 

  const createNewBots = (x, y, time, history) => {
    const d = 50
    const pos = [
      {x: -d, y: -d},
      {x: d, y: -d},
      {x: -d, y: d},
      {x: d, y: d},
    ]
    pos.forEach(p => {
      createBot({ x, y, x2: x + p.x, y2: y + p.y, time: time / 4, history: [...history]})
    })
  }

  const removeDestroyedBots = () => {
    bots.forEach(bot =>{
      if (bot.mode === 'destroyed') body.removeChild(bot.bot)
    })
    bots = bots.filter(bot => bot.mode !== 'destroyed') 
  }

  const countdownTime = (bot, logs) => {
    bot.time--
    if (bot.time <= 0) {
      bot.stop = true
      changeAnimation('stop', bot)
      bot.mode = 'stop'
      bot.bot.className = 'bot_wrapper stop'
      logs.push(`${bot.id} has stopped`)
    }
  }

  const multiply = (bot, logs) => {
    if (bot.time % 4 === 0 && (activeBotsNo() < 40)) {
      logs.push(`${bot.id} multiplied`)
      createNewBots(bot.xy.x, bot.xy.y, bot.time, bot.history ? [...bot.history, bot.id] : [bot.id])
      stopBot('stop', bot)
      bot.time = 0
      bot.mode = 'destroyed'
    }
  }

  const updateLog = logs => {
    if (logs.length) {
      const newLog = document.createElement('div')
      newLog.innerHTML = logs.map(l => `<p>${l}</p>`).join('')
      log.append(newLog)
      setTimeout(()=> {
        newLog.style.height = `${indicator.clientHeight * logs.length}px`
      }, 100)
      log.childNodes.forEach((node, i) => {
        if (i < (log.childNodes.length - 1)) node.classList.add('light_fade')
      })
    }
    if (log.childNodes[4]) {
      log.childNodes[0].classList.add('fade')
      setTimeout(()=> {
        log.removeChild(log.childNodes[0])
      }, 500)
    }
  }

  setInterval(()=> {
    const logs = []
    bots.forEach(bot => {
      if (bot.mode === 'multiply') {
        bot.time--
        multiply(bot, logs)
      } else if (bot.mode === 'sleep' && !bot.stop) {
        if (bot.time < 300) {
          bot.time += 10
        } else {
          explodeBot(bot)
          logs.push(`${bot.id} exploded due to overcharge`)
        }
      } else if (!bot.stop) {
        countdownTime(bot, logs)
      }
      bot.bot.setAttribute('time', bot.time)
    })
    moveBots(logs)
    removeDestroyedBots()
    updateLog(logs)
    indicator.innerText = `active bots: ${activeBotsNo()}`
    populateInfo()
  }, 1000)
  
  // info.addEventListener('click', displayInfo)
  infoCard.addEventListener('click', ()=> info.classList.remove('open'))
  createBots(botNo())
}

window.addEventListener('DOMContentLoaded', init)



