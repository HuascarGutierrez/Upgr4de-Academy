import React, { useState, useEffect } from 'react';
import { db } from "../../config/app";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import "./styles/MostrarCursos.css";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import EditUnitsForm from '../molecules/EditarUnitsForm';

function MostrarCursos() {
  const [courses, setCourses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      setUploading(true);
      const courseRef = doc(db, "courses", currentCourse.id);
      
      let imageUrl = currentCourse.link_image;
      
      // Si hay un nuevo archivo de imagen, subirlo a Storage
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `course_images/${currentCourse.id}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      // Actualizar el documento con la nueva URL (o la existente si no cambió)
      await updateDoc(courseRef, {
        ...currentCourse,
        link_image: imageUrl
      });
      
      toast.success("¡Curso actualizado con éxito!");
      setEditMode(false);
      setCurrentCourse(null);
      setImageFile(null);
      setImagePreview(null);
      fetchCourses();
    } catch (error) {
      toast.error("Error al actualizar el curso: " + error.message);
    } finally {
      setUploading(false);
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
        <div className="container">
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
              Imagen del Curso
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Vista previa" style={{maxWidth: '200px', marginTop: '10px'}} />
                </div>
              )}
              {!imagePreview && currentCourse.link_image && (
                <div className="current-image">
                  <p>Imagen actual:</p>
                  <img src={currentCourse.link_image} alt="Actual" style={{maxWidth: '200px'}} />
                </div>
              )}
            </label>
            
            <button type="submit" className="btn-editar-curso" disabled={uploading}>
              {uploading ? 'Subiendo imagen...' : 'Guardar Cambios'}
            </button>
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

          <EditUnitsForm courseId={currentCourse.id} />

        </div>
        
        

      ) : (
        <>
        <div className='boton-crear'>
          <button className='btn-crear-curso' onClick={() => {navigate("/admin/crearcurso");}}>Crear Curso</button>
        </div>
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
