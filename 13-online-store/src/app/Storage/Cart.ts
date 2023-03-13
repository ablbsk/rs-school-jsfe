import dataStorage from '.';
import Paginator from './Paginator';
import {ICartProduct} from '../Types';


class CartStorage {

  private cartProducts: ICartProduct[];
  private paginator: Paginator;

  constructor() {
    this.cartProducts = [];
    this.paginator = new Paginator(this.cartProducts);
  }

  setProducts(cartProducts: ICartProduct[]): void {
    this.cartProducts = cartProducts;
  }

  clearProducts(): void {
    this.cartProducts = [];
  }

  addProduct(id: string): void {
    if (this.isProductInCart(id)) {
      const cartProduct = this.cartProducts.find((cartProd) => cartProd.id === id);

      if (cartProduct) cartProduct.count += 1;

    } else {
      this.cartProducts.push({
        id: id,
        count: 1
      })
    }
  }

  removeProduct(id: string): void {
    const cartProduct = this.cartProducts.find((cartProd) => cartProd.id === id);

    if (cartProduct) {
      this.cartProducts = this.cartProducts.filter((cartProd) => cartProd.id !== id);
    }
  }

  decrProduct(id: string): void {
    const cartProduct = this.cartProducts.find((cartProd) => cartProd.id === id);

    if (cartProduct) {
      cartProduct.count -= 1;
      if (cartProduct.count === 0) {
        this.cartProducts = this.cartProducts.filter((cartProd) => cartProd.count !== 0);
      }
    }
  }

  getCartProducts(): ICartProduct[] {
    return this.cartProducts;
  }

  getOrderedProducts(): ICartProduct[] {
    return this.cartProducts.map((cartProd, i) => {
      cartProd.num = i + 1;
      return cartProd;
    });
  }

  getCountProducts(): number {
    return this.cartProducts.reduce((count, cartProd) => count + +cartProd.count, 0);
  }

  getTotal(): number {
    return this.cartProducts.reduce((sum, cartProd) => sum + (+this.getPriceById(cartProd.id) * +cartProd.count), 0);
  }

  getPriceById(id: string): number {
    const product = dataStorage.getProductById(id);
    return +product.price;
  }

  isProductInCart(id: string): boolean {
    const productInCart = this.cartProducts.filter((cartProd) => cartProd.id === id);
    return !!productInCart.length;
  }

  /* pagination */

  setLimitProducts(limit: number): void {
    this.paginator.setLimit(limit);
  }

  getPagesCount(): number {
    this.paginator.setItems(this.getOrderedProducts());
    return this.paginator.getPagesCount();
  }

  getPaginatedItems(page = 1): ICartProduct[] {
    this.paginator.setItems(this.getOrderedProducts());
    return this.paginator.getPageItems(page);
  }

}

const cartStorage = new CartStorage();

export default cartStorage;
