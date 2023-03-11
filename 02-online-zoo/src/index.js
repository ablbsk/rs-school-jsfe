import './styles/main.scss'
import Hamburger from './scripts/hamburger'
import Popup from './scripts/popup'
import Carousel from './scripts/carousel'
import Slider from './scripts/slider'
import Amount from './scripts/amount'

import petsJSON from './assets/pets.json'

import pet1 from './assets/images/pets/pet-1.png'
import pet2 from './assets/images/pets/pet-2.png'
import pet3 from './assets/images/pets/pet-3.png'
import pet4 from './assets/images/pets/pet-4.png'
import pet5 from './assets/images/pets/pet-5.png'
import pet6 from './assets/images/pets/pet-6.png'
import pet7 from './assets/images/pets/pet-7.png'
import pet8 from './assets/images/pets/pet-8.png'
import pet9 from './assets/images/pets/pet-9.png'
import pet10 from './assets/images/pets/pet-10.png'
import pet11 from './assets/images/pets/pet-11.png'
import pet12 from './assets/images/pets/pet-12.png'

import herbivore from './assets/icons/herbivore.svg'
import predator from './assets/icons/predator.svg'

window.onload = (e) => {
  e.preventDefault()

  const hamburger = new Hamburger()
  hamburger.init()

  if (window.location.pathname === '/donate.html') {
    const amount = new Amount()
    amount.init()
  } else {
    const testimonialArr = document.querySelectorAll('.testimonial')
    testimonialArr.forEach((testimonial) => {
      const popup = new Popup(testimonial)
      popup.init()
    })

    const testimonialsCarousel = new Carousel()
    testimonialsCarousel.init()

    const images = {
      pets: [pet1, pet2, pet3, pet4, pet5, pet6, pet7, pet8, pet9, pet10, pet11, pet12],
      herbivore,
      predator
    }

    const petsSlider = new Slider(Object.values(petsJSON), images)
    petsSlider.init()
  }
}
