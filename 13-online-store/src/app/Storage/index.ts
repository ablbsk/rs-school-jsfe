import {IProducts, IProduct, IFilterItems, IReqParams} from '../Types';
import products from './data.json';

class DataStorage {

  private readonly products: IProduct[];
  private currentProducts: IProduct[];

  constructor() {
    this.products = DataStorage.convertProductsToArray(products);
    this.currentProducts = this.products;
  }

  private static convertProductsToArray(products: IProducts): IProduct[] {
    const array: IProduct[] = [];

    for (const key in products) {
      const item = products[key];

      const newObjParams = {
        name: key,
        size: `${item.sizes.width}/${item.sizes.profile} R${item.sizes.radius}`,
        productRating: item.rating.overageRating
      };

      const newObjProduct: IProduct = Object.assign(newObjParams, item);
      array.push(newObjProduct);
    }

    return array;
  }

  private static sortItemsBy(key: string, order: string, products: IProduct[]): IProduct[] {
    const prodKey = key as keyof IProduct;

    return products.sort((a, b) => order === 'ASC'
      ? (+a[prodKey] - +b[prodKey])
      : (+b[prodKey] - +a[prodKey]));
  }

  private static filterSearchedItems(value: string[], products: IProduct[]): IProduct[] {
    return products.filter((product) => {
      let isSearched = false;

      for (const key in product) {
        const prodKey = key as keyof IProduct;
        const isFind = product[prodKey].toString().toLowerCase().indexOf(value[0].toLowerCase()) >= 0;

        if (!['id', 'imageUrl'].includes(key) && isFind) isSearched = true;
      }
      return isSearched;
    });
  }

  private static filterRangeItems(key: string, value: string[], products: IProduct[]): IProduct[] {
    const prodKey = key as keyof IProduct;
    const [min, max] = value
    return products.filter((product) => (+min <= +product[prodKey]) && (+product[prodKey] <= +max));
  }

  private static filterEqualItems(key: string, value: string[], products: IProduct[]): IProduct[] {
    const prodKey = key as keyof IProduct;
    return products.filter((product) => value.includes(product[prodKey]?.toString()));
  }

  getValuesByKey(key: string, withCurrent?: boolean): IFilterItems {
    const result: IFilterItems = {};
    const prodKey = key as keyof IProduct;

    this.products.forEach((product) => {
      const value = product[prodKey].toString();

      value in result
        ? result[value].total += 1
        : result[value] = {curr: 0, total: 1};
    });

    if (withCurrent) {
      this.currentProducts.forEach((product) => {
        const value = product[prodKey].toString();

        if (value in result) result[value].curr += 1;
      });
    }

    return result;
  }

  getCurrProducts(): IProduct[] {
    return this.currentProducts;
  }

  getProductById(id: string): IProduct {
    return this.products.filter((product) => product.id === id)[0];
  }

  setFilters(reqParams: IReqParams): IProduct[] {
    let products = [...this.products];

    for (const key in reqParams) {
      if (reqParams[key].filter((reqParam) => reqParam)) {
        if (['price', 'count'].includes(key)) {
          products = DataStorage.filterRangeItems(key, reqParams[key], products);
        } else if (key in products[0]) {
          products = DataStorage.filterEqualItems(key, reqParams[key], products);
        } else if (key === 'search') {
          products = DataStorage.filterSearchedItems(reqParams[key], products)
        } else if (key === 'sort') {
          const [prodKey, order] = reqParams[key][0].split('-')
          products = DataStorage.sortItemsBy(prodKey, order, products)
        }
      }
    }

    this.currentProducts = products;
    return this.currentProducts;
  }

}

const dataStorage = new DataStorage();

export default dataStorage;
