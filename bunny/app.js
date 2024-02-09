
function init() { 

  // TODO add experessions

  const elements = {
    testButton: document.querySelector('.test')
  }

  const parts = {
    neck: document.querySelector('.neck-base'),
    shoulders: document.querySelectorAll('.shoulder'),
    elbows: document.querySelectorAll('.elbow'),
    waist: document.querySelector('.belly-joint'),
    ears: document.querySelectorAll('.ear-joint'),
  }

  const config = {
    shoulders: [12, -12]
  }

  const poses = {
    shrug: [
      { el: parts.neck, deg: 20 },
      { el: parts.shoulders[0], deg: 65 },
      { el: parts.elbows[0], deg: 40 },
      { el: parts.shoulders[1], deg: -65 },
      { el: parts.elbows[1], deg: -40 },
      { el: parts.ears[0], deg: -10 },
      { el: parts.ears[1], deg: 10 },
    ],
    leftArmUp: [
      { el: parts.neck, deg: 10 },
      { el: parts.shoulders[0], deg: 100 },
      { el: parts.elbows[0], deg: 45 },
      { el: parts.shoulders[1], deg: -50 },
      { el: parts.elbows[1], deg: 65 },
      { el: parts.waist, deg: 5 },
      { el: parts.ears[0], deg: -15 },
      { el: parts.ears[1], deg: -15 },
    ],
    rightArmUp: [
      { el: parts.neck, deg: -10 },
      { el: parts.shoulders[0], deg: 50 },
      { el: parts.elbows[0], deg: -65 },
      { el: parts.shoulders[1], deg: -100 },
      { el: parts.elbows[1], deg: -45 },
      { el: parts.waist, deg: -5 },
      { el: parts.ears[0], deg: 15 },
      { el: parts.ears[1], deg: 15 },
    ],
    bothArmsUp: [
      { el: parts.shoulders[0], deg: 120 },
      { el: parts.elbows[0], deg: 45 },
      { el: parts.shoulders[1], deg: -120 },
      { el: parts.elbows[1], deg: -45 },
    ],
  }

  const px = num => `${num}px`

  poses.neutral = Object.keys(parts).map(part => {
    return parts[part].length
      ? Array.from(parts[part]).map((p, i) => {
        return { el: p, deg: config[part]?.[i] || 0 }
      })
      : { el: parts[part], deg: config[part] || 0 }
  }).flat(1)
  

  document.querySelector('.buttons').innerHTML =  Object.keys(poses).map(pose => `<button class="btn">${pose}</button>`).join('')
  
  document.querySelectorAll('.btn').forEach(b => b.addEventListener('click', ()=> {
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
  
  pose('neutral')

  const stopButton = document.getElementById("stopButton")



  async function startRecording() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    })
    const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9") ? "video/webm; codecs=vp9" : "video/webm";
    const recorder = new MediaRecorder(stream, { mimeType: mime });

    const chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: chunks[0].type });
      console.log(blob);
      stream.getVideoTracks()[0].stop();

      const filename= 'video.webm'
      var elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;        
      document.body.appendChild(elem);
      elem.click();        
      document.body.removeChild(elem);
    };
    recorder.start();
  }


  elements.testButton.addEventListener("click", ()=> startRecording())

  stopButton.addEventListener('click', ()=> {
    console.log('test')
    const audio = document.createElement('audio')
    audio.src = `tst.wav`
    audio.play()

    // const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    // const audioSource = audioCtx.createMediaElementSource(audio)
    // const analyser = audioCtx.createAnalyser()
    // audioSource.connect(analyser)


    // analyser.connect(audioCtx.destination)
    // setInterval(()=>{
    //       const bufferLength = analyser.frequencyBinCount
    // const dataArray = new Uint8Array(bufferLength)
    //   console.log(analyser.getByteFrequencyData(dataArray))
    // }, 200)

    
  })
}
  
window.addEventListener('DOMContentLoaded', init)

