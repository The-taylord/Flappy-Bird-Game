import { ObstacleData, ObstacleType } from '../obstacleTypes'

export function pushToObstaclesData(
    obstacle: React.RefObject<HTMLDivElement>, 
    obstaclesData: ObstacleData[]) {
    const obstacleElement = obstacle.current!
    const maxRange = -100, minRange = -170
    const obstaclePosiotion = generateRandoNumber(maxRange, minRange)
    obstacleElement.style.top = `${obstaclePosiotion}px`

    obstaclesData.push({ obstacle: obstacleElement, obstaclePosiotion, collided: null })
}

export const generateRandoNumber = (maxRange: number, minRange: number) => {
    const randomValue = Math.floor(Math.random() * (maxRange - minRange) + minRange)
    return randomValue
}

export function removeFromObstacleData(obstacles: ObstacleType, obstaclesData: ObstacleData[]) {
    const newObstaclesData = obstaclesData.filter(obstacleData => {
        if (!(obstacleData.obstacle === obstacles))
            return obstacleData
    })
    return newObstaclesData
}
