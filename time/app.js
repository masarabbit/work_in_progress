function init() {  

  // TODO add move about
  // TODO add number display (do with before?)

  const body = document.querySelector('.wrapper')
  const bots = []
  const botData = {
    interval: null,
    x: 0,
    y: 0,
    stop: true,
    frameSpeed: 100,
    animation: 'walk',
    frame: 0,
    frameTimer: null,
  }
  const cellD = 32

  const animationFrames = {
    walk: ['n-1', 'n-2', 'n-1', 'r-1', 'r-2', 'r-1'],
    // stop: [0],
    // celebrate: [5, 6, 7, 6, 3, 4],
    // turnFromup: [0, 1, 2, 3, 4],
    // turnFromdUp: [1, 2, 3, 4],
    // turnFromside: [2, 3, 4],
    // turnFromdDown: [3, 4],
    // turnFromdown: [4],
  }

  const setMargin = (target, x, y) => target.style.transform = `translate(${x}px, ${y}px)`
  const randomP = max => Math.ceil(Math.random() * max)

  const startBot = (bot, data) =>{
    animate(bot, data)
    data.stop = false
  }
  
  const animate = (bot, data) =>{
    const { frame:i, animation, frameSpeed } = data
    const sprite = bot.childNodes[0].childNodes[0]
    const frame = animationFrames[animation][i].split('-')
    setMargin(sprite, `-${frame[1] * cellD}`, 0)
    bot.childNodes[0].classList[frame[0] === 'n' ? 'remove' : 'add']('flip')
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
    bot.setAttribute('time', 99)
    body.appendChild(bot)
    bots.push({...botData})
    const data = bots[bots.length - 1]
    data.bot = bot
    data.x = x
    data.y = y
    setMargin(bot, x, y)
    startBot(bot, data)
  }
  
  new Array(5).fill('').map(()=>{
    return [randomP(body.clientWidth - 100), randomP(body.clientHeight - 100)]
  }).forEach( pos => {
    createBot(pos[0], pos[1])
  })


  const changeAnimation = (animation, data) => {
    data.frame = 0
    data.animation = animation
  }

  // console.log(bots)

  const stopBot = (animation, data) =>{
    changeAnimation(animation)
    data.stop = true
  }

  setInterval(()=>{
    bots.forEach(bot =>{
      bot.bot.setAttribute('time', +bot.bot.getAttribute('time') - 1)
    })
  }, 1000)


}

window.addEventListener('DOMContentLoaded', init)



