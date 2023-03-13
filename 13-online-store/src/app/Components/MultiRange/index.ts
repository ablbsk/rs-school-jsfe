import dataStorage from '../../Storage';
import router from '../../Router';

class MultiRange {

  private readonly wrapper: HTMLDivElement;
  private title?: string;
  private minRangeVal: string;
  private maxRangeVal: string;
  private minCurrVal: string;
  private maxCurrVal: string;
  private rangeMax: HTMLInputElement;
  private rangeMin: HTMLInputElement;
  private key: string;
  private updateCallback: <T>(thisObj: T) => void;

  constructor(key: string, title: string, updateCallback: <T>(thisObj: T) => void) {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'multi-range filters__cell filters__cell--v2';

    this.key = key;
    this.minRangeVal = '0';
    this.maxRangeVal = '0';
    this.minCurrVal = '0';
    this.maxCurrVal = '0';

    this.title = title;

    this.rangeMax = document.createElement('input');
    this.rangeMin = document.createElement('input');

    this.updateCallback = updateCallback;
    this.update();
  }

  buildElements() {
    this.wrapper.innerHTML = '';

    /** FIELDS */

    if (this.title) {
      const titleSpan = document.createElement('span');
      titleSpan.className = 'multi-range__header';
      titleSpan.textContent = this.title;
      this.wrapper.appendChild(titleSpan);
    }

    const fieldsWrapper = document.createElement('div');
    fieldsWrapper.className = 'multi-range__fields';
    this.wrapper.appendChild(fieldsWrapper);

    const inputMin = document.createElement('input');
    inputMin.className = 'multi-range__value input-min';
    inputMin.type = 'number';
    inputMin.placeholder = 'Мин';
    inputMin.min = this.minRangeVal;
    inputMin.max = this.maxRangeVal;

    inputMin.oninput = () => {
      if ((+inputMin.value < +this.maxCurrVal) && (+inputMin.value > +this.minRangeVal)) {
        this.minCurrVal = inputMin.value;
        this.setValues({ rangeMin });
        this.route();
      }
    }

    inputMin.onblur = () => {
      if (+inputMin.value > +this.maxCurrVal) {
        inputMin.value = this.maxCurrVal;
        this.minCurrVal = inputMin.value;
        this.setValues({ rangeMin });
      }

      if (+inputMin.value < +this.minRangeVal) {
        inputMin.value = this.minCurrVal;
        this.minCurrVal = inputMin.value;
        this.setValues({ rangeMin });
      }

      this.route();
    }

    fieldsWrapper.appendChild(inputMin);

    const inputsSeparator = document.createElement('span');
    inputsSeparator.className = 'multi-range__separator';
    inputsSeparator.textContent = '-';
    fieldsWrapper.appendChild(inputsSeparator);

    const inputMax = document.createElement('input');
    inputMax.className = 'multi-range__value input-max';
    inputMax.type = 'number';
    inputMax.placeholder = 'Макс';
    inputMax.min = this.minRangeVal;
    inputMax.max = this.maxRangeVal;

    inputMax.oninput = () => {
      if ((+inputMax.value > +this.minCurrVal) && (+inputMax.value < +this.maxRangeVal)) {
        this.maxCurrVal = inputMax.value;
        this.setValues({ rangeMax });
        this.route();
      }
    }

    inputMin.onblur = () => {
      if (+inputMax.value < +this.minCurrVal) {
        inputMax.value = this.minCurrVal;
        this.maxCurrVal = inputMax.value;
        this.setValues({ rangeMax });
      }

      if (+inputMax.value > +this.maxRangeVal) {
        inputMax.value = this.maxCurrVal;
        this.maxCurrVal = inputMax.value;
        this.setValues({ rangeMax });
      }

      this.route();
    }

    fieldsWrapper.appendChild(inputMax);


    /*Inputs ranges */

    const rangesWrapper = document.createElement('div');
    rangesWrapper.className = 'multi-range__ranges';
    this.wrapper.appendChild(rangesWrapper);

    const rangeMin = document.createElement('input');
    this.rangeMin = rangeMin;
    rangeMin.className = 'multi-range__range range-min';
    rangeMin.type = 'range';
    rangeMin.value = this.minCurrVal;
    rangeMin.min = this.minRangeVal;
    rangeMin.max = this.maxRangeVal;
    rangeMin.step = '1';
    rangeMin.style.zIndex = '1';

    rangeMin.oninput = () => {
      if (+rangeMin.value > +this.maxCurrVal) rangeMin.value = this.maxCurrVal;

      this.minCurrVal = rangeMin.value;
      this.setValues({ inputMin });
      this.route();
    }

    rangesWrapper.appendChild(rangeMin);

    const rangeMax = document.createElement('input');
    this.rangeMax = rangeMax;
    rangeMax.className = 'multi-range__range range-max';
    rangeMax.type = 'range';
    rangeMax.step = '1';
    rangeMax.min = this.minRangeVal;
    rangeMax.max = this.maxRangeVal;
    rangeMax.value = this.maxCurrVal;
    rangeMax.style.zIndex = '0';

    rangeMax.oninput = () => {
      if (+rangeMax.value < +this.minCurrVal) rangeMax.value = this.minCurrVal;
      this.maxCurrVal = rangeMax.value;
      this.setValues({ inputMax });
      this.route();
    }

    rangesWrapper.appendChild(rangeMax);

    this.setValues({ inputMin, inputMax, rangeMin, rangeMax });
  }

  private setValues({ inputMin, inputMax, rangeMin, rangeMax }: { [key: string]: HTMLInputElement | null }): void {
    if (inputMin) inputMin.value = this.minCurrVal;
    if (inputMax) inputMax.value = this.maxCurrVal;
    if (rangeMin) rangeMin.value = this.minCurrVal;
    if (rangeMax) rangeMax.value = this.maxCurrVal;

    this.fillRange();
  }

  private fillRange(): void {
    const sliderColor = '#ddd';
    const rangeColor = '#ff0020';
    const distance = +this.maxRangeVal - +this.minRangeVal;

    this.rangeMax.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${((+this.minCurrVal - +this.minRangeVal) / distance) * 100}%,
      ${rangeColor} ${((+this.minCurrVal - +this.minRangeVal) / distance) * 100}%,
      ${rangeColor} ${((+this.maxCurrVal - +this.minRangeVal) / distance) * 100}%,
      ${sliderColor} ${((+this.maxCurrVal - +this.minRangeVal) / distance) * 100}%,
      ${sliderColor} 100%)`;
  }

  getHTML(): HTMLDivElement {
    return this.wrapper;
  }

  private setDataValues(): void {
    const priceRangeString = dataStorage.getValuesByKey(this.key, true);

    this.minRangeVal = Math.min(...Object.keys(priceRangeString).map((el) => +el)).toString();

    this.maxRangeVal = Math.max(...Object.keys(priceRangeString).map((el) => +el)).toString();

    this.minCurrVal = Math.min(...Object.keys(priceRangeString)
      .filter((el:string) => priceRangeString[el].curr > 0)
      .map((el) => +el))
      .toString();

    this.maxCurrVal = Math.max(...Object.keys(priceRangeString)
      .filter((el:string) => priceRangeString[el].curr > 0)
      .map((el) => +el))
      .toString();
  }

  update(): void {
    this.setDataValues();
    this.buildElements();
  }

  route(): void {
    router.setReqParams(this.key, `${this.minCurrVal},${this.maxCurrVal}`);
    this.updateCallback(this);
  }
}

export default MultiRange;
