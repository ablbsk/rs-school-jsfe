import { IReqParams } from '../../Types';
import cartStorage from '../../Storage/Cart';
import router from '../../Router';
import PaginationControls from '../../Components/PaginationControls';
import SectionCartProducts from '../../Components/SectionCartProducts';
import SectionCartTotal from '../../Components/SectionCartTotal';
import OrderingModal from '../../Components/OrderingModal';
import { addBlocksToDocument } from '../../utils';

class CartPage {

  private sectionCartProducts: SectionCartProducts;
  private sectionCartProductsHTML?: HTMLDivElement;
  private readonly main: HTMLElement;
  private readonly paginationSection: HTMLElement;
  private readonly cartWrapper: HTMLElement;
  private readonly totalWrapper: HTMLElement;
  private paginationControls: PaginationControls;
  private sectionCartTotal: SectionCartTotal;

  constructor() {
    this.main = CartPage.createMain();
    this.cartWrapper = CartPage.createWrapper();
    this.paginationSection = CartPage.createPagination();
    this.totalWrapper = CartPage.totalWrapper();
    this.paginationControls = new PaginationControls();
    this.sectionCartProducts = new SectionCartProducts(this.goFirstPage.bind(this));
    this.sectionCartTotal = new SectionCartTotal();
  }

  static createMain(): HTMLElement {
    const mainDOM = document.createElement('main');
    mainDOM.className = 'main';

    return mainDOM;
  }

  static createPagination(): HTMLElement {
    const paginationDOM = document.createElement('section');
    paginationDOM.className = 'cart__section';

    return paginationDOM;
  }

  static createWrapper(): HTMLElement {
    const wrapperDOM = document.createElement('div');
    wrapperDOM.className = 'cart';

    return wrapperDOM;
  }

  static totalWrapper(): HTMLElement {
    const promoDOM = document.createElement('div');
    promoDOM.className = 'promo';
    promoDOM.innerHTML = '<h3 class="promo__header">Заказ</h3>';

    return promoDOM;
  }

  render(reqParams: IReqParams): void {
    document.title = `Online Store — Корзина`;

    this.buildMainHTML(reqParams);

    this.main.appendChild(this.cartWrapper);

    document.body.innerHTML = '';

    addBlocksToDocument(this.main);

    this.sectionCartTotal.renderActivatedPromoCodes();
  }

  private buildMainHTML(reqParams: IReqParams): void {
    const cartProducts = cartStorage.getCartProducts();

    if (!cartProducts.length) {
      this.cartWrapper.innerHTML = '<p class="cart__empty">Ваша корзина пуста</p>';
      return;
    }

    this.cartWrapper.innerHTML = '';
    this.cartWrapper.appendChild(this.paginationSection);
    this.checkBuyNow(reqParams);
    this.buildPagination();
    this.setPaginationValues(reqParams);
    this.buildTotal();
    this.update(reqParams);
    this.startListeners();
  }

  private showOrderingModal(): void {
    const orderingModalDOM = new OrderingModal();
    orderingModalDOM.start();
  }

  private checkBuyNow(reqParams: IReqParams): void {
    if (reqParams.buy) {
      router.resetReqParams();
      this.showOrderingModal();
    }
  }

  private buildTotal(): void {
    this.cartWrapper.appendChild(this.totalWrapper);
    this.totalWrapper.appendChild(this.sectionCartTotal.getHTML());
  }

  private buildPagination(): void {
    this.paginationSection.appendChild(this.paginationControls.getHTML());
  }

  private goFirstPage(): void {
    this.paginationControls.goToFirstPage();
  }

  private setPaginationValues(reqParams: IReqParams): void {
    const limitVal = (reqParams.limit && reqParams.limit[0]) ?  +reqParams.limit[0] : 3;
    this.paginationControls.setValuesFromReqParams(limitVal);
  }

  private buildProductsHTML(pageNum = 1): void {
    const cartProducts = cartStorage.getCartProducts();

    if (!cartProducts.length) {
      this.cartWrapper.innerHTML = '<p class="cart__empty">Ваша корзина пуста</p>';
      return;
    }

    this.sectionCartProductsHTML?.remove();
    this.sectionCartProductsHTML = this.sectionCartProducts.getHTML(pageNum) as HTMLDivElement;
    this.paginationSection.appendChild(this.sectionCartProductsHTML);
  }

  private startListeners(): void {
    const orderingButtonDOM = this.cartWrapper.querySelector('.promo__button') as HTMLButtonElement;
    const promoButtonDOM = this.cartWrapper.querySelector('.button--special') as HTMLButtonElement;

    promoButtonDOM.addEventListener('click', () => this.sectionCartTotal.addPromoCode());

    orderingButtonDOM.addEventListener('click', () => this.showOrderingModal());
  }

  update(reqParams: IReqParams): void {
    let pageVal = 1;

    if (reqParams.page && reqParams.page[0]) pageVal = +reqParams.page[0]
    this.buildProductsHTML(pageVal);
  }

}

export default CartPage;
