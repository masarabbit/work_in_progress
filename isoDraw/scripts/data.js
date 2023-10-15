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
  downloadTextLink: document.querySelector('.download-text-link'),
}

const input = {
  layer: document.querySelector('.layer'),
}

const tiles = {
  stair: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAYAAAAqXEs9AAAAAXNSR0IArs4c6QAAAUxJREFUWEe911sSwiAMBVDZ/6JxaBumMLnkcaN+6UjpaRJSaJ+aT3+maex07AQXpPfb09qcLj1v9sIFskeFgUVBRwiAhe7hHZyBiM97jzvtRhGmIFtNWfdYCGgwBZmhuYucApVAKkClEBbUJedWU5PlHB0fSdvIr3TZ2eBQX4lCMg3zAu0Xot9sBD0NcwFtuYcRK4qguvpUkLyXrBQRNQXbQQqUhXgaZgjEQjztwAWqgtAgmcCqpehieB6wvqijkH281jBhyt47QBQhNpVaXzqCUARYyGmH6QKxqYnUYAj0j4ZZCmJTOa4vAbGQd0lQoCoIDfplw6QixO6PtOUv7bt0T51IJTyDUzAGYp0qKZgjlfCsZh3iXLARGU83bq+XF0JboLmgxpfTS/YE8kCslKEHUCOGIhSBZEFqxHZQBsKCFpikk4FUgawFFf7/C3O0Pi7r8Ps1AAAAAElFTkSuQmCC',
  stairBlue: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAYAAAAqXEs9AAAAAXNSR0IArs4c6QAAAWBJREFUWEfF2G0WgiAQBdDYi2t0Ea2xvdABGZIR5lvrV50Ibjg+wPSKeeXWTfJ25+2gQnI+PCn17sz9Wn84QPCseGBaEAlZwFRjSBtbIOCTjnFcdqYITZD356ipfavdc2MMhFVjFwRGiACFQCJAoRAvKEOOcKEGtzPUCNe+XTJVHaWigYFWMCvEEpgV1O/PlrS4I+2McH+MuvMGEIZFQTSBOQXBusSBoEa0NUgtxCaQFSIJTBXIC5HEgQgUBXGDoANtjQhrb7pskTMUDUEzNA3MJei8A+RyhZsRDKECkwT9IzBFoCcDUwV6IjBDQd54KL8PAXkh56J3gaIgbtCdgVnSUrxjhKK+MzAhvk176sDAXJ7BXTDDVveynt16LlsdAvbt91TispuMOLmWmZGsZxSkrwbcUaZ9zz7toEASiBbU7/TyBhfzaoY0ECtoCsMgC8QLGmDlQ7lkHkgUSFiC8mZfypxBLjBTJvgAAAAASUVORK5CYII=',
  stairLeft: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAYAAAAqXEs9AAAAAXNSR0IArs4c6QAAAUdJREFUWEfFmOsShSAIhPP9H9qmjjbmEVgWqv6a+M0C66VsOV9tYUo0XDTACVLrj6eUKxwdl514A5lViYAxQLUrYqWHAaOAOsgTYBTQXDOZYCGgrlRPTQZYClAmWCpQBpgXSG13qf09qUSBlgboWWg0UA3cAoIMkAVbNYMG5DZAFmxUTAViDdACO5SR/oEUYn1GXDQKFG3nGSysUEY7z8eUUMqkXZ1NpWoBwmKPGyCq0GsGKKreBl43QA3oEwNUgb4wQEghtmsYA4SA3jRAF1AWmObIFFAUTDPAEFAEzNr5b0ePUrbbbo/2v1X81ri0N5638ZV0LFgE5MqClMuW//6qof12PTKg6dGu2NaZ+gRBFEM6CrnrQ0CDk4uKqYcuxzONC0gDWwEhivwVuFocxuCYyhGIAYGKGoU9wAaIYxqlfGgiCuv9bwddnkDv3LmVagAAAABJRU5ErkJggg==',
  // cube: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAARZJREFUWEft2MESwiAMBFD5/4/GoRUmUmCTbFoP4hWbvi6RMU2vmE/+lElsObbAAcn59KTUyrnrei/8gvSpMDAraAmJgGlBJggDQyAK4oHNQKEQC6wH3QrRwCroUcgKVkC5niPsocZeX46LA1QL/Qomzq0T1J+0T8EqRN5/uGX9F9mtmPVM/+Bty2aJRMNQPQiqT4YKoQS116tBXpgWIuu7fvboRmh9lqg5IdScXgidEIKhnrotIVm4pMOeX/SWbZClF/aWobR2Qn+d0DENy5EYpTFaZ3pITrphU4cHNBq5w+YyC2g1+4dNrhqQ5iUEArWBBPXYCqSBtL8gxgaeNv8IZIF4QdPEJMgDYUEXmECUNW0rXDboDZ9c6hLR3ROJAAAAAElFTkSuQmCC',
  cube: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAYAAAAqXEs9AAAAAXNSR0IArs4c6QAAAR1JREFUWEft2MESwiAMBFD5/4/GoRUmUmCTbFoP4rWSvi6RMU2vmE/+lElsObbAAcn59KTUyrnrehd+QfpUGJgVtIREwLQgE4SBIRAF8cBmoFCIBdaDboVoYBX0KGQFK6BczxH2UGPXl+PiANVCv4KJc+sE9SftU7AKkfcfbln/RXYrZj3TP3jbslki0TBUD4Lqk6FCKEHtejXIC9NCZH3Xzx7dCF2fJWpOCDWnF0InhGCop25LSBYu6bDnF71lG2Tphb1lKK2d0F8ndEzDciRGaYyuMz0kJ92wqcMDGo3cYXOZBbSa/cMmVw1I8xICgdpAgnpsBdJA2l8QYwNPm38EskC8oGliEuSBsKALTCDKNW0rXDbIvbCrFPaO8Q2E4usT3uthmwAAAABJRU5ErkJggg==',
  cubeNoSide: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAYAAAAqXEs9AAAAAXNSR0IArs4c6QAAASdJREFUWEft2NEOwyAIBdDx/x/tohsGnSIX6JYl3WsjPUNKpfTI+ZV3GIqGiwZokFJeHqIezh3Xu3CAzFmJwFCQCsmAWUEQJAI7gUIQD2wHSoUgsBl0KcQCY9BXIRqsggr3kWhTi66v7aKBONCvYNy36v2HDMkL0X9rWb+633LLroZp8dUayoZZ4pmK2hJI2yJkvQnEN0MCy7c/8rBAICsMhcvsukA7WATSY2Y0xgxIKojrBamV3UMQ2rJh74n6UdbSFG+QN0v3lp0yd2forzLEJ8Y2DcuR+PQvVtdrMG9jlJNu2tThAa1G7rS5DAFps3/a5GoBWT5CnEB9IDnVmAayQOTbHqnhbfGvQAjEC9pmTII8kCjoAyYQ7XiEpH0+wnrXynVp3xiftcnt4LtNoxwAAAAASUVORK5CYII=',
  cubeBlue: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAYAAAAqXEs9AAAAAXNSR0IArs4c6QAAARVJREFUWEft10ESgyAMBdByl56xh2iv2J6FDkIsUgxJftQNbCOZN18nYLj5rFjaBLQd2mCBxJg9IaztzH2tGzeQNhUEpgWxEA+YFKSCILARCIJYYHsgV4gG1oIOhUhgBDoVwsESKNIcQYcauj+NiwVEja6C0dx6vmMGtZP2LFgNoVC6r4wePArWg7CgtVjOJi8YBxGBvGASiApkhWkgJpAUZoFAoD0YAnEBtbA0R9DlNqlfH5SS90/QKMeZ0ExolMCoPr8hLqHHPd8Y04Lv1MhgTJCyfj/jKMwCqiH1WdZLUZ2YBtSDjEBUF8MkIA4iBYlhHEgC0YKGsB5IA7GCdmE1yAJBQX+wBEIgXqANrNyvRqcDW/8C5YLVyJ+0hvoAAAAASUVORK5CYII='
}

const settings = {
  column: 11, //this is always one more than how many you want
  row: 30,
  factor: 2,
  tile: 'stair',
  layer: 0,
  erase: false,
}

const state = {
  cells: [[]]
}

export {
  elements,
  input,
  tiles,
  settings,
  state,
}