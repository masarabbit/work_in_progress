
  function init() { 

    const wrapper = document.querySelector('.wrapper')

    const createMapCodes = length => {
      return new Array(length).fill('').map((_n, i) => {
        let letters = ''
        while (i >= 0) {
          letters = 'abcdefghijklmnopqrstuvwxyz'[i % 26] + letters
          i = Math.floor(i / 26) - 1
        }
        return letters
      })
    }
    
  

    const arr = createMapCodes(708)

    wrapper.innerHTML = arr.map((content, i) => {
      return `<div><span>${i}</span> ${content}</div>`
    }).join('')
  }
  
  window.addEventListener('DOMContentLoaded', init)



