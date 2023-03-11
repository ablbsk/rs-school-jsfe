import pets from './pets.json' assert { type: "json" }

const cardArr = Array.from(document.getElementsByClassName('card'))

const goToFirstPageButton = document.getElementById('pagination-first')
const goToLastPageButton = document.getElementById('pagination-last')
const goToNextPageButton = document.getElementById('pagination-next')
const goToBackPageButton = document.getElementById('pagination-back')
const currentPageButton = document.getElementById('pagination-current-page')

let currentPage = 0
let maxPage = 6
let cardsCount = 8

const defineProperties = () => {
  const width = window.innerWidth;
  if (width >= 1280) {
    maxPage = 6
    cardsCount = 8
  } else if (width >= 768 && width < 1280) {
    maxPage = 8
    cardsCount = 6
  } else if (width < 768) {
    maxPage = 16
    cardsCount = 3
  }
}

const updateCards = newPets => {
  cardArr.slice(0, cardsCount).map((card, i) => {
    card.children[0].src = newPets[i].img
    card.children[1].innerHTML = newPets[i].name
  })
}

goToFirstPageButton.addEventListener('click', () => {
  defineProperties()
  currentPage = 0
  currentPageButton.innerText = currentPage + 1
  updateCards(pets.slice(0, cardsCount + 1))

  goToFirstPageButton.classList.add('square-button--disabled')
  goToBackPageButton.classList.add('square-button--disabled')

  goToNextPageButton.classList.remove('square-button--disabled')
  goToLastPageButton.classList.remove('square-button--disabled')
  
  goToFirstPageButton.disabled = true
  goToBackPageButton.disabled = true
  goToNextPageButton.disabled = false
  goToLastPageButton.disabled = false
})

goToNextPageButton.addEventListener('click', () => {
  defineProperties()
  currentPage = currentPage + 1
  currentPageButton.innerText = currentPage + 1
  updateCards(pets.slice(currentPage * cardsCount, (currentPage + 1) * cardsCount))

  goToBackPageButton.classList.remove('square-button--disabled')
  goToFirstPageButton.classList.remove('square-button--disabled')

  goToFirstPageButton.disabled = false
  goToBackPageButton.disabled = false
  goToNextPageButton.disabled = false
  goToLastPageButton.disabled = false

  if (currentPage + 1 === maxPage) {
    goToNextPageButton.classList.add('square-button--disabled')
    goToLastPageButton.classList.add('square-button--disabled')
    goToFirstPageButton.classList.remove('square-button--disabled')
    goToBackPageButton.classList.remove('square-button--disabled')

    goToNextPageButton.disabled = true
    goToLastPageButton.disabled = true
  }
})

goToBackPageButton.addEventListener('click', () => {
  defineProperties()
  currentPage = currentPage - 1
  currentPageButton.innerText = currentPage + 1
  updateCards(pets.slice(currentPage * cardsCount, (currentPage + 1) * cardsCount))

  goToFirstPageButton.classList.remove('square-button--disabled')
  goToBackPageButton.classList.remove('square-button--disabled')

  goToFirstPageButton.disabled = false
  goToBackPageButton.disabled = false
  goToNextPageButton.disabled = false
  goToLastPageButton.disabled = false

  if (currentPage === 0) {
    goToFirstPageButton.classList.add('square-button--disabled')
    goToBackPageButton.classList.add('square-button--disabled')
    goToNextPageButton.classList.remove('square-button--disabled')
    goToLastPageButton.classList.remove('square-button--disabled')

    goToFirstPageButton.disabled = true
    goToBackPageButton.disabled = true
  }
})

goToLastPageButton.addEventListener('click', () => {
  defineProperties()
  currentPage = maxPage
  currentPageButton.innerText = maxPage
  updateCards(pets.slice((maxPage - 1) * cardsCount, maxPage * cardsCount))

  goToFirstPageButton.classList.remove('square-button--disabled')
  goToBackPageButton.classList.remove('square-button--disabled')

  goToNextPageButton.classList.add('square-button--disabled')
  goToLastPageButton.classList.add('square-button--disabled')

  goToFirstPageButton.disabled = false
  goToBackPageButton.disabled = false
  goToNextPageButton.disabled = true
  goToLastPageButton.disabled = true
})
