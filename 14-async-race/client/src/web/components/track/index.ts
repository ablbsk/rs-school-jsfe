import { changeActivityOfDOM, createDOMElement } from '../../utils'
import { ICar, ICarEngine } from '../../interfaces'
import { deleteCar, startCarEngine, driveCar, updateCar, stopCarEngine } from '../../api/api'
import imageFinish from '../../../assets/images/finish.jpg'
import Notification from '../notification'

export default class Track {
  private readonly trackDOM: HTMLElement

  private readonly notification: Notification

  animation: Animation | null

  car: ICar

  constructor(car: ICar) {
    this.trackDOM = createDOMElement('div', ['track'])
    this.notification = new Notification()
    this.animation = null
    this.car = car
  }

  render(): HTMLElement {
    this.trackDOM.innerHTML = `
      <div class="track__controls">
        <p class="track__number">${this.car.id}</p>
        <div class="track__cell">
          <button class="button button-select">Select</button>
          <button class="button button-delete">Remove</button>
        </div>
        <div class="track__cell">
          <button class="button button-start button--special button--start">Start</button>
          <button class="button button-stop button--special button--stop disabled">Stop</button>
        </div>
      </div>
      <p class="track__name">${this.car.name}</p>
      <div class="track__track">
        <svg class="track__icon">
          <circle cx="50" cy="50" r="40" fill="${this.car.color}" />
        </svg>
      </div>
      <img class="track__finish" src="${imageFinish}" alt="Finish"> 
    `

    this.addListeners()

    return this.trackDOM
  }

  private addListeners(): void {
    const startButtonDOM = this.trackDOM.querySelector('.button-start') as HTMLButtonElement
    const stopButtonDOM = this.trackDOM.querySelector('.button-stop') as HTMLButtonElement
    const deleteButtonDOM = this.trackDOM.querySelector('.button-delete') as HTMLButtonElement
    const selectButtonDOM = this.trackDOM.querySelector('.button-select') as HTMLButtonElement

    startButtonDOM.addEventListener('click', (): Promise<void> => this.start())

    stopButtonDOM.addEventListener('click', (): void => this.stop())

    deleteButtonDOM.addEventListener('click', (): void => this.remove())

    selectButtonDOM.addEventListener('click', (): void => this.update())
  }

  private animateDrive(data: { result: ICarEngine; status: number }): void {
    const time = data.result.distance / data.result.velocity

    const item = this.trackDOM.querySelector('svg') as SVGElement
    const finishPosition = `calc(100% - 100px)`

    this.animation = item.animate([{ left: '0px' }, { left: finishPosition }], {
      duration: time,
      easing: 'ease-in'
    })

    this.animation.play()
    this.animation.onfinish = () => {
      item.style.left = finishPosition
    }
  }

  start(): Promise<void> {
    const { id } = this.car

    return startCarEngine(id)
      .then((data) => {
        this.changeActivityOfButtons(true)
        this.animateDrive(data)
      })
      .then(() => driveCar(id))
      .then((status) => {
        return new Promise((resolve) => {
          if (status === 500) {
            this.animation?.pause()
            this.prepareTitleToStart(true)
          } else if (status === 200) resolve()
        })
      })
  }

  stop(): void {
    const item = this.trackDOM.querySelector('svg') as SVGElement

    stopCarEngine(this.car.id)
      .then((result) => {
        if (result.status === 200) {
          this.animation?.cancel()
          this.changeActivityOfButtons(false)
          item.removeAttribute('style')
        }
      })
      .catch(() => this.notification.render('Fail', 'something went wrong...'))
  }

  private remove(): void {
    deleteCar(this.car.id)
      .then(() => {
        this.notification.render('Complete', `remove ${this.car.name}`)
        document.dispatchEvent(new Event('updateTracks', { bubbles: true }))
      })
      .catch(() => this.notification.render('Fail', `remove ${this.car.name}`))
  }

  private update(): void {
    const updateCarNameDOM = document.getElementById('updateTrackName') as HTMLInputElement
    const updateCarColorDOM = document.getElementById('updateTrackColor') as HTMLInputElement
    const updateButtonDOM = document.getElementById('updateTrackButton') as HTMLButtonElement

    document.body.scrollIntoView()

    updateCarNameDOM.value = this.car.name
    updateCarColorDOM.value = this.car.color

    updateButtonDOM.addEventListener('click', (): void => {
      if (updateCarNameDOM.value) {
        this.car.name = updateCarNameDOM.value
        this.car.color = updateCarColorDOM.value

        updateCar(this.car)
          .then(() => {
            this.updateDOM()
            this.notification.render('Complete', 'update car')
          })
          .catch(() => this.notification.render('Fail', 'update car'))

        updateCarNameDOM.value = ''
        updateButtonDOM.classList.add('disabled')
      }
    })
  }

  private updateDOM(): void {
    const trackNameDOM = this.trackDOM.querySelector('.track__name') as HTMLElement
    const circleDOM = this.trackDOM.querySelector('circle') as SVGCircleElement
    trackNameDOM.textContent = this.car.name
    circleDOM.style.fill = this.car.color
  }

  prepareTitleToStart(isCrash = false): void {
    const trackNameDOM = this.trackDOM.querySelector('.track__name') as HTMLElement
    isCrash ? trackNameDOM.classList.add('track__name--crash') : trackNameDOM.classList.remove('track__name--crash')
  }

  changeActivityOfButtons(isStart: boolean): void {
    const startButtonDOM = this.trackDOM.querySelector('.button-start') as HTMLButtonElement
    const stopButtonDOM = this.trackDOM.querySelector('.button-stop') as HTMLButtonElement
    const deleteButtonDOM = this.trackDOM.querySelector('.button-delete') as HTMLButtonElement
    const selectButtonDOM = this.trackDOM.querySelector('.button-select') as HTMLButtonElement

    changeActivityOfDOM(isStart, startButtonDOM)
    changeActivityOfDOM(!isStart, stopButtonDOM)
    changeActivityOfDOM(isStart, deleteButtonDOM)
    changeActivityOfDOM(isStart, selectButtonDOM)
  }
}
