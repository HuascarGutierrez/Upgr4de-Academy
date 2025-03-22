import CourseModel from '../../models/course_model';
import './styles/CourseDetail.css'
import ZowlWhite from '../../assets/images/zowl-white.svg';
import { useNavigate, useParams } from 'react-router-dom';

const courses = [
  new CourseModel({id: 1, title: 'Introducción a cálculo', description: 'Acompañame en este maravilloso mundo', lessons: 12, quiz: 3, teacher: 'Ing. Huascar Guitierrez'}),
  new CourseModel({id: 2, title: 'Introducción a física', description: 'Ven y divirtamonos juntos con la física', lessons: 20, quiz: 4, teacher: 'Ing. Helen Catacora'}),
  new CourseModel({id: 3, title: 'Química inorgánica"', description: 'Preparate para ver reacciones asombrosas', lessons: 6, quiz: 7, teacher: 'Ing. Ivan Condori'}),
  new CourseModel({id: 4, title: 'Álgebra de cero a experto', description: 'Te volveras un experto en Álgebra conmigo', lessons: 7, quiz: 1, teacher: 'Ing. Samuel Veliz'}),
]

function CourseDetail() {

const navigate = useNavigate();
const { courseId } = useParams();
const course = courses.find((c) => c.id === parseInt(courseId));

if (!course) {
  return <p>Curso no encontrado</p>;
}

const unidades = Array.from({ length: course.lessons }, (_, i) => `Unidad ${i + 1}`);

  return (
    <div className="course-banner-container">
      <div className="course-detail-card">
        <div className="course-banner-title">
          <div className="banner-content">
            <div>
              <h1 className='banner-title'>{course.title}</h1>
              <h2 className='banner-subtitle'>CURSO PRÁCTICO</h2>
            </div>
            <img src={ZowlWhite} alt="React Logo" className="react-logo" />
          </div>
        </div>
        <div className="course-info">
          <div className="info-header">
            <h3 className="course-title">{course.title}</h3>
            <span className="course-category">Algebra</span>
          </div>
          <div className="rating">
            <span className="rating-label">Calificación:</span>
            <span className="rating-value">5</span>
            <span className="star">&#9733;</span>
          </div>
          <p className="instructor">{course.teacher}</p>
          <div className="description">
            <p>{course.description}</p>
          </div>
          <div className="topics">
            <h3>Temario</h3>
            
            {
              unidades.map((unidades, index) => (
                <div key={index} className="topic-item">
                  <span>Unidad didáctica {unidades}</span>
                  <span className="arrow">&#9660;</span>
                </div>
              ))
            }

            
          </div>
          <div className="actions">
            <button className="enroll-button">Inscribirme por 150Bs.</button>
            <a onClick={()=>{navigate('../catalogo')}} className="back-link">Regresar</a>
          </div>
        </div>
      </div>
    </div>
  );
}
  
export default CourseDetail