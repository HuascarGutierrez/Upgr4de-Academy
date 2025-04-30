import React, { useEffect, useState } from 'react';
import YouTubeVideo from '../molecules/YouTubeVideo';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/InteractiveCourse.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/app';

const InteractiveCourse = ({user}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const lesson = location.state?.lesson;
  const lastLessonByUnit = location.state?.lastLessonByUnit;
  const courseId = location.state?.courseId;
  //const unitId = location.state?.unitId;

  const [completed, setCompleted] = useState();
  const [position, setPosition] = useState();
  const [units, setUnits] = useState([]);

  useEffect(()=>{

    const isCompleted = async () => {
      try {
        const q = await doc(db, 'users',user.uid, 'enrolledCourses',courseId);
        const docRead = await getDoc(q);
        const docReadData = docRead.data();
        const dataUnits = docReadData.units;
        setUnits(dataUnits);

        dataUnits.map((unit, index)=>{
          if(unit.id == lesson.unit_id) {
            setPosition(index);
            setCompleted(unit.completed);
          }
        })
        //await setDoc(docCreated, {unidades: units})
      } catch (error) {
        console.error('error al momento de leer el historial: ', error);
      }
    };
    
  isCompleted();
  },[])

  const uploadComplete = async() => {

    let newUnits = units;

    newUnits[position] = {...newUnits[position], completed: true};
    setUnits(newUnits);

    const courseRef = await doc(db, 'users',user.uid, 'enrolledCourses',courseId);
    await updateDoc(courseRef, { units: units });

    setCompleted(true);
  }

  const uploadCompleteUndo = async() => {

    let newUnits = units;

    newUnits[position] = {...newUnits[position], completed: false};
    setUnits(newUnits);

    const courseRef = await doc(db, 'users',user.uid, 'enrolledCourses',courseId);
    await updateDoc(courseRef, { units: units });

    setCompleted(false);
  }

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
        <a onClick={() => navigate(-1)} className="">Regresar</a>
        {
          lastLessonByUnit == lesson.number_lesson && (
            completed ?
            <button onClick={()=>{uploadCompleteUndo()}} className='actions_complete actions_complete-undo'>Cancelar completado</button>:
            <button onClick={()=>{uploadComplete()}} className='actions_complete'>Marcar como completado</button>
          )
        }
        <a href={lesson.link_doc} download target='_blank'>Descargar PDF</a>
      </div>
    </div>
  );
};

export default InteractiveCourse;