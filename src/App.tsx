import { useRef, useEffect, useState } from 'react';
import './App.css'
import './components/Bird/Bird.css';
import bird from './assets/flappy-bird.png'
import { collision, addToObstaclesData, removeFromObstacleData, hasBirdFallen } from './components/Obstacles/obstacleHelper'
import { getBirdPosition } from './components/Bird/birdHelper'
import { ObstacleData, ObstacleType } from './components/Obstacles/obstacleTypes'
import Obstacle from './components/Obstacles/Obstacles'

let shouldStartGame = true
let obstaclesData: ObstacleData[] = []
//bird 
const jumpDuration = 216.5
let currentJumpTime = jumpDuration
//obstacle 
const ObstacleInterval = 1100
let tiemSinceLastObstacle = ObstacleInterval
//
let animationFrameId: number;
let lastTime: null | number = null
//
let game: HTMLElement;

function App() {

  const [endGamePopup, setEndGamePopup] = useState(false)
  const birdRef = useRef<HTMLImageElement>(null)
  const topObstacleRef = useRef<HTMLImageElement>(null)
  const obstaclesRef1 = useRef<HTMLDivElement>(null)
  const obstaclesRef2 = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    addEventListeners()
  }, [])

  function addEventListeners() {
    game = document.getElementById('game')!
    game.addEventListener('click', handleJump)
    document.addEventListener('keydown', handleJump)
  }

  function handleJump(e: KeyboardEvent | MouseEvent) {
    if ('code' in e) { if (e.code !== "Space") return }
    currentJumpTime = 0;
    if (shouldStartGame) startGame();
  }

  function startGame() {
    shouldStartGame = false
    animationFrameId = requestAnimationFrame(updateGamePlay)
  }

  function updateGamePlay(time: number) {
    const lapse = getLapseTime(time)

    updateBirdPosition(lapse)
    if (!shouldStartGame) {
      let newObstaclesData: ObstacleData[] = []
      updateObstaclesPosition(lapse)!
      gamePlayLoop: for (let i = 0; i < obstaclesData.length; i++) {
        const collided = collision({ obstacleData: obstaclesData[i], bird: birdRef.current!, topObstacleRef })
        //if collided is true obstacleData.length will be 0 and then the else statement
        //will run below.
        if (typeof collided === 'boolean') {
          if (collided) { shouldStartGame = stopGame(); break gamePlayLoop; }
          //this section will only run if the user Passes an Obstacle.
          if (!collided) updateScore();
        }
        const didObstaclePositionReset = resetObstaclePosition(obstaclesData[i].obstacle)
        if (didObstaclePositionReset) {
          newObstaclesData = removeFromObstacleData(obstaclesData[i].obstacle, obstaclesData)
          obstaclesData = newObstaclesData
        }
      }
    } else {
      setEndGamePopup(true)
      const hasBirdFallen = endGameBirdFall()
      if (hasBirdFallen) return cancelAnimationFrame(animationFrameId)
    };
    animationFrameId = requestAnimationFrame(updateGamePlay)
  }

  function getLapseTime(time: number) {
    if (lastTime == null) lastTime = time
    const lapse = time - lastTime
    lastTime = time
    return lapse
  }

  function updateBirdPosition(delta: number) {
    const birdSpeed = 0.3 * delta
    const birtStyle = birdRef.current!.style
    const top = getBirdPosition(birdRef)
    if (currentJumpTime <= jumpDuration) {
      //move bird up
      birtStyle.top = `${top - birdSpeed}px`
    } else {
      //move bird down
      birtStyle.top = `${top + birdSpeed}px`
    }
    currentJumpTime += delta
  }

  function updateObstaclesPosition(delta: number) {
    if (tiemSinceLastObstacle >= ObstacleInterval) {
      generateObstacle()
    } else tiemSinceLastObstacle += 0.5 * delta;

    obstaclesData.forEach((obstacleData) => {
      const obstacleSpeed = 0.1 * delta
      const obstacleLeft = parseFloat(getComputedStyle(obstacleData.obstacle).left)
      obstacleData.obstacle.style.left = `${obstacleLeft - obstacleSpeed}px`
    })
    return obstaclesData
  }

  function generateObstacle() {
    const next = obstaclesData.some(obstacleData => obstacleData.obstacle === obstaclesRef1.current!)
    const newxtObstacleRef = next ? obstaclesRef2 : obstaclesRef1

    if (obstaclesData.length === 0 || obstaclesData.length == 1) tiemSinceLastObstacle = 0;
    if (obstaclesData.length === 1) addToObstaclesData(newxtObstacleRef, obstaclesData);
    //this will be true only once, when the game first starts
    if (obstaclesData.length === 0) addToObstaclesData(obstaclesRef1, obstaclesData);
  }

  function resetObstaclePosition(obstacle: ObstacleType) {
    const { left, width } = getComputedStyle(obstacle)
    const obstacleStyleLeft = parseFloat(left)
    const obstacleStyleWidth = parseFloat(width)

    if (obstacleStyleLeft < 0 &&
      Math.abs(obstacleStyleLeft) > obstacleStyleWidth) {
      obstacle.style.left = getObstacleDefaultLeftPosition()
      return true
    }
    return false
  }

  function stopGame() {
    document.removeEventListener('keydown', handleJump)
    game.removeEventListener('click', handleJump)
    currentJumpTime = jumpDuration
    updateBestScore()
    return true
  }

  function endGameBirdFall() {
    if (hasBirdFallen(birdRef.current!)) return true
    return false
  }

  function updateScore() {
    const score = parseInt(scoreRef.current!.innerText)
    scoreRef.current!.innerText = `${score + 1}`
  }

  function updateBestScore() {
    const score = parseInt(scoreRef.current!.innerText)
    const bestScore = JSON.parse(localStorage.getItem('score')!);
    if (bestScore === null) localStorage.setItem('score', JSON.stringify(score));
    if (bestScore < score) localStorage.setItem('score', JSON.stringify(score));
  }

  function handleRestartGame() {
    //stop the any existing amnimation
    cancelAnimationFrame(animationFrameId)
    //reset bird position
    birdRef.current!.style.top = getBirdDefaultTopPosition()
    //reset obstacles position
    const defalutLeftObstaclePosition = getObstacleDefaultLeftPosition()
    obstaclesRef1.current!.style.left = defalutLeftObstaclePosition
    obstaclesRef2.current!.style.left = defalutLeftObstaclePosition
    //tiemSinceLastObstacle
    tiemSinceLastObstacle = ObstacleInterval
    //
    lastTime = null
    //reset score
    scoreRef.current!.innerText = '0'
    //empty obstacleData array
    obstaclesData = []
    //start 
    shouldStartGame = true
    setEndGamePopup(false)
    addEventListeners()
  }

  function getObstacleDefaultLeftPosition() {
    return getComputedStyle(obstaclesRef1.current!).getPropertyValue('--defaultObstacleLeftPosition')!
  }

  function getBirdDefaultTopPosition() {
    return getComputedStyle(birdRef.current!).getPropertyValue('--defaultBirdTopPosition')!
  }

  return (
    <>
      <main>
        <p className='flappy-bird-text'>Flappy Bird</p>
        <div className="Game-container">
          <section id='game'>
            <p id='score' ref={scoreRef}>{endGamePopup ? '' : 0}</p>
            <div className='game-background-img '>
              <img ref={birdRef} id="bird" src={bird} alt="bird" />
              <Obstacle
                topObstacleRef={topObstacleRef}
                obstaclesRef={obstaclesRef1}
              />
              <Obstacle obstaclesRef={obstaclesRef2} />
            </div>
            <div className='game-forground-img'></div>
            {endGamePopup ? <div id='end-game-popup-container'>
              <div id='end-game-popup'>
                <div id='score-container'>
                  <p>Score</p>
                  <p>{scoreRef.current!.innerText}</p>
                  <p>Best Score</p>
                  <p>{localStorage.getItem('score')}</p>
                </div>
                <button id='restart-button' onClick={handleRestartGame}>Restart</button>
              </div>
            </div> : null}
          </section>
        </div>
      </main>
    </>
  );
}
export default App;
