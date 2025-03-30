import './styles/Benefits.css'

function Benefits() {
    /**const title = 'Beneficios de Upgr4de Academy'
    const list = [ 'Clases pregrabadas disponibles mediante la plataforma SAPI',
        'Disponible desde cualquier lugar con conexión a internet.',
        'Diseñado para estudiantes con dificultades en estas materias.'
    ] */
  return (
      <section className="benefits" id='Beneficios'>
        <div className='benefits_title'>
          <h2 className='title-text'>Beneficios de Upgr4de academy</h2>
        </div>
        <div className='benefits_text'><p>Clases pregrabadas disponibles mediante la plataforma SAPI.</p></div>
        <div className='benefits_text'><p>Disponible desde cualquier lugar con conexión a internet.</p></div>
        <div className='benefits_text'><p>Diseñado para estudiantes con dificultades en materias STEM.</p></div>
      </section>
  )
}

export default Benefits