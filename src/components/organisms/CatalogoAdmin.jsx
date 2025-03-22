import React from 'react'
import "./styles/CoursesCatalog.css"

const courses = [
    { id: 1, title: "Introducción a cálculo", description: "Acompañame en este maravilloso mundo", lessons: 12, quiz: 3 },
    { id: 2, title: "Introducción a física", description: "Ven y divirtamonos juntos con la física", lessons: 20, quiz: 4 },
    { id: 3, title: "Química inorgánica", description: "Preparate para ver reacciones asombrosas", lessons: 5, quiz: 7 },
    { id: 4, title: "Álgebra de cero a experto", description: "Te volveras un experto en Álgebra conmigo", lessons: 7, quiz: 1 },
  ];

function CatalogoAdmin() {
  return (
    <>
    <div className="catalog-container">
          <div className="catalog-banner">
            <p className="title">Catalogo de Cursos</p>
            <div className="filters">
                <button className="filter-button active">Todos</button>
                <button className="filter-button">Más visto</button>
                <button className="filter-button">Más buscado</button>
                <button className="filter-button">Más popular</button>
                <button className="filter-button">Explora</button>
            </div>
          </div>
         <div className="course-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-banner">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-subtitle">{course.description}</p>
                </div>
                <div className="course-content">
                  <div className="course-meta">
                    <span>📘 {course.lessons} lessons</span>
                    <span>📝 {course.quiz} quiz</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </>
  )
}

export default CatalogoAdmin