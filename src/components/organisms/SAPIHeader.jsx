import './styles/SAPIHeader.css'
import CircularText from '../atoms/CircularText'
function SAPIHeader() {
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
                <h2>AYUDANOS A CUMPLIR TUS METAS</h2>
                <a href="#SAPIMain">EXPLORA EL LUGAR</a>
            </div>
        </div>
    </header>
)
}

export default SAPIHeader