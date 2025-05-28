import './styles/CoursesCatalog.css';
import './styles/Busqueda.css'
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/app';
import React, { useEffect, useState } from 'react';
import CourseModel from '../../models/course_model';

function Busqueda({ user }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch courses with their units and lessons
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1) Fetch all courses
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 2) Fetch all units
      const unitsSnapshot = await getDocs(collection(db, 'units'));
      const unitsData = unitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 3) Fetch all lessons
      const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
      const lessonsData = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 4) Nest units and lessons under courses
      const nestedCourses = coursesData.map(course => {
        const courseUnits = unitsData
          .filter(unit => unit.course_id === course.id)
          .map(unit => ({
            ...unit,
            lessons: lessonsData.filter(lesson => lesson.unit_id === unit.id)
          }));
        return { ...course, units: courseUnits };
      });

      setCourses(nestedCourses.map(c => new CourseModel(c)));
    } catch (error) {
      console.error('Error fetching catalog data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Deep filter by course, category, description, units, lessons
  const filteredCourses = courses.filter(course => {
    const term = searchTerm.toLowerCase();
    const inTitle = course.title?.toLowerCase().includes(term);
    const inCategory = course.category?.toLowerCase().includes(term);
    const inDescription = course.description?.toLowerCase().includes(term);

    const inUnits = course.units?.some(unit => {
      const unitMatch = unit.title.toLowerCase().includes(term);
      const lessonMatch = unit.lessons?.some(lesson => lesson.title.toLowerCase().includes(term));
      return unitMatch || lessonMatch;
    });

    return inTitle || inCategory || inDescription || inUnits;
  });

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <div className="logo">SAPI</div>
        <nav className="nav-bar">
          <input
            type="text"
            placeholder="Busca curso, unidad o lección"
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </nav>
      </header>

      <div className="catalog-banner">
        <p className="title">Catálogo de cursos</p>
      </div>

      {loading ? (
        <p className="loading">Cargando catálogo...</p>
      ) : (
        <div className="course-grid">
          {filteredCourses.length === 0 ? (
            <p className="noItems">No se encontraron resultados para “{searchTerm}”</p>
          ) : (
            filteredCourses.map(course => (
              <div
                key={course.id}
                className="course-card"
                onClick={() => navigate('/main/courses/course', { state: { course } })}
              >
                <div
                  className="course-banner"
                  style={{ backgroundImage: `url(${course.link_image})` }}
                >
                  <div className="course-banner-faded-title">
                    <h3 className="course-title">
                      {course.title.length > 32 ? `${course.title.slice(0, 29)}...` : course.title}
                    </h3>
                  </div>
                </div>
                <div className="course-content">
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span>📂 {course.category}</span>
                    <span>👤 {course.teacher}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Busqueda;
