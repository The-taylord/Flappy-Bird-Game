import { useRef, useEffect, useState } from 'react';
import './App.css'
import './components/Bird/Bird.css';
import bird from './assets/flappy-bird.png'
import { collision, addToObstaclesData } from './components/Obstacles/obstacleHelper'
import { MoveBirdUP, moveBirdDown } from './components/Bird/birdHelper'
import { ObstacleData, Obstacles } from './components/Obstacles/obstacleTypes'
import Obstacle from './components/Obstacles/Obstacles'

let shouldStartGame = true
let obstaclesData: ObstacleData[] = []
//bird var
const jumpDuration = 245
let currentJumpTime = jumpDuration
//obstacle var
const ObstacleInterval = 870
let tiemSinceLastObstacle = ObstacleInterval
//others
let animationFrameId: number;
let lastTime: null | number = null
let sectionEle: HTMLElement;

function App() {

  const [endGamePopup, setEndGamePopup] = useState(false)
  const birdRef = useRef<HTMLDivElement>(null)
  const topObstacleRef = useRef<HTMLImageElement>(null)
  const obstaclesRef1 = useRef<HTMLDivElement>(null)
  const obstaclesRef2 = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    addEventListeners()
  }, [])

  function addEventListeners() {
    document.addEventListener('keydown', handleJump)
    sectionEle = document.querySelector('section')!
    sectionEle.addEventListener('click', handleJump)
  }

  function handleJump(e: KeyboardEvent | MouseEvent) {
    if ('code' in e) { if (e.code !== "Space") return }
    currentJumpTime = 0

    if (shouldStartGame) startGame();
  }

  function startGame() {
    shouldStartGame = false
    animationFrameId = requestAnimationFrame(updateGamePlay)
  }

  function updateGamePlay(time: number) {
    if (lastTime == null) lastTime = time
    const delta = time - lastTime
    lastTime = time

    updateBirdPosition(delta)
    if (!shouldStartGame) {
      let newObstaclesData: ObstacleData[] = []
      updateObstaclesPosition(delta)!
      LoopLable: for (let i = 0; i < obstaclesData.length; i++) {
        const collided = collision(obstaclesData[i], birdRef, topObstacleRef)
        //if didCollided is true obstacleData.length will be 0 and then the else statement
        //will run below.
        if (typeof collided === 'boolean') {
          if (collided) { shouldStartGame = stopGame(); break LoopLable; }
          //this section will only run if the user Passes an Obstacle.
          console.log(collided)
          if (!collided) updateScore();
        }

        const didObstaclePositionReset = resetObstaclePosition(obstaclesData[i].obstacles)
        if (didObstaclePositionReset) {
          newObstaclesData = removeFromObstacleData(obstaclesData[i].obstacles, obstaclesData)
          obstaclesData = newObstaclesData
        }
      }
    } else {
      const hasBirdFallen = birdFall()
      if (hasBirdFallen) { setEndGamePopup(true); return cancelAnimationFrame(animationFrameId) }
    };
    animationFrameId = requestAnimationFrame(updateGamePlay)
  }

  function updateBirdPosition(delta: number) {
    if (currentJumpTime <= jumpDuration) {
      MoveBirdUP(birdRef, delta)
    } else { moveBirdDown(birdRef, delta) }
    currentJumpTime += delta
  }

  function updateObstaclesPosition(delta: number) {
    if (tiemSinceLastObstacle >= ObstacleInterval) {
      generateObstacles()
    } else tiemSinceLastObstacle += 0.3 * delta;

    obstaclesData.forEach((obstacleData) => {
      const obstacleStyle = getComputedStyle(obstacleData.obstacles.current!)
      const obstacleLeft = parseFloat(obstacleStyle.left)
      obstacleData.obstacles.current!.style.left = `${obstacleLeft - 0.1 * delta}px`
    })
    return obstaclesData
  }

  function generateObstacles() {
    const next = obstaclesData.some(obstacleData => obstacleData.obstacles === obstaclesRef1)
    const newxtObstacleRef = next ? obstaclesRef2 : obstaclesRef1

    if (obstaclesData.length === 1) addToObstaclesData(newxtObstacleRef, obstaclesData);
    if (obstaclesData.length === 0) addToObstaclesData(obstaclesRef1, obstaclesData);
    tiemSinceLastObstacle = 0
  }

  function stopGame() {
    document.removeEventListener('keydown', handleJump)
    sectionEle.removeEventListener('click', handleJump)
    obstaclesData = []
    updateBestScore()
    return true
  }

  function updateBestScore() {
    const score = parseInt(scoreRef.current!.innerText)
    const bestScore = JSON.parse(localStorage.getItem('score')!);
    if (bestScore === null) localStorage.setItem('score', JSON.stringify(score));
    if (bestScore < score) localStorage.setItem('score', JSON.stringify(score));
  }

  function updateScore() {
    const score = parseInt(scoreRef.current!.innerText)
    scoreRef.current!.innerText = `${score + 1}`
  }

  function resetObstaclePosition(obstacles: Obstacles) {
    const { left, width: obstacleStyleWidth } = getComputedStyle(obstacles.current!)
    const obstacleStyleLeft = parseFloat(left)
    if (obstacleStyleLeft < 0 && Math.abs(obstacleStyleLeft) > parseFloat(obstacleStyleWidth)) {
      obstacles.current!.style.left = '500px'
      return true
    }
    return false
  }

  function removeFromObstacleData(obstacles: Obstacles, obstaclesData: ObstacleData[]) {
    const newObstaclesData = obstaclesData.filter(obstacleData => {
      if (!(obstacleData.obstacles === obstacles))
        return obstacleData
    })
    return newObstaclesData
  }

  function birdFall() {
    const birdStyle = getComputedStyle(birdRef.current!)
    if (Math.abs(parseFloat(birdStyle.bottom)) <= 91) return true;
    return false
  }

  function handleRestartGame() {
    // reset bird position
    birdRef.current!.style.top = '370px'
    // reset obstacles position
    obstaclesRef1.current!.style.left = '500px'
    obstaclesRef2.current!.style.left = '500px'
    //tiemSinceLastObstacle
    tiemSinceLastObstacle = ObstacleInterval
    lastTime = null
    // start updateGamePlay
    scoreRef.current!.innerText = '0'
    shouldStartGame = true
    setEndGamePopup(false)
    addEventListeners()
  }

  return (
    <>
      <div className="Game-container">
        <section>
          <p id='score' ref={scoreRef}>{endGamePopup ? '' : 0}</p>
          <div className='game-background-img '>
            <div ref={birdRef} id="bird" >
              <img src={bird} alt="bird" />
            </div>
            <Obstacle
              topObstacleRef={topObstacleRef}
              obstaclesRef={obstaclesRef1}
            />
            <Obstacle obstaclesRef={obstaclesRef2} />
          </div>
          <div className='game-forground-img'></div>
        </section>

      </div>{
        endGamePopup ? <div id='end-game-popup-container'>
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
    </>
  );
}
export default App;
