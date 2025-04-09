import './styles/QuienesSomos.css'
function QuienesSomos() {
  return (
    <section className='gridSomos'>
        <div className='gridSomos_element gridSomos_logo_name'>
            <img className='gridSomos_logo' src="/assets/zowl-white.svg" alt="" />
            <h1 className='gridSomos_name'>Upgr4de Academy</h1>
        </div>
        <div className='gridSomos_element gridSomos_img'>
            <img src="/images/quienes_somos_image.webp" alt="quienes somos image" />
        </div>
        <div className='gridSomos_element gridSomos_title'>
            <h2>QUIENES SOMOS</h2>
        </div>
        <div className='gridSomos_element gridSomos_text'>
            <p>Estamos enfocados en ayudar a estudiantes <span className='text-span'>con dificultades en materias STEM</span></p>
        </div>
        <div className='gridSomos_element gridSomos_text'>
            <p>Proporcionando un refuerzo académico estructurado a través de la <span className='text-span'>plataforma virtual SAPI</span>.</p>
        </div>
    </section>
  )
}

export default QuienesSomos