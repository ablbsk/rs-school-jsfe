export interface ISource {
  readonly category: string;
  readonly county: string;
  readonly description: string;
  readonly id: string;
  readonly language: string;
  readonly name: string;
  readonly url: string;
}

export class Sources {
  draw(data: ISource[]): void {
    const fragment = document.createDocumentFragment() as DocumentFragment;
    const sourceItemTemp = document.querySelector('#sourceItemTemp') as HTMLTemplateElement;

    data.forEach((item: ISource, i: number): void => {
      const sourceClone = sourceItemTemp.content.cloneNode(true) as DocumentFragment;

      const sourceNameDOM = sourceClone.querySelector('.source__item-name') as HTMLElement;
      sourceNameDOM.textContent = item.name;

      const sourceItemDOM = sourceClone.querySelector('.source__item') as HTMLElement;
      sourceItemDOM.setAttribute('data-source-id', item.id);

      if (i === 0) sourceItemDOM.classList.add('source__item--active');

      fragment.append(sourceClone);
    });

    const sourcesDOM = document.querySelector('.sources') as HTMLElement;
    sourcesDOM.append(fragment);
  }
}
