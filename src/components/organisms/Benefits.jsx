import './styles/Benefits.css'

import ListColumn from "../molecules/ListColumn"

function Benefits() {
    const title = 'Beneficios de Upgr4de Academy'
    const list = [ 'Clases pregrabadas disponibles mediante la plataforma SAPI',
        'Disponible desde cualquier lugar con conexión a internet.',
        'Diseñado para estudiantes con dificultades en estas materias.'
    ]
  return (
      <section className="benefits">
        <img src="images/benefits-girl.webp" alt="" className="benefits_img" />
        <div className="benefits_container">
            <ListColumn title={title} list={list}/>
        </div>
    </section>
  )
}

export default Benefits