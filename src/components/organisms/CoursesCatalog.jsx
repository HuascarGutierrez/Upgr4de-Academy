import './styles/CoursesCatalog.css';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/app';
import React, { useEffect, useState } from 'react';
import CourseModel from '../../models/course_model';

function CoursesCatalog() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [myCategory, setMyCategory] = useState('Álgebra'); 
  const [activeFilter, setActiveFilter] = useState('Álgebra');

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
  };

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <div className="logo">SAPI</div>
        <nav className="nav-bar">
          <input type="text" placeholder="Busca el tema que necesitas" className="search-input" />
          <div className="nav-links">
            <span>Mis Cursos</span>
            <span>Progreso</span>
          </div>
        </nav>
      </header>
      <div className="catalog-banner">
        <p className="title">Catálogo de cursos</p>
        <div className="filters">
          <button
            className={`filter-button ${activeFilter === 'Álgebra' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Álgebra')}
          >
            Álgebra
          </button>
          <button
            className={`filter-button ${activeFilter === 'Cálculo' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Cálculo')}
          >
            Cálculo
          </button>
          <button
            className={`filter-button ${activeFilter === 'Física' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Física')}
          >
            Física
          </button>
          <button
            className={`filter-button ${activeFilter === 'Química' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Química')}
          >
            Química
          </button>
        </div>
      </div>

      <h2 className="weekly-streak">Inicia una racha semanal</h2>
      <p className="weekly-description">Visita 5 min de video o prueba al día para lograr tus objetivos</p>
      <div className="course-grid">
        {courses.map((course) => (
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
                <h3 className="course-title">{course.title}</h3>
              </div>
            </div>
            <div className="course-content">
              <p className="course-description">{course.description}</p>
              <div className="course-meta">
                <span>👤 {course.teacher}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesCatalog;