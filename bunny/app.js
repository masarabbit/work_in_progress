
function init() { 

  // TODO add experessions

  const parts = {
    neck: document.querySelector('.neck-base'),
    shoulders: document.querySelectorAll('.shoulder'),
    elbows: document.querySelectorAll('.elbow'),
    waist: document.querySelector('.belly-joint'),
  }

  const poses = {
    shrug: [
      { el: parts.neck, deg: 20 },
      { el: parts.shoulders[0], deg: 65 },
      { el: parts.elbows[0], deg: 40 },
      { el: parts.shoulders[1], deg: -65 },
      { el: parts.elbows[1], deg: -40 },
    ],
    leftArmUp: [
      { el: parts.neck, deg: 10 },
      { el: parts.shoulders[0], deg: 100 },
      { el: parts.elbows[0], deg: 45 },
      { el: parts.shoulders[1], deg: -50 },
      { el: parts.elbows[1], deg: 65 },
      { el: parts.waist, deg: 5 },
    ],
    rightArmUp: [
      { el: parts.neck, deg: -10 },
      { el: parts.shoulders[0], deg: 50 },
      { el: parts.elbows[0], deg: -65 },
      { el: parts.shoulders[1], deg: -100 },
      { el: parts.elbows[1], deg: -45 },
      { el: parts.waist, deg: -5 },
    ],
    bothArmsUp: [
      { el: parts.shoulders[0], deg: 120 },
      { el: parts.elbows[0], deg: 45 },
      { el: parts.shoulders[1], deg: -120 },
      { el: parts.elbows[1], deg: -45 },
    ],
  }

  poses.neutral = Object.keys(parts).map(part => {
    return parts[part].length
      ? Array.from(parts[part]).map(p => {
        return { el:p, deg: 0 }
      })
      : { el: parts[part], deg: 0 }
  }).flat(1)
  

  document.querySelector('.buttons').innerHTML =  Object.keys(poses).map(pose => `<button>${pose}</button>`).join('')
  
  document.querySelectorAll('button').forEach(b => b.addEventListener('click', ()=> {
    pose('neutral')
    pose(b.innerHTML)
  }))


  const setStyles = ({ el, x, y, deg }) =>{
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
    // el.style.zIndex = y
  }

  const pose = key => {
    poses[key].forEach(data => {
      setStyles(data)
    })
  }
  

}
  
window.addEventListener('DOMContentLoaded', init)

