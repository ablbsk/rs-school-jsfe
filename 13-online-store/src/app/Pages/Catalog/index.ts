import { IReqParams } from '../../Types';
import dataStorage from '../../Storage';
import SectionProducts from '../../Components/SectionProducts';
import SectionFilters from '../../Components/SectionFilters';
import { addBlocksToDocument } from "../../utils";

class CatalogPage {

  private sectionProducts: SectionProducts;
  private sectionProductsHTML?: HTMLElement;
  private main: HTMLElement;

  constructor() {
    this.sectionProducts = new SectionProducts();
    this.main = this.createMain();
    this.sectionProductsHTML;
  }

  private createMain(): HTMLElement {
    const mainDOM = document.createElement('main');
    mainDOM.className = 'main';
    return mainDOM;
  }

  render(reqParams: IReqParams): void {
    dataStorage.setFilters(reqParams);
    document.title = `Online Store — Каталог`;

    if (this.main) this.main.remove();

    this.main = this.createMain();

    const sectionFilters = new SectionFilters();
    this.main.appendChild(sectionFilters.getHTML());

    this.updateDOM();

    addBlocksToDocument(this.main);
  }

  update(reqParams: IReqParams): void {
    dataStorage.setFilters(reqParams);
    this.updateDOM();
  }

  updateDOM(): void {
    this.sectionProductsHTML?.remove();
    this.sectionProductsHTML = this.sectionProducts.getHTML();
    this.main.appendChild(this.sectionProductsHTML);
  }
}

export default CatalogPage;
