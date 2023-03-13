import Header from './components/header'
import Garage from './pages/garage'
import Winners from './pages/winners'
import { createDOMElement } from './utils'

export default class App {
  private readonly containerDOM: HTMLElement

  private readonly mainDOM: HTMLElement

  private header

  page: number

  constructor() {
    this.containerDOM = document.getElementById('root') as HTMLElement
    this.mainDOM = createDOMElement('main', ['main'])
    this.header = new Header(this.containerDOM)
    this.page = 1

    this.addListeners()
  }

  start(): void {
    this.header.render()
    this.containerDOM.append(this.mainDOM)
    this.render('garage')
  }

  private render(content: string): void {
    const contentDOM = content === 'garage' ? new Garage(this.page) : new Winners()
    this.mainDOM.innerHTML = ''
    this.mainDOM.append(contentDOM.render())
  }

  private addListeners(): void {
    window.addEventListener('renderGaragePage', () => this.render('garage'))

    window.addEventListener('renderWinnersPage', () => this.render('winners'))

    window.addEventListener('prevPage', (): void => {
      this.page -= 1
    })

    window.addEventListener('nextPage', (): void => {
      this.page += 1
    })
  }
}
