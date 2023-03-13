import router from '../../Router';
import dataStorage from '../../Storage';


class FilterSelect {

  private keySearch: string;
  private title: string;
  private readonly select: HTMLSelectElement;
  private updateCallback: <T>(thisObj: T) => void;

  constructor(keySearch: string, title: string, updateCallback: <T>(thisObj: T) => void) {
    this.keySearch = keySearch;
    this.title = title;
    this.select = FilterSelect.createSelect();
    this.updateCallback = updateCallback;
  }

  private static createSelect(): HTMLSelectElement {
    const selectDOM = document.createElement('select');
    selectDOM.className = 'select__select';

    return selectDOM;
  }

  getHTML(): HTMLSelectElement {
    this.update();
    return this.select;
  }

  update(): void {
    const sizesValues = dataStorage.getValuesByKey(this.keySearch, true);

    this.select.innerHTML = ``;

    const defaultOption = document.createElement('option');
    defaultOption.hidden = true;
    defaultOption.textContent = this.title;
    this.select.appendChild(defaultOption);

    const optionAll = document.createElement('option');

    optionAll.textContent = 'Все';
    optionAll.value = '';
    optionAll.className = 'select__option';
    this.select.appendChild(optionAll);

    for (const key in sizesValues) {
      const option = document.createElement('option');
      option.textContent = `${key}(${sizesValues[key].curr}/${sizesValues[key].total})`;
      option.value = key;
      option.className = 'select__option';
      this.select.appendChild(option);
    }

    let value = '';

    const reqParams =  router.getReqParamsAll();

    if (this.keySearch in reqParams) {
      const routerParams = router.getReqParamsAll();

      if (routerParams) {
        value = routerParams[this.keySearch][0];
      }

      this.select.value = value
    }

    this.select.onchange = (): void => this.route(this.select.value);
  }

  route(param: string): void {
    router.setReqParams(this.keySearch, param);
    this.updateCallback(this);
  }
}

export default FilterSelect;
