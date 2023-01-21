import { ObstacleData, Obstacles } from './obstacleTypes'

export function collision(
    obstacleData: ObstacleData,
    birdRef: React.RefObject<HTMLDivElement>,
    topObstacleRef: React.RefObject<HTMLImageElement>) {

    const topObstacleStyle = getComputedStyle(topObstacleRef.current!)
    const birdStyle = getComputedStyle(birdRef.current!)
    const obstacleStyle = getComputedStyle(obstacleData.obstacles.current!)
    const obstacleWidth = parseFloat(obstacleStyle.width)
    //parseFloat(obstacleStyle.left) <= Math.abs(parseFloat(birdStyle.right) + 23
    //collided with the obstacles
    if (parseFloat(obstacleStyle.left) <= parseFloat(birdStyle.left)+ parseFloat(birdStyle.width) &&
        parseFloat(obstacleStyle.left) >= parseFloat(birdStyle.left) - obstacleWidth) {
        console.log('hey')
        //fail
        const isInRange = isBirdInRange(obstacleData, topObstacleStyle, birdStyle)
        if (!isInRange) return true
        else {
            if (obstacleData.collided === null) {
                obstacleData.collided = false
                return obstacleData.collided
            }
        }
    }
    // collided with the floor
    if (Math.abs(parseFloat(birdStyle.bottom)) <= 91) return true;
}

function isBirdInRange(
    obstacleData: ObstacleData,
    topObstacleStyle: CSSStyleDeclaration,
    birdStyle: CSSStyleDeclaration) {

    const obstacleGap = Number(getComputedStyle(obstacleData.obstacles.current!).getPropertyValue('--obstacleGap'))
    const obstacleHeight= parseFloat(topObstacleStyle.height)

    const rangeStart = obstacleHeight + obstacleData.obstaclePosiotion 
    const rangeEnd = (rangeStart + obstacleGap) - (parseFloat(birdStyle.height))

    if (parseFloat(birdStyle.top) > rangeStart &&
        parseFloat(birdStyle.top) < rangeEnd) {
        return true
    } else return false
}

export function addToObstaclesData(obstacles: Obstacles, obstaclesData: ObstacleData[]) {
    const obstaclePosiotion = randomizeObstaclesPostion(obstacles)
    obstaclesData.push({ obstacles, obstaclePosiotion, collided: null })
}

export function randomizeObstaclesPostion(obstacles: Obstacles) {
    const obstaclePosiotion = generateRandoNumber(1, -170)
    obstacles.current!.style.top = `${obstaclePosiotion}px`
    return obstaclePosiotion
}

const generateRandoNumber = (max: number, min: number) => {
    const randomValue = Math.floor(Math.random() * (max - min) + min)
    return randomValue
}
