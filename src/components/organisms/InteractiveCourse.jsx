import React from 'react';
import YouTubeVideo from '../molecules/YouTubeVideo';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/InteractiveCourse.css';

const InteractiveCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lesson = location.state?.lesson;

  if (!lesson) {
    return <p>Lección no disponible</p>;
  }

  return (
    <div className="clases-part-container">
      <div className="video-container">
        <YouTubeVideo videoId={lesson.link_video} /> 
      </div>

      <h2>Lección: {lesson.title}</h2>
      <p>{lesson.description}</p>
      <p>Instructor: {lesson.instructor}</p>
      

      <div className="actions">
        <a onClick={() => navigate(-1)} className="back-link">Regresar</a>
        <a href={lesson.link_doc} download target='_blank'>Descargar PDF</a>
      </div>
    </div>
  );
};

export default InteractiveCourse;