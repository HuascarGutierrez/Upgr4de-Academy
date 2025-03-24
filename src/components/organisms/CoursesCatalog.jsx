import CourseModel from '../../models/course_model';
import './styles/CoursesCatalog.css';
import { useNavigate } from 'react-router-dom';
import BarMyCourses from '../molecules/BarMyCourses';

const courses = [
  new CourseModel({id: 1, title: 'Introducción a cálculo', description: 'Acompañame en este maravilloso mundo', lessons: 12, quiz: 3, teacher: 'Ing. Huascar Guitierrez'}),
  new CourseModel({id: 2, title: 'Introducción a física', description: 'Ven y divirtamonos juntos con la física', lessons: 20, quiz: 4, teacher: 'Ing. Helen Catacora'}),
  new CourseModel({id: 3, title: 'Química inorgánica', description: 'Preparate para ver reacciones asombrosas', lessons: 6, quiz: 7, teacher: 'Ing. Ivan Condori'}),
  new CourseModel({id: 4, title: 'Álgebra de cero a experto', description: 'Te volveras un experto en Álgebra conmigo', lessons: 7, quiz: 1, teacher: 'Ing. Samuel Veliz'}),
];

function CoursesCatalog() {
  const navigate = useNavigate();

  return (
    <div className="SAPIcurses">
      <BarMyCourses />
      <div className="catalog-banner">
        <p className="title">Catálogo de cursos</p>
        <p className="sub-title">Mis Cursos / Catálogo</p>
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
          <div 
            key={course.id} 
            className="course-card" 
            onClick={() => navigate(`./${course.id}`)}
          >
            <div className="course-banner">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-subtitle">{course.description}</p>
            </div>
            <div className="course-content">
              <p className="course-description">{course.description}</p>
              <div className="course-meta">
                <span>👤 {course.teacher}</span>
                <span>📘 {course.lessons} lecciones</span>
                <span>📝 {course.quiz} ejercicios</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesCatalog;
