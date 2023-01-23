import { ObstacleData, ObstacleType } from './obstacleTypes'
interface CollisionAttr {
    obstacleData: ObstacleData
    bird: HTMLDivElement
    topObstacleRef: React.RefObject<HTMLImageElement>
}

interface isBirdBetweenGapAttr {
    obstacleData: ObstacleData
    topObstacleStyle: CSSStyleDeclaration
    birdStyle: CSSStyleDeclaration
}

export function collision({ obstacleData, bird, topObstacleRef }: CollisionAttr) {

    const topObstacleStyle = getComputedStyle(topObstacleRef.current!)
    const birdStyle = getComputedStyle(bird)
    const obstacleStyle = getComputedStyle(obstacleData.obstacle)

    const obstacleWidth = parseFloat(obstacleStyle.width)
    const obstacleLeft = parseFloat(obstacleStyle.left)
    const birdWidth = parseFloat(birdStyle.width)
    const birdLeft = parseFloat(birdStyle.left)

    if (obstacleLeft <= birdLeft + birdWidth && obstacleLeft >= birdLeft - obstacleWidth) {

        if (!isBirdBetweenGap({ obstacleData, topObstacleStyle, birdStyle })) return true
        else { if (obstacleData.collided === null) return obstacleData.collided = false }
    }
    // collided with the floor
    return hasBirdFallen(bird)
}

export function hasBirdFallen(bird: HTMLDivElement) {
    const backgroundImgHeight = 530
    const birdStyle = getComputedStyle(bird)
    const birdHeight = parseFloat(birdStyle.height)
    const birdTop = parseFloat(birdStyle.top)
    if (birdTop >= backgroundImgHeight - birdHeight) return true;
}

function isBirdBetweenGap({ obstacleData, topObstacleStyle, birdStyle }: isBirdBetweenGapAttr) {

    const obstacleGap = Number(getComputedStyle(obstacleData.obstacle).getPropertyValue('--obstacleGap'))
    const obstacleHeight = parseFloat(topObstacleStyle.height)

    const birdTop = parseFloat(birdStyle.top)
    const birdHeight = parseFloat(birdStyle.height)

    const rangeStart = obstacleHeight + obstacleData.obstaclePosiotion
    const rangeEnd = rangeStart + obstacleGap - birdHeight

    if (birdTop > rangeStart && birdTop < rangeEnd) return true
    else return false
}

export function addToObstaclesData(obstacle: React.RefObject<HTMLDivElement>, obstaclesData: ObstacleData[]) {
    const obstacleElement = obstacle.current!
    const obstaclePosiotion = randomizeObstaclesPostion(obstacleElement)
    obstaclesData.push({ obstacle: obstacleElement, obstaclePosiotion, collided: null })
}

export function randomizeObstaclesPostion(obstacle: ObstacleType) {
    const obstaclePosiotion = generateRandoNumber(1, -170)
    obstacle.style.top = `${obstaclePosiotion}px`
    return obstaclePosiotion
}

const generateRandoNumber = (max: number, min: number) => {
    const randomValue = Math.floor(Math.random() * (max - min) + min)
    return randomValue
}

export function removeFromObstacleData(obstacles: ObstacleType, obstaclesData: ObstacleData[]) {
    const newObstaclesData = obstaclesData.filter(obstacleData => {
        if (!(obstacleData.obstacle === obstacles))
            return obstacleData
    })
    return newObstaclesData
}
