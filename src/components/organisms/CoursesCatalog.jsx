import './styles/CoursesCatalog.css'

const courses = [
    { id: 1, title: "Introducción a cálculo", description: "Acompañame en este maravilloso mundo", lessons: 12, quiz: 3 },
    { id: 2, title: "Introducción a física", description: "Ven y divirtamonos juntos con la física", lessons: 20, quiz: 4 },
    { id: 3, title: "Química inorgánica", description: "Preparate para ver reacciones asombrosas", lessons: 5, quiz: 7 },
    { id: 4, title: "Álgebra de cero a experto", description: "Te volveras un experto en Álgebra conmigo", lessons: 7, quiz: 1 },
  ];

function CoursesCatalog() {

    return (
        <div className="catalog-container">
          <header className="catalog-header">
            <div className="logo">SAPI</div>
            <nav className="nav-bar">
              <input type="text" placeholder="Buscar cualquier cosa" className="search-input" />
              <div className="nav-links">
                <span>My Courses</span>
                <span>Progreso</span>
                <span>🔔</span>
                <span>⚙️</span>
              </div>
            </nav>
          </header>
          <div className="catalog-banner">
            <p className="title">Course Catalog</p>
            <p className="sub-title">My Courses / catalog</p>
            <div className="filters">
                <button className="filter-button active">Todos</button>
                <button className="filter-button">Más visto</button>
                <button className="filter-button">Más buscado</button>
                <button className="filter-button">Más popular</button>
                <button className="filter-button">Explora</button>
            </div>
          </div>
          
          <h2 className="weekly-streak">Inicia una racha semanal</h2>
          <p className="weekly-description">Visita 5 min de video o prueba al día para lograr tus objetivos</p>
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-banner">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-subtitle">{course.description}</p>
                </div>
                <div className="course-content">
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span>👤 Shams Tabrez</span>
                    <span>📘 {course.lessons} lessons</span>
                    <span>📝 {course.quiz} quiz</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}

export default CoursesCatalog

