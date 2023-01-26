import './Obstacles.css'
import ObstacleImage from '../../assets/flappybird-pipe.png'

interface Props {
    obstaclesRef: React.RefObject<HTMLDivElement>
    topObstacleRef?: React.RefObject<HTMLImageElement>
}

const Obstacle: React.FC<Props> = ({ obstaclesRef, topObstacleRef }) => {
    return (
        <>
            <div
                ref={obstaclesRef}
                className="obstacle-container">
                <img
                    ref={topObstacleRef}
                    className='obstacle obstacle-top' src={ObstacleImage} alt="obstacle" />
                <img className='obstacle obstacle-bottom' src={ObstacleImage} alt="obstacle" />
            </div>
        </>
    )
}

export default Obstacle
