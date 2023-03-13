import { ICartProduct } from '../Types';

class Paginator {

  private items: ICartProduct[];
  private limit: number;
  private paginatedItems: Array<ICartProduct[]>;

  constructor(items?: ICartProduct[], limit?: number) {
    this.items = items || [];
    this.limit = limit || 3;
    this.paginatedItems = this.getPaginatedItems();
  }

  getPagesCount(): number {
    return Math.ceil(this.items.length / this.limit);
  }

  getPaginatedItems(): Array<ICartProduct[]> {
    const paginatedItems = [];
    const pagesCount = this.getPagesCount();

    for (let i = 1; i <= pagesCount; i += 1) {
      const startIdx: number = (i - 1) * this.limit;
      const templastIdx = ((i - 1) * this.limit) + this.limit - 1;
      const lastIdx: number = templastIdx >= this.items.length ? this.items.length : templastIdx;

      paginatedItems.push(this.items.slice(startIdx, lastIdx + 1));
    }

    return paginatedItems;
  }

  getPageItems(pageNum: number): ICartProduct[] {
    return this.paginatedItems[+pageNum - 1];
  }

  setItems(items: ICartProduct[]): void {
    this.items = items;
    this.paginatedItems = this.getPaginatedItems();
  }

  setLimit(limit: number): void {
    this.limit = limit;
    this.paginatedItems = this.getPaginatedItems();
  }

}

export default Paginator;
