import router from '../../Router';

class SortSelect {

  getHTML(): HTMLSelectElement {
    const reqParams =  router.getReqParamsAll();

    const wrapper = document.createElement('div');
    wrapper.className = 'catalog__select select';

    const selectInput = document.createElement('select');
    selectInput.className = 'select__select';
    selectInput.innerHTML = `
      <option hidden>Сортировка</option>
      <option value="price-ASC" class="select__option">Цена ▲</option>
      <option value="price-DESC" class="select__option">Цена ▼</option>
      <option value="count-ASC" class="select__option">Количество ▲</option>
      <option value="count-DESC" class="select__option">Количество ▼</option>
      <option value="productRating-ASC" class="select__option">Рейтинг ▲</option>
      <option value="productRating-DESC" class="select__option">Рейтинг ▼</option>
    `;

    const sortValue = reqParams['sort'];

    if (sortValue) selectInput.value = sortValue[0];

    selectInput.addEventListener('change', () => this.route(selectInput.value));

    return selectInput;
  }

  route(param: string): void {
    router.setReqParams('sort', param);
  }
}

export default SortSelect;
