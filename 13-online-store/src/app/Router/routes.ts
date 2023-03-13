import MainPage from '../Pages/Main';
import CatalogPage from '../Pages/Catalog';
import CartPage from '../Pages/Cart';
import ProductPage from '../Pages/Product';
import Error404Page from '../Pages/404';

const routes = [
  {path: '/', title: 'Home', isMenuItem: true, page: new MainPage()},
  {path: '/catalog', title: 'Catalog', isMenuItem: true, page: new CatalogPage()},
  {path: '/cart', title: 'Cart', isMenuItem: true, page: new CartPage()},
  {path: '/product', title: 'Product', isMenuItem: false, page: new ProductPage()},
  {path: '/404', title: 'Error 404', isMenuItem: false, page: new Error404Page()},
]

export default routes;
