import imageCard from '../../../assets/icons/order/card.svg';
import imageVisa from '../../../assets/icons/order/visa.svg';
import imageMastercard from '../../../assets/icons/order/mastercard.svg';
import imageBelcard from '../../../assets/icons/order/belcard.svg';
import router from '../../Router';
import cartStorage from '../../Storage/Cart';

class OrderingModal {

  private readonly mainDOM: HTMLElement;

  private readonly modalDOM: HTMLElement;

  private readonly shadowDOM: HTMLElement;

  constructor() {
    this.mainDOM = document.querySelector('main') as HTMLElement;
    this.modalDOM = this.createModal();
    this.shadowDOM = this.createShadow();
  }

  createModal(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('ordering');
    return wrapper;
  }

  createShadow(): HTMLElement {
    const shadow = document.createElement('div');
    shadow.classList.add('shadow', 'shadow--active');
    return shadow;
  }

  start() {
    this.render();
    this.openModal();
    this.validate();
  }

  render() {
    this.modalDOM.append(createContent());

    function createContent(): HTMLDivElement {
      const containerDOM = document.createElement('div');
      containerDOM.classList.add('ordering__container');
      containerDOM.innerHTML = `<h2 class="ordering__header">Оформление заказа</h2>`;

      containerDOM.append(createForm());
      return containerDOM;
    }

    function createForm(): HTMLFormElement {
      const formDOM = document.createElement('form');
      formDOM.classList.add('ordering__form');
      formDOM.innerHTML = `
        <div class="ordering__form-column">
          <div class="ordering__form-line">
            <label class="ordering__form-label" for="orderingName">Имя и Фамилия</label>
            <input class="ordering__form-input" type="text" name="orderingName" id="orderingName" autocomplete="off" required>
            <span class="ordering__form-error">* Неверное значение</span>
          </div>
          <div class="ordering__form-line">
            <label class="ordering__form-label" for="orderingPhone">Номер телефона</label>
            <input class="ordering__form-input" type="text" name="orderingPhone" id="orderingPhone" autocomplete="off" required>
            <span class="ordering__form-error">* Неверное значение</span>
          </div>
          <div class="ordering__form-line">
            <label class="ordering__form-label" for="orderingAddress">Адрес доставки</label>
            <input class="ordering__form-input" type="text" name="orderingAddress" id="orderingAddress" autocomplete="off" required>
            <span class="ordering__form-error">* Неверное значение</span>
          </div>
          <div class="ordering__form-line">
            <label class="ordering__form-label" for="orderingEmail">Почта</label>
            <input class="ordering__form-input" type="text" name="orderingEmail" id="orderingEmail" autocomplete="off" required>
            <span class="ordering__form-error">* Неверное значение</span>
          </div>
        </div>
        <div class="ordering__form-column">
          <div class="ordering__form-line">
            <label class="ordering__form-label" for="orderingCardNumber">Номер карты</label>
            <div class="ordering__form-card-number">
              <input class="ordering__form-input" type="text" name="orderingCardNumber" id="orderingCardNumber"
                     autocomplete="off" placeholder="начни с 4, 5 или 9" required>
              <span class="ordering__form-error">* Неверное значение</span>
              <div class="ordering__form-image">
                <img src=${imageCard} alt="Неопределено">
              </div>
            </div>
          </div>
          <div class="ordering__form-line">
            <label class="ordering__form-label" for="orderingExpirationDate">Срок действия</label>
            <input class="ordering__form-input" type="text" name="orderingExpirationDate" id="orderingExpirationDate"
                   autocomplete="off" required>
            <span class="ordering__form-error">* Неверное значение</span>
          </div>
          <div class="ordering__form-line">
            <label class="ordering__form-label" for="orderingCVV">CVV</label>
            <input class="ordering__form-input" type="text" name="orderingCVV" id="orderingCVV" autocomplete="off" required>
            <span class="ordering__form-error">* Неверное значение</span>
          </div>
          <div class="ordering__form-line">
            <label class="ordering__form-label ordering__form-label--hidden">Подтвердить</label>
            <button class="button ordering__button">Заказать</button>
          </div>
        </div>
      `;

      return formDOM;
    }
  }

  openModal() {
    this.mainDOM.append(this.modalDOM, this.shadowDOM);
    this.shadowDOM.addEventListener('click', (): void => this.closeModal());
  }

  closeModal() {
    this.modalDOM.remove();
    this.shadowDOM.remove();
  }

