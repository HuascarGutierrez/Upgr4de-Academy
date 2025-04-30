import { useLocation } from "react-router-dom";

function MenuPrincipal({exercises, cambiarSeccion, cambiarTituloEjercicio, cambiarExerciseByUnitId, progreso }) {


  return (
    <div className="menu-container">
      <h2 className="menu-title">Módulos de Ejercicios</h2>
      
      <div className="modulos-grid">
      {
      exercises.length > 0 ?
      exercises.map((exercise) => (
          <div 
            key={exercise.id}
            className="modulo-card"
            onClick={() => {cambiarSeccion('ejercicio'); cambiarTituloEjercicio(exercise.title); cambiarExerciseByUnitId(exercise.id);}}
          >
            <div className="modulo-content">
              <div className="modulo-header">
                <div className="modulo-icono">{'🔢'}</div>
                <h3 className="modulo-titulo">{exercise?.title}</h3>
              </div>
              <p className="modulo-descripcion">{exercise?.description}</p>
              
              <div className="barra-progreso-container">
                <div 
                  className="barra-progreso"
                  style={{ width: `${0}%` }}
                ></div>
              </div>
              <div className="progreso-texto">
                {0}% Completado
              </div>
            </div>
          </div>
        )) : <h2 className='noExercises'>Sin Ejercicios por el momento.</h2>}
      </div>
    </div>
  );
}

export default MenuPrincipal;