import './styles/AboutSapi.css'
import { useRef } from 'react'
import VariableProximity from '../atoms/VariableProximity'

function AboutSapi() {
    const containerRef = useRef(null);
  return (
    <section className="sapi_grid">
        <div className="sapi_element sapi_text">
            <img src="assets/zowl-white.svg" alt="" />
            <p>Diseñada para reforzar los conocimientos de los estudianetes.</p>
        </div>
        <div className="sapi_element sapi_ceo">
            <img className='sapi-img' src="images/ivan-ceo.webp" alt="" />
        </div>
        <div ref={containerRef} className="sapi_element sapi_title sapi-yellow" style={{'position': 'relative'}}>
            <VariableProximity
                label={'PLATAFORMA EDUCATIVA (SAPI)'}
                className={'variable-proximity-demo'}
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={containerRef}
                radius={100}
                falloff='linear'
            />
        </div>
        <div className="sapi_element sapi_materias">
            <p>La plataforma cubre <span>álgebra, cálculo, física y química.</span></p>
        </div>
        <div className="sapi_element sapi_description">
            <p>Cada materia se divide en unidades.</p>
        </div>
        <div className="sapi_element sapi_pet sapi-yellow">
            <img className='sapi-img' src="images/sapi-pet.webp" alt="" />
        </div>
    </section>
  )
}

export default AboutSapi