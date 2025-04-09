import './styles/GridVision.css'

function GridVision() {
  return (
    <section className="vision" id='Mision'>
        <div className="vision_element vision_title">
            <h2 className="title-h2">MISIÓN</h2>
        </div>
        <div className="vision_element vision_image">
            <img src="images/kid_study_2.webp" alt="" className="image-img" />
        </div>
        <div className="vision_element vision_description">
            <img className='description-image' src="assets/zowl-white.svg" alt="zowl" />
            <p>Empoderar a estudiantes de Bolivia para superar sus desafíos en materias STEM</p>
        </div>
        <div className="vision_element vision_description">
            <p>Proporcionando una educación en línea <span>accesible y de alta calidad</span> a través de la plataforma SAPI.</p>
        </div>
        <div className="vision_element vision_description">
            <p>Utilizando herramientas innovadoras y retroalimentación</p>
        </div>
    </section>
  )
}

export default GridVision