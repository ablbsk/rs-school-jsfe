import router from '../../Router';
import dataStorage from '../../Storage';
import {seasonNames} from '../../Storage/consts';
import {IFilterItems} from '../../Types';

class FilterSeason {

  private seasonsValues: IFilterItems;
  private readonly seasonListDOM: HTMLUListElement;
  private updateCallback: <T>(thisObj: T) => void;

  constructor(updateCallback: <T>(thisObj: T) => void) {
    this.seasonsValues = dataStorage.getValuesByKey('season');
    this.seasonListDOM = FilterSeason.createList();
    this.updateCallback = updateCallback;
  }

  private static createList(): HTMLUListElement {
    const seasonListDOM = document.createElement('ul');
    seasonListDOM.className = 'season__list';

    return seasonListDOM;
  }

  getHTML(): HTMLUListElement {
    this.update();
    return this.seasonListDOM;
  }

  update(): void {
    this.seasonsValues = dataStorage.getValuesByKey('season');
    this.seasonListDOM.innerHTML = '';

    for (const seasonKey in this.seasonsValues) {
      const seasonItemDOM = document.createElement('li');
      seasonItemDOM.className = 'season__item';
      seasonItemDOM.innerHTML = `
        <span class="season__title">${seasonNames[seasonKey]}</span>
        <div class="season__control">
          <input id="${seasonKey}" class="season__check" type="checkbox" value="${seasonKey}">
          <label class="season__label" for="${seasonKey}">
            <span class="icon icon--${seasonKey}"></span>
          </label>
        </div>
      `;

      this.seasonListDOM.appendChild(seasonItemDOM);
      this.updateInput(seasonKey);
    }
  }

  private updateInput(id: string): void {
    const inputDOM = this.seasonListDOM.querySelectorAll('.season__check') as NodeListOf<HTMLInputElement>;
    inputDOM.forEach(item => {
      if (item.id === id) {
        item.addEventListener('change', () => this.route());

        if (FilterSeason.isChecked(id)) item.checked = true;
      }
    });
  }

  private getChecked(): string[] {
    const selected = this.seasonListDOM.querySelectorAll<HTMLInputElement>('input:checked');
    return [...selected].map((input) => input.value);
  }

  private static isChecked(val: string): boolean {
    const reqParams = router.getReqParamsAll()['season'];

    if (!reqParams) return false;

    return reqParams.includes(val);
  }

  private route(): void {
    router.setReqParams('season', this.getChecked().join(','));
    this.updateCallback(this);
  }
}


export default FilterSeason;
