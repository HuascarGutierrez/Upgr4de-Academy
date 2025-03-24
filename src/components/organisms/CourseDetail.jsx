import './styles/CourseDetail.css';
import ZowlWhite from '../../assets/images/zowl-white.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../config/app';
import UnitModel from '../../models/unit_model';

function CourseDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const course = location.state?.course;

  const [units, setUnits] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [openUnitIndex, setOpenUnitIndex] = useState(null);

  if (!course) {
    return <p>Curso no disponible</p>;
  }

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const q = query(
          collection(db, 'units'),
          where('course_id', '==', course.id),
          orderBy('number_unit')
        );
        const querySnapshot = await getDocs(q);
        const unitsData = querySnapshot.docs.map((doc) => new UnitModel({ id: doc.id, ...doc.data() }));
        setUnits(unitsData);
      } catch (error) {
        console.error('Error al obtener las Unidades: ', error);
      }
    };

    fetchUnits();
  }, [course.id]);

  const fetchLessons = async (unitId) => {
    try {
      const q = query(collection(db, 'lessons'), where('unit_id', '==', unitId), orderBy('number_lesson'));
      const querySnapshot = await getDocs(q);
      const lessonsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLessons(lessonsData);
    } catch (error) {
      console.error('Error al obtener las lecciones: ', error);
    }
  };

  const handleTopicClick = async (index, unitId) => {
    if (openUnitIndex === index) {
      setOpenUnitIndex(null);
      setLessons([]);
    } else {
      setOpenUnitIndex(index);
      await fetchLessons(unitId);
    }
  };

  return (
    <div className="course-banner-container">
      <div className="course-detail-card">
        <div className="course-banner-title">
          <div className="banner-content">
            <div>
              <h1 className="banner-title">{course.title}</h1>
              <h2 className="banner-subtitle">CURSO PRÁCTICO</h2>
            </div>
            <img src={ZowlWhite} alt="React Logo" className="react-logo" />
          </div>
        </div>
        <div className="course-info">
          <div className="info-header">
            <h3 className="course-title">{course.title}</h3>
            <span className="course-category">{course.category}</span>
          </div>
          <div className="rating">
            <span className="rating-label">Calificación:</span>
            <span className="rating-value">{"N/A"}</span>
            <span className="star">&#9733;</span>
          </div>
          <p className="instructor">{course.teacher}</p>
          <div className="description">
            <p>{course.description}</p>
          </div>

          <div className="topics">
            <h3>Temario</h3>
            {units.map((unit, index) => (
              <div key={unit.id}>
                <div
                  className={`topic-item ${openUnitIndex === index ? 'open' : ''}`}
                  onClick={() => handleTopicClick(index, unit.id)}
                >
                  <span>Unidad {unit.number_unit}: {unit.title}</span>
                  <span className="arrow">{openUnitIndex === index ? '▲' : '▼'}</span>
                </div>
                {openUnitIndex === index && (
                  <div className="lessons-list">
                    {lessons.map((lesson) => (
                      <
                        div key={lesson.id} 
                        className="lesson-item"
                        onClick={() => navigate('/main/courses/course/interactive-course', {state: {lesson}})}
                      >
                        <span>{lesson.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="actions">
            <a onClick={() => navigate(-1)} className="back-link">Regresar</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;