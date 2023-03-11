import './styles/main.scss'
import mp3File from './assets/audio/move.mp3'

window.onload = (event) => {
  event.preventDefault()

  const createElementsDOM = () => {
    const main = document.createElement('main')
    main.classList.add('main')
    document.body.append(main)

    const createHeaderDOM = () => {
      const header = document.createElement('header')
      header.classList.add('header')
      header.innerHTML = `<h1 class="header__title">Gem Puzzle</h1>
        <div class="header__controls">
          <button id="buttonStart" class="header__button">Start</button>
          <button id="buttonPause" class="header__button header__button--pause" disabled>Pause</button>
          <button id="buttonSave" class="header__button" disabled>Save</button>
          <button id="buttonResult" class="header__button">Results</button>
        </div>`

      main.append(header)
    }

    const createFooterDOM = () => {
      const footer = document.createElement('footer')
      footer.classList.add('footer')

      footer.innerHTML = `<div class="footer__info">
          <span class="stopwatch">00:00:00</span>
          <span class="sound sound--on"></span>
          <span class="footer__move">Moves: 0</span>
        </div>
        <div class="sizes">
          <p class="sizes__title">Other sizes:</p>
          <ul class="sizes__list">
            <li class="sizes__list-item">3x3</li>
            <li class="sizes__list-item sizes__list-item--active">4x4</li>
            <li class="sizes__list-item">5x5</li>
            <li class="sizes__list-item">6x6</li>
            <li class="sizes__list-item">7x7</li>
            <li class="sizes__list-item">8x8</li>
          </ul>
        </div>`

      main.append(footer)
    }

    const createPlaygroundDOM = () => {
      const results = document.createElement('div')
      results.classList.add('top-result', 'hidden')
      results.innerHTML = `<ul class="top-result__line top-result__line--header">
        <li class="top-result__item">#</li>
        <li class="top-result__item">Size</li>
        <li class="top-result__item">Time</li>
        <li class="top-result__item">Moves</li>
      </ul>`

      results.addEventListener('click', () => results.classList.add('hidden'))

      main.append(results)

      const victory = document.createElement('div')
      victory.classList.add('message', 'message--victory', 'hidden')
      main.append(victory)

      const playground = document.createElement('div')
      playground.classList.add('playground')
      main.append(playground)
    }

    createHeaderDOM()
    createPlaygroundDOM()
    createFooterDOM()
  }

  createElementsDOM()

  const startButtonDOM = document.getElementById('buttonStart')
  const pauseButtonDOM = document.getElementById('buttonPause')
  const saveButtonDOM = document.getElementById('buttonSave')
  const resultsButtonDOM = document.getElementById('buttonResult')

  const playgroundDOM = document.querySelector('.playground')
  const userMoveCountDOM = document.querySelector('.footer__move')
  const stopwatchDOM = document.querySelector('.stopwatch')

  const soundDOM = document.querySelector('.sound')
  const modalDOM = document.querySelector('.top-result')
  const victoryMessageDOM = document.querySelector('.message')

  // Global variables
  let gemSize = 0
  const emptyGem = {} // empty cell

  let fieldSize = 4
  let numbers = []
  let dominos = []
  let isReady = true
  let isPaused = false
  let userMoveCount = 0
  let stopwatch = null
  let pausedTime = 0
  let isMute = false
  let leaderBoard = []

  const shuffle = (gemArr) => gemArr.sort(() => Math.random() - 0.5)

  const playSound = () => {
    const audio = new Audio(mp3File)
    if (!isMute) audio.play()
  }

  function moveGem(i) {
    const isPosition = () => {
      const topShift = Math.abs(emptyGem.positionTop - dominos[i].positionTop)
      const leftShift = Math.abs(emptyGem.positionLeft - dominos[i].positionLeft)

      return topShift + leftShift <= 1
    }

    if (isReady && isPosition()) {
      isReady = false

      const currentTop = emptyGem.positionTop
      const currentLeft = emptyGem.positionLeft

      emptyGem.positionTop = dominos[i].positionTop
      emptyGem.positionLeft = dominos[i].positionLeft

      dominos[i].positionTop = currentTop
      dominos[i].positionLeft = currentLeft
      dominos[i].element.style.top = `${currentTop * gemSize * 0.1}rem`
      dominos[i].element.style.left = `${currentLeft * gemSize * 0.1}rem`

      userMoveCount++

      userMoveCountDOM.textContent = `Moves: ${userMoveCount}`

      playSound()

      if (isVictory()) showWinMessage()
    }
  }

  // Start timer
  function countSec(sec, min, hour) {
    let seconds = sec || 0
    let minutes = min || 0
    let hours = hour || 0

    seconds++

    if (seconds === 60) {
      minutes++
      seconds = 0
    }

    if (minutes === 60) {
      hours++
      minutes = 0
    }

    stopwatch = setTimeout(() => countSec(seconds, minutes, hours), 1000)

    stopwatchDOM.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  // Pause timer
  function stopCountSec() {
    clearTimeout(stopwatch)
    const hours = +stopwatchDOM.textContent.slice(0, 2)
    const minutes = +stopwatchDOM.textContent.slice(3, 5)
    const seconds = +stopwatchDOM.textContent.slice(6)
    pausedTime = [seconds, minutes, hours]
    isPaused = true
    pauseButtonDOM.textContent = 'Resume'
    const pauseWindow = document.createElement('div')
    pauseWindow.className = 'message message--pause'
    pauseWindow.innerHTML = `<span class="line">Game paused</span>`

    const main = document.querySelector('.main')
    main.append(pauseWindow)

    pauseWindow.addEventListener('click', () => {
      isPaused = false
      resumeCountSec()
      pauseWindow.remove()
    })

    return pausedTime
  }

  // Resume timer after pause
  function resumeCountSec() {
    countSec(...pausedTime)
    pauseButtonDOM.textContent = 'Pause'
    isPaused = false
    const pauseWindow = document.querySelector('.message--pause')
    pauseWindow.remove()
  }

  function isVictory() {
    let value = true
    const result = dominos.slice()
    result
      .sort((a, b) => a.positionTop + a.positionLeft - b.positionTop - b.positionLeft)
      .sort((a, b) => a.positionTop - b.positionTop)
    for (let i = 0; i < result.length - 2; i++) {
      if (result[i + 1].number - result[i].number !== 1) value = false
    }

    return value
  }

  // Create game field
  function initGame() {
    pauseButtonDOM.disabled = false
    saveButtonDOM.disabled = false
    isReady = true
    playgroundDOM.innerHTML = ''
    emptyGem.positionLeft = fieldSize - 1
    emptyGem.positionTop = fieldSize - 1
    emptyGem.number = 0
    gemSize = playgroundDOM.clientWidth / fieldSize
    dominos = []
    numbers = []
    userMoveCount = 0
    userMoveCountDOM.textContent = `Moves: ${userMoveCount}`
    stopwatchDOM.textContent = '00:00:00'
    clearTimeout(stopwatch)
    stopwatch = null
    countSec(0, 0, 0)

    for (let i = 1; i < fieldSize * fieldSize; i++) {
      numbers.push(i)
    }

    shuffle(numbers)

    for (let i = 0; i < fieldSize * fieldSize - 1; i++) {
      const domino = document.createElement('div')
      const positionLeft = i % fieldSize
      const positionTop = (i - (i % fieldSize)) / fieldSize
      dominos.push({
        positionLeft,
        positionTop,
        number: numbers[i],
        element: domino
      })
      domino.className = 'gem'
      domino.style.width = `${gemSize * 0.1}rem`
      domino.style.height = `${gemSize * 0.1}rem`
      domino.style.left = `${positionLeft * gemSize * 0.1}rem`
      domino.style.top = `${positionTop * gemSize * 0.1}rem`

      domino.textContent = numbers[i]

      domino.addEventListener('click', () => moveGem(i))
      domino.addEventListener('transitionend', () => {
        isReady = true
      })
      playgroundDOM.append(domino)
    }
    dominos.push(emptyGem)
    canSolve()
  }

  // Check if combinations unsolvable, and reshaffles it
  function canSolve() {
    let count = +fieldSize
    const result = dominos.slice()
    result
      .sort((a, b) => a.positionTop + a.positionLeft - b.positionTop - b.positionLeft)
      .sort((a, b) => a.positionTop - b.positionTop)

    for (let i = 0; i < result.length - 1; i++) {
      for (let j = i + 1; j < result.length - 1; j++) {
        if (result[i].number > result[j].number) count++
      }
    }

    if ((fieldSize % 2 === 0 && count % 2 !== 0) || (fieldSize % 2 !== 0 && count % 2 === 0)) {
      initGame()
      canSolve()
    }
  }

  // Save field to local storage
  function setLocalStorage() {
    if (localStorage.getItem('numbers')) {
      localStorage.removeItem('numbers')
      localStorage.removeItem('lefts')
      localStorage.removeItem('tops')
      localStorage.removeItem('nullLeft')
      localStorage.removeItem('nullTop')
      localStorage.removeItem('size')
      localStorage.removeItem('currentMoves')
      localStorage.removeItem('currentTime')
      saveButtonDOM.textContent = 'Save game'
    } else {
      const positionsLeft = []
      const positionsTop = []
      const numOreder = []
      let nullLeft = 0
      let nullTop = 0
      dominos.forEach((value) => {
        if (value.number === 0) {
          nullLeft = value.positionLeft
          nullTop = value.positionTop
        }
        positionsLeft.push(value.positionLeft)
        positionsTop.push(value.positionTop)
        numOreder.push(value.number)
      })

      localStorage.setItem('numbers', JSON.stringify(numOreder))
      localStorage.setItem('lefts', JSON.stringify(positionsLeft))
      localStorage.setItem('tops', JSON.stringify(positionsTop))
      localStorage.setItem('nullLeft', nullLeft)
      localStorage.setItem('nullTop', nullTop)
      localStorage.setItem('size', fieldSize)
      localStorage.setItem('currentMoves', userMoveCount)
      localStorage.setItem('currentTime', stopwatchDOM.textContent)
      saveButtonDOM.textContent = 'Reset save'
    }
  }

  // Show victory message and save results to local storage
  function showWinMessage() {
    clearTimeout(stopwatch)
    pauseButtonDOM.disabled = true
    saveButtonDOM.disabled = true
    victoryMessageDOM.innerHTML = `
      <span class="line line--gold">Hooray!</span>
      <span class="line">You solved the puzzle in ${stopwatchDOM.textContent} and ${userMoveCount} moves!</span>
    `
    setTimeout(() => {
      victoryMessageDOM.classList.remove('hidden')
      isReady = false
    }, 501)

    const currentResult = {
      size: fieldSize,
      time: stopwatchDOM.textContent,
      moves: userMoveCount
    }
    let number = 1
    leaderBoard.push(currentResult)
    leaderBoard.sort((a, b) => a.moves - b.moves)
    if (leaderBoard.length > 10) {
      leaderBoard = leaderBoard.slice(0, 10)
    }
    modalDOM.innerHTML = `<ul class="top-result__line top-result__line--header">
        <li class="top-result__item">#</li>
        <li class="top-result__item-item">Size</li>
        <li class="top-result__item">Time</li>
        <li class="top-result__item">Moves</li>
      </ul>`

    leaderBoard.forEach((value) => {
      const section = document.createElement('ul')
      section.classList.add('top-result__line')

      const position = document.createElement('li')
      position.textContent = number
      position.className = 'top-result__item'
      section.append(position)

      const winSize = document.createElement('li')
      winSize.textContent = value.size
      winSize.className = 'top-result__item'
      section.append(winSize)

      const winTime = document.createElement('li')
      winTime.textContent = value.time
      winTime.className = 'top-result__item'
      section.append(winTime)

      const winMoves = document.createElement('li')
      winMoves.textContent = value.moves
      winMoves.className = 'top-result__item'
      section.append(winMoves)

      modalDOM.append(section)

      number++
    })

    localStorage.setItem('leaderBoard', JSON.stringify(leaderBoard))
    localStorage.setItem('results', modalDOM.innerHTML)
  }

  // load game save from local storage
  if (localStorage.getItem('numbers')) {
    pauseButtonDOM.disabled = false
    saveButtonDOM.disabled = false
    saveButtonDOM.textContent = 'Reset save'
    playgroundDOM.innerHTML = ''
    fieldSize = +localStorage.getItem('size')

    const sizesDOM = document.querySelectorAll('.sizes__list-item')
    const activeSize = document.querySelector('.sizes__list-item--active')
    activeSize.classList.remove('sizes__list-item--active')
    sizesDOM[+fieldSize - 3].classList.add('sizes__list-item--active')

    numbers = JSON.parse(localStorage.getItem('numbers'))
    const lefts = JSON.parse(localStorage.getItem('lefts'))
    const tops = JSON.parse(localStorage.getItem('tops'))
    gemSize = playgroundDOM.clientWidth / fieldSize
    userMoveCount = localStorage.getItem('currentMoves')
    userMoveCountDOM.textContent = `Moves: ${userMoveCount}`
    stopwatchDOM.textContent = localStorage.getItem('currentTime')
    clearTimeout(stopwatch)
    stopwatch = null
    const sec = +localStorage.getItem('currentTime').slice(6)
    const min = +localStorage.getItem('currentTime').slice(3, 5)
    const hours = +localStorage.getItem('currentTime').slice(0, 2)
    countSec(sec, min, hours)

    for (let i = 0; i < fieldSize * fieldSize - 1; i++) {
      const domino = document.createElement('div')
      const positionLeft = lefts[i]
      const positionTop = tops[i]
      dominos.push({
        positionLeft,
        positionTop,
        number: numbers[i],
        element: domino
      })
      domino.className = 'gem'
      domino.style.width = `${gemSize * 0.1}rem`
      domino.style.height = `${gemSize * 0.1}rem`
      domino.style.left = `${positionLeft * gemSize * 0.1}rem`
      domino.style.top = `${positionTop * gemSize * 0.1}rem`

      domino.textContent = numbers[i]

      domino.addEventListener('click', () => moveGem(i))
      domino.addEventListener('transitionend', () => {
        isReady = true
      })
      playgroundDOM.append(domino)
    }
    emptyGem.positionLeft = +localStorage.getItem('nullLeft')
    emptyGem.positionTop = +localStorage.getItem('nullTop')
    emptyGem.number = 0
    dominos.push(emptyGem)
  }

  // load data to results.popup
  if (localStorage.getItem('results')) modalDOM.innerHTML = localStorage.getItem('results')

  // load list of leaders
  if (localStorage.getItem('leaderBoard')) leaderBoard = JSON.parse(localStorage.getItem('leaderBoard'))

  // Change size of the game field
  const sizesDOM = document.querySelectorAll('.sizes__list-item')
  sizesDOM.forEach((item) => {
    item.addEventListener('click', () => {
      if (item.classList.length !== 2) {
        const activeSize = document.querySelector('.sizes__list-item--active')
        activeSize.classList.remove('sizes__list-item--active')

        fieldSize = item.textContent.charAt(0)
        item.classList.add('sizes__list-item--active')
        initGame()
      }
    })
  })

  // Shuffle and start
  startButtonDOM.addEventListener('click', () => {
    initGame()
    if (modalDOM.classList.length === 1) modalDOM.classList.add('hidden')
    if (victoryMessageDOM.classList.length === 2) victoryMessageDOM.classList.add('hidden')
  })

  // Pause-Resume game
  pauseButtonDOM.addEventListener('click', () => (isPaused ? resumeCountSec() : stopCountSec()))

  // Sound of dominos movement
  soundDOM.addEventListener('click', () => {
    soundDOM.classList.toggle('sound--on')
    soundDOM.classList.toggle('sound--off')
    isMute = !isMute
  })

  // Save-reset game
  saveButtonDOM.addEventListener('click', setLocalStorage)

  // close pop up windows
  window.addEventListener('click', () => {
    if (!victoryMessageDOM.classList.contains('hidden')) {
      if (!event.target.classList.contains('victory')) {
        victoryMessageDOM.classList.add('hidden')
      }
    }
  })

  // Open leaderboard
  resultsButtonDOM.addEventListener('click', () => {
    // eslint-disable-next-line no-unused-expressions
    modalDOM.classList.length === 2 ? modalDOM.classList.remove('hidden') : modalDOM.classList.add('hidden')
  })

  window.addEventListener('resize', () => {
    const playgroundWidth = document.querySelector('.playground').clientWidth
    const gemArr = document.querySelectorAll('.gem')

    const updateGemSize = () => {
      if (gemArr.length !== 0) {
        const gemWidth = Number.parseInt(gemArr[0].style.width, 10)
        gemSize = playgroundWidth / fieldSize

        gemArr.forEach((item) => {
          const gemTopK = Math.floor(Number.parseInt(item.style.top, 10) / gemWidth)
          const gemLeftK = Math.floor(Number.parseInt(item.style.left, 10) / gemWidth)

          // eslint-disable-next-line no-param-reassign
          item.style.width = `${gemSize * 0.1}rem`
          // eslint-disable-next-line no-param-reassign
          item.style.height = `${gemSize * 0.1}rem`
          // eslint-disable-next-line no-param-reassign
          item.style.top = gemTopK ? `${gemSize * gemTopK * 0.1}rem` : `0rem`
          // eslint-disable-next-line no-param-reassign
          item.style.left = gemLeftK ? `${gemSize * gemLeftK * 0.1}rem` : `0rem`
        })
      }
    }
    if (window.matchMedia('(max-width: 1440px)').matches) {
      updateGemSize()
    }
    if (window.matchMedia('(max-width: 1280px)').matches) {
      updateGemSize()
    }
    if (window.matchMedia('(max-width: 768px)').matches) {
      updateGemSize()
    }
    if (window.matchMedia('(max-width: 552px)').matches) {
      updateGemSize()
    }
  })
}
