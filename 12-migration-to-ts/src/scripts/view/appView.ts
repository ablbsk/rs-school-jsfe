import { News, IArticle } from './news/news';
import { Sources, ISource } from './sources/sources';

export interface IArticlesWithInfo {
  articles: IArticle[];
  readonly status: string;
  readonly totalResults: number;
}

export interface ISourcesWithInfo {
  sources: ISource[];
  readonly status: string;
}

export class AppView {
  private news: News;

  private sources: Sources;

  constructor() {
    this.news = new News();
    this.sources = new Sources();
  }

  drawNews(data: IArticlesWithInfo): void {
    const values: IArticle[] = data?.articles ? data?.articles : [];
    this.news.draw(values);
  }

  drawSources(data: ISourcesWithInfo): void {
    const values: ISource[] = data?.sources ? data?.sources : [];
    this.sources.draw(values);
  }
}
