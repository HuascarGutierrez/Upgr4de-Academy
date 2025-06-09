import "./styles/SAPIHeader.css";
import CircularText from "../atoms/CircularText";
import { useNavigate } from "react-router-dom";

function SAPIHeader({ user }) {
    const navigate = useNavigate();

    const handleIngreso = () => {
        user ? navigate("/main/courses") : navigate("/iniciodesesion");
    };

    return (
        <header className="SAPIHeader">
            <div className="SAPIHeader_bg">
                {/* <img src="images/SAPI_header.webp" alt="bg" /> */}
            </div>
            <div className="SAPIHeader_overlay">
                <div className="SAPIHeader_circle">
                    <CircularText
                        text="FÍSICA - ÁLGEBRA - CÁLCULO - QUÍMICA - "
                        onHover="speedUp"
                        spinDuration={10}
                        className="circle-rotation"
                    />
                </div>
                <div className="SAPIHeader_contenido">
                    <p>SAPI</p>
                    <h3>Solución de Aprendizaje Práctica e Inteligente</h3>
                    <h2>SAPI es una plataforma educativa orientada a brindar cursos para </h2>
                    <h2>las materias de álgebra, cálculo física y química. Con el fin de</h2>
                    <h2>reforzar los conocimientos de los estudiantes.</h2>
                    <a onClick={handleIngreso}>INGRESAR A SAPI</a>
                </div>
                <img src="images/veloz_buho.webp" alt="veloz" />
            </div>
        </header>
    );
}

export default SAPIHeader;
