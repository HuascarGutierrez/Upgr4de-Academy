import './styles/AboutSapi.css'
function AboutSapi() {
  return (
    <section className="sapi_grid">
        <div className="sapi_element sapi_text">
            <img src="assets/zowl-white.svg" alt="" />
            <p>Diseñada para reforzar los conocimientos de los estudianetes.</p>
        </div>
        <div className="sapi_element sapi_ceo">
            <img className='sapi-img' src="images/ivan-ceo.webp" alt="" />
        </div>
        <div className="sapi_element sapi_title">
            <h2>PLATAFORMA EDUCATIVA (SAPI)</h2>
        </div>
        <div className="sapi_element sapi_materias">
            <p>La plataforma cubre <span>álgebra, cálculo, física y química.</span></p>
        </div>
        <div className="sapi_element sapi_description">
            <p>Cada materia se divide en unidades.</p>
        </div>
        <div className="sapi_element sapi_pet">
            <img className='sapi-img' src="images/sapi-pet.webp" alt="" />
        </div>
    </section>
  )
}

export default AboutSapi