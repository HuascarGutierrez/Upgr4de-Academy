import "./styles/SAPIIngreso.css";
import { useNavigate } from "react-router-dom";

function SAPIIngreso({ user }) {
    const navigate = useNavigate();

    const handleIngreso = () => {
        user ? 
        navigate('/main/courses'):
        navigate('/iniciodesesion')
    }

  return (
    <>
      <h2 className="SAPIIngreso_title">SAPI</h2>
      <section className="SAPIIngreso_container">
        <div className="SAPIIngreso_img">
            <img src="/images/sapi-pet.webp" alt="sapi pet" />
        </div>
        <div className="SAPIIngreso_description">
          <h3>Sistema de Aprendizaje Práctica e Inteligente</h3>
          <p>
            SAPI es una plataforma educativa orientada a brindar cursos para las
            materias de álgebra, cálculo física y química. Con el fin de
            reforzar los conocimientos de los estudiantes.
          </p>
          <a onClick={handleIngreso}>Ingresa a SAPI</a>
        </div>
      </section>
    </>
  );
}

export default SAPIIngreso;
