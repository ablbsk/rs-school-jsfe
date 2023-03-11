const body = document.body;
const shadow= document.getElementsByClassName('shadow-back')[0];
const logo = document.querySelector('.logo');
const hamburger = document.getElementsByClassName('hamburger')[0];
const navigation = document.getElementsByClassName('header__navigation')[0];
const navigationLinks = document.querySelectorAll('.navigation__link');

const arr = [
  { element: body, style: 'body--locked' },
  { element: shadow, style: 'shadow-back--active' },
  { element: navigation, style: 'header__navigation--opened' },
  { element: logo, style: 'logo--hidden' },
  { element: hamburger, style: 'hamburger--opened' },
]

hamburger.addEventListener('click', () => {
  arr.map(item => item.element.classList.toggle(item.style))
})

shadow.addEventListener('click', () => {
  arr.map(item => item.element.classList.remove(item.style))
})

navigationLinks.forEach(element => {
  element.addEventListener('click', () => {
    arr.map(item => item.element.classList.remove(item.style))
  })
});
