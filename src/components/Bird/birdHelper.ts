export const getBirdPosition = (birdRef: React.RefObject<HTMLDivElement>) => {
    const top = parseFloat(getComputedStyle(birdRef.current!).top)
    return top
}
