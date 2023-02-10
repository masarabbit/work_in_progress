test2
  function init() { 

    
    const inputs = document.querySelectorAll('input')
    const box = document.querySelector('.box')

    inputs.forEach(input => {
        input.addEventListener('change', ()=>{
          box.childNodes[+input.dataset.id].style.backgroundColor = input.value
        })
      }     
    )

  }
  
  window.addEventListener('DOMContentLoaded', init)



