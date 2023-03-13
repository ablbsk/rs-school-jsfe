type OptionsType = { [key: string]: string | number };
type ResponseType = { endpoint: string; options?: OptionsType };

export default class Loader {
  constructor(public baseLink: string, public options: OptionsType) {
    this.baseLink = baseLink;
    this.options = options;
  }

  getResp<T>(res: ResponseType, callback = (data: T) => console.error(`No callback for GET response ${data}`)): void {
    const { endpoint, options } = res;
    this.load('GET', endpoint, callback, options);
  }

  errorHandler(res: Response): Response {
    if (!res.ok) {
      if (res.status === 401 || res.status === 404)
        console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
      throw Error(res.statusText);
    }

    return res;
  }

  makeUrl(options: OptionsType, endpoint: string): string {
    const urlOptions: OptionsType = { ...this.options, ...options };
    let url = `${this.baseLink}${endpoint}?`;

    Object.keys(urlOptions).forEach((key: string) => (url += `${key}=${urlOptions[key]}&`));

    return url.slice(0, -1);
  }

  load<T>(method: string, endpoint: string, callback: (data: T) => void, options: OptionsType = {}) {
    fetch(this.makeUrl(options, endpoint), { method })
      .then(this.errorHandler)
      .then((res: Response) => res.json())
      .then((data: T) => callback(data))
      .catch((err: Error) => console.error(err));
  }
}
