import {IPromoCodes} from '../../Types';

class PromoLi {

  private readonly promo: IPromoCodes;

  private readonly itemDOM: HTMLElement;

  constructor(promo: IPromoCodes) {
    this.promo = promo
    this.itemDOM = this.create();
  }

  create(): HTMLElement {
    const item = document.createElement('li') as HTMLElement;
    item.classList.add('promo__activated-item');

    item.innerHTML = `
      <span class="promo__activated-code">${this.promo.name}</span>
      <span class="promo__activated-code">${this.promo.percent}%</span>
      <span class="promo__activated-delete">X</span>
    `;

    return item;
  }

  start() {
    this.render();
    this.addListeners();
  }

  render() {
    const listDOM = document.querySelector('.promo__activated-list') as HTMLElement;
    listDOM.append(this.itemDOM);
  }

  addListeners() {
    const deleteDOM = this.itemDOM.querySelector('.promo__activated-delete') as HTMLElement;

    deleteDOM.addEventListener('click', () => this.delete(deleteDOM));
  }

  delete(element: HTMLElement) {
    const listDOM = document.querySelector('.promo__activated-list') as HTMLElement;

    updateStorage(this.promo.name);
    createEvent();

    listDOM.removeChild(this.itemDOM);

    function updateStorage(code:string) {
      const storageActivatedCodes = localStorage.getItem('activatedCodes');

      if (storageActivatedCodes) {
        const codes: string[] = JSON.parse(storageActivatedCodes);
        const newData = codes.filter((item: string) => item !== code);
        localStorage.setItem('activatedCodes', JSON.stringify(newData));
      }
    }

    function createEvent() {
      const deletePromoCode = new Event('deletePromoCode', {bubbles: true});
      element.dispatchEvent(deletePromoCode);
    }
  }
}

export default PromoLi
