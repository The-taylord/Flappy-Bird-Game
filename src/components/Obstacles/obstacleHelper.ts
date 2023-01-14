import './Obstacles.css'
import { ObstacleData, Obstacles } from './obstacleTypes'

export function collision(
    obstacles: Obstacles,
    obstaclePosiotion: number,
    birdRef: React.RefObject<HTMLDivElement>,
    topObstacleRef: React.RefObject<HTMLImageElement>) {

    const topObstacleStyle = getComputedStyle(topObstacleRef.current!)
    const birdStyle = getComputedStyle(birdRef.current!)
    const obstacleStyle = getComputedStyle(obstacles.current!)
    const obstacleWidth = parseFloat(obstacleStyle.width)
    let collided = true
    //collided with the obstacles
    if (
        parseFloat(obstacleStyle.left) <= Math.abs(parseFloat(birdStyle.right) + 23) &&
        parseFloat(obstacleStyle.left) >= parseFloat(birdStyle.left) - obstacleWidth
    ) {
        const obstacleGap = Number(getComputedStyle(obstacles.current!).getPropertyValue('--obstacleGap'))
        const obstacleLength = parseFloat(topObstacleStyle.height)

        const rangeStart = obstacleLength + obstaclePosiotion + 7
        const rangeEnd = (rangeStart + obstacleGap) - (parseFloat(birdStyle.height))

        if (!(parseFloat(birdStyle.top) > rangeStart && parseFloat(birdStyle.top) < rangeEnd)) {
            console.log('fail: ', collided)
            return collided
        } else {
            // console.log('pass: ', !collided)
            // return !collided
        }
    }
    // collided with the floor
    if (Math.abs(parseFloat(birdStyle.bottom)) <= 91) return collided;

    return !collided
}

export function addToObstaclesData(obstacles: Obstacles, obstaclesData: ObstacleData[]) {
    const obstaclePosiotion = randomizeObstaclesPostion(obstacles)
    obstaclesData.push({ obstacles, obstaclePosiotion })
}

export function randomizeObstaclesPostion(obstacles: Obstacles) {
    const obstaclePosiotion = generateRandoNumber(15, -170)
    obstacles.current!.style.top = `${obstaclePosiotion}px`
    return obstaclePosiotion
}

const generateRandoNumber = (max: number, min: number) => {
    const randomValue = Math.floor(Math.random() * (max - min) + min)
    return randomValue
}
