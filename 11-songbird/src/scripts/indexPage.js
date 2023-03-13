import songBirdImage from '../assets/images/songbird.png'
import songAnimalImage from '../assets/images/songanimal.png'
import mushroomsImage from '../assets/images/mushrooms.png'
import berriesImage from '../assets/images/berries.png'

export default class IndexPage {
  constructor(language) {
    this.language = language
    this.quizesArr = [
      { titleEn: 'Bird sounds', titleRu: 'Голоса птиц', image: songBirdImage, allowed: true },
      { titleEn: 'Animal sounds', titleRu: 'Голоса животных', image: songAnimalImage, allowed: false },
      { titleEn: 'Mushrooms', titleRu: 'Грибы', image: mushroomsImage, allowed: false },
      { titleEn: 'Berries', titleRu: 'Ягоды', image: berriesImage, allowed: false }
    ]
  }

  render() {
    const mainElement = document.getElementById('mainContainer')
    const listElement = document.createElement('ul')
    listElement.classList.add('quizes__list')

    const quizLabelKey = this.language === 'ru' ? 'titleRu' : 'titleEn'

    this.quizesArr.forEach((item) => {
      const element = document.createElement('li')

      element.classList.add('quizes__item')
      if (!item.allowed) element.classList.add('quizes__item--disable')

      element.innerHTML = `<div class="quiz__container">
          <img class="quiz__image" src="${item.image}" alt="Songbird quiz">
          <h2 class="quiz__title">${item[quizLabelKey]}</h2>
          </div>
          <div class="quiz__navigation${item.allowed ? '' : ' quiz__navigation--disable'}">
            <a 
              class="quiz__link${item.allowed ? '' : ' quiz__link--disable'}" 
              href="${item.allowed ? './quiz.html' : '#'}"
              >
              <span class="icon icon--play"></span>
            </a>
            <a 
              class="quiz__link${item.allowed ? '' : ' quiz__link--disable'}" 
              href="${item.allowed ? './gallery.html' : '#'}"
              >
              <span class="icon icon--gallery"></span>
            </a>
          </div>`

      listElement.append(element)
    })

    mainElement.append(listElement)
  }
}
