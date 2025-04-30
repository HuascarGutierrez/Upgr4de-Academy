import { useState, useEffect } from 'react';
import './styles/ModuloEjercicios.css'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Ejercicio from './Ejercicio';
import MenuPrincipal from './MenuPrincipal';

import { collection, getDocs, where, query, orderBy } from "firebase/firestore";
import { db } from '../../config/app';

// Componente principal del módulo de ejercicios
export default function ModuloEjercicios({user}) {
  const location = useLocation();
  const navigate = useNavigate();
  const unitTitle = location.state?.unitTitle;
  const unitId = location.state?.unitId;
//nivel
//puntuacion

  const [seccionActual, setSeccionActual] = useState('menu');
  const [TituloEjercicioActual, setTituloEjercicioActual] = useState('');
  const [exercisesByUnit, setExercisesByUnit] = useState([]);
  const [exerciseByUnitId, setExerciseByUnitId] = useState(''); //aqui cambiar por el id del ejercicio

  const [nivelActual, setNivelActual] = useState(1); //aqui cambiar por el nivel
  const [puntuacion, setPuntuacion] = useState(0); //aqui cambiar por la puntuacion //importante

  const [progreso, setProgreso] = useState({
    ecuacionesLineales: 0,
    ecuacionesCuadraticas: 0,
    inecuaciones: 0,
    sistemasEcuaciones: 0
  }); //aqui la lista de progresos

  // Función para cambiar de sección
  const cambiarSeccion = (seccion) => {
    setSeccionActual(seccion);
  };

  const cambiarTituloEjercicio = (tituloEjercicio) => {
    setTituloEjercicioActual(tituloEjercicio);
  };

  const cambiarExerciseByUnitId = (id) => {
    setExerciseByUnitId(id);
  }

    //effect
    useEffect(() => {
      const fetchExercisesByUnit = async () => {
        try {
          const q = query(
            collection(db, "exerciseByUnit"),
            where("unitId", "==", unitId),
          orderBy("number_exerciseByUnit", "asc")
          );
          const querySnapshot = await getDocs(q);
          const data = await querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setExercisesByUnit(data);
        } catch (error) {
          console.error("Error fetching exercises:", error);
        }
      };
  
      fetchExercisesByUnit();
    }, []);

  return (
    <div className="app-container">
    {/* Cabecera */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">{unitTitle}</h1>
          <div className="header-controls">
            <div className="puntos-badge">
              Puntos: {puntuacion}
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="menu-button"
            >
              Salir del Curso
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="app-main">
        {seccionActual === 'menu' && (
          <MenuPrincipal exercises={exercisesByUnit} cambiarSeccion={cambiarSeccion} cambiarTituloEjercicio = {cambiarTituloEjercicio} cambiarExerciseByUnitId={cambiarExerciseByUnitId} progreso={progreso} />
        )}
        
        {seccionActual === 'ejercicio' && (
          <Ejercicio 
            exerciseByUnitId={exerciseByUnitId}
            titulo = {TituloEjercicioActual}
            nivel={nivelActual} 
            cambiarSeccion={cambiarSeccion}
            actualizarPuntuacion={(puntos) => setPuntuacion(prev => prev + puntos)}
            actualizarProgreso={(valor) => setProgreso(prev => ({...prev, ecuacionesLineales: valor}))}
          />
        )}
      </main>

    </div>
  );
}