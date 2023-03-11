export default class Hamburger {
  constructor() {
    this.shadow = document.getElementById('shadow')
    this.hamburgerIcon = document.getElementById('hamburgerIcon')
    this.hamburger = document.getElementById('hamburger')
    this.closeHamburgerIcon = document.getElementById('closeHamburgerIcon')
  }

  init() {
    const removeStyles = () => {
      this.shadow.classList.remove('shadow')
      this.hamburger.classList.remove('hamburger--opened')
      document.body.classList.remove('body--fixed')
    }

    this.hamburgerIcon.addEventListener('click', () => {
      this.shadow.classList.add('shadow')
      this.hamburger.classList.add('hamburger--opened')
      document.body.classList.add('body--fixed')
    })

    this.closeHamburgerIcon.addEventListener('click', () => removeStyles())
    this.shadow.addEventListener('click', () => removeStyles())
  }
}
