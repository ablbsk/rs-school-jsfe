import { createDOMElement, changeActivityOfDOM } from '../../utils'

export default class Tools {
  private readonly toolsDOM: HTMLElement

  constructor() {
    this.toolsDOM = createDOMElement('div', ['tools']) as HTMLElement
  }

  render(): HTMLElement {
    this.toolsDOM.innerHTML = `
      <div class="entity">
        <div class="entity__form">
          <input id="createTrackName" class="entity__input" type="search" autocomplete="off">
          <input id="createTrackColor" class="entity__color" type="color">
          <button id="createTrackButton" class="button disabled">Create</button>
        </div>
        <div class="entity__form">
          <input id="updateTrackName" class="entity__input" type="search" autocomplete="off">
          <input id="updateTrackColor" class="entity__color" type="color">
          <button id="updateTrackButton" class="button disabled">Update</button>
        </div>
      </div>
      <div class="options">
        <button id="raceButton" class="button">Race</button>
        <button id="resetButton" class="button button--stop disabled">Reset</button>
        <button id="generateCars" class="button">Generate cars</button>
      </div>
    `

    this.addListeners()

    return this.toolsDOM
  }

  private addListeners(): void {
    // Tools — Entity buttons & inputs

    const createTrackButtonDOM = this.toolsDOM.querySelector('#createTrackButton') as HTMLButtonElement
    const updateTrackButtonDOM = this.toolsDOM.querySelector('#updateTrackButton') as HTMLButtonElement

    const createTrackNameDOM = this.toolsDOM.querySelector('#createTrackName') as HTMLInputElement
    const updateTrackNameDOM = this.toolsDOM.querySelector('#updateTrackName') as HTMLInputElement

    createTrackNameDOM.addEventListener('input', (e: Event): void => {
      const target = e.target as HTMLInputElement
      const result = target.value.trim().length < 4

      changeActivityOfDOM(result, createTrackButtonDOM)
    })

    updateTrackNameDOM.addEventListener('input', (e: Event): void => {
      const target = e.target as HTMLInputElement
      const result = target.value.trim().length < 4

      changeActivityOfDOM(result, updateTrackButtonDOM)
    })

    createTrackButtonDOM.addEventListener('click', (): void => {
      document.dispatchEvent(new Event('createNewTrack', { bubbles: true }))

      createTrackNameDOM.value = ''
      changeActivityOfDOM(true, createTrackButtonDOM)
    })

    // Tools — Options buttons

    const raceButtonDOM = this.toolsDOM.querySelector('#raceButton') as HTMLButtonElement
    const resetButtonDOM = this.toolsDOM.querySelector('#resetButton') as HTMLButtonElement
    const generateButtonDOM = this.toolsDOM.querySelector('#generateCars') as HTMLButtonElement

    raceButtonDOM.addEventListener('click', () => document.dispatchEvent(new Event('startRace', { bubbles: true })))

    resetButtonDOM.addEventListener('click', () => document.dispatchEvent(new Event('resetRace', { bubbles: true })))

    generateButtonDOM.addEventListener('click', () => document.dispatchEvent(new Event('generate', { bubbles: true })))
  }
}
