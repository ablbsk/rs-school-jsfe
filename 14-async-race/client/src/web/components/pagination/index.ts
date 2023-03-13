import { createDOMElement, changeActivityOfDOM } from '../../utils'

export default class Pagination {
  private readonly paginationDOM: HTMLElement

  private readonly prevButtonDOM: HTMLElement

  private readonly nextButtonDOM: HTMLElement

  private readonly labelDOM: HTMLElement

  private count: number

  private page: number

  constructor(count: number, page: number) {
    this.count = count
    this.page = page

    this.paginationDOM = createDOMElement('div', ['pagination'])
    this.prevButtonDOM = createDOMElement('button', ['button', 'button-prev'], 'prev')
    this.nextButtonDOM = createDOMElement('button', ['button', 'button-next'], 'next')
    this.labelDOM = createDOMElement('span', ['pagination__label'], this.viewPageCount())
  }

  render(): HTMLElement {
    this.addListeners()
    this.changeActivityOfButtons()

    this.paginationDOM.append(this.prevButtonDOM, this.labelDOM, this.nextButtonDOM)

    return this.paginationDOM
  }

  private addListeners(): void {
    this.prevButtonDOM.addEventListener('click', () => document.dispatchEvent(new Event('prevPage', { bubbles: true })))
    this.nextButtonDOM.addEventListener('click', () => document.dispatchEvent(new Event('nextPage', { bubbles: true })))
  }

  private viewPageCount(): string {
    return `${this.page} / ${Math.ceil(this.count / 7)}`
  }

  updatePageLabel(count: number, page: number): void {
    this.page = page
    this.count = count

    this.changeActivityOfButtons()

    this.labelDOM.innerHTML = this.viewPageCount()
  }

  changeActivityOfButtons(active = false): void {
    const isPrevActive = this.page < 2
    const isNextActive = this.page === Math.ceil(this.count / 7)

    changeActivityOfDOM(active || isPrevActive, this.prevButtonDOM)
    changeActivityOfDOM(active || isNextActive, this.nextButtonDOM)
  }
}
