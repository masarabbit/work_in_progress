
function init() { 
  console.log('test')

  const isNum = x => typeof x === 'number'
  const px = num => `${num}px`

  const setStyles = ({ target, h, w, x, y, deg }) =>{
    if (isNum(w)) target.style.width = px(w)
    if (isNum(h)) target.style.height = px(h)
    if (isNum(x)) target.style.left = px(x)
    if (isNum(y)) target.style.top = px(y)
    if (isNum(deg)) target.style.transform = `rotate(${deg}deg)`
  }

  const armData = {
    arm1Deg: 10,
    arm2Deg: 30,
  }

  const elements = {
    arm1: document.querySelector('.arm-1'),
    arm2: document.querySelector('.arm-2')
  }

  // setInterval(()=> {
  //   const deg1 = armData.arm1Deg += 10
  //   const deg2 = armData.arm2Deg -= 20

  //   setStyles({
  //     target: elements.arm1,
  //     deg: deg1
  //   })
  //   setStyles({
  //     target: elements.arm2,
  //     deg: deg2
  //   })
  
  // }, 200)
  

}
  
window.addEventListener('DOMContentLoaded', init)

