import "./styles/GridProposito.css";
function GridProposito() {
  return (
    <section className="proposito" id="Proposito">
      <div className="proposito_element proposito_mainImage">
        <img src="images/proposito_main.webp" alt="main image" />
      </div>
      <div className="proposito_element proposito_title">
        <h2>PROPÓSITO</h2>
      </div>
      <div className="proposito_element proposito_text">
        <p>
          El propósito de Upgr4de Academy es nivelar el campo de juego educativo
          para los estudiantes bolivianos,{" "}
          <span>
            proporcionando un camino claro y efectivo hacia el dominio de las
            materias STEM.
          </span>
        </p>
      </div>
      <div className="proposito_element proposito_secondImage">
        <img src="images/proposito_second.webp" alt="second image" />
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
