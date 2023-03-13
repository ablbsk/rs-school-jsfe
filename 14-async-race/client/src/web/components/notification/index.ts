import { createDOMElement } from '../../utils'

export default class Notification {
  private readonly notificationDOM: HTMLElement

  constructor() {
    this.notificationDOM = createDOMElement('div', ['notification'])
  }

  render(status: string, msg: string): void {
    this.notificationDOM.innerHTML = `<span class="modal__line">${status}: ${msg}</span>`
    this.notificationDOM.classList.add(status === 'Complete' ? 'notification--complete' : 'notification--error')

    document.body.append(this.notificationDOM)

    this.remove()
  }

  private remove() {
    setTimeout(() => this.notificationDOM.remove(), 1000)
  }
}