  validate() {
    const formDOM = document.querySelector('.ordering__form') as HTMLFormElement;
    const buttonDOM = document.querySelector('.ordering__button') as HTMLButtonElement;

    const inputErrors: {[key: string]: boolean} = {
      orderingName: false,
      orderingPhone: false,
      orderingAddress: false,
      orderingEmail: false,
      orderingCardNumber: false,
      orderingExpirationDate: false,
      orderingCVV: false
    };

    formDOM.addEventListener('input', (e: Event): void => {
      const target = e.target as HTMLFormElement;
      const errorDOM = target.nextElementSibling as HTMLElement;
      const validateResult = checkValue(target.value, target.id);

      if (target.id === 'orderingExpirationDate') watchExpirationDate();

      if (target.id === 'orderingCardNumber') updateCardImage();

      updateErrorStyle();

      function checkValue(value: string, id: string): boolean {

        const patterns: {[key: string]: RegExp} = {
          orderingName: /[a-zA-Zа-яА-Я]{3,}(\s[a-zA-Zа-яА-Я]{3,})+$/, // /^[a-zA-Zа-яА-Я]{3,12}[' '][a-zA-Zа-яА-Я]{3,12}$/,
          orderingPhone: /[+][0-9]{9,}$/,
          orderingAddress: /[a-zA-Zа-яА-Я]{5,}(\s[a-zA-Zа-яА-Я]{5,})+$/, // /^[a-zA-Zа-яА-Я]{5,30}[' '][a-zA-Zа-яА-Я]{5,30}[' '][a-zA-Zа-яА-Я]{5,30}$/,
          orderingEmail: /^([a-z0-9]{3,12})+@([a-z]+\.)+[a-z]{2,4}$/,
          orderingCardNumber: /^[0-9]{16}$/,
          orderingExpirationDate: /^(0[1-9]|1[0-2])\/([0-9]{2}|[0-9]{2})$/,
          orderingCVV: /^[0-9]{3}$/
        };

        const regExp = new RegExp(patterns[id]) ;
        const result = regExp.test(value);

        if (id !== '') inputErrors[id] = result;

        return result
      }

      function updateErrorStyle() {
        validateResult
          ? errorDOM.classList.remove('ordering__form-error--active')
          : errorDOM.classList.add('ordering__form-error--active');
      }

      function watchExpirationDate() {
        const symbol = '/';
        const ev = e as InputEvent
        const inputType = ev.inputType
        const input = e.target as HTMLInputElement;

        if (e.target) {
          if (target.value.length === 2) {
            input.value = inputType === 'deleteContentBackward'
              ? target.value.split(symbol)[0]
              : target.value + symbol
          } else if (target.value.length > 4) {
            input.value = target.value.slice(0, 5);
          }
        }
      }

      function updateCardImage() {
        const formImageDOM = document.querySelector('.ordering__form-image') as HTMLElement;

        switch (target.value[0]) {
          case '4':
            formImageDOM.innerHTML = `<img src=${imageVisa} alt="Visa">`
            break;
          case '5':
            formImageDOM.innerHTML = `<img src=${imageMastercard} alt="Mastercard">`
            break;
          case '9':
            formImageDOM.innerHTML = `<img src=${imageBelcard} alt="Белкард">`
            break;
          default:
            formImageDOM.innerHTML = `<img src=${imageCard} alt="Неопределено">`
        }
      }
    });

    buttonDOM.addEventListener('click', (e: Event): void => {
      e.preventDefault();

      const errors = Object.values(inputErrors);

      if (errors.every(item => item)) {
        console.log('validate successful');
        this.showSuccessMessage()
      } else if (errors.every(item => !item)) {
        // If all inputs are empty and user click button
        const errorSpanDOM = document.querySelectorAll('.ordering__form-error') as NodeListOf<HTMLElement>;
        errorSpanDOM.forEach((item) => item.classList.add('ordering__form-error--active'));
      } else {
        console.log('validate error');
      }
    });
  }

  showSuccessMessage(): void {
    const modalContainer = this.modalDOM.querySelector('.ordering__container') as HTMLElement;

    if (modalContainer) {
      modalContainer.innerHTML = `
        <h2 class="ordering__header">Спасибо за заказ!</h2>
      `
      setTimeout(() => {
        cartStorage.clearProducts()
        removeActivatedPromoCodes();
        this.closeModal();
        router.goTo('/catalog');
      }, 3000);
    }

    function removeActivatedPromoCodes() {
      localStorage.setItem('activatedCodes', JSON.stringify([]));

      const deletePromoCode = new Event('deletePromoCode', {bubbles: true});
      document.dispatchEvent(deletePromoCode);
    }
  }

}

export default OrderingModal;
