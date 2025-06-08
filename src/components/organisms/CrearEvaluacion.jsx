import './styles/CrearEvaluacion.css'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { app } from '../../config/app';
import { useEffect, useState } from 'react';
import { collection, query, getDocs, where, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../../config/app';
import { toast } from 'react-toastify';
import { col } from 'framer-motion/client';

function CrearEvaluacion({user}) {

    const [formUnit, setFormUnit] = useState({
        title: "",
        unitId: "",
        description: "",
        number_exerciseByUnit: 0,
      });


    const [formExercise, setFormExercise] = useState({
        answer: "",
        description: "",
        exerciseByUnitId: "",
        hint: "",
        number: 0,
      });


    const counterExercisesByUnit = async (unitId) => {
    const exercisesRef = collection(db, 'exerciseByUnit');
    const q = query(exercisesRef, where('unitId', '==', unitId));
    const querySnapshot = await getDocs(q);
    const count = querySnapshot.size;
    return count + 1;
};

    const counterExercises = async (exerciseByUnitId) => {
    const exercisesRef = collection(db, 'exercises');
    const q = query(exercisesRef, where('exerciseByUnitId', '==', exerciseByUnitId));
    const querySnapshot = await getDocs(q);
    const count = querySnapshot.size;
    return count + 1;
};


    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormUnit({ ...formUnit, [name]: value });
  };

  const handleInputExerciseChange = (e) => {
    const { name, value } = e.target;
    setFormExercise({ ...formExercise, [name]: value });
  };

    const navigate = useNavigate();
    const location = useLocation();
    const datos = location.state || {};

    //console.log("datos:", datos);

    const getUnitsByCourseId = async (courseId) => {
        const unitsRef = collection(db, 'units');
        const q = query(unitsRef, where('course_id', '==', courseId));
        const querySnapshot = await getDocs(q);
        const units = [];
        querySnapshot.forEach((doc) => {
            units.push({ id: doc.id, ...doc.data() });
        });
        return units;
    }

    const [units, setUnits] = useState([]);

    const handleSubmitSelection = async (e) => {
        e.preventDefault();
        try {
            const nextNumber = await counterExercisesByUnit(formUnit.unitId);
            const exerciseByUnitRef = collection(db, 'exerciseByUnit');
            await addDoc(exerciseByUnitRef, {
                activo: true,
                title: formUnit.title,
                description: formUnit.description,
                unitId: formUnit.unitId,
                number_exerciseByUnit: nextNumber,
            }, { merge: true });
            toast.success(`¡Unidad seleccionada exitosamente!`);
            console.log("Nueva evaluacion:", formUnit);
        } catch (error) {
            toast.error("Error al crear el curso: " + error.message);
        } 
    };

    const [listEvaluaciones, setListEvaluaciones] = useState([]);

    const actualizarListaEvaluaciones = async () => {
        try {
            if (datos.courseId) {
                const exercises = await getEvaluacionesByCourseId(datos.courseId);
                return exercises;
            } else {
                toast.error("No se ha proporcionado un courseId válido.");
                return [];
            }
        } catch (error) {
            toast.error("Error al obtener las evaluaciones: " + error.message);
            return [];
        }
    };


    async function getEvaluacionesByCourseId(courseId) {
  try {
    // Paso 1: Obtener todos los IDs de units con el courseId específico
    const unitsQuery = query(
      collection(db, 'units'),
      where('course_id', '==', courseId)
    );
    
    const unitsSnapshot = await getDocs(unitsQuery);
    const unitIds = [];
    
    unitsSnapshot.forEach((doc) => {
      unitIds.push(doc.id);
    });
    
    console.log('Unit IDs encontrados:', unitIds);
    
    if (unitIds.length === 0) {
      console.log('No se encontraron units para este curso');
      return [];
    }
    
    const exercises = [];
    
    for (let i = 0; i < unitIds.length; i += 10) {
      const batch = unitIds.slice(i, i + 10);
      
      const exercisesQuery = query(
        collection(db, 'exerciseByUnit'),
        where('unitId', 'in', batch)
      );
      
      const exercisesSnapshot = await getDocs(exercisesQuery);
      
      exercisesSnapshot.forEach((doc) => {
        exercises.push({
          id: doc.id,
          ...doc.data()
        });
      });
    }
    
    console.log('Ejercicios encontrados:', exercises);
    setListEvaluaciones(exercises);
    toast.success(`¡Ejercicios obtenidos exitosamente!`);
    return exercises;
    
  } catch (error) {
    console.error('Error obteniendo ejercicios:', error);
    toast.error("Error al obtener los ejercicios: " + error.message);
  }
}


const handleSubmitExercise = async (e) => {
        e.preventDefault();
        try {
            //const nextNumber = await counterExercisesByUnit(formUnit.unitId);
            const ExerunitId = formExercise.exerciseByUnitId;
                const nextNumber = await counterExercises(ExerunitId);
            //const exerciseByUnitRef = collection(db, 'exerciseByUnit');
           // await addDoc(exerciseByUnitRef, {
           const newExercise = {
                activo: true,
                answer: formExercise.answer,
                description: formExercise.description,
                hint: formExercise.hint,
                exerciseByUnitId: formExercise.exerciseByUnitId,
                number: nextNumber,
            }
            const exerciseByUnitRef = collection(db, 'exercises');
            await addDoc(exerciseByUnitRef, newExercise, { merge: true });


           // }, { merge: true });
            toast.success(`¡Unidad seleccionada exitosamente!`);
            console.log("Nuevo ejercicio:", newExercise);
        } catch (error) {
            toast.error("Error al crear el curso: " + error.message);
        }
    };
    useEffect(() => {
        const fetchUnits = async () => {
            if (datos.courseId) {
                const unitsData = await getUnitsByCourseId(datos.courseId);
                setUnits(unitsData);
                
                const exercisesData = await actualizarListaEvaluaciones();
                setListEvaluaciones(exercisesData);
                console.log("Ejercicios obtenidos:", exercisesData);
            }
        };
        
        fetchUnits();
    }, []);

  return (
    <div className='container-crear-nuevo-curso'>
      <div className="container-title" style={{ position: 'relative' }}>
        <button type="submit" className="btn-volver" onClick={() => {navigate(-1);}} >
          <img src="/assets/circle-arrow-left.svg" alt="" />
        </button>
        <p className='crear-nuevo-curso-title'>Crear Evaluacion</p>
        <button className='btn-crear-evaluacion' style={{position: 'absolute', top: '10px', right: '10px', fontSize: '18px', padding: '2px'}}
        onClick={() => {navigate('/admin/editEvaluacion', {state: {
              courseId: datos.courseId, 
              courseTitle: datos.courseTitle, 
              courseDescription: datos.courseDescription, 
              courseImage: datos.courseImage
          }, merge: true})
          }}>Editar Evaluaciones / Ejercicios</button>
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
            <h1 className="crear-curso-title">Crear evaluacion</h1>
          </div>

          <form className="form-crear" onSubmit={handleSubmitSelection}>
            <div className="numero-titulo-container">
              <label style={{ width: '100%' }}>
                Unidad - ID
                <select 
                    name="unitId"
                    value={formUnit.unitId}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Seleccione una unidad</option>
                    {units.map(unit => (
                    <option key={unit.id} value={unit.id}>
                        {unit.title} - {unit.id}
                    </option>
                    ))}
              </select>
            </label>

            </div>

            <label>
              Descripción de la unidad
              <p>
                {units.find(unit => unit.id === formUnit.unitId)?.description || "Seleccione una unidad para ver la descripción."}
              </p>
            </label>
                { formUnit.exerciseByUnitId !== "" && (
                    <>
                    <label>
                Título de la evaluacion
                <input
                    type="text"
                    name="title"
                    placeholder="Título de la evaluacion"
                    value={formUnit.title}
                    onChange={handleInputChange}
                    required
                />
                    </label>
                    <label>
                Descripción de la evaluacion
                
                <textarea
                    name="description"
                    placeholder="Descripción de la evaluacion"
                    value={formUnit.description}
                    onChange={handleInputChange}
                    required
                ></textarea>
                    </label>
                    </>
                )}

            <div className='boton-crear'>
            <button type="button" className="btn-crear-curso" onClick={handleSubmitSelection} >
              CREAR EVALUACIÓN
            </button>
            </div>
          </form>
        </div>

        <div className="crear-container" style={{ position: 'relative' }}>
          <div>        
            <h1 className="crear-curso-title">Crear Ejercicio</h1>
          </div>
            <button type="button" className="btn-crear-evaluacion" style={{height: 'min-content', position: 'absolute', top: '20px', right: '20px'}}
            onClick={() => {actualizarListaEvaluaciones()}}
            >
              actualizar lista de evaluaciones
            </button>
          <form className="form-crear" onSubmit={handleSubmitExercise}>

          <div className="numero-titulo-container">
              <label style={{ width: '100%' }}>
                Evaluación - ID
                <select 
                    name="exerciseByUnitId"
                    value={formExercise.exerciseByUnitId}
                    onChange={handleInputExerciseChange}
                    required
                >
                    <option value="">Seleccione una unidad</option>
                    {listEvaluaciones.map(unit => (
                    <option key={unit.id} value={unit.id}>
                        {unit.title} - {unit.id}
                    </option>
                    ))}
              </select>
            </label>
            </div>

            <label>
              Descripción
              <p>
                {listEvaluaciones.find(unit => unit.id === formExercise.exerciseByUnitId)?.description || "Seleccione una unidad para ver la descripción."}
              </p>
            </label>

            <label>
                Respuesta correcta
                <input
                    type="text"
                    name="answer"
                    placeholder="Respuesta correcta"
                    value={formExercise.answer}
                    onChange={handleInputExerciseChange}
                    required
                    />
            </label>

            <label>
                Descripción del ejercicio
                <textarea
                    name="description"
                    placeholder="Descripción del ejercicio"
                    value={formExercise.description}
                    onChange={handleInputExerciseChange}
                    required
                ></textarea>
            </label>

            <label>
                Pista del ejercicio
                <textarea
                    name="hint"
                    placeholder="Pista del ejercicio"
                    value={formExercise.hint}
                    onChange={handleInputExerciseChange}
                    required
                ></textarea>
            </label>
            <div className='boton-crear'>
            <button type="submit" className="btn-crear-curso">
              CREAR EJERCICIO
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CrearEvaluacion