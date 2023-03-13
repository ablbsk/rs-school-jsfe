export default class NavigationLink {
  private readonly linkDOM: HTMLElement

  constructor(linkDOM: HTMLElement) {
    this.linkDOM = linkDOM
  }

  addListener() {
    this.linkDOM.addEventListener('click', (e: Event): void => {
      e.preventDefault()

      const target = e.target as HTMLElement
      const key = target.id === 'garageLink' ? 'renderGaragePage' : 'renderWinnersPage'

      const event = new Event(key, { bubbles: true })
      document.dispatchEvent(event)
    })
  }
}
