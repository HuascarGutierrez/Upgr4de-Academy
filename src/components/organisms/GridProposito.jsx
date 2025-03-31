import "./styles/GridProposito.css";
function GridProposito() {
  return (
    <section className="proposito">
      <div className="proposito_element proposito_mainImage">
        <img src="images/proposito_main.webp" alt="main image" />
      </div>
      <div className="proposito_element proposito_title">
        <h2>PROPÓSITO</h2>
      </div>
      <div className="proposito_element proposito_text">
        <p>
          El propósito de Upgr4de Academy es nivelar el campo de juego educativo para los estudiantes bolivianos,proporcionando un camino claro y efectivo hacia el dominio de las materias STEM.
        </p>
      </div>
      <div className="proposito_element proposito_text">
        <p>
          Buscamos desmitificar estos temas, haciendo que
          <span> el aprendizaje sea accesible, atractivo y empoderador.</span>
        </p>
      </div>
      <div className="proposito_element proposito_text">
        <p>
          <span>A través de nuestra plataforma SAPI</span>, nos esforzamos por
          construir una base sólida de conocimientos que permita a los
          estudiantes alcanzar sus metas académicas y profesionales
        </p>
      </div>
    </section>
  );
}

export default GridProposito;
