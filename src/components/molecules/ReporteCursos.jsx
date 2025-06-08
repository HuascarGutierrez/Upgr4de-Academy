import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/app';
import './styles/ReporteCursos.css';

const ReporteCursos = ({ reportType, startDate, endDate }) => {
  const [cursos, setCursos] = useState([]);
  const [unidades, setUnidades] = useState({});
  const [lecciones, setLecciones] = useState({});
  const [categorias, setCategorias] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chunkArray = (array, size = 30) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const queryInBatches = async (collectionName, field, values) => {
    const chunks = chunkArray(values);
    let results = [];
    
    for (const chunk of chunks) {
      const q = query(
        collection(db, collectionName),
        where(field, 'in', chunk)
      );
      const snapshot = await getDocs(q);
      results = [...results, ...snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))];
    }
    
    return results;
  };

  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = parseDateString(dateStr);
    if (!date || isNaN(date.getTime())) return dateStr;
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const startDateObj = startDate ? parseDateString(startDate) : null;
        const endDateObj = endDate ? parseDateString(endDate) : null;
        if (endDateObj) endDateObj.setHours(23, 59, 59, 999);

        const cursosQuery = query(collection(db, 'courses'), orderBy('category'));
        const cursosSnapshot = await getDocs(cursosQuery);
        
        const allCursos = [];
        const categoriasData = {};
        
        cursosSnapshot.forEach(doc => {
          const cursoData = doc.data();
          const cursoDate = parseDateString(cursoData.creation_date);
          
          if (startDateObj && endDateObj) {
            if (!cursoDate || cursoDate < startDateObj || cursoDate > endDateObj) {
              return;
            }
          }
          
          const curso = {
            id: doc.id,
            ...cursoData
          };
          
          allCursos.push(curso);
          
          if (!categoriasData[curso.category]) {
            categoriasData[curso.category] = [];
          }
          categoriasData[curso.category].push(curso);
        });
        
        setCursos(allCursos);
        setCategorias(categoriasData);
        
        if (allCursos.length > 0) {
          const courseIds = allCursos.map(c => c.id);
          const unidadesResults = await queryInBatches('units', 'course_id', courseIds);
          
          const unidadesData = {};
          unidadesResults.forEach(unidad => {
            if (!unidadesData[unidad.course_id]) {
              unidadesData[unidad.course_id] = [];
            }
            unidadesData[unidad.course_id].push(unidad);
          });

          // ORDENAR LAS UNIDADES POR number_unit
          Object.keys(unidadesData).forEach(courseId => {
            unidadesData[courseId].sort((a, b) => a.number_unit - b.number_unit);
          });
          
          setUnidades(unidadesData);
          
          if (Object.keys(unidadesData).length > 0) {
            const unitIds = Object.values(unidadesData).flat().map(u => u.id);
            const leccionesResults = await queryInBatches('lessons', 'unit_id', unitIds);
            
            const leccionesData = {};
            leccionesResults.forEach(leccion => {
              if (!leccionesData[leccion.unit_id]) {
                leccionesData[leccion.unit_id] = [];
              }
              leccionesData[leccion.unit_id].push(leccion);
            });
            
            setLecciones(leccionesData);
          }
        }
        
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("Error al cargar los datos de cursos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportType, startDate, endDate]);

  if (loading) {
    return <div className="loading-container">Cargando estructura de cursos...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="reporte-cursos-container">
      <h1 className="reporte-title">Reporte de Cursos, Unidades y Lecciones</h1>
      
      {startDate && endDate && (
        <div className="date-range-info">
          Mostrando cursos creados entre: <strong>{formatDisplayDate(startDate)}</strong> y <strong>{formatDisplayDate(endDate)}</strong>
        </div>
      )}
      
      {Object.keys(categorias).length === 0 ? (
        <div className="no-data-message">No se encontraron cursos en el rango de fechas seleccionado</div>
      ) : (
        Object.keys(categorias).map(categoria => (
          <div key={categoria} className="categoria-section">
            <h2 className="categoria-title">{categoria}</h2>
            
            {categorias[categoria].map(curso => (
              <div key={curso.id} className="curso-section">
                <div className="curso-header">
                  <h3 className="curso-title">{curso.title}</h3>
                  <div className="curso-meta">
                    <span className="curso-teacher">Docente: {curso.teacher}</span>
                    <span className="curso-date">Creado: {formatDisplayDate(curso.creation_date)}</span>
                  </div>
                </div>
                
                {unidades[curso.id]?.map(unidad => (
                  <div key={unidad.id} className="unidad-section">
                    <div className="unidad-header">
                      <h4 className="unidad-title">
                        Unidad {unidad.number_unit}: {unidad.title}
                      </h4>
                    </div>
                    
                    <div className="lecciones-container">
                      {lecciones[unidad.id]?.map(leccion => (
                        <div key={leccion.id} className="leccion-item">
                          <span className="leccion-number">Lección {leccion.number_lesson}:</span>
                          <span className="leccion-title">{leccion.title}</span>
                        </div>
                      ))}
                      
                      {!lecciones[unidad.id]?.length && (
                        <div className="no-lecciones">No hay lecciones en esta unidad</div>
                      )}
                    </div>
                  </div>
                ))}
                
                {!unidades[curso.id]?.length && (
                  <div className="no-unidades">No hay unidades en este curso</div>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ReporteCursos;