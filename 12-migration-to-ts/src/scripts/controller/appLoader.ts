import Loader from './loader';

export default class AppLoader extends Loader {
  constructor() {
    super('https://newsapi-redirect-production.up.railway.app/', {
      apiKey: '50636d895e7348abb7ab1f591d684a49',
    });
  }
}
