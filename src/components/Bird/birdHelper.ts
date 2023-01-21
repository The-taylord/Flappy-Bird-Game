// export function MoveBirdUP(birdRef: React.RefObject<HTMLDivElement>, birdSpeed: number) {
//     const top = getBirdPosition(birdRef)
//     birdRef.current!.style.top = `${top - birdSpeed}px`
// }

// export function moveBirdDown(birdRef: React.RefObject<HTMLDivElement>, birdSpeed: number) {
//     const top = getBirdPosition(birdRef)
//     birdRef.current!.style.top = `${top + birdSpeed}px`
// }

export const getBirdPosition = (birdRef: React.RefObject<HTMLDivElement>) => {
    const top = parseFloat(getComputedStyle(birdRef.current!).top)
    return top
}
