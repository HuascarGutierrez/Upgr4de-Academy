import { useState, useEffect } from "react";
import { collection, getDocs, setDoc, doc, query, where, orderBy } from "firebase/firestore";
import { db } from '../../config/app';
import { useLocation } from "react-router-dom";

function MenuPrincipal({user, unitId, exercises, cambiarSeccion, cambiarTituloEjercicio, cambiarExerciseByUnitId, progreso }) {

    const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const q = query(
          collection(db, "progress"),
          where("userId", "==", user.uid),
          where("unitId", "==", unitId),
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProgressData(results);
        console.log("Progreso:", results);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    if (user.uid && unitId) {
      fetchProgress();
    }
  }, [user.uid, unitId]);

  return (
    <div className="menu-container">
      <h2 className="menu-title">Módulos de Ejercicios</h2>
      
      <div className="modulos-grid">
      {
      exercises.length > 0 ?
      exercises.map((exercise) => {
        const progresoEjercicio = progressData.find(
            (p) => p.exerciseByUnitId === exercise.id
          );
          const porcentaje = progresoEjercicio?.ejerciciosCompletados/progresoEjercicio?.totalEjercicios * 100 || 0;
        return(
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
                  style={{ width: `${porcentaje}%` }}
                ></div>
              </div>
              <div className="progreso-texto">
                {porcentaje}% Completado
              </div>
            </div>
          </div>
        )}) : <h2 className='noExercises'>Sin Ejercicios por el momento.</h2>}
      </div>
    </div>
  );
}

export default MenuPrincipal;