import NavigationLink from '../navigationLink'
import { createDOMElement } from '../../utils'

export default class Header {
  private containerDOM: HTMLElement

  private readonly headerDOM: HTMLElement

  constructor(containerDOM: HTMLElement) {
    this.containerDOM = containerDOM
    this.headerDOM = createDOMElement('header', ['header'])
  }

  render(): void {
    this.headerDOM.innerHTML = `
      <nav class="nav">
        <ul class="nav__list">
          <li class="nav__item">
            <a id="garageLink" class="nav__link" href="/">Garage</a>
          </li>
          <li class="nav__item">
            <a id="winnersLink" class="nav__link" href="/winners">Winners</a>
          </li>
        </ul>
      </nav>
    `

    this.containerDOM.append(this.headerDOM)
    this.addListenerToLinks()
  }

  private addListenerToLinks(): void {
    const navigationLinksDOM = document.querySelectorAll('.nav__link') as NodeListOf<HTMLElement>

    navigationLinksDOM.forEach((element): void => {
      const link = new NavigationLink(element)
      link.addListener()
    })
  }
}
