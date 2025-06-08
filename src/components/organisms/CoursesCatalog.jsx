// CoursesCatalog.jsx
import './styles/CoursesCatalog.css';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/app';
import React, { useEffect, useState } from 'react'; // Eliminado el ' => {' extra aquí
import CourseModel from '../../models/course_model';

function CoursesCatalog({ user }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [myCategory, setMyCategory] = useState('Álgebra');
  const [activeFilter, setActiveFilter] = useState('Álgebra');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = async (category) => {
    try {
      const q = query(collection(db, 'courses'), where('category', '==', category));
      const querySnapshot = await getDocs(q);
      const coursesData = querySnapshot.docs.map((doc) => new CourseModel({ id: doc.id, ...doc.data() }));
      setCourses(coursesData);
    } catch (error) {
      console.error('Error al obtener los cursos: ', error);
    }
  };

  useEffect(() => {
    fetchCourses(myCategory);
  }, [myCategory]);

  const handleFilterClick = (category) => {
    setMyCategory(category);
    setActiveFilter(category);
    setSearchTerm(''); // Restablecer la búsqueda al cambiar de categoría
  };

  // Filtrar cursos por término de búsqueda en título o descripción
  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(term) ||
      (course.description && course.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <div className="name">Hola: {user?.userName || "Cargando Nombre..."}</div>
        <nav className="nav-bar">
          <input
            type="text"
            placeholder="Busca el tema que necesitas"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </nav>
      </header>

      <div className="catalog-banner">
        {/* Aquí está el cambio de tamaño del título */}
        <p className="title">Catálogo de Cursos</p>
        <p className="sub-title">Descubre una extensa colección de cursos de matemáticas y ciencias diseñados para impulsar tu aprendizaje.</p>
        <div className="filters">
          {['Álgebra', 'Cálculo', 'Física', 'Química'].map((cat) => (
            <button
              key={cat}
              className={`filter-button ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => handleFilterClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="course-grid">
        {user?.planType !== 'Gratuito' ? (
          (searchTerm ? filteredCourses : courses).map((course) => (
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
                  <span>👤 {course.teacher}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h3 className="noItems">Este contenido está disponible en el plan Mensual.<br/>¡Actualiza para acceder a todos los cursos!</h3>
        )}

        {searchTerm && filteredCourses.length === 0 && (
          <>
            <p className="noItems">No se encontraron cursos que coincidan con "{searchTerm}"</p>
            <p className="noItems" onClick={() => { navigate('/main/catalogo/busqueda') }}>¿Deseas realizar una búsqueda más profunda?</p>
          </>
        )}
      </div>
    </div>
  );
}

export default CoursesCatalog;