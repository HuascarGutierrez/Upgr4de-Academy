import './styles/GridVision.css'

function GridVision() {
  return (
    <section className="vision" id='Vision'>
        <div className="vision_element vision_title">
            <h2 className="title-h2">VISIÓN</h2>
        </div>
        <div className="vision_element vision_image">
            <img src="images/kid_study_3.webp" alt="" className="image-img" />
        </div>
        <div className="vision_element vision_description">
            <img className='description-image' src="assets/zowl-white.svg" alt="zowl" />
            <p>Ser la plataforma líder en educación en línea en Bolivia.</p>
        </div>
        <div className="vision_element vision_description">
            <p>Reconocida por su excelencia en el <span>reforzamiento de materias STEM.</span></p>
        </div>
        <div className="vision_element vision_description">
            <p>Aspiramos a crear una comunidad de aprendizaje inclusiva y dinámica, donde cada estudiante tenga <span>la oportunidad de alcanzar su máximo potencial.</span></p>
        </div>
    </section>
  )
}

export default GridVision