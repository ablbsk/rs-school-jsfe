import pageHeader from '../Components/PageHeader';
import pageFooter from '../Components/PageFooter';

export const addBlocksToDocument = (main: HTMLElement): void => {
  const blocks = [pageHeader.getHTML(), main, pageFooter.getHTML()]
  document.body.append(...blocks);
}

export const getRatingStyleColor = (ratingValue: string): string => {
  const rating: number = parseFloat(ratingValue);

  switch (true) {
    case rating >= 4.8:
      return 'rating--good';
    case rating > 3.9:
      return 'rating--medium';
    default:
      return 'rating--bad';
  }
}
