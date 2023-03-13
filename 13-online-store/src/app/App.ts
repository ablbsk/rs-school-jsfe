import router from './Router/index';
import cartStorage from './Storage/Cart';
import { ICartProduct } from './Types';

class App {

  private router;

  constructor() {
    this.router = router;
  }

  start(): void {
    this.getLocalStorage();
    window.addEventListener('beforeunload', this.setLocalStorage.bind(this));
    this.router.start();
  }

  setLocalStorage(): void {
    const cartItems = cartStorage.getCartProducts();
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  getLocalStorage(): void {
    const cartData = localStorage.getItem('cartItems');

    if (cartData) {
      const cartItems: ICartProduct[] = JSON.parse(cartData);
      cartStorage.setProducts(cartItems);
    }
  }
}

export default App;
