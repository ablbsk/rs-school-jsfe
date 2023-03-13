export interface IArticle {
  readonly author: string;
  readonly content: string;
  readonly description: string;
  readonly publishedAt: string;
  readonly source: {
    id: string;
    name: string;
  };
  readonly title: string;
  readonly url: string;
  readonly urlToImage: string;
}

export class News {
  draw(data: IArticle[]): void {
    const news: IArticle[] = data.length < 10 ? data : data.filter((_item: IArticle, idx: number) => idx < 10);

    const fragment = document.createDocumentFragment() as DocumentFragment;
    const newsItemTemp = document.querySelector('#newsItemTemp') as HTMLTemplateElement;

    news.forEach((item: IArticle, idx: number): void => {
      const newsClone = newsItemTemp.content.cloneNode(true) as DocumentFragment;

      if (idx % 2) {
        const newsItemDOM = newsClone.querySelector('.news__item') as HTMLElement;
        newsItemDOM.classList.add('alt');
      }

      const newsMetaPhotoDOM = newsClone.querySelector('.news__meta-photo') as HTMLElement;
      newsMetaPhotoDOM.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;

      const newsMetaAuthorDOM = newsClone.querySelector('.news__meta-author') as HTMLElement;
      newsMetaAuthorDOM.textContent = item.author || item.source.name;

      const newsMetaDateDOM = newsClone.querySelector('.news__meta-date') as HTMLElement;
      newsMetaDateDOM.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');

      const newsDescriptionTitleDOM = newsClone.querySelector('.news__description-title') as HTMLElement;
      newsDescriptionTitleDOM.textContent = item.title;

      const newsDescriptionSourceDOM = newsClone.querySelector('.news__description-source') as HTMLElement;
      newsDescriptionSourceDOM.textContent = item.source.name;

      const newsDescriptionContentDOM = newsClone.querySelector('.news__description-content') as HTMLElement;
      newsDescriptionContentDOM.textContent = item.description;

      const newsDescriptionReadMoreDOM = newsClone.querySelector('.news__read-more a') as HTMLElement;
      newsDescriptionReadMoreDOM.setAttribute('href', item.url);

      fragment.append(newsClone);
    });

    const newsDOM = document.querySelector('.news') as HTMLElement;
    newsDOM.innerHTML = '';
    newsDOM.appendChild(fragment);
  }
}
