export function createDOMElement(tag: string, className: string[], inner?: string): HTMLElement {
  const element = document.createElement(tag)
  element.classList.add(...className)

  if (inner) element.innerHTML = inner

  return element
}

export function changeActivityOfDOM(result: boolean, element: HTMLElement | HTMLButtonElement): void {
  result ? element.classList.add('disabled') : element.classList.remove('disabled')
}
