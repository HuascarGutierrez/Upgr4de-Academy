import React, { act } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db } from "../../config/app";
import { collection, getDocs, query, where, addDoc, setDoc, doc } from "firebase/firestore";

function EditarEvaluacion({user}) {
    const navigate = useNavigate();
    const location = useLocation();
    const datos = location.state || {};

    const [units, setUnits] = useState([]);
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);
    //console.log("Datos recibidos:", datos);

        const getUnitsByCourseId = async () => {
            const units = [];
            const q = query(collection(db, "units"), where("course_id", "==", datos.courseId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                units.push({ id: doc.id, ...doc.data() });
            });
            return units;
        }

        const getEvaluacionesByCourseId = async () => {
                const unidades = await getUnitsByCourseId();
                setUnits(unidades);
                console.log("Unidades obtenidas:", unidades);

                // Usa Promise.all para esperar todas las consultas
                const evaluationsArrays = await Promise.all(
                    unidades.map(async (unit) => {
                        const evaluacion = query(collection(db, "exerciseByUnit"), where("unitId", "==", unit.id));
                        const querySnapshot = await getDocs(evaluacion);
                        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    })
                );
                // Aplana el array de arrays
                const evaluations = evaluationsArrays.flat();
                return evaluations;
            };
        
    const getEjerciciosByUnitId = async () => {
    const evaluacions = await getEvaluacionesByCourseId();
    setEvaluaciones(evaluacions);
    console.log("Evaluaciones obtenidas:", evaluacions);
    console.log("tamaño de evaluaciones:", evaluacions.length);

    // Usa Promise.all para esperar todas las consultas de ejercicios
    const exercisesArrays = await Promise.all(
        evaluacions.map(async (evaluacion) => {
            const ejercicio = query(collection(db, "exercises"), where("exerciseByUnitId", "==", evaluacion.id));
            const querySnapshot = await getDocs(ejercicio);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        })
    );
    // Aplana el array de arrays
    const exercises = exercisesArrays.flat();
    setEjercicios(exercises);
    return exercises;
};

    const [formEv, setFormEv] = useState({
        activo: true,
        description: "",
        title: "",
        id: "",
    });

    const [formExercise, setFormExercise] = useState({
        activo: true,
        answer: "",
        description: "",
        id: "",
        hint: ""
    });

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormEv({ ...formEv, [name]: value });
  };

  const handleInputExerciseChange = (e) => {
    const { name, value } = e.target;
    setFormExercise({ ...formExercise, [name]: value });
  };

  const handleSubmitEv = async (e) => {
        e.preventDefault();
        try {
            const exerciseByUnitRef = doc(db, 'exerciseByUnit', formEv.id);
            await setDoc(exerciseByUnitRef, {
                activo: formEv.activo,
                title: formEv.title,
                description: formEv.description,
            }, { merge: true });
            toast.success(`¡Unidad editado exitosamente!`);
            console.log("Nueva evaluacion:", formEv);
        } catch (error) {
            toast.error("Error al crear el curso: " + error.message);
        } 
    };

      const handleSubmitExercise = async (e) => {
        e.preventDefault();
        try {
            const exerciseByUnitRef = doc(db, 'exercises', formExercise.id);
            await setDoc(exerciseByUnitRef, {
                activo: formExercise.activo,
                answer: formExercise.answer,
                description: formExercise.description,
                hint: formExercise.hint
            }, { merge: true });
            toast.success(`!Ejercicios editado exitosamente!`);
            console.log("Nueva evaluacion:", formExercise);
        } catch (error) {
            toast.error("Error al crear el curso: " + error.message);
        } 
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ejs = await getEjerciciosByUnitId();
                setEjercicios(ejs);
                console.log("Ejercicios obtenidos:", ejs);
                toast.success("Datos cargados correctamente");
            } catch (error) {
                toast.error("Error al cargar los datos: " + error.message);
            }
        };
        fetchData();
    }, []);

  return (
    <div className='container-crear-nuevo-curso'>
      <div className="container-title" style={{ position: 'relative' }}>
        <button type="submit" className="btn-volver" onClick={() => {navigate(-1);}} >
          <img src="/assets/circle-arrow-left.svg" alt="" />
        </button>
        <p className='crear-nuevo-curso-title'>Editar Evaluacion / Ejercicio</p>
      </div>
      <div className="container-formularios">
        <div className="crear-container">
          <div>        
            <h1 className="crear-curso-title">Datos del curso</h1>
          </div>

          <form className="form-crear" >
            <label>
              Nombre del Curso
              <p>{datos.courseTitle}</p>
            </label>
            <label>
              Descripción
              <p>{datos.courseDescription}</p>
            </label>
          </form>
        </div>

        <div className="crear-container">
          <div>        
            <h1 className="crear-curso-title">Editar evaluacion</h1>
          </div>

          <form className="form-crear" /**onSubmit={handleSubmitUnit} */>
            <div className="numero-titulo-container">
              <label style={{ width: '100%' }}>
                Evaluación - ID
                <select 
                    name="id"
                    value={formEv.id}
                    onChange={handleInputChange} 
                    required
                >
                    <option value="">Seleccione una evaluación</option>
                    {
                        evaluaciones.map((ev) => (
                            <option key={ev.id} value={ev.id}>
                                {ev.title} - {ev.id}
                            </option>
                        ))
                    }
              </select>
            </label>

            </div>

                { formEv.id && (
                    <>
                    <label>
                Título de la evaluación
                <input
                    type="text"
                    name="title"
                    placeholder={evaluaciones.find(eva => eva.id === formEv.id)?.title || "Título de la evaluacion"}
                    value={formEv.title}
                    onChange={handleInputChange}
                    required
                />
                    </label>
                    <label>
                Descripción de la evaluación
                
                <textarea
                    name="description"
                    placeholder={evaluaciones.find(eva => eva.id === formEv.id)?.description || "Descripción de la evaluacion"}
                    value={formEv.description}
                    onChange={handleInputChange}
                    required
                ></textarea>
                    </label>

                    <label>
                        Tener la evaluación activa?
                        <input
                            type="checkbox"
                            name="activo"
                            checked={formEv.activo}
                            value={formEv.activo}
                            onChange={() => setFormEv({ ...formEv, activo: !formEv.activo })}
                            />

                    </label>
                    </>
                ) }

            <div className='boton-crear'>
            <button type="button" className="btn-crear-curso" onClick={handleSubmitEv}>
              MODIFICAR EVALUACIÓN
            </button>
            </div>
          </form>
        </div>

        <div className="crear-container" style={{ position: 'relative' }}>
          <div>        
            <h1 className="crear-curso-title">Editar Ejercicio</h1>
          </div>
            
          <form className="form-crear">

          <div className="numero-titulo-container">
              <label style={{ width: '100%' }}>
                Ejercicio - ID
                <select 
                    name="id"
                    value={formExercise.unitId}
                    onChange={handleInputExerciseChange} 
                    required
                >
                    <option value="">Seleccione una unidad</option>
                    {
                        ejercicios.map((exercise) => (
                            <option key={exercise.id} value={exercise.id}>
                                {exercise.description} - {exercise.id}
                            </option>
                        ))
                    }

              </select>
            </label>
            </div>

            <label>
                Respuesta correcta
                <input
                    type="text"
                    name="answer"
                    placeholder= {ejercicios.find(ex => ex.id === formExercise.id)?.answer || "Respuesta correcta del ejercicio"}
                    value={formExercise.answer}
                    onChange={handleInputExerciseChange}
                    required
                    />
            </label>

            <label>
                Descripción del ejercicio
                <textarea
                    name="description"
                    placeholder={ejercicios.find(ex => ex.id === formExercise.id)?.description || "Descripción del ejercicio"}
                    value={formExercise.description}
                    onChange={handleInputExerciseChange}
                    required
                ></textarea>
            </label>

            <label>
                Pista del ejercicio
                <textarea
                    name="hint"
                    placeholder={ejercicios.find(ex => ex.id === formExercise.id)?.hint || "Pista del ejercicio"}
                    value={formExercise.hint}
                    onChange={handleInputExerciseChange}
                    required
                ></textarea>
            </label>
            <label >
                Tener el ejercicio activo?
                <input
                    type="checkbox"
                    name="activo"
                    checked={formExercise.activo}
                    value={formExercise.activo}
                    onChange={() => setFormExercise({ ...formExercise, activo: !formExercise.activo })}
                />
            </label>
            <div className='boton-crear'>
            <button type="button" className="btn-crear-curso" onClick={handleSubmitExercise}>
              CREAR EJERCICIO
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditarEvaluacion