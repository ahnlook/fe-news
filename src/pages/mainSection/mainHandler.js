import { getElement } from '../../script/utils.js'
import MainView from './mainView.js'

class MainHandler {
  #data
  #mainView
  #currentView
  #currentViewData
  #currentPage
  #subscriptionList

  constructor() {
    this.#fetchData('http://localhost:3001/presses')
    this.#currentPage = 1
    this.#subscriptionList = new Set()
  }

  #fetchData(url) {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.#data = this.#shuffleData(data)
        this.#initMainView()
      })
  }

  #shuffleData(data) {
    return data.sort(() => Math.random() - 0.5)
  }

  #initMainView() {
    this.#setGridDate()

    this.#mainView = new MainView(this.#currentViewData)
    this.#currentView = this.#mainView.getCurrentView()
    this.#onClickGridBtn()
    this.#onGridEvent()
  }

  #setGridDate() {
    const PRESSES_PER_PAGE = 24

    const endPress = PRESSES_PER_PAGE * this.#currentPage
    const startPress = endPress - PRESSES_PER_PAGE

    const slicedData = this.#data.slice(startPress, endPress)

    this.#currentViewData = slicedData.map(press => {
      const isSubscription = [...this.#subscriptionList].includes(press.name)
      press.isSubscription = isSubscription
      return press
    })
  }

  #onClickGridBtn() {
    const button = getElement('ns-direction-btn')

    button.addEventListener('click', ({ target }) => {
      const clickedBtn = target.alt

      if (clickedBtn === 'RightButton') this.#currentPage++
      if (clickedBtn === 'LeftButton') this.#currentPage--

      this.#renderGridView()
    })
  }

  #renderGridView() {
    this.#setGridDate()
    this.#mainView.setCurrentViewData({
      currentPage: this.#currentPage,
      currentViewData: this.#currentViewData
    })
  }

  #onGridEvent() {
    const grid = getElement('.main-view')

    const toggleClass = (target, className) => {
      const cell = target.closest('.grid-cell')
      if (cell) {
        cell.firstChild.classList.toggle(className)
        cell.lastChild.classList.toggle(className)
      }
    }

    grid.addEventListener('mouseover', ({ target }) => {
      toggleClass(target, 'none')
    })

    grid.addEventListener('mouseout', ({ target }) => {
      toggleClass(target, 'none')
    })

    grid.addEventListener('click', ({ target }) => {
      const cell = target.closest('.grid-cell')
      const pressName = cell?.querySelector('.press img').alt
      const subscriptionStatus = cell?.querySelector('.subscribe-btn img').alt

      subscriptionStatus === 'subscription'
        ? this.#subscriptionList.delete(pressName)
        : this.#subscriptionList.add(pressName)

      this.#renderGridView()
    })
  }
}

export default MainHandler
