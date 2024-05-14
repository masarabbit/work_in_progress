
function init() { 


  const px = num => `${num}px`

  // poses.neutral = Object.keys(parts).map(part => {
  //   return parts[part].length
  //     ? Array.from(parts[part]).map((p, i) => {
  //       return { el: p, deg: config[part]?.[i] || 0 }
  //     })
  //     : { el: parts[part], deg: config[part] || 0 }
  // }).flat(1)
  

  // document.querySelector('.buttons').innerHTML =  Object.keys(poses).map(pose => `<button class="btn">${pose}</button>`).join('')
  
  // document.querySelectorAll('.btn').forEach(b => b.addEventListener('click', ()=> {
  //   pose('neutral')
  //   pose(b.innerHTML)
  // }))


  // const setStyles = ({ el, x, y, deg }) =>{
  //   el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
  //   // el.style.zIndex = y
  // }

  // const pose = key => {
  //   poses[key].forEach(data => {
  //     setStyles(data)
  //   })
  // }
  
  // pose('neutral')

}
  
window.addEventListener('DOMContentLoaded', init)

