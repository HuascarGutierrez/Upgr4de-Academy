import React, { useState } from 'react';
import "./styles/CrearCurso.css";
import { db } from "../../config/app";
import { collection, addDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function CrearCurso() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    teacher: "",
    link_image: "",
    number_students: 0, 
    creation_date: new Date().toLocaleDateString("es-ES"), 
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const coursesRef = collection(db, "courses");
      await addDoc(coursesRef, formData); 
      toast.success("¡Curso creado exitosamente!");
      setFormData({
        title: "",
        description: "",
        category: "",
        teacher: "",
        link_image: "",
        number_students: 0,
        creation_date: new Date().toLocaleDateString("es-ES"),
      });
    } catch (error) {
      toast.error("Error al crear el curso: " + error.message);
    }
  };

  return (
    <div className="crear-curso-container">
      <h1 className="crear-curso-title">CREAR CURSO</h1>
      <button type="submit" className="btn-crear-curso" onClick={() => {navigate("/admin/listacursos");}} >
        Volver
      </button>
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
          <input
            type="text"
            name="category"
            placeholder="Física, Química"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
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
        <label>
          Enlace de Imagen
          <input
            type="text"
            name="link_image"
            placeholder="URL de la Imagen"
            value={formData.link_image}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit" className="btn-crear-curso" onClick={() => {navigate("/admin/listacursos");}} >
          CREAR NUEVO CURSO
        </button>
        
      </form>
    </div>
  );
}

export default CrearCurso;
