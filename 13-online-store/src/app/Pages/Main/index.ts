import { IReqParams } from '../../Types';
import router from '../../Router';
import template from './template.html';
import { addBlocksToDocument } from '../../utils';

class MainPage {

  render(reqParams: IReqParams): void {
    if (reqParams.length) router.goTo('/');

    document.title = `Online Store — Главная`;

    const main = document.createElement('main');
    main.innerHTML = template;
    addBlocksToDocument(main);
  }

  update(reqParams: IReqParams): void {
    this.render(reqParams)
  }
}

export default MainPage;
