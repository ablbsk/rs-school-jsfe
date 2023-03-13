import routes from './routes';
import { IReqParams } from '../Types/';

class Router {

  private routes;
  private reqParams;

  constructor() {
    this.routes = routes;
    this.reqParams = {};
  }

  private loadPage(refresh?: boolean): void {
    const urlPathname = location.pathname;
    const correctRoutes = routes.filter((route) => route.path === urlPathname);
    const reqParams = this.getReqParamsAll();

    if (correctRoutes.length < 1) {
      this.goTo('/404');
    } else {
      const currRoute = correctRoutes[0];

      if (refresh && Object.keys(reqParams).length) {
        currRoute.page.update(reqParams);
      } else {
        document.body.innerHTML = '';
        currRoute.page.render(reqParams);
      }
    }
  }

  private static convertReqParamsToObj(reqParams: URLSearchParams) {
    const reqParamsObj: IReqParams = {};

    reqParams.forEach((param, i) => {
      if (param.split(',').filter((param) => param).length > 0) {
        reqParamsObj[i] = param.split(',');
      }
    });

    return reqParamsObj;
  }

  goTo(href: string): void {
    const currPath = location.pathname;
    history.pushState('', '', href);
    const newPath = location.pathname;

    newPath !== currPath ? this.loadPage() : this.loadPage(true);
  }

  getReqParamsAll() {
    const newURL = new URL(location.toString());
    return Router.convertReqParamsToObj(newURL.searchParams);
  }

  setReqParams(name: string, value: string): void {
    const reqParams = new URLSearchParams(this.reqParams);

    reqParams.has(name) ? reqParams.set(name, value) : reqParams.append(name, value);

    this.reqParams = reqParams;

    const newURL = new URL(location.toString());
    newURL.search = reqParams.toString();
    this.goTo(newURL.toString());
  }

  resetReqParams(): void {
    this.reqParams = {};
    this.goTo(location.pathname);
  }

  start(): void {
    window.addEventListener('popstate', (): void => this.loadPage());

    window.addEventListener('DOMContentLoaded', (): void => this.loadPage());

    window.addEventListener('click', (e: Event): void => {
      if (!e.target) return;

      const target = e.composedPath()[0] as HTMLElement;
      const link = target.closest('a');

      if (link?.matches('[data-local-link')) {
        e.preventDefault();
        this.goTo(link.href);
      }
    });
  }
}

const router = new Router();

export default router;
