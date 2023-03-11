import pets from './pets.json' assert { type: "json" }

const cardArr = document.querySelectorAll('.card')

const modal = document.getElementsByClassName('modal-pet')[0]
const shadow = document.getElementsByClassName('shadow-back')[0]
const closeButton = document.getElementsByClassName('modal-pet__close')[0]

const arrElements = [
  { element: document.body, style: 'body--locked' },
  { element: shadow, style: 'shadow-back--active' },
  { element: modal, style: 'modal-pet--opened' }
]

cardArr.forEach(card => {
  card.addEventListener('click', () => {
    const heading = card.querySelector('p').textContent
    const pet = findPet(heading)
    createModal(pet)
    arrElements.map(item => item.element.classList.toggle(item.style))
  })
})

const findPet = heading => pets.find(pet => pet.name === heading)

const createModal = pet => {
  document.getElementById('modal-content').innerHTML =
    `<div class="modal-pet__container">
       <div class="modal-pet__card-image">
          <img class="modal-pet__image" src="${pet.img}" alt="${pet.name}">
        </div>
       <div class="modal-pet__card-content">
          <h3 class="modal-pet__header">${pet.name}</h3>
          <p class="modal-pet__type">${pet.type} — ${pet.breed}</p>
          <p class="modal-pet__description">${pet.description}</p>
          <ul class="modal-pet__list">
            <li><span>Age:</span> ${pet.age}</li>
            <li><span>Inoculations:</span> ${pet.inoculations}</li>
            <li><span>Diseases:</span> ${pet.diseases}</li>
            <li><span>Parasites:</span> ${pet.parasites}</li>
          </ul>
        </div>
     </div>`
}

shadow.addEventListener('click', () => {
  arrElements.map(item => item.element.classList.remove(item.style))
})

closeButton.addEventListener('click', () => {
  arrElements.map(item => item.element.classList.remove(item.style))
})

modal.addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    arrElements.map(item => item.element.classList.remove(item.style))
  }
})
