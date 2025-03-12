import './styles/SAPIHeader.css'
import CircularText from '../atoms/CircularText'
import { Navigate } from 'react-router-dom'

function SAPIHeader() {
    const navigate = Navigate
  return (
    <header className='SAPIHeader'>
        <div className='SAPIHeader_bg'>
            {/**<img src="images/SAPI_header.webp" alt="bg" /> */}
        </div>
        <div className='SAPIHeader_overlay'>
            <div className='SAPIHeader_circle'>  
                <CircularText
                    text="SI PUEDES SOÑARLO, PUEDES LOGRARLO... "
                    onHover="speedUp"
                    spinDuration={10}
                    className="circle-rotation"
                />
            </div>
            <div className='SAPIHeader_contenido'>
                <p>No pares de estudiar</p>
                <h2>AYUDANOS A<br /> CUMPLIR TUS <span>METAS</span></h2>
                <a href='./main'>INGRESA A SAPI</a>
            </div>
            <img src="images/veloz_buho.webp" alt="veloz" />
        </div>
    </header>
)
}

export default SAPIHeader