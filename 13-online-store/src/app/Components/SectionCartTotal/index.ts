import cartStorage from '../../Storage/Cart';
import {IPromoCodes} from '../../Types';
import PromoLi from '../PromoLi';

class SectionCartTotal {

  private readonly promoContentDOM: HTMLElement;

  private readonly promoCodes: IPromoCodes[];

  private promoPercent: number;

  private activatedCodes: string[];

  constructor() {
    this.promoContentDOM = this.createContainer();
    this.promoPercent = 0;
    this.promoCodes = [
      {name: 'DARIM10', percent: 10},
      {name: 'DARIM20', percent: 20},
    ];
    this.activatedCodes = this.getActivatedCodesFromStorage();

    window.addEventListener('addedToCard', () => this.updateTotalColumn());
    window.addEventListener('deletePromoCode', () => this.updateState());
  }

  createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('promo__content');
    return container;
  }

  getHTML(): HTMLElement {
    this.promoContentDOM.innerHTML = '';

    const columnsDOM = [this.createTotalColumnDOM(), this.createActivateColumnDOM(), this.createConfirmColumnDOM()];

    this.promoContentDOM.append(...columnsDOM);

    return this.promoContentDOM;
  }

  createTotalColumnDOM(): HTMLDivElement {
    const columnDOM = this.createColumnDOM() as HTMLDivElement;

    const cartCount = cartStorage.getCountProducts().toString();
    const cartTotal = cartStorage.getTotal().toString();
    const promoSum = +(+cartTotal * (this.promoPercent / 100)).toFixed(2);

    columnDOM.innerHTML = `
      <ul class="promo__list">
        <li class="promo__item">
          <span class="promo__item-title">Количество</span>
          <span class="promo__item-value">${cartCount} шт.</span>
        </li>
        <li class="promo__item">
          <span class="promo__item-title">Стоимость</span>
          <span class="promo__item-value">${cartTotal} руб</span>
        </li>
        <li class="promo__item">
           <span class="promo__item-title">Скидка</span>
           <span class="promo__item-value">- ${promoSum} руб</span>
        </li>
        <li class="promo__item promo__item--main">
           <span class="promo__item-title">Итого</span>
           <span class="promo__item-value">${+cartTotal - promoSum} руб</span>
        </li>
      </ul>
    `;

    return columnDOM;
  }

  createActivateColumnDOM(): HTMLDivElement {
    const columnDOM = this.createColumnDOM() as HTMLDivElement;

    columnDOM.innerHTML = `
      <ul class="promo__activated-list"></ul>
      <div class="promo__activate">
        <input class="promo__input" type="text" placeholder="Промокод (DARIM10, DARIM20)" autocomplete="off">
        <button class="button button--special">Применить</button>
      </div>
    `;

    return columnDOM;
  }

  createConfirmColumnDOM(): HTMLDivElement {
    const columnDOM = this.createColumnDOM() as HTMLDivElement;
    columnDOM.innerHTML = `<button id="orderingButton" class="button promo__button">Оформить заказ</button>`;

    return columnDOM;
  }

  createColumnDOM(): HTMLDivElement {
    const columnDOM = document.createElement('div');
    columnDOM.classList.add('promo__column');
    return columnDOM;
  }

  updateTotalColumn(): void {
    this.promoContentDOM.removeChild(this.promoContentDOM.children[0]);
    this.promoContentDOM.prepend(this.createTotalColumnDOM());
  }

  updateState(): void {
    this.activatedCodes = this.getActivatedCodesFromStorage();
    this.promoPercent = 0;

    this.findActivatedCodes();
    this.updateTotalColumn();
  }

  addPromoCode(): void {
    const inputDOM = document.querySelector('.promo__input') as HTMLInputElement;

    this.promoCodes.forEach((item) => {

      if (inputDOM.value === item.name && !this.activatedCodes.includes(inputDOM.value)) {

        const promo = new PromoLi(item);
        promo.start();

        this.promoPercent = this.promoPercent + item.percent;
        this.activatedCodes.push(item.name);

        this.updateTotalColumn();
        this.setActivatedCodesInStorage();

        inputDOM.value = '';
      }
    });
  }

  renderActivatedPromoCodes(): void {
    if (this.activatedCodes.length) {
      this.activatedCodes.forEach((item) => {

        this.promoCodes.find((code) => {
          if (code.name === item) {
            const promo = new PromoLi(code);
            promo.start();
          }
        });
      });

      this.findActivatedCodes();
      this.updateTotalColumn();
    }
  }

  findActivatedCodes(): void {
    this.activatedCodes.forEach((item) => {
      this.promoCodes.find((code) => {
        if (code.name === item) this.promoPercent = this.promoPercent + code.percent;
      });
    });
  }

  setActivatedCodesInStorage(): void {
    localStorage.setItem('activatedCodes', JSON.stringify(this.activatedCodes));
  }

  getActivatedCodesFromStorage(): string[] {
    const codesData = localStorage.getItem('activatedCodes');
    return codesData ? JSON.parse(codesData) : [];
  }
}

export default SectionCartTotal;
