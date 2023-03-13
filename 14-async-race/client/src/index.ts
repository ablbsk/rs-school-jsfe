import App from './web/app'
import './styles/main.scss'

window.addEventListener('DOMContentLoaded', (): void => {
  const app = new App()
  app.start()
})
