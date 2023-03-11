export default class Popup {
  constructor(item) {
    this.testimonial = item
    this.shadow = document.getElementById('shadow')
  }

  init() {
    this.testimonial.addEventListener('click', () => {
      if (window.innerWidth < 1000) {
        this.shadow.classList.add('shadow')
        this.createPopup()
      }
    })

    this.shadow.addEventListener('click', () => {
      this.removePopup()
    })
  }

  createPopup() {
    const popup = document.createElement('div')
    popup.classList.add('popup')

    const content = this.testimonial.cloneNode(true)
    content.classList.add('testimonial__popup')

    const closeIcon = document.createElement('span')
    closeIcon.classList.add('close__icon--popup')

    closeIcon.addEventListener('click', () => {
      this.removePopup()
    })

    popup.appendChild(closeIcon)
    popup.appendChild(content)
    document.body.appendChild(popup)
  }

  removePopup() {
    this.shadow.classList.remove('shadow')
    const popup = document.getElementsByClassName('popup')[0]
    popup.remove()
  }
}
