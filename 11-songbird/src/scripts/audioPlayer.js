/* eslint-disable */
export default class AudioPlayer {
  constructor(link) {
    this.audioLink = link
    this.interval = null
    this.audio = null
  }

  createAudio() {
    const audioContainerDOM = document.createElement('div')
    audioContainerDOM.classList.add('audio')
    audioContainerDOM.innerHTML = `<div class='audio__timeline'>
        <div class='audio__progress'></div>
      </div>
      <div class='audio__controls'>
        <div class='audio__play'>
          <span class='toggle-play play'>
        </span>
      </div>
      <div class='audio__time'>
        <span class='current'>0:00</span>
        <span class='divider'>/</span>
        <span class='length'></span>
      </div>
      <div class='volume'>
        <div class='volume__button'></div>
        <div class='volume__slider'>
          <div class='volume__percentage'></div>
        </div>
      </div>
    </div>`

    this.addListeners(audioContainerDOM)
    return audioContainerDOM
  }

  addListeners(audioContainerDOM) {
    const loadAudio = () => {
      audio.addEventListener('loadeddata', () => {
        audioContainerDOM.querySelector('.length').textContent = this.getTimeCode(audio.duration)
        audio.volume = .5
      }, false)
    }

    const updateTimeline = () => {
      const timeline = audioContainerDOM.querySelector('.audio__timeline')
      timeline.addEventListener('click', e => {
        const timelineWidth = window.getComputedStyle(timeline).width
        audio.currentTime = e.offsetX / parseInt(timelineWidth) * audio.duration
      }, false)
    }

    const updateProgress = () => {
      const progressBar = audioContainerDOM.querySelector('.audio__progress')
      progressBar.style.width = audio.currentTime / audio.duration * 100 + '%'
      audioContainerDOM.querySelector('.current').textContent = this.getTimeCode(audio.currentTime)

      if (progressBar.style.width === '100%') this.stopAudio()
    }

    const updateVolume = () => {
      const volumeSlider = audioContainerDOM.querySelector('.volume__slider')
      volumeSlider.addEventListener('click', e => {
        const sliderWidth = window.getComputedStyle(volumeSlider).width
        const newVolume = e.offsetX / parseInt(sliderWidth)
        audio.volume = newVolume
        audioContainerDOM.querySelector('.volume__percentage').style.width = newVolume * 100 + '%'
      }, false)
    }

    const changePlayButton = () => {
      const buttonDOM = audioContainerDOM.querySelector('.toggle-play')
      buttonDOM.addEventListener('click', () => {
        if (audio.paused) {
          buttonDOM.classList.remove('play')
          buttonDOM.classList.add('pause')
          this.interval = setInterval(() => updateProgress(), 250)
          audio.play()
        } else {
          buttonDOM.classList.remove('pause')
          buttonDOM.classList.add('play')
          audio.pause()
        }
      }, false)
    }

    const audio = new Audio(this.audioLink)
    this.audio = audio

    loadAudio()
    updateTimeline()
    updateVolume()
    changePlayButton()
  }

  getTimeCode(value) {
    let seconds = parseInt(value)
    let minutes = parseInt(seconds / 60)
    seconds -= minutes * 60
    const hours = parseInt(minutes / 60)
    minutes -= hours * 60

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`
  }

  stopAudio() {
    const audioContainerDOM = document.querySelector('.audio')
    const buttonDOM = audioContainerDOM.querySelector('.toggle-play')
    buttonDOM.classList.remove('pause')
    buttonDOM.classList.add('play')

    this.audio.pause()
    this.audio.currentTime = 0

    const progressBar = audioContainerDOM.querySelector('.audio__progress')
    progressBar.style.width = '0'
    audioContainerDOM.querySelector('.current').textContent = this.getTimeCode(0)

    clearInterval(this.interval)
  }
}
