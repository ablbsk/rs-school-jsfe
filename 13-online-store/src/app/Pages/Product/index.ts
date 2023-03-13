import { IProduct, IReqParams } from '../../Types';
import router from '../../Router';
import dataStorage from '../../Storage';
import { seasonNames } from '../../Storage/consts';
import cartStorage from '../../Storage/Cart';
import { addBlocksToDocument, getRatingStyleColor } from '../../utils'

class ProductPage {

  render(reqParams: IReqParams): void {

    if (!reqParams.id) {
      router.goTo('/404');
    }

    const product = dataStorage.getProductById(reqParams.id[0]);

    document.title = `Online Store — ${product?.model || 'not found'}`;

    const main = document.createElement('main');
    main.className = 'main';

    if (product) {
      main.appendChild(this.getBreadcrumbsHTML(product));
      main.appendChild(this.getProductCardHTML(product));
    } else {
      router.goTo('/404');
    }

    addBlocksToDocument(main);
  }

  private getBreadcrumbsHTML(product: IProduct): HTMLDivElement {
    const breadcrumbsWrapper = document.createElement('div');
    breadcrumbsWrapper.className = 'link-navigation';
    breadcrumbsWrapper.innerHTML = this.getBreadcrumbsTemplate(product);
    return breadcrumbsWrapper;
  }

  private getBreadcrumbsTemplate(product: IProduct): string {
    return `
      <ul class="link-navigation__list">
        <li class="link-navigation__item">
          <a href="/catalog" class="link-navigation__link" data-local-link>Шины</a>
          <span class="icon icon--link-navigation"></span>
        </li>
        <li class="link-navigation__item">
          <a href="/catalog?season=${product.season}" class="link-navigation__link" data-local-link>${seasonNames[product.season]}</a>
          <span class="icon icon--link-navigation"></span>
        </li>
        <li class="link-navigation__item">
          <a href="/catalog?brand=${product.brand}" class="link-navigation__link" data-local-link>${product.brand}</a>
          <span class="icon icon--link-navigation"></span>
        </li>
        <li class="link-navigation__item">
          <span class="link-navigation__link link-navigation__link--disable">${product.model}</span>
        </li>
      </ul>
    `
  }

  private getProductCardHTML(product: IProduct): HTMLDivElement {
    const productContainer = document.createElement('div') as HTMLDivElement;
    productContainer.classList.add('catalog');

    const productWrapper = document.createElement('div');
    productWrapper.className = 'product product--page-view';
    productContainer.appendChild(productWrapper);
    productWrapper.innerHTML = this.getProductCardTemplate(product);

    this.addImageSwitcher(product, productWrapper);

    const cartButton = productWrapper.querySelector('#cartButton') as HTMLButtonElement;

    this.setCartButtonState(product.id, cartButton);
    cartButton.onclick = () => {
      cartStorage.isProductInCart(product.id)
        ? cartStorage.removeProduct(product.id)
        : cartStorage.addProduct(product.id);

      this.setCartButtonState(product.id, cartButton);

      const addToCartEvent = new Event('addedToCard', { bubbles: true });
      cartButton.dispatchEvent(addToCartEvent);
    }

    const buyButton = productWrapper.querySelector('#buyButton') as HTMLButtonElement;

    buyButton.onclick = () => {
      if (!cartStorage.isProductInCart(product.id)) cartStorage.addProduct(product.id);
      router.goTo('/cart?buy=true');
    }

    return productContainer;
  }

  private setCartButtonState(productId: string, button: HTMLButtonElement): void {
    if (cartStorage.isProductInCart(productId)) {
      button.textContent = 'В корзине';
      button.classList.add('button--in-cart');
    } else {
      button.textContent = 'В корзину';
      button.classList.remove('button--in-cart');
    }
  }

  private getProductCardTemplate(product: IProduct): string {
    return `
    <div class="product__column product__column--main">
     <h3 class="product__header">
        <a id="productTitle" class="product__title" href="/product?id=${product.id}" data-local-link>
          <span class="product__brand">${product.brand}</span>
          <span class="product__model">${product.model}</span>
          <span class="product__sizes">${product.size}</span>
        </a>
      </h3>
    <ul class="product__miniatures-list">
        <li class="product__miniatures-item product__miniatures-item--active">
          <img class="product__miniatures-image"
               src="${product.imageUrl[0]}" alt="${product.brand} ${product.model}">
        </li>
        <li class="product__miniatures-item">
          <img class="product__miniatures-image"
               src="${product.imageUrl[1]}" alt="${product.brand} ${product.model}">
        </li>
      </ul>
    <img class="product__image"
        src="${product.imageUrl[0]}"
        alt="${product.brand} ${product.model}">
  </div>
    <div class="product__column product__column--short">
      <div class="product__subtitle product__subtitle--top">
        <span class="product__price">${product.price} руб</span>
        <span class="product__count">В наличии: ${product.count} шт.</span>
      </div>
      <ul class="product__labels-list">
        <li class="product__labels-item">
          <span class="product__season icon icon--${product.season}"></span>
          <span class="product__labels-title">${seasonNames[product.season]}</span>
        </li>
        <li class="product__labels-item">
          <p class="product__rating">
            <span class="icon icon--star rating ${getRatingStyleColor(product.rating.overageRating)}"></span>
            <span class="rating__value ${getRatingStyleColor(product.rating.overageRating)}">${product.rating.overageRating}</span>
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
    </div>
    <div class="product__column product__column--price">
      <div class="product__subtitle">
        <p class="product__price">${product.price} руб</p>
        <p class="product__count">В наличии: ${product.count} шт.</p>
      </div>
      <ul class="product__offers-list">
          <li class="product__offers-item">
            <span class="product__offers-icon icon icon--pay"></span>
            <p class="product__offers-title">Оплата частями</p>
          </li>
          <li class="product__offers-item">
            <span class="product__offers-icon icon icon--guarantee"></span>
            <p class="product__offers-title">Официальная гарантия</p>
          </li>
          <li class="product__offers-item">
            <span class="product__offers-icon icon icon--shipping"></span>
            <p class="product__offers-title">Доставка по РБ</p>
          </li>
        </ul>
      <button id="buyButton" class="product__buy product__button button button--accent">Купить</button>
      <button id="cartButton" class="product__button button">В корзину</button>
    </div>
  `
  }

  private addImageSwitcher(product: IProduct, productWrapper: HTMLElement): void {
    const miniatures = productWrapper.querySelectorAll('.product__miniatures-item') as NodeListOf<HTMLElement>;
    const productImage = productWrapper.querySelector('.product__image') as HTMLElement;

    miniatures.forEach((item: HTMLElement, i: number): void => {
      item.addEventListener('click', () => {
        const activeStyle = 'product__miniatures-item--active';

        if (item.classList.length === 1) {
          const activeMiniatures = document.querySelector(`.${activeStyle}`) as HTMLElement;
          activeMiniatures.classList.remove(`${activeStyle}`);
          item.classList.add(`${activeStyle}`);
          productImage.setAttribute('src', `${product.imageUrl[i]}`)
        }
      });
    });
  }

  update(reqParams: IReqParams): void {
    this.render(reqParams)
  }
}

export default ProductPage;
