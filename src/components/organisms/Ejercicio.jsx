import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from '../../config/app';

function Ejercicio({exerciseByUnitId, titulo, nivel, cambiarSeccion, actualizarPuntuacion, actualizarProgreso }) {
  const [ejercicioActual, setEjercicioActual] = useState(0);
  const [respuestaUsuario, setRespuestaUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estadoRespuesta, setEstadoRespuesta] = useState(null); // 'correcto', 'incorrecto', null
  const [mostrarHint, setMostrarHint] = useState(false);
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState(0);

  const verificarRespuesta = () => {
    setMostrarHint(false);
    if (respuestaUsuario === ejercicios[ejercicioActual].answer) {
      setMensaje("¡Correcto! Muy bien.");
      setEstadoRespuesta('correcto');
      actualizarPuntuacion(10);
      
      // Esperar un momento y avanzar al siguiente ejercicio
      setTimeout(() => {
        if (ejercicioActual < ejercicios.length - 1) {
          setEjercicioActual(ejercicioActual + 1);
          setEjerciciosCompletados(prev => prev + 1);
          setRespuestaUsuario('');
          setMensaje('');
          setEstadoRespuesta(null);
          
          // Actualizar el porcentaje de progreso
          const nuevoProgreso = Math.round((ejerciciosCompletados + 1) / ejercicios.length * 100);
          actualizarProgreso(nuevoProgreso);
        } else {
          setMensaje("¡Has completado todos los ejercicios de este nivel!");
          actualizarProgreso(100);
        }
      }, 1500);
    } else {
      setMensaje("Respuesta incorrecta. Intenta de nuevo.");
      setEstadoRespuesta('incorrecto');
    }
  };

  const mostrarAyuda = () => {
    setMostrarHint(true);
  };

  const [ejercicios, setEjercicios] = useState([]);
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const q = query(
          collection(db, "exercises"),
          where("exerciseByUnitId", "==", exerciseByUnitId),
          orderBy("number", "asc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEjercicios(data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    if (exerciseByUnitId) {
      fetchExercises();
    }
  }, [exerciseByUnitId]);

  return (
    <div className="ejercicios-container ecuaciones-lineales">
      <div className="ejercicios-header">
        <h2 className="ejercicios-titulo">{titulo}</h2>
        <div className="ejercicios-contador">Ejercicio {ejercicioActual + 1} de {ejercicios.length}</div>
      </div>
      
      <div className="enunciado-container">
        <p className="enunciado-texto">{ejercicios[ejercicioActual]?.description}</p>
      </div>
      
      <div className="respuesta-container">
        <label className="respuesta-label">Tu respuesta:</label>
        <div className="respuesta-input-container">
          <input
            type="text"
            value={respuestaUsuario}
            onChange={(e) => setRespuestaUsuario(e.target.value)}
            className="respuesta-input"
            placeholder="Ingresa tu respuesta"
          />
          <button
            onClick={verificarRespuesta}
            className="verificar-button"
          >
            Verificar
          </button>
        </div>
      </div>
      
      {mensaje && (
        <div 
          className={`mensaje-container ${
            estadoRespuesta === 'correcto' ? 'mensaje-correcto' : 'mensaje-incorrecto'
          }`}
        >
          {mensaje}
        </div>
      )}
      
      {estadoRespuesta === 'incorrecto' && (
        <div className="hint-container">
          <button
            onClick={mostrarAyuda}
            className="hint-button"
          >
            ¿Necesitas una pista?
          </button>
          
          {mostrarHint && (
            <div className="hint-text">
              <strong>Pista:</strong> {ejercicios[ejercicioActual].hint}
            </div>
          )}
        </div>
      )}
      
      <div className="ejercicios-footer">
        <button
          onClick={() => cambiarSeccion('menu')}
          className="volver-button"
        >
          Volver al menú
        </button>
        
        <div className="progreso-container">
          <span className="progreso-label">Progreso:</span>
          <div className="barra-progreso-pequeña-container">
            <div 
              className="barra-progreso-pequeña"
              style={{ width: `${Math.round(ejerciciosCompletados / ejercicios.length * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ejercicio;