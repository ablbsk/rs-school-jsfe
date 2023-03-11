export default class Amount {
  constructor() {
    this.line = document.querySelector('.amount__line')
    this.dots = [...document.querySelectorAll('.amount__dot')]
    this.prices = [...document.querySelectorAll('.amount__price-item')]
    this.amountInput = document.getElementById('amountInput')
    this.priceArr = [5000, 2000, 1000, 500, 250, 100, 50, 25]
  }

  init() {
    this.amountInput.value = 100
    this.changeActiveDot()
    this.changeActivePrice()
  }

  changeActiveDot() {
    this.line.addEventListener('click', (e) => {
      if (e.target !== this.line) {
        this.removeActiveStyle()

        const el = e.target.children.length > 0 ? e.target.children[0] : e.target
        el.classList.add('amount__dot--active')

        let index = 0
        this.dots.forEach((item, j) => {
          index = item.classList.length === 2 ? j : index
          return item
        })

        this.addActiveStyle(index)

        this.amountInput.value = this.prices[index].innerText.replace('$', '')
      }
    })
  }

  changeActivePrice() {
    this.amountInput.addEventListener('input', () => {
      this.amountInput.value = this.amountInput.value.replace(/[^0-9]/g, '')

      if (this.amountInput.value.length > 4) this.amountInput.value = this.amountInput.value.slice(0, 4)

      const index = this.priceArr.indexOf(+this.amountInput.value)

      this.removeActiveStyle()

      if (index !== -1) {
        this.dots[index].classList.add('amount__dot--active')
        this.addActiveStyle(index)
      }
    })
  }

  addActiveStyle(index) {
    return this.prices[index].classList.add('amount__price-item--active')
  }

  // eslint-disable-next-line class-methods-use-this
  removeActiveStyle() {
    const activeDot = document.querySelector('.amount__dot--active')
    if (activeDot !== null) activeDot.classList.remove('amount__dot--active')

    const activePrice = document.querySelector('.amount__price-item--active')
    if (activePrice !== null) activePrice.classList.remove('amount__price-item--active')
  }
}
