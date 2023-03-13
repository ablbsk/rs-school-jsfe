import router from '../../Router';
import { IReqParams } from '../../Types';
import { addBlocksToDocument } from '../../utils';

class Error404Page {

  render(reqParams: IReqParams): void {
    document.title = `Страница не найдена`;

    if (reqParams.length) router.goTo('/404');

    const mainDOM = document.createElement('main');
    mainDOM.append(this.createMessage());

    addBlocksToDocument(mainDOM);
  }

  createMessage(): HTMLElement {
    const notFoundDOM = document.createElement('div') as HTMLElement;
    notFoundDOM.classList.add('not-found');
    notFoundDOM.innerHTML = `
      <div class="wrapper">
        <span class="not-found__image"></span>
        <p class="not-found__title">Ой! Что-то пошло не так...</p>
      </div>
    `;

    return notFoundDOM;
  }

  update(reqParams: IReqParams): void {
    this.render(reqParams);
  }
}

export default Error404Page;
