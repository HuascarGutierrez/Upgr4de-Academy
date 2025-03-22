import './styles/SAPIHeader.css'
import CircularText from '../atoms/CircularText'

function SAPIHeader() {
    {/**
    const navigate = useNavigate()
    const handleIngresa = () => {
        user?
        navigate('/main/courses'):
        handleErrorNoti({title: 'Alto', texto:'Primero debes iniciar sesión'})
    } */}

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
                {/**<a onClick={handleIngresa}>INGRESAR  A  SAPI</a> */}
            </div>
            <img src="images/veloz_buho.webp" alt="veloz" />
        </div>
    </header>
)
}

export default SAPIHeader