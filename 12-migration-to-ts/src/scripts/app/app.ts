import AppController from '../controller/controller';
import { AppView, IArticlesWithInfo, ISourcesWithInfo } from '../view/appView';

export default class App {
  private controller: AppController;

  private view: AppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  start() {
    const sourcesDOM = document.querySelector('.sources') as HTMLElement;

    this.controller.getSources((data: ISourcesWithInfo): void => this.view.drawSources(data));

    this.controller.getNewsOnload((data: IArticlesWithInfo): void => this.view.drawNews(data));

    sourcesDOM.addEventListener('click', (e: Event): void =>
      this.controller.getNews(e, (data: IArticlesWithInfo): void => this.view.drawNews(data))
    );
  }
}
