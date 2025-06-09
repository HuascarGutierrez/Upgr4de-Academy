import { useState, useEffect } from 'react';
import "./styles/EditarUnitsForm.css";
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from "../../config/app";
import { toast } from 'react-toastify';

const EditUnitsForm = ({ courseId }) => {
  const [units, setUnits] = useState([]);
  const [lessons, setLessons] = useState({}); // { unitId: [lessons] }
  const [loading, setLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState({});

  // Toggle para expandir/contraer unidades
  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  // Obtener unidades del curso
  const fetchUnits = async () => {
    try {
      const q = query(collection(db, 'units'), where('course_id', '==', courseId));
      const querySnapshot = await getDocs(q);
      const unitsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      unitsData.sort((a, b) => a.number_unit - b.number_unit);
      setUnits(unitsData);
      
      // Obtener lecciones para cada unidad
      await fetchLessonsForUnits(unitsData.map(unit => unit.id));
    } catch (error) {
      console.error("Error fetching units: ", error);
      toast.error("Error al cargar las unidades");
    } finally {
      setLoading(false);
    }
  };

  // Obtener lecciones para las unidades
  const fetchLessonsForUnits = async (unitIds) => {
    try {
      const lessonsData = {};
      
      for (const unitId of unitIds) {
        const q = query(collection(db, 'lessons'), where('unit_id', '==', unitId));
        const querySnapshot = await getDocs(q);
        lessonsData[unitId] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a, b) => a.number_lesson - b.number_lesson);
      }
      
      setLessons(lessonsData);
    } catch (error) {
      console.error("Error fetching lessons: ", error);
      toast.error("Error al cargar las lecciones");
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [courseId]);

  // Manejar cambios en unidades
  const handleUnitChange = (unitId, field, value) => {
    setUnits(units.map(unit => 
      unit.id === unitId ? { ...unit, [field]: value } : unit
    ));
  };

  // Manejar cambios en lecciones
  const handleLessonChange = (unitId, lessonId, field, value) => {
    setLessons(prev => ({
      ...prev,
      [unitId]: prev[unitId].map(lesson => 
        lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
      )
    }));
  };

  // Guardar cambios de unidad
  const handleUnitSubmit = async (unitId, e) => {
    e.preventDefault();
    try {
      const unitToUpdate = units.find(unit => unit.id === unitId);
      if (!unitToUpdate) return;

      const unitRef = doc(db, 'units', unitId);
      await updateDoc(unitRef, {
        title: unitToUpdate.title,
        description: unitToUpdate.description,
        number_unit: unitToUpdate.number_unit,
      });

      toast.success(`Unidad ${unitToUpdate.number_unit} actualizada con éxito`);
    } catch (error) {
      console.error("Error updating unit: ", error);
      toast.error(`Error al actualizar la unidad: ${error.message}`);
    }
  };

  // Guardar cambios de lección
  const handleLessonSubmit = async (unitId, lessonId, e) => {
    e.preventDefault();
    try {
      const lessonToUpdate = lessons[unitId]?.find(lesson => lesson.id === lessonId);
      if (!lessonToUpdate) return;

      const lessonRef = doc(db, 'lessons', lessonId);
      await updateDoc(lessonRef, {
        title: lessonToUpdate.title,
        description: lessonToUpdate.description,
        link_doc: lessonToUpdate.link_doc,
        link_video: lessonToUpdate.link_video,
        number_lesson: lessonToUpdate.number_lesson,
      });

      toast.success(`Lección ${lessonToUpdate.number_lesson} actualizada con éxito`);
    } catch (error) {
      console.error("Error updating lesson: ", error);
      toast.error(`Error al actualizar la lección: ${error.message}`);
    }
  };

  if (loading) return <div className="loading">Cargando unidades y lecciones...</div>;

  return (
    <div className="units-edit-container">
      <h2 >Editar Unidades y Lecciones del Curso</h2>
      <div className="units-list">
        {units.map(unit => (
          <div key={unit.id} className="unit-form-container">
            <form 
              onSubmit={(e) => handleUnitSubmit(unit.id, e)}
              className="unit-edit-form"
            >
              <div className="unit-header" onClick={() => toggleUnit(unit.id)}>
                <h3>Unidad {unit.number_unit}: {unit.title}</h3>
                <span className="toggle-icon">
                  {expandedUnits[unit.id] ? '▲' : '▼'}
                </span>
              </div>
              
              {expandedUnits[unit.id] && (
                <>
                  <label>
                    <p className='edit-secction'>Título:</p>
                    <input
                      type="text"
                      value={unit.title || ''}
                      onChange={(e) => handleUnitChange(unit.id, 'title', e.target.value)}
                      required
                    />
                  </label>

                  <label>
                    <p className='edit-secction'>Descripción:</p>
                    <textarea
                      value={unit.description || ''}
                      onChange={(e) => handleUnitChange(unit.id, 'description', e.target.value)}
                      required
                    />
                  </label>

                  <label>
                    <p className='edit-secction'>Número de Unidad:</p>
                    <input
                      type="number"
                      min="1"
                      value={unit.number_unit || ''}
                      onChange={(e) => handleUnitChange(unit.id, 'number_unit', parseInt(e.target.value))}
                      required
                    />
                  </label>

                  <button type="submit" className="btn-save">
                    Guardar Cambios Unidad
                  </button>
                </>
              )}
            </form>

            {expandedUnits[unit.id] && (
              <div className="lessons-container">
                <h4>Lecciones de esta unidad</h4>
                {lessons[unit.id]?.length > 0 ? (
                  lessons[unit.id].map(lesson => (
                    <form 
                      key={lesson.id}
                      onSubmit={(e) => handleLessonSubmit(unit.id, lesson.id, e)}
                      className="lesson-edit-form"
                    >
                      <h5>Lección {lesson.number_lesson}</h5>
                      
                      <label>
                        <p className='edit-lessons'>Título:</p>
                        <input
                          type="text"
                          value={lesson.title || ''}
                          onChange={(e) => handleLessonChange(unit.id, lesson.id, 'title', e.target.value)}
                          required
                        />
                      </label>

                      <label>
                        <p className='edit-lessons'>Descripción:</p>
                        <textarea
                          value={lesson.description || ''}
                          onChange={(e) => handleLessonChange(unit.id, lesson.id, 'description', e.target.value)}
                          required
                        />
                      </label>

                      <label>
                        <p className='edit-lessons'>Número de Lección:</p>
                        <input
                          type="number"
                          min="1"
                          value={lesson.number_lesson || ''}
                          onChange={(e) => handleLessonChange(unit.id, lesson.id, 'number_lesson', parseInt(e.target.value))}
                          required
                        />
                      </label>

                      <label>
                        <p className='edit-lessons'>Enlace del Documento:</p>
                        <input
                          type="url"
                          value={lesson.link_doc || ''}
                          onChange={(e) => handleLessonChange(unit.id, lesson.id, 'link_doc', e.target.value)}
                        />
                      </label>

                      <label>
                        <p className='edit-lessons'>Enlace del Video:</p>
                        <input
                          type="text"
                          value={lesson.link_video || ''}
                          onChange={(e) => handleLessonChange(unit.id, lesson.id, 'link_video', e.target.value)}
                        />
                      </label>

                      <button type="submit" className="btn-save">
                        Guardar Cambios Lección
                      </button>
                    </form>
                  ))
                ) : (
                  <p>No hay lecciones en esta unidad.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditUnitsForm;