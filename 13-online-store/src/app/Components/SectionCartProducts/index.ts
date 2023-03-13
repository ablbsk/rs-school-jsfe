import dataStorage from '../../Storage';
import { seasonNames } from '../../Storage/consts';
import cartStorage from '../../Storage/Cart';
import { getRatingStyleColor } from '../../utils';


class SectionCartProducts {

  private section: HTMLElement;
  private cartProductsWrapper: HTMLElement;
  private pageNum: number;
  private delCallback: () => void;

  constructor(delCallback: () => void) {
    this.section = document.createElement('section');
    this.pageNum = 1;
    this.delCallback = delCallback;
    this.cartProductsWrapper = document.createElement('div');
    this.cartProductsWrapper.className = 'cart__catalog';
  }

  buildHTML(): void {

    const addToCartEvent = new Event('addedToCard', {bubbles: true});
    const productsData = cartStorage.getPaginatedItems(this.pageNum);

    if (this.pageNum > cartStorage.getPagesCount()) {
      this.delCallback();
      return
    }

    productsData.forEach((cartProd) => {
      const cartProductWrapper = document.createElement('article');
      cartProductWrapper.className = 'product product--cart-view';
      const product = dataStorage.getProductById(cartProd.id);
      cartProductWrapper.innerHTML = `
        <div class="product__column product__column--main">
          <div class="product__title">
            <h3 class="product__brand">${product.brand}</h3>
            <span class="product__model">${product.model}</span>
            <span class="product__sizes">${product.size}</span>
          </div>
          <img class="product__image"
               src="${product.imageUrl[0]}"
               alt="${product.brand} ${product.model}">
        </div>
      `

      /** Features Column */

      const featuresListWrapper = document.createElement('div');

      const ratingStyleColor = getRatingStyleColor(product.rating.overageRating);

      featuresListWrapper.innerHTML = `
      <ul class="product__labels-list">
        <li class="product__labels-item">
          <span class="product__season icon icon--${product.season}"></span>
          <span class="product__labels-title">${seasonNames[product.season]}</span>
        </li>
        <li class="product__labels-item">
          <p class="product__rating">
              <span class="icon icon--star rating ${ratingStyleColor}"></span>
              <span class="rating__value ${ratingStyleColor}">${product.rating.overageRating}</span>
          </p>
          <span class="product__labels-title">Рейтинг</span>
        </li>
        <li class="product__labels-item">
          <span class="product__comments">${product.rating.commentsCount}</span>
          <span class="product__labels-title">Комент</span>
        </li>
      </ul>
      <ul class="product__features-list">
        <li class="product__features-item">
          <span class="product__features-title">Глубина протектора</span>
          <span class="product__features-value">${product.features.protector} мм</span>
        </li>
        <li class="product__features-item">
          <span class="product__features-title">Вес</span>
          <span class="product__features-value">${product.features.weight} кг</span>
        </li>
        <li class="product__features-item">
          <span class="product__features-title">Эксплуатация</span>
          <span class="product__features-value">${product.features.exploitation}</span>
        </li>
        <li class="product__features-item">
          <span class="product__features-title">Защита диска</span>
          <span class="product__features-value">${product.features.discProtector}</span>
        </li>
        <li class="product__features-item">
          <span class="product__features-title">Индекс нагрузки</span>
          <span class="product__features-value">${product.features.loadIndex}</span>
        </li>
        <li class="product__features-item">
          <span class="product__features-title">Индекс скорости</span>
          <span class="product__features-value">${product.features.speedIndex}</span>
        </li>
      </ul>
      `
      featuresListWrapper.className = 'product__column product__column--short product__column--hidden';

      cartProductWrapper.appendChild(featuresListWrapper);

      /** Total Column */

      const inputsWrapper = document.createElement('div');
      inputsWrapper.className = 'product__column product__column--price';
      cartProductWrapper.appendChild(inputsWrapper);

      /** Numbering items */

      const numberingWrapper = document.createElement('div');
      numberingWrapper.className = 'product__delete-container';
      inputsWrapper.appendChild(numberingWrapper);

      const numberingSpan = document.createElement('span');
      numberingSpan.className = 'product__delete';
      numberingSpan.textContent = `${cartProd.num}`;
      numberingWrapper.appendChild(numberingSpan);

      const productCount = document.createElement('span');
      productCount.classList.add('product__count');
      productCount.textContent = `В наличии: ${product.count} шт.`;
      inputsWrapper.appendChild(productCount);

      /** Total calc */

      const totalList = document.createElement('ul');
      totalList.className = 'product__summary-list';
      inputsWrapper.appendChild(totalList);

      const priceItem = document.createElement('li');
      priceItem.className = 'product__summary-item';
      priceItem.innerHTML = `
        <span class="product__summary-title">Цена за шт.</span>
        <span class="product__summary-value">${product.price} руб</span>
      `
      totalList.appendChild(priceItem);

      const counterItem =  document.createElement('li');
      counterItem.className = 'product__summary-item';
      counterItem.innerHTML = '<span class="product__summary-title">Количество</span>';
      totalList.appendChild(counterItem);

      const counterInputsWrapper = document.createElement('div');
      counterInputsWrapper.className = 'product__summary-count';
      counterItem.appendChild(counterInputsWrapper);

      const decrCountButton = document.createElement('button');
      decrCountButton.className = 'button button--accent product__summary-button';
      decrCountButton.textContent = '-';
      decrCountButton.onclick = () => {

        cartStorage. decrProduct(cartProd.id) // addProduct(cartProd.id);
        const value = +countInput.value - 1
        countInput.value = value.toString();
        totalValue.textContent = `${+countInput.value * +product.price} руб`;

        decrCountButton.dispatchEvent(addToCartEvent);
        if (value === 0) {
          this.update();

        }
      }

      counterInputsWrapper.appendChild(decrCountButton);

      const countInput = document.createElement('input');
      countInput.className = 'product__summary-value product__summary-input';
      countInput.type = 'number';
      countInput.disabled = true;
      countInput.value = cartProd.count.toString();
      counterInputsWrapper.appendChild(countInput);

      const incrCountButton = document.createElement('button');
      incrCountButton.className = 'button button--accent product__summary-button';
      incrCountButton.textContent = '+';
      incrCountButton.onclick = () => {
        if (+countInput.value >= +product.count) return;

        cartStorage.addProduct(cartProd.id);
        const value = +countInput.value + 1
        countInput.value = value.toString();
        totalValue.textContent = `${+countInput.value * +product.price} руб`;

        incrCountButton.dispatchEvent(addToCartEvent);
      }
      counterInputsWrapper.appendChild(incrCountButton);

      const totalItem =  document.createElement('li');
      totalItem.className = 'product__summary-item';
      totalItem.innerHTML = '<span class="product__summary-title">Стоимость</span>';
      totalList.appendChild(totalItem);

      const totalValue = document.createElement('span');
      totalValue.className = 'product__summary-value product__summary-value--accent';
      totalValue.textContent = `${+countInput.value * +product.price} руб`;
      totalItem.appendChild(totalValue);

      const detailButton = document.createElement('button');
      detailButton.className = 'button button--accent product__details-button';
      detailButton.innerHTML = 'Детали <span class="icon icon--arrow-down"></span></button>';
      detailButton.onclick = () => {
        const detailsButtonIconDOM = detailButton.querySelector('.icon--arrow-down') as HTMLElement;
        featuresListWrapper.classList.toggle('product__column--hidden');
        detailsButtonIconDOM.classList.toggle('icon--rotate');
      }
      inputsWrapper.appendChild(detailButton);

      this.cartProductsWrapper.appendChild(cartProductWrapper);
    })
  }

  getHTML(pageNum: number): HTMLElement {
    this.pageNum = pageNum || 1;
    this.update();
    return this.cartProductsWrapper;
  }

  update(): void {
    this.cartProductsWrapper.innerHTML = '';
    this.buildHTML();
  }
}

export default SectionCartProducts;
