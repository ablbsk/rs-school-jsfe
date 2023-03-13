import AudioPlayer from './audioPlayer'
import birdsDataRu from './data/birdsDataRu'
import birdsDataEn from './data/birdsDataEn'

export default class GalleryPage {
  constructor(language) {
    this.data = language === 'ru' ? birdsDataRu : birdsDataEn
    this.mainDOM = document.getElementById('mainContainer')
  }

  render() {
    const galleryDOM = document.createElement('div')
    galleryDOM.classList.add('gallery')

    const arr = []

    this.data.forEach((itemArr) => {
      itemArr.forEach((item) => {
        const galleryItemDOM = document.createElement('div')
        galleryItemDOM.classList.add('card')
        galleryItemDOM.innerHTML = `<div class="card__header">
            <img class="card__image" src="${item.image}" alt="${item.name}">
            <ul class="card__list">
              <li class="card__item card__item--title">${item.name}</li> 
              <li class="card__item card__item--subtitle">${item.species}</li>
              <li class="card__item card__item--audio"></li> 
            </ul>
          </div>
          <p class="card__description">${item.description}</p>`

        const audioContainerDOM = galleryItemDOM.querySelector('.card__item--audio')
        const audioDOM = new AudioPlayer(item.audio)
        audioContainerDOM.append(audioDOM.createAudio())
        arr.push(galleryItemDOM)
      })
    })

    galleryDOM.append(...arr)
    this.mainDOM.append(galleryDOM)
  }
}
