

    
    const inputs = document.querySelectorAll('input')
    const b = document.querySelector('.box')

    inputs.forEach(input => {
        input.addEventListener('change', ()=>{
          b.childNodes[+input.dataset.id].style.backgroundColor = input.value
        })
      }     
    )

  }
  
  window.addEventListener('DOMContentLoaded', init)



