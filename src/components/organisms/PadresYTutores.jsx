import "./styles/PadresYTutores.css";

function PadresYTutores() {
    /**const title = 'Beneficios de Upgr4de Academy'
      const list = [ 'Clases pregrabadas disponibles mediante la plataforma SAPI',
          'Disponible desde cualquier lugar con conexión a internet.',
          'Diseñado para estudiantes con dificultades en estas materias.'
      ] */
    return (
        <section className="benefits">
            <div className="benefits_title">
                <h2 className="title-text">Para Padres y Tutores</h2>
            </div>
            <div className="benefits_text">
                <p>
                    Recibe reportes detallados del avance de tu hijo y celebra sus logros
                    junto a él.
                </p>
            </div>
            <div className="benefits_text">
                <p>
                    Planes flexibles y precios ajustados para que la educación de calidad
                    no sea una ilusión.
                </p>
            </div>
            <div className="benefits_text">
                <p>
                    Que tu hijo desarrolle habilidades STEM críticas para carreras
                    universitarias y profesionales en auge.
                </p>
            </div>

        </section>
    );
}

export default PadresYTutores;
/* <div className="padres-tutores-image-container">
                    <img 
                        src="images/PadresYTutores.webp" 
                        alt="Padres y Tutores" 
                        className="padres-tutores-image" 
                    />
                </div>
*/