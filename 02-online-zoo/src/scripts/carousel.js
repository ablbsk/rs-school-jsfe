export default class Carousel {
  constructor() {
    this.range = document.getElementById('testimonialsRange')
    this.container = document.getElementById('testimonialsContainer')
  }

  init() {
    this.range.addEventListener('input', () => {
      const itemWidth = document.querySelector('.testimonial').offsetWidth
      const containerGap = Number.parseInt(window.getComputedStyle(this.container).gap, 10)

      this.container.style.transform = `translateX(-${this.range.value * (itemWidth + containerGap) * 0.1}rem)`
    })
  }
}
