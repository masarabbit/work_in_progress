const elements = {
  canvas: {
    el: document.querySelector('canvas'),
    ctx: function() {
      return this.el.getContext('2d')
    }
  },
  line: document.querySelector('.line'),
  cube: document.querySelector('.cube'),
  stair: document.querySelector('.stair'),
  blank: document.querySelector('.blank'),
  btns: document.querySelectorAll('.btn'),
  indicator: document.querySelector('.indicator'),
  cellData: document.querySelectorAll('.cells'),
  stamp: document.querySelector('.stamp'),
  palette: document.querySelector('.palette'),
  max: document.querySelector('.max'),
  layers: document.querySelector('.layers'),
}

const tiles = {
  stair: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAYAAAAqXEs9AAAAAXNSR0IArs4c6QAAAUtJREFUWEfF11ESgyAMBNBy/0PjoIYRSsgmG9t+dUbEZwKrlk/Or97TFHY6doITUuvlKaVPF543euIAmavCwLygLUSBua6BDo5AxIde42q7sQhDkGlNWdcYCNpgCtJLcy1yCpQCyQClQlhQlZ5boSbb2Tve07bSNNaFrONaDkUC8wRNJf5KXm9FtPFIYA4gDfZSK5e7bwmS55JVmWgrdw/iECgKQQLTBWIhSBxAoCwIDZIJrLXk3Qz3DeYvai9kHr8KTLVlzzdAK1eiFVzl0hb0j8CEQGxrPBV0gX4RmKkgNh7a+SkgFvJcEhQoC0KD3gzMlpbwGyO6qJldKfGd+k4daKX6DU7BGIj1VUnBgDdM9VvN+oiDYK0ySBqXx8NLQ1ugvqHan91DdgdCIFbLtBtYVkyrkAcSBS0rNoMiEBY0wKSdDCQLZG0o9/EDEKlBLgROJT4AAAAASUVORK5CYII=',
  cube: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAYAAAAqXEs9AAAAAXNSR0IArs4c6QAAAR1JREFUWEft2MESwiAMBFD5/4/GoRUmUmCTbFoP4rWSvi6RMU2vmE/+lElsObbAAcn59KTUyrnrehd+QfpUGJgVtIREwLQgE4SBIRAF8cBmoFCIBdaDboVoYBX0KGQFK6BczxH2UGPXl+PiANVCv4KJc+sE9SftU7AKkfcfbln/RXYrZj3TP3jbslki0TBUD4Lqk6FCKEHtejXIC9NCZH3Xzx7dCF2fJWpOCDWnF0InhGCop25LSBYu6bDnF71lG2Tphb1lKK2d0F8ndEzDciRGaYyuMz0kJ92wqcMDGo3cYXOZBbSa/cMmVw1I8xICgdpAgnpsBdJA2l8QYwNPm38EskC8oGliEuSBsKALTCDKNW0rXDbIvbCrFPaO8Q2E4usT3uthmwAAAABJRU5ErkJggg==',
}

const settings = {
  column: 11, //this is always one more than how many you want
  row: 30,
  factor: 2,
  tile: 'stair',
  layer: 0,
  erase: false,
}

export {
  elements,
  tiles,
  settings
}