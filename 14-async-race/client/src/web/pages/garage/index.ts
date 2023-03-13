import { ICar, ICreateCar, IGetCars } from '../../interfaces'
import { createCar, getAllCars } from '../../api/api'
import Tools from '../../components/tools'
import Track from '../../components/track'
import Pagination from '../../components/pagination'
import Modal from '../../components/modal'
import { changeActivityOfDOM, createDOMElement } from '../../utils'
import carsModels from './constants'
import Notification from '../../components/notification'

export default class Garage {
  private readonly wrapperDOM: HTMLElement

  private readonly tracksDOM: HTMLElement

  private readonly notification: Notification

  private readonly generateCount: number

  private page: number

  private garage: Array<Track>

  pagination: Pagination | null

  constructor(page: number) {
    this.wrapperDOM = createDOMElement('section', ['garage'])
    this.tracksDOM = createDOMElement('div', ['garage__tracks'])
    this.notification = new Notification()
    this.pagination = null
    this.generateCount = 100
    this.garage = []
    this.page = page

    this.addListeners()
  }

  private addListeners(): void {
    window.addEventListener('createNewTrack', (): void => this.createNewTrack())

    window.addEventListener('updateTracks', () => this.updateTracks())

    window.addEventListener('startRace', () => this.startRace())

    window.addEventListener('resetRace', (): void => this.resetTracks())

    window.addEventListener('generate', (): void => this.generateTracks())

    window.addEventListener('prevPage', (): void => this.changePage(false))

    window.addEventListener('nextPage', (): void => this.changePage(true))
  }

  private createNewTrack(): void {
    const carNameDOM = document.getElementById('createTrackName') as HTMLInputElement
    const carColorDOM = document.getElementById('createTrackColor') as HTMLInputElement

    if (carNameDOM.value) {
      const car: ICreateCar = { name: carNameDOM.value, color: carColorDOM.value }

      createCar(car)
        .then(() => {
          this.updateTracks()
          this.notification.render('Complete', 'create car')
        })
        .catch(() => this.notification.render('Fail', 'create car'))
    }
  }

  private updateTracks(): void {
    this.garage = []

    getAllCars(this.page)
      .then((data) => {
        if (data) {
          this.updateRender(data)
          if (this.pagination) this.pagination.updatePageLabel(+data.count, this.page)
        }
      })
      .catch(() => this.notification.render('Fail', 'something went wrong...'))
  }

  private async startRace() {
    if (this.garage.length) {
      const resetButtonDOM = document.getElementById('resetButton') as HTMLButtonElement

      const tracks = this.garage.map((track) => track.start().then(() => track))

      this.changeActivityOfElements(true)
      changeActivityOfDOM(true, resetButtonDOM)

      const winnerCar = await Promise.race(tracks)

      this.showWinnerModal(winnerCar)

      Promise.race(tracks)
        .then((winner) => this.showWinnerModal(winner))
        .then(() => changeActivityOfDOM(false, resetButtonDOM))
        .catch(() => this.notification.render('Fail', 'something went wrong...'))
    }
  }

  private showWinnerModal(winner: Track): void {
    if (winner.animation?.currentTime) {
      const time = (winner.animation.currentTime / 1000).toFixed(3)
      const modalDOM = new Modal(winner.car, +time)

      this.wrapperDOM.append(modalDOM.render())
      setTimeout(() => modalDOM.remove(), 5000)
    }
  }

  private resetTracks(): void {
    this.garage.forEach((track) => {
      track.stop()
      track.prepareTitleToStart()
      track.changeActivityOfButtons(false)
    })
    this.changeActivityOfElements(false)
  }

  private generateTracks(): void {
    const keys = Object.keys(carsModels)
    const generatedCars = []
    const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min)) + min

    const createName = (): string => {
      const brand = keys[random(0, keys.length)]
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const model = carsModels[brand][random(0, carsModels[brand].length - 1)]
      return `${brand} ${model}`
    }

    const createColor = (): string => {
      const result = ['#']

      for (let i = 0; i < 6; i++) {
        result.push(random(0, 9).toString())
      }

      return result.join('')
    }

    for (let i = 0; i < this.generateCount; i++) {
      const car: ICreateCar = { name: createName(), color: createColor() }
      generatedCars.push(createCar(car))
    }

    Promise.all(generatedCars)
      .then(() => getAllCars(this.page))
      .then((data) => {
        if (data) {
          this.updateRender(data)
          this.notification.render('Complete', 'generate new cars')
          if (this.pagination) this.pagination.updatePageLabel(+data.count, this.page)
        }
      })
      .catch(() => this.notification.render('Fail', 'generate new cars'))
  }

  private changePage(isNext: boolean): void {
    this.garage = []
    this.page = isNext ? this.page + 1 : this.page - 1

    this.updateTracks()
  }

  render(): HTMLElement {
    const tools = new Tools()
    this.wrapperDOM.append(tools.render())

    getAllCars(this.page)
      .then((data) => {
        if (data) {
          this.pagination = new Pagination(+data.count, this.page)

          this.renderGarageDOM(data)
          this.wrapperDOM.append(this.pagination.render())
        }
      })
      .catch(() => {
        this.renderErrorHeaderDOM()
        this.notification.render('Fail', 'something went wrong...')
      })

    return this.wrapperDOM
  }

  private renderGarageDOM(data: IGetCars): void {
    const containerDOM = createDOMElement('div', ['garage__container'])
    const titleDOM = createDOMElement('h2', ['title'], `Garage [${data.count}]`)

    this.renderTracksDOM(data.cars)

    containerDOM.append(titleDOM, this.tracksDOM)
    this.wrapperDOM.append(containerDOM)
  }

  private renderTracksDOM(cars: ICar[]): void {
    this.tracksDOM.innerHTML = ''

    cars.forEach((car: ICar) => {
      const track = new Track(car)
      this.garage.push(track)
      this.tracksDOM.append(track.render())
    })
  }

  private renderErrorHeaderDOM(): void {
    const errorDOM = createDOMElement('h2', ['title', 'title--error'], `Hmm, are you started server?`)
    this.wrapperDOM.append(errorDOM)
  }

  private updateTitleCount(count: string) {
    const titleDOM = document.querySelector('.title') as HTMLElement
    titleDOM.textContent = `Garage [${count}]`
  }

  private updateRender(data: IGetCars): void {
    this.updateTitleCount(data.count)
    this.renderTracksDOM(data.cars)
  }

  private changeActivityOfElements(isStart: boolean): void {
    const entityDOM = document.querySelector('.entity') as HTMLElement

    changeActivityOfDOM(isStart, entityDOM)

    const raceButtonDOM = document.getElementById('raceButton') as HTMLButtonElement
    const resetButtonDOM = document.getElementById('resetButton') as HTMLButtonElement
    const generateButtonDOM = document.getElementById('generateCars') as HTMLButtonElement

    changeActivityOfDOM(isStart, raceButtonDOM)
    changeActivityOfDOM(!isStart, resetButtonDOM)
    changeActivityOfDOM(isStart, generateButtonDOM)

    if (this.pagination) this.pagination.changeActivityOfButtons(isStart)
  }
}
