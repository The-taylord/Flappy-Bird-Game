const BidrSpeed = 0.2
export function MoveBirdUP(birdRef: React.RefObject<HTMLDivElement>, delta: number) {
    const top = getBirdPosition(birdRef)
    birdRef.current!.style.top = `${top - BidrSpeed * delta}px`
}

export function moveBirdDown(birdRef: React.RefObject<HTMLDivElement>, delta: number) {
    const top = getBirdPosition(birdRef)
    birdRef.current!.style.top = `${top + BidrSpeed * delta}px`
}

const getBirdPosition = (birdRef: React.RefObject<HTMLDivElement>) => {
    const top = parseFloat(getComputedStyle(birdRef.current!).top)
    return top
}
