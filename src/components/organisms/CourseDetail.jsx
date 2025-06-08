// CourseDetail.jsx
import './styles/CourseDetail.css';
import ZowlWhite from '../../assets/images/zowl-white.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, where, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import { db } from '../../config/app';
import UnitModel from '../../models/unit_model';

function CourseDetail({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const course = location.state?.course;

  const [courseId, setCourseId] = useState(null);
  const [unitId, setUnitId] = useState(null);
  const [lastLessonByUnit, setLastLessonByUnit] = useState(null);
  const [units, setUnits] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [openUnitIndex, setOpenUnitIndex] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!course) {
    return <p className="course-not-available">Curso no disponible. Por favor, regresa al catálogo.</p>;
  }

  const fetchLessons = useCallback(async (currentUnitId) => {
    setLessons([]);
    try {
      const q = query(collection(db, 'lessons'), where('unit_id', '==', currentUnitId), orderBy('number_lesson'));
      const querySnapshot = await getDocs(q);
      const lessonsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLessons(lessonsData);

      if (lessonsData.length > 0) {
        setLastLessonByUnit(lessonsData[lessonsData.length - 1].number_lesson);
        setCourseId(course.id);
        setUnitId(lessonsData[lessonsData.length - 1].unit_id);
      } else {
        setLastLessonByUnit(null);
        setUnitId(null);
      }
    } catch (err) {
      console.error('Error al obtener las lecciones: ', err);
      setError('Error al cargar las lecciones. Inténtalo de nuevo.');
    }
  }, [course.id]);

  useEffect(() => {
    const fetchUnitsAndEnrollment = async () => {
      setLoading(true);
      setError(null);
      try {
        const qUnits = query(
          collection(db, 'units'),
          where('course_id', '==', course.id),
          orderBy('number_unit')
        );
        const unitsSnapshot = await getDocs(qUnits);
        const unitsData = unitsSnapshot.docs.map((doc) => new UnitModel({ id: doc.id, ...doc.data() }));
        setUnits(unitsData);

        if (user?.uid) {
          const enrollmentRef = doc(db, 'users', user.uid, 'enrolledCourses', course.id);
          const enrollmentSnapshot = await getDoc(enrollmentRef);
          const enrollmentData = enrollmentSnapshot.data();

          if (enrollmentSnapshot.exists() && enrollmentData?.activo) {
            setEnrolled(true);
          } else {
            setEnrolled(false);
          }
        }
      } catch (err) {
        console.error('Error al obtener las unidades o verificar matrícula: ', err);
        setError('No se pudo cargar la información del curso. Por favor, recarga la página.');
      } finally {
        setLoading(false);
      }
    };

    fetchUnitsAndEnrollment();
  }, [course.id, user?.uid]);

  const handleTopicClick = async (index, unitId) => {
    if (openUnitIndex === index) {
      setOpenUnitIndex(null);
      setLessons([]);
    } else {
      setOpenUnitIndex(index);
      await fetchLessons(unitId);
    }
  };

  const toggleEnrollment = async () => {
    if (!user?.uid) {
      alert('Debes iniciar sesión para matricularte en un curso.');
      return;
    }

    try {
      const enrollmentRef = doc(db, 'users', user.uid, 'enrolledCourses', course.id);
      
      if (enrolled) {
        await updateDoc(enrollmentRef, { activo: false });
        alert('Curso quitado de tus estadísticas.');
      } else {
        const unitsForEnrollment = units.map((unit) => ({
          id: unit.id,
          nombreUnidad: unit.title,
          completed: false,
          completedAt: null,
        }));

        await setDoc(enrollmentRef, {
          units: unitsForEnrollment,
          startedAt: new Date(),
          activo: true,
          title: course.title,
          category: course.category,
        }, { merge: true });
        alert('Curso agregado a tus estadísticas.');
      }
      setEnrolled(!enrolled);
    } catch (err) {
      console.error('Error al matricular/desmatricular el curso: ', err);
      setError('Hubo un error al actualizar el estado de tu curso. Inténtalo de nuevo.');
      alert('Hubo un error al actualizar el estado de tu curso.');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Cargando detalles del curso...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="course-banner-container">
      <div className="course-detail-card">
        <div className="course-banner-title">
          <a onClick={() => navigate(-1)} className="back-link">
            <span role="img" aria-label="back arrow">⬅️</span> Regresar
          </a>
          <div className="banner-content">
            <div>
              <h1 className="banner-title">{course.title}</h1>
              <h2 className="banner-subtitle">CURSO PRÁCTICO</h2>
            </div>
            {/* Aquí puedes usar el logo de Zowl u otro logo relevante */}
            <img src={ZowlWhite} alt="Zowl Logo" className="react-logo" />
          </div>
        </div>
        <div className="course-info">
          <div className="info-header">
            <h3 className="course-title">{course.title}</h3>
            <span className="course-category">{course.category}</span>
          </div>

          <p className="instructor">
            <span role="img" aria-label="teacher icon">👨‍🏫</span> Docente: {course.teacher}
          </p>
          <div className="description">
            <p>{course.description}</p>
          </div>

          <div className="actions">
            <button
              onClick={toggleEnrollment}
              className={`action-button ${enrolled ? 'actions_enrollCourse-enrolled' : 'actions_enrollCourse'}`}
            >
              {enrolled ? (
                <>Quitar de las estadísticas <span role="img" aria-label="remove icon">❌</span></>
              ) : (
                <>Agregar a las estadísticas <span role="img" aria-label="add icon">✅</span></>
              )}
            </button>
          </div>

          {enrolled && (
            <div className="rating">
              <span className="rating-label">Calificación:</span>
              <span className="rating-value">{"N/A"}</span>
              <span className="star" role="img" aria-label="star">&#9733;</span>
            </div>
          )}

          <div className="topics">
            <h3>Temario del Curso</h3>
            {units.length > 0 ? (
              units.map((unit, index) => (
                <div key={unit.id} className="unit-section">
                  <div
                    className="topic-item"
                    onClick={() => handleTopicClick(index, unit.id)}
                  >
                    <span>Unidad {unit.number_unit}: {unit.title}</span>
                    <span className="arrow">{openUnitIndex === index ? '▲' : '▼'}</span>
                  </div>
                  {openUnitIndex === index && (
                    lessons.length > 0 ? (
                      <div className="lessons-list">
                        {lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="lesson-item"
                            onClick={() => navigate('/main/courses/course/interactive-course', { state: { lesson, lastLessonByUnit, courseId, unitId } })}
                          >
                            <span><span role="img" aria-label="lesson icon">📚</span> {lesson.title}</span>
                          </div>
                        ))}
                        <div
                          className="lesson-item exercises-item"
                          onClick={() => navigate('/main/courses/course/interactive-exercises', { state: { unitTitle: unit.title, unitId: unit.id } })}
                        >
                          <span><span role="img" aria-label="exercises icon">📝</span> Ejercicios de la Unidad</span>
                        </div>
                      </div>
                    ) : (
                      <p className="no-lessons-message">No hay lecciones disponibles para esta unidad.</p>
                    )
                  )}
                </div>
              ))
            ) : (
              <p className="no-units-message">No hay unidades disponibles para este curso.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;