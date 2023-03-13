import AppLoader from './appLoader';
import { IArticlesWithInfo, ISourcesWithInfo } from '../view/appView';

export default class AppController extends AppLoader {
  getSources(callback: (data: ISourcesWithInfo) => void): void {
    super.getResp({ endpoint: 'sources' }, callback);
  }

  getNews(e: Event, callback: (data: IArticlesWithInfo) => void): void {
    let target = e.target as HTMLElement;
    const newsContainer = e.currentTarget as HTMLElement;

    while (target !== newsContainer) {
      if (target.classList.contains('source__item')) {
        const sourceId: string | null = target.getAttribute('data-source-id');

        if (sourceId !== null && newsContainer.getAttribute('data-source') !== sourceId) {
          newsContainer.setAttribute('data-source', sourceId);
          super.getResp({ endpoint: 'everything', options: { sources: sourceId } }, callback);

          const sourceItemActiveDOM = document.querySelector('.source__item--active') as HTMLElement;
          sourceItemActiveDOM.classList.remove('source__item--active');

          target.classList.add('source__item--active');
        }
        return;
      }
      target = target.parentNode as HTMLElement;
    }
  }

  getNewsOnload(callback: (data: IArticlesWithInfo) => void): void {
    super.getResp({ endpoint: 'everything', options: { sources: 'abc-news' } }, callback);
  }
}
