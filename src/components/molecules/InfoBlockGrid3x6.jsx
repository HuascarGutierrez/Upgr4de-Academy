import React from 'react'
import { useRef } from 'react'
import VariableProximity from '../atoms/VariableProximity'
import './styles/InfoBlockGrid3x6.css'

function InfoBlockGrid3x6({title, text1, textetiqueta, text3, imageLarge, imageSmall, displayBuho= 1}) {
  const containerRef = useRef(null);
  return (
    <section className="grid" id='Mision'>
      <div className="grid_element grid_text">
          <img style={displayBuho? {display: 'block'}:{display: 'none'}} src="assets/zowl-white.svg" alt="" />
          <p>{text1}</p>
      </div>
      <div className="grid_element grid_ceo">
          <img className='grid-img' src={imageLarge} alt="" />
      </div>
      <div ref={containerRef} className="grid_element grid_title grid-yellow" style={{'position': 'relative'}}>
          {title}
      </div>
      <div className="grid_element grid_materias">
          {textetiqueta}
          {/**La plataforma cubre <span>álgebra, cálculo, física y química.</span> */}
      </div>
      <div className="grid_element grid_description">
          <p>{text3}</p>
      </div>
      <div className="grid_element grid_pet grid-yellow">
          <img className='grid-img' src={imageSmall} alt="" />
      </div>
  </section>
  )
}

export default InfoBlockGrid3x6