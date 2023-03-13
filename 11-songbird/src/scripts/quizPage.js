import AudioPlayer from './audioPlayer'
import birdsDataRu from './data/birdsDataRu'
import birdsDataEn from './data/birdsDataEn'

import ImageAccept from '../assets/images/accept.png'
import ImageSmile from '../assets/images/smile.png'
import SoundGood from '../assets/sound/sound1.mp3'
import SoundBad from '../assets/sound/sound2.mp3'
import SoundCena from '../assets/sound/sound3.mp3'

/* eslint-disable */
export default class QuizPage {
  constructor(language) {
    this.language = language
    this.data = language === 'ru' ? birdsDataRu : birdsDataEn
    this.questionsOrder = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5)
    this.questionIndex = 0
    this.rightAnswerId = 0
    this.questionsLength = this.data.length
    this.score = 0
    this.questionScore = 5
    this.mainDOM = document.getElementById('mainContainer')
    this.audio = null
  }

  start() {
    this.rightAnswerId = this.random(1, 6)
    const value = document.getElementsByClassName('score')

    this.render()
    this.highlightQuestionNumber()
    this.addAnswersListener()
    this.addButtonListener()

    if (value.length === 0) {
      this.addScoreDOM()
    }

    console.group('Для проверки')
    console.info('Номера вопросов: ' + this.questionsOrder)
    console.info('Индекс вопроса: ' + this.questionIndex)
    console.info('Правильный ответ (li data-id): ' + this.rightAnswerId)
    console.groupEnd()
  }

  render() {
    const addInfoDOM = () => {
      const infoDOM = document.createElement('div')
      infoDOM.classList.add('info')

      const infoListDOM = document.createElement('ul')
      infoListDOM.classList.add('info__list')

      const infoItemsArr = []

      for (let i = 1; i < this.questionsLength + 1; i++) {
        const infoItem = document.createElement('li')
        infoItem.classList.add('info__item')
        infoItem.textContent = `${i}`
        infoItemsArr.push(infoItem)
      }

      infoListDOM.append(...infoItemsArr)
      infoDOM.append(infoListDOM)
      return infoDOM
    }

    const addQuestionDOM = () => {
      const question = this.getQuestion()

      const questionDOM = document.createElement('div')
      questionDOM.classList.add('question')
      questionDOM.innerHTML = `<img class="question__image" src="https://media.gettyimages.com/id/1183118977/video/4k-3d-metallic-question-mark-animation-on-white-background.jpg?s=640x640&k=20&c=4EjvcsFAE9C2v--mLlZlxMKxmcGNxjjvGJLlMGoEX68=" alt="Question image">
      <div class="question__content">
        <p class="question__title">******</p>
      </div>`

      const questionContentDOM = questionDOM.querySelector('.question__content')
      this.audio = new AudioPlayer(question[this.rightAnswerId - 1].audio)
      questionContentDOM.append(this.audio.createAudio())

      return questionDOM
    }

    const addAnswersDOM = () => {
      const answers = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5)
      const question = this.getQuestion()

      const answersListDOM = document.createElement('ul')
      answersListDOM.classList.add('answers__list')

      const answersItemArr = []

      for (let i = 0; i < 6; i++) {
        const answer = question[answers[i]]
        const itemDOM = document.createElement('li')
        itemDOM.dataset.id = answer.id
        itemDOM.classList.add('answers__item')
        itemDOM.innerHTML = `<span class="round"></span><span class="answers__item-title">${answer.name}</span>`
        answersItemArr.push(itemDOM)
      }

      answersListDOM.append(...answersItemArr)
      return answersListDOM
    }

    const addCardDOM = () => {
      const cardDOM = document.createElement('div')
      cardDOM.classList.add('card')

      const noneText = this.language === 'ru' ? 'Выберите вариант' : 'Choose answer'

      cardDOM.innerHTML = `<div class="card__container"><span class="card__none">${noneText}</span></div>`

      return cardDOM
    }

    const addContainerDOM = () => {
      const containerDOM = document.createElement('div')
      containerDOM.classList.add('dependencies')
      containerDOM.append(addAnswersDOM())
      containerDOM.append(addCardDOM())
      return containerDOM
    }

    const addNextButtonDOM = () => {
      const buttonDOM = document.createElement('button')
      buttonDOM.classList.add('next')
      buttonDOM.textContent = this.language === 'ru' ? 'Далее' : 'Next'
      return buttonDOM
    }

    const addSounds = () => {
      const container = document.createElement('div')
      container.style.visibility = 'hidden'
      container.innerHTML = `<audio id="soundGood" src="${SoundGood}"></audio>
        <audio id="soundBad" src="${SoundBad}" ></audio>
        <audio id="soundCena" src="${SoundCena}" ></audio>`

      return container
    }

    this.mainDOM.append(addInfoDOM())
    this.mainDOM.append(addQuestionDOM())
    this.mainDOM.append(addContainerDOM())
    this.mainDOM.append(addNextButtonDOM())
    this.mainDOM.append(addSounds())
  }

  addScoreDOM() {
    const scoreDOM = document.createElement('div')
    const headerContainerDOM = document.querySelector('.header__container')

    const languageDOM = document.getElementById('language')
    languageDOM.style.display = 'none'

    scoreDOM.classList.add('score')
    scoreDOM.innerHTML = `<span class="score__title">Score: </span><span class="score__value">${this.score}</span>`

    headerContainerDOM.append(scoreDOM)
  }

  highlightQuestionNumber() {
    const numbersDOM = document.getElementsByClassName('info__item')
    numbersDOM[this.questionIndex].classList.add('info__item--current')
  }

  addAnswersListener() {
    const answersItemsDOM = document.querySelectorAll('.answers__item')

    answersItemsDOM.forEach((item) => {
      item.addEventListener('click', () => {
        this.renderCardContent(item.dataset.id)
        this.changeAnswerStatus(item)
      })
    })
  }

  addButtonListener() {
    const buttonNextDOM = document.querySelector('.next')

    buttonNextDOM.addEventListener('click', () => {
      const ifClickSuccessAnswer = document.getElementsByClassName('round--success')

      if (ifClickSuccessAnswer.length !== 0) {
        this.updateScore()
        this.questionIndex++
        this.mainDOM.innerHTML = ''

        if (this.questionIndex === 6) {
          const scoreDOM = document.querySelector('.score')
          scoreDOM.remove()
          this.renderResultBlock()
        } else {
          this.start()
        }
      }
    })
  }

  renderCardContent(index) {
    const cardDOM = document.querySelector('.card')

    const question = this.getQuestion()
    const content = question[index - 1]

    cardDOM.innerHTML = `<div class="card__header">
          <img class="card__image" src="${content.image}" alt="${content.name}">
          <ul class="card__list">
            <li class="card__item card__item--title">${content.name}</li>
            <li class="card__item card__item--subtitle">${content.species}</li>
            <li class="card__item card__item--audio"></li>
          </ul>
        </div>
        <p class="card__description">${content.description}</p>`

    const cardItemAudioDOM = cardDOM.querySelector('.card__item--audio')
    const audio = new AudioPlayer(content.audio)
    cardItemAudioDOM.append(audio.createAudio())
  }

  changeAnswerStatus(answerDOM) {
    const id = +answerDOM.dataset.id
    const ifClickSuccessAnswer = document.getElementsByClassName('round--success')
    const roundDOM = answerDOM.querySelector('.round')
    const buttonNextDOM = document.querySelector('.next')

    const soundGood = document.getElementById('soundGood')
    const soundBad = document.getElementById('soundBad')
    const soundCena = document.getElementById('soundCena')

    if (ifClickSuccessAnswer.length === 0) {
      if (id === this.rightAnswerId) {
        this.audio.stopAudio()
        const errorsDOM = document.getElementsByClassName('round--error')
        errorsDOM.length === 0 ? soundCena.play() : soundGood.play()
        roundDOM.classList.add('round--success')
        buttonNextDOM.classList.add('next--agree')
        this.showAnswerInQuestion()
      } else {
        soundBad.play()
        roundDOM.classList.add('round--error')
      }
    }
  }

  showAnswerInQuestion() {
    this.audio.stopAudio()

    const question = this.getQuestion()
    const current = question[this.rightAnswerId - 1]

    const questionDOM = document.querySelector('.question')
    questionDOM.innerHTML = `<img class="question__image" src="${current.image}" alt="${current.name}">
      <div class="question__content">
        <p class="question__title">${current.name}</p>
        <div class="question__audio"></div>
      </div>`

    const questionAudioDOM = questionDOM.querySelector('.question__audio')
    const audio = new AudioPlayer(current.audio)
    questionAudioDOM.append(audio.createAudio())
  }

  updateScore() {
    const errors = document.getElementsByClassName('round--error').length
    this.score += this.questionScore - errors
    document.querySelector('.score__value').textContent = this.score
  }

  renderResultBlock() {
    const line1 = this.language === 'ru' ? 'Ура! Ваш результат: ' : 'Yahoo! Your result: '
    const line2 = this.language === 'ru' ? 'Может еще раз? ' : 'Maybe again? '
    const linkText = this.language === 'ru' ? 'Да' : 'Yes'

    if (this.score === 30) {
      this.mainDOM.innerHTML = `<div class="result">
        <img class="result__image" src="${ImageAccept}" alt="Accept result">
        <p class="result__line">${line1}<span class="result__score">${this.score}</span></p>
      </div>`
    } else {
      this.mainDOM.innerHTML = `<div class="result">
        <img class="result__image" src="${ImageSmile}" alt="Smile result">
        <p class="result__line">${line1}<span class="result__score">${this.score}</span></p>
        <p class="result__additional">${line2}<a class="result__link" href="./quiz.html">(${linkText})</a></p>
      </div>`
    }
  }

  getQuestion() {
    return this.data[this.questionsOrder[this.questionIndex]]
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }
}
