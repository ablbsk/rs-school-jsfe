import '../styles/main.scss'
import IndexPage from './indexPage'
import GalleryPage from './galleryPage'
import QuizPage from './quizPage'

import logoDOM from '../assets/icons/logo.svg'

class App {
  constructor() {
    this.path = window.location.pathname
    this.language = null
  }

  start() {
    this.getLanguage()
    this.renderDOM()
    this.addListeners()
  }

  getLanguage() {
    if (localStorage.lang) {
      this.language = JSON.parse(localStorage.getItem('lang'))
    } else {
      localStorage.setItem('lang', JSON.stringify('ru'))
      this.language = 'ru'
    }
  }

  renderDOM() {
    const languageIcon = this.language === 'ru' ? 'icon--language-ru' : 'icon--language-en'

    const addHeaderDOM = () => {
      const headerDOM = document.createElement('header')
      headerDOM.classList.add('header')
      headerDOM.innerHTML = `<div class="header__container container">
        <a href="./index.html">
          <img class="logo" src="${logoDOM}" alt="Quizes — main logo">
        </a>
        <span id="language" class="icon ${languageIcon}"></span>
      </div>`

      return headerDOM
    }

    const addFooterDOM = () => {
      const footerDOM = document.createElement('footer')
      footerDOM.classList.add('footer')
      footerDOM.innerHTML = `<ul class="footer-list">
      <li class="footer-list__item">
        <a href="https://github.com/ablbsk">
          <span class="icon icon--github"></span>
        </a>
      </li>
      <li class="footer-list__item">
        <a href="https://rs.school/js/">
          <span class="icon icon--rsschool"></span>
        </a>
      </li>
    </ul>`

      return footerDOM
    }

    document.body.insertBefore(addHeaderDOM(), document.body.firstChild)

    if (this.path.includes('quiz')) {
      const page = new QuizPage(this.language)
      page.start()
    } else if (this.path.includes('gallery')) {
      const page = new GalleryPage(this.language)
      page.render()
    } else {
      const page = new IndexPage(this.language)
      page.render()
    }

    document.body.append(addFooterDOM())
  }

  addListeners() {
    const languageDOM = document.getElementById('language')

    languageDOM.addEventListener('click', () => {
      this.language = this.language === 'ru' ? 'en' : 'ru'
      localStorage.setItem('lang', JSON.stringify(this.language))

      document.body.innerHTML = `<main class="main">
          <div id="mainContainer" class="main__container container"></div>
         </main>`

      this.start()
    })
  }
}

window.onload = () => {
  const app = new App()
  app.start()
}
