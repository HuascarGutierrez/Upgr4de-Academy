import React, { useState } from 'react';
import "./styles/CrearCurso.css";
import { db } from "../../config/app";
import { collection, addDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

function CrearCurso() {

  const navigate = useNavigate();

  const [idCurse, setIdCurse] = useState("")
  const [idUnit, setIdUnit] = useState("")

  // crear curso
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    teacher: "",
    link_image: "",
    number_students: 0, 
    creation_date: new Date().toLocaleDateString("es-ES"),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const coursesRef = collection(db, "courses"); 
      const docRef = await addDoc(coursesRef, formData); 
      setIdCurse(docRef.id);
      toast.success(`¡Curso creado exitosamente!`);

      setFormData({
        creation_date: new Date().toLocaleDateString("es-ES"),
      });
  
    } catch (error) {
      toast.error("Error al crear el curso: " + error.message);
    }
  };

  // crear unidad
  const [unitData, setUnitData] = useState({
    course_id: "",
    title: "",
    description: "",
    number_unit: "",
  })

  const handleInputUnitChange = (e) => {
    const { name, value } = e.target;
    setUnitData({ ...unitData, [name]: value})
  }

  const handleUnitSubmit = async (e) => {
    e.preventDefault()
    try {
      const unitRef = collection(db, "units");
      unitData.number_unit = parseInt(unitData.number_unit)
      const docRef = await addDoc(unitRef, unitData);
      setIdUnit(docRef.id);
      toast.success(`¡Unidad creado exitosamente!`);
      
    } catch (error) {
      toast.error("Error al crear la unidad: " + error.message);
    }
  }

  // crear leccion
  const [lessonData, setLessonData] = useState({
    unit_id: "",
    title: "",
    description: "",
    number_lesson: "",
    link_doc: "",
    link_video: ""
  })

  const handleInputLessonChange = (e) => {
    const { name, value} =e.target;
    setLessonData({ ...lessonData, [name]: value})
  }

  const handleLessonSubmit = async (e) => {
    e.preventDefault()
    try {
      const lessonRef = collection(db, "lessons")
      lessonData.number_lesson = parseInt(lessonData.number_lesson)
      const docRef = await addDoc(lessonRef, lessonData);
      toast.success(`Lección creado exitosamente!`);
      setLessonData({
        unit_id: "",
        title: "",
        description: "",
        number_lesson: "",
        link_doc: "",
        link_video: ""
      })
    } catch (error) {
      toast.error("Error al crear la lección: " + error.message);
    }
  }

  const handleCourseImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `courses_images/${file.name}`);
      await uploadBytes(storageRef, file);
  
      const url = await getDownloadURL(storageRef);
  
      setFormData(prev => ({
        ...prev,
        link_image: url
      }));
  
      toast.success("Imagen subida correctamente");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast.error("Error al subir la imagen");
    }
  };

  return (
    <div className='container-crear-nuevo-curso'>
      <div className="container-title">
        <button type="submit" className="btn-volver" onClick={() => {navigate("/admin/listacursos");}} >
          <img src="/assets/circle-arrow-left.svg" alt="" />
        </button>
        <h1 className='crear-nuevo-curso-title'>Crear Nuevo Curso</h1>
      </div>

      <div className="container-formularios">
        <div className="crear-container">
          <div>        
            <h1 className="crear-curso-title">Llena los datos del curso</h1>
          </div>

          <form className="form-crear" onSubmit={handleSubmit}>
            <label>
              Nombre del Curso
              <input
                type="text"
                name="title"
                placeholder="Nombre del Curso"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Descripción
              <textarea
                name="description"
                placeholder="Descripción"
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </label>
            <label>
              Categoría
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione una materia</option>
                <option value="Álgebra">Álgebra</option>
                <option value="Cálculo">Cálculo</option>
                <option value="Física">Física</option>
                <option value="Química">Química</option>
              </select>
            </label>
            <label>
              Profesor
              <input
                type="text"
                name="teacher"
                placeholder="Ing."
                value={formData.teacher}
                onChange={handleInputChange}
                required
              />
            </label>
            {
              <label>
                Arrastra una imagen aquí
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCourseImageChange}
                  required
                />
              </label>
            }
            <div className='boton-crear'>
            <button type="submit" className="btn-crear-curso" >
              CREAR NUEVO CURSO
            </button>
            </div>
          </form>
        </div>

        <div className="crear-container">
          <div>        
            <h1 className="crear-curso-title">Llena los datos de la unidad</h1>
          </div>

          <form className="form-crear" onSubmit={handleUnitSubmit}>
            <div className="numero-titulo-container">
              <label className='numero-label'>
                N°
                <input
                  type="text"
                  name="number_unit"
                  placeholder="0"
                  value={unitData.number_unit}
                  onChange={handleInputUnitChange}
                  required
                />
              </label>

              <label className='titulo-label'>
                Nombre de la Unidad
                <input
                  type="text"
                  name="title"
                  placeholder="Nombre de la Unidad"
                  value={unitData.title}
                  onChange={handleInputUnitChange}
                  required
                />
              </label>
            </div>

            <label>
              Descripción
              <textarea
                name="description"
                placeholder="Descripción"
                value={unitData.description}
                onChange={handleInputUnitChange}
                required
              ></textarea>
            </label>
            <div className='boton-crear'>
            <button type="submit" className="btn-crear-curso" onClick={() => {unitData.course_id = idCurse}} >
              CREAR NUEVA UNIDAD
            </button>
            </div>
          </form>
        </div>

        <div className="crear-container">
          <div>        
            <h1 className="crear-curso-title">Llena los datos de la lección</h1>
          </div>

          <form className="form-crear" onSubmit={handleLessonSubmit}>

          <div className="numero-titulo-container">
              <label className='numero-label'>
                N°
                <input
                  type="text"
                  name="number_lesson"
                  placeholder="0"
                  value={lessonData.number_lesson}
                  onChange={handleInputLessonChange}
                  required
                />
              </label>
              <label className='titulo-label'>
                Nombre de la lección
                <input
                  type="text"
                  name="title"
                  placeholder="Nombre de la lección"
                  value={lessonData.title}
                  onChange={handleInputLessonChange}
                  required
                />
              </label>
            </div>

            <label>
              Descripción
              <textarea
                name="description"
                placeholder="Descripción"
                value={lessonData.description}
                onChange={handleInputLessonChange}
                required
              ></textarea>
            </label>
            <label>
              Ingresa el link del documento de apoyo
              <input
                type="text"
                name="link_doc"
                placeholder="https://doc_apoyo.pdf"
                value={lessonData.link_doc}
                onChange={handleInputLessonChange}
                required
              />
            </label>
            <label>
              Ingresa el id del video de apoyo
              <input
                type="text"
                name="link_video"
                placeholder="XldlrDkdj5R"
                value={lessonData.link_video}
                onChange={handleInputLessonChange}
                required
              />
            </label>

            <div className='boton-crear'>
            <button type="submit" className="btn-crear-curso" onClick={() => {lessonData.unit_id = idUnit}}>
              CREAR NUEVA LECCION
            </button>
            </div>
          </form>
        </div>


      </div>
    </div>
  );
}

export default CrearCurso;
