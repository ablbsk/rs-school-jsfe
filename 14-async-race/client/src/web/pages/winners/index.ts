export default class Winners {
  private readonly wrapperDOM: HTMLElement

  constructor() {
    this.wrapperDOM = this.createWrapper()
  }

  private createWrapper(): HTMLElement {
    const wrapperDOM = document.createElement('div')
    wrapperDOM.classList.add('winners')
    wrapperDOM.innerHTML = `<h2 class="winners">Sorry, but winner's table is not realize :(</h2>`
    return wrapperDOM
  }

  render(): HTMLElement {
    return this.wrapperDOM
  }
}
