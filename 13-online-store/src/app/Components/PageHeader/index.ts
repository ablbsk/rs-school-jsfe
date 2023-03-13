import template from './template.html';
import cartStorage from '../../Storage/Cart';

class PageHeader {

  getHTML(): HTMLElement {
    const header = document.createElement('header');

    header.className = 'header';
    header.innerHTML = template;

    const cartCounter = header.querySelector('#basketCount') as HTMLSpanElement;

    this.setCartCounter(cartCounter);

    window.addEventListener('addedToCard', () => {
      this.setCartCounter(cartCounter);
    })

    return header;
  }

  setCartCounter(cartCounter: HTMLSpanElement): void {
    const cartCount = cartStorage.getCountProducts().toString();
    const cartTotal = cartStorage.getTotal().toString();

    cartCounter.innerHTML = `<span>${cartCount} шт</span><span>${cartTotal} руб</span>`
  }
}

const pageHeader = new PageHeader();

export default pageHeader;
