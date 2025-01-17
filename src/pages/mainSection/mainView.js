import { getElement, createNode } from '../../script/utils.js'
import { CONTENTS } from '../../script/contents.js'
import PressesGridView from './pressesGridView.js'
import PressListView from './pressListView.js'
import ViewSelectionBtn from './viewSelectionBtn.js'
import SubscribeSnackbar from './subscribeSnackbar.js'

class MainView {
  #mainViewContainer
  #viewSelectButton
  #directionButton
  #currentView

  constructor(currentViewData) {
    this.app = getElement('.app')
    this.#mainViewContainer = createNode('div')
    this.#mainViewContainer.classList.add('main-view')

    this.#createMainViewButtons()
    this.#createGridView(currentViewData)
    this.#createSubscribeSnackbar()
    this.#createUnsubscribingModal()
    this.app.appendChild(this.#mainViewContainer)
  }

  #createMainViewButtons() {
    this.#viewSelectButton = new ViewSelectionBtn().createButtons()
    this.#mainViewContainer.appendChild(this.#viewSelectButton)

    this.#directionButton = createNode('ns-direction-btn')
    this.#mainViewContainer.appendChild(this.#directionButton)
  }

  #createGridView(data) {
    this.#currentView && this.#mainViewContainer.removeChild(this.#currentView)

    const gridView = new PressesGridView(data)
    this.#currentView = gridView.getGridView()

    this.#mainViewContainer.appendChild(this.#currentView)
  }

  #createListView(data) {
    const pressListView = new PressListView(data)
    const listView = pressListView.getListView()

    this.#currentView.innerHTML = listView
  }

  #createUnsubscribingModal() {
    const unsubscribingModal = createNode('ns-unsubscribe-modal')
    this.#mainViewContainer.appendChild(unsubscribingModal)
  }

  #createSubscribeSnackbar() {
    const snackbar = new SubscribeSnackbar()
    const snackbarEl = snackbar.createSnackbar()

    this.#mainViewContainer.appendChild(snackbarEl)
  }

  onSnackbar() {
    const snackbar = document.querySelector('.subscribe-snb')
    snackbar.classList.remove('none')
    setTimeout(() => {
      snackbar.classList.add('none')
    }, 1000)
  }

  setCurrentViewData(data) {
    const { currentPage, currentViewType, currentViewData, dataLength } = data

    this.#setCurrentPage(currentPage)

    const lastPage =
      currentViewType === 'grid'
        ? Math.ceil(dataLength / CONTENTS.PRESSES_PER_PAGE) || 1
        : dataLength || 0
    this.#directionButton.setAttribute('last-page', lastPage)

    if (currentViewType === 'grid') {
      this.#createGridView(currentViewData)
    }

    if (currentViewType === 'list') {
      this.#createListView(currentViewData)
      // if(구독하기를 눌렀으면) 스낵바띄우기
    }
  }

  #setCurrentPage(page) {
    this.#directionButton.setAttribute('page', page)
  }
}

export default MainView
