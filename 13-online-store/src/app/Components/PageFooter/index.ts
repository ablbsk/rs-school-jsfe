import template from './template.html';

class PageFooter {

  getHTML(): HTMLElement {
    const footer = document.createElement('footer');

    footer.className = 'footer';
    footer.innerHTML = template;

    return footer;
  }
}

const pageFooter = new PageFooter();

export default pageFooter;
