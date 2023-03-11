export default class Slider {
  constructor(petsArr, images) {
    this.pets = petsArr
    this.container = document.getElementById('petsContainer')
    this.containerWidth = this.container.offsetWidth
    this.arrowLeft = document.getElementById('sliderArrowLeft')
    this.arrowRight = document.getElementById('sliderArrowRight')
    this.petImages = images.pets
    this.herbivoreImage = images.herbivore
    this.predatorImage = images.predator
  }

  init() {
    this.createGrid()

    this.arrowRight.addEventListener('click', () => this.showNew())
    this.arrowLeft.addEventListener('click', () => this.showPrevious())
  }

  createGrid() {
    const grid = document.createElement('div')
    grid.classList.add('pets__slider')

    this.shuffle()
    const pets = this.pets.slice(0, 6)
    pets.forEach((item, i) => grid.appendChild(this.createCard(item, i)))

    this.container.appendChild(grid)
  }

  createCard(pet) {
    const petDOM = document.createElement('div')
    petDOM.classList.add('pet')

    petDOM.innerHTML = `
        <img class='pet__image' src='${this.petImages[pet.index - 1]}' alt='${pet.name}' />
        <div class='pet__content'>
          <div class='pet__text'>
            <p class='pet__name'>${pet.name}</p>
            <p class='pet__geo'>${pet.location}</p>
          </div>
        <img class='pet__icon' 
          src='${pet.predator ? this.predatorImage : this.herbivoreImage}' 
          alt='${pet.predator ? 'Predator' : 'Herbivore'}' 
        />
        </div>
        <div class='pet__content--show'>
              <div class='pet__text--show'>
                <p class='pet__name'>${pet.name}</p>
                <p class='pet__geo'>${pet.location}</p>
              </div>
            </div>`

    return petDOM
  }

  showNew() {
    const rightPos = this.container.style.right ? Number.parseInt(this.container.style.right, 10) : 0
    this.createGrid()
    this.container.style.right = `${rightPos + this.containerWidth * 0.1}rem`
  }

  showPrevious() {
    const rightPos = Number.parseInt(this.container.style.right, 10)

    if (rightPos) {
      this.container.style.right = `${rightPos - this.containerWidth * 0.1}rem`
    }
  }

  shuffle() {
    this.pets.sort(() => Math.random() - 0.5)
  }
}
