import React, { useState, useEffect } from 'react';
import { db } from "../../config/app";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import "./styles/MostrarCursos.css";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function MostrarCursos() {
  const [courses, setCourses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);
    } catch (error) {
      toast.error("Error al obtener los cursos: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el curso permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "courses", id));
        toast.success("¡Curso eliminado con éxito!");
        fetchCourses(); 
      } catch (error) {
        toast.error("Error al eliminar el curso: " + error.message);
      }
    }
  };


  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const courseRef = doc(db, "courses", currentCourse.id);
      await updateDoc(courseRef, currentCourse);
      toast.success("¡Curso actualizado con éxito!");
      setEditMode(false);
      setCurrentCourse(null);
      fetchCourses(); 
    } catch (error) {
      toast.error("Error al actualizar el curso: " + error.message);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourse({ ...currentCourse, [name]: value });
  };


  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="mostrar-cursos-container">
      <h1 className="mostrar-cursos-title">Cursos</h1>
      {editMode ? (
        <form className="editar-curso-form" onSubmit={handleEdit}>
          <h2>Editar Curso</h2>
          <label>
            Nombre del Curso
            <input
              type="text"
              name="title"
              value={currentCourse.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Descripción
            <textarea
              name="description"
              value={currentCourse.description}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <label>
            Categoría
            <input
              type="text"
              name="category"
              value={currentCourse.category}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Profesor
            <input
              type="text"
              name="teacher"
              value={currentCourse.teacher}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Enlace de Imagen
            <input
              type="text"
              name="link_image"
              value={currentCourse.link_image}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="btn-editar-curso">Guardar Cambios</button>
          <button
            type="button"
            className="btn-cancelar-edicion"
            onClick={() => {
              setEditMode(false);
              setCurrentCourse(null);
            }}
          >
            Cancelar
          </button>
        </form>
      ) : (
        <>
        <div className='boton-crear'>
        <button className='btn-crear-curso' onClick={() => {navigate("/admin/crearcurso");}}>Crear Curso</button></div>
        <div className="tabla-cursos">
          {courses.map(course => (
            <div className="curso-card" key={course.id}>
            <img src={course.link_image} alt={course.title} className="curso-imagen" />
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p><strong>Categoría:</strong> {course.category}</p>
              <p><strong>Profesor:</strong> {course.teacher}</p>
              <p><strong>Fecha de Creación:</strong> {course.creation_date}</p>
              
              <div className="curso-actions">
                <button
                  className="btn-editar"
                  onClick={() => {
                    setEditMode(true);
                    setCurrentCourse(course);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn-borrar"
                  onClick={() => handleDelete(course.id)}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>

  );
}

export default MostrarCursos;
