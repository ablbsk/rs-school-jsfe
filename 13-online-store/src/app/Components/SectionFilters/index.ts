import FilterSelect from '../FilterSelect';
import FilterSeasons from '../FilterSeason';
import MultiRange from '../MultiRange';
import router from '../../Router';
import FilterSearch from '../FilterSearch';

class SectionFilters {

  private filtersWrapper: HTMLDivElement;
  private multiRangeCount: MultiRange;
  private multiRangePrice: MultiRange;
  private selectSizes: FilterSelect;
  private selectBrands: FilterSelect
  private filterSeasons: FilterSeasons;
  private filtersObjects: (MultiRange | FilterSelect | FilterSeasons)[];
  private filterSearch: FilterSearch;

  constructor() {
    this.filtersWrapper = document.createElement('div');
    this.filtersWrapper.className = 'filters';

    this.filtersObjects = [];

    const filtersGrid = document.createElement('div');

    this.filtersWrapper.appendChild(this.getFilterSwitcherButtonHTML(filtersGrid));

    filtersGrid.className = 'filters__grid';
    this.filtersWrapper.appendChild(filtersGrid);

    this.selectSizes = new FilterSelect('size', 'Выберите размер', this.updateFilters.bind(this));
    filtersGrid.appendChild(this.getFilterSizeHTML());

    this.selectBrands = new FilterSelect('brand', 'Выберите производителя', this.updateFilters.bind(this));
    filtersGrid.appendChild(this.getFilterBrandHTML());

    this.filterSeasons = new FilterSeasons(this.updateFilters.bind(this));
    filtersGrid.appendChild(this.getFilterSeasonHTML());

    this.multiRangeCount = new MultiRange('count', 'Кол-во', this.updateFilters.bind(this));
    this.filtersObjects.push(this.multiRangeCount);
    filtersGrid.appendChild(this.multiRangeCount.getHTML());

    this.multiRangePrice = new MultiRange('price', 'Цена', this.updateFilters.bind(this));
    this.filtersObjects.push(this.multiRangePrice);
    filtersGrid.appendChild(this.multiRangePrice.getHTML());

    filtersGrid.appendChild(this.getFiltersResetButtonHTML());

    this.filterSearch = new FilterSearch(this.updateFilters.bind(this));
    filtersGrid.appendChild(this.getSearchHTML());
  }

  getHTML(): HTMLDivElement {
    return this.filtersWrapper;
  }

  private updateFilters<T>(currfilterObj: T): void {
    this.filtersObjects.forEach((filterObj) => {
      if (JSON.stringify(currfilterObj) !== JSON.stringify(filterObj)) {
        filterObj.update();
      }
    })
  }

  private getFilterSwitcherButtonHTML(filtersWrapper: HTMLDivElement): HTMLButtonElement {
    const filterSwitcherButton = document.createElement('button');

    filterSwitcherButton.className = 'button button--accent filters__button';
    filterSwitcherButton.innerHTML = 'Фильтры <span class="icon icon--arrow-down"></span>';
    filterSwitcherButton.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      const filtersButtonIconDOM = filterSwitcherButton.querySelector('.icon--arrow-down') as HTMLElement;

      filtersWrapper.classList.toggle('filters__grid--open');
      filtersButtonIconDOM.classList.toggle('icon--rotate');
    })

    return filterSwitcherButton;
  }

  private getFilterSizeHTML(): HTMLDivElement {
    const filterSizeWrapper = document.createElement('div');

    filterSizeWrapper.className = 'select filters__cell';
    filterSizeWrapper.innerHTML = '<span class="select__title">Ширина / Профиль / Диаметр</span>';
    filterSizeWrapper.appendChild(this.selectSizes.getHTML());
    this.filtersObjects.push(this.selectSizes);

    return filterSizeWrapper;
  }

  private getFilterBrandHTML(): HTMLDivElement {
    const filterBrandWrapper = document.createElement('div');

    filterBrandWrapper.className = 'select filters__cell';
    filterBrandWrapper.innerHTML = '<span class="select__title">Производитель</span>';
    filterBrandWrapper.appendChild(this.selectBrands.getHTML());
    this.filtersObjects.push(this.selectBrands);

    return filterBrandWrapper;
  }

  private getFilterSeasonHTML(): HTMLDivElement {
    const filterSeasonsWrapper = document.createElement('div');

    filterSeasonsWrapper.className = 'season filters__cell filters__cell--v2';
    filterSeasonsWrapper.appendChild(this.filterSeasons.getHTML());
    this.filtersObjects.push(this.filterSeasons);

    return filterSeasonsWrapper;
  }

  private getFiltersResetButtonHTML(): HTMLButtonElement {
    const filtersResetButton = document.createElement('button');

    filtersResetButton.className = 'filters__cell--button button button--accent';
    filtersResetButton.textContent = 'Сброс';
    filtersResetButton.onclick = () => {
      router.resetReqParams();
    }

    return filtersResetButton;
  }

  private getSearchHTML(): HTMLDivElement {
    const searchWrapper = document.createElement('div');

    searchWrapper.className = 'search';

    const searchTitle = document.createElement('span');

    searchTitle.className = 'search__header';
    searchTitle.textContent = 'Поиск';
    searchWrapper.appendChild(searchTitle);
    searchWrapper.appendChild(this.filterSearch.getHTML());

    return searchWrapper;
  }
}

export default SectionFilters;
