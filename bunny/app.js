
function init() { 

  const parts = {
    neck: document.querySelector('.neck-base'),
    shoulders: document.querySelectorAll('.shoulder'),
    elbows: document.querySelectorAll('.elbow'),
  }

  const poses = {
    shrug: [
      {
        el: parts.neck,
        deg: 20
      },
      {
        el: parts.shoulders[0],
        deg: 45
      },
      {
        el: parts.shoulders[1],
        deg: -45
      },
      {
        el: parts.elbows[0],
        deg: 20
      },
      {
        el: parts.elbows[1],
        deg: -20
      },
    ]
  }


  const setStyles = ({ el, x, y, deg }) =>{
    el.style.transform = `translate(${x ? px(x) : 0}, ${y ? px(y) : 0}) rotate(${deg || 0}deg)`
    // el.style.zIndex = y
  }

  const pose = key => {
    poses[key].forEach(data => {
      setStyles(data)
    })
  }
  
  pose('shrug')
}
  
window.addEventListener('DOMContentLoaded', init)

