import { createDOMElement } from '../../utils'
import { ICar } from '../../interfaces'

export default class Modal {
  private readonly modalDOM: HTMLElement

  private readonly winner: ICar

  private readonly time: number

  constructor(winner: ICar, time: number) {
    this.modalDOM = createDOMElement('div', ['modal'])
    this.winner = winner
    this.time = time
  }

  render() {
    this.modalDOM.innerHTML = `
      <p class="modal__line">Winner: ${this.winner.name} | ${this.winner.id}<span>  
      <p class="modal__line">Time: ${this.time} sec<span>  
    `

    return this.modalDOM
  }

  remove() {
    this.modalDOM.remove()
  }
}
