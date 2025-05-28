import React, { useEffect, useState } from 'react';
import './styles/Progreso.css'; // Asegúrate de que la ruta a tus estilos sea correcta
import Calendario from './Calendario'; // Asegúrate de que la ruta a tu componente Calendario sea correcta
import Buho from '/images/OrangeBuho.webp'; // ¡CONFIRMA ESTA RUTA DE IMAGEN! Debe estar en la carpeta 'public' o gestionada por tu bundler.

// Importaciones de Firebase Firestore
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from '../../config/app'; // ¡CONFIRMA ESTA RUTA A TU CONFIGURACIÓN DE FIREBASE!

function ProgresoCurso({ userId, courseId, level = "Progreso" }) {
  const characterImage = Buho;

  // Estados para el progreso
  const [progress, setProgress] = useState(0);
  const [unitsCompleted, setUnitsCompleted] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);

  useEffect(() => {
    let unsubscribe; // Variable para almacenar la función de desuscripción de onSnapshot

    const setupUnitsProgressListener = () => {
      // 1. Verificación de props esenciales
      if (!userId || !courseId) {
        console.warn('ProgresoCurso: userId o courseId no proporcionados. No se puede cargar el progreso.');
        setProgress(0);
        setUnitsCompleted(0);
        setTotalUnits(0);
        return; // Salir si no hay datos suficientes
      }

      // 2. Crear referencia al documento de Firebase
      // La ruta exacta es: users/{userId}/enrolledCourses/{courseId}
      const enrolledCourseRef = doc(db, 'users', userId, 'enrolledCourses', courseId);

      console.log('ProgresoCurso DEBUG: Escuchando cambios en Firebase en la ruta:', enrolledCourseRef.path);

      // 3. Establecer la escucha en tiempo real con onSnapshot
      unsubscribe = onSnapshot(enrolledCourseRef, (enrolledCourseSnap) => {
        if (enrolledCourseSnap.exists()) {
          // El documento existe, procesar los datos
          const enrolledCourseData = enrolledCourseSnap.data();
          const unitsArray = enrolledCourseData.units || []; // Obtener el array 'units', si no existe, usar un array vacío

          console.log('ProgresoCurso DEBUG: Datos de unidades recibidos de Firebase:', unitsArray);

          // Contar unidades completadas y el total de unidades
          const completedCount = unitsArray.filter(unit => unit.completed === true).length; 
          const totalCount = unitsArray.length; 

          console.log(`ProgresoCurso DEBUG: Unidades completadas: ${completedCount} / ${totalCount}`);

          // Actualizar los estados del componente
          setUnitsCompleted(completedCount);
          setTotalUnits(totalCount);

          if (totalCount > 0) {
            const calculatedProgress = (completedCount / totalCount) * 100;
            setProgress(parseFloat(calculatedProgress.toFixed(1))); // Redondear a un decimal
          } else {
            setProgress(0); // Si no hay unidades, el progreso es 0
          }
        } else {
          // El documento no existe en Firebase
          console.warn(`ProgresoCurso WARN: Documento de curso matriculado no encontrado en ${enrolledCourseRef.path}. Mostrando 0% de progreso.`);
          setUnitsCompleted(0);
          setTotalUnits(0);
          setProgress(0);
        }
      }, (error) => {
        // Manejo de errores en la escucha de Firestore
        console.error('ProgresoCurso ERROR: Error de Firestore en onSnapshot:', error);
        setUnitsCompleted(0);
        setTotalUnits(0);
        setProgress(0);
      });
    };

    // Iniciar la escucha cuando el componente se monta o userId/courseId cambian
    setupUnitsProgressListener();

    // 4. Función de limpieza (desuscripción)
    // Se ejecuta cuando el componente se desmonta o cuando las dependencias del useEffect cambian.
    return () => {
      if (unsubscribe) {
        unsubscribe();
        console.log('ProgresoCurso DEBUG: Desuscrito de la escucha de Firebase.');
      }
    };
  }, [userId, courseId]); // Dependencias: re-ejecutar el efecto si userId o courseId cambian

  // Calculamos la posición ajustada para el búho y el porcentaje
  // La barra de progreso tiene un padding del 5% a cada lado (total 10% de margen horizontal).
  // El rango útil para el progreso es del 5% al 95% del ancho del contenedor.
  const adjustedLeft = 5 + (progress * 0.9);

  return (
    <div className="ProgresoCurso">
      <div className="ProgresoCurso-contenido">
        <div className="progress-container">
          <h2>{level}</h2>
          <p className="progress-description">¡Sigue avanzando para dominar tus unidades!</p>

          <div className="progress-bar-wrapper">
            <div className="character-background">
              {/* El búho se posiciona usando adjustedLeft */}
              <img src={characterImage} alt="Búho que avanza" className="character" style={{ left: `${adjustedLeft}%` }} />
            </div>
            <div className="progress-line-container">
              {/* La línea de progreso coloreada */}
              <div className="progress-line" style={{ width: `${progress}%` }}></div> 
              {/* El porcentaje se posiciona usando adjustedLeft */}
              <span className="progress-percentage" style={{ left: `${adjustedLeft}%` }}>{progress}%</span>
            </div>
            {/* Indicador de unidades completadas / total de unidades */}
            <span className="courses-indicator">{unitsCompleted}/{totalUnits} unidades</span>
          </div>
          {/* Resumen del progreso */}
          <div className="progress-summary">
            ¡Has completado {unitsCompleted} de {totalUnits} unidades!
          </div>
        </div>
        <Calendario />
      </div>
    </div>
  );
}

export default ProgresoCurso;