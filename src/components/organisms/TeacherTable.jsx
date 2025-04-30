import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/app';
import './styles/UserTable.css';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function TeacherTable() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    teacherName: '',
    email: '',
    imageUrl: '',
    activo: false,
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teacher"));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleDateString('es-ES') || 'N/A',
        }));
        setTeachers(list);
      } catch (err) {
        console.error("Error al cargar docentes:", err);
      }
    };
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este docente?")) {
      try {
        await deleteDoc(doc(db, "teacher", id));
        setTeachers(teachers.filter(teacher => teacher.id !== id));
        toast.success("Docente eliminado");
      } catch (error) {
        toast.error("Error al eliminar docente");
      }
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher.id);
    setFormData({
      teacherName: teacher.teacherName,
      email: teacher.email,
      imageUrl: teacher.imageUrl,
      activo: teacher.activo,
    });
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "teacher", editingTeacher);
      await updateDoc(docRef, formData);
      setTeachers(teachers.map(t => (t.id === editingTeacher ? { ...t, ...formData } : t)));
      toast.success("Docente actualizado");
      setEditingTeacher(null);
    } catch (error) {
      toast.error("Error al actualizar docente");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="Tabla">
      <div className='Header_UserTable'>
        <h1>Lista de Docentes</h1>
        <button className="btn btn-create" onClick={() => navigate("/admin/creardocente")}>Crear Docente</button>
      </div>
      <div className='tablacontenedor'>
        <table className="styled-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha de Creación</th>
              <th>Activo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher.id}>
                <td>{index + 1}</td>
                <td>
                {teacher.imageUrl ? (
                    <img src={teacher.imageUrl} alt="docente"  className="user-image" />
                  ) : (
                    <img src="https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad" alt="User" className="user-image" />
                  )}
                  {teacher.teacherName}</td>
                <td>{teacher.email}</td>
                <td>{teacher.createdAt}</td>
                <td>{teacher.activo ? 'Sí' : 'No'}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(teacher)}>Editar</button>
                  {/*<button className="btn btn-delete" onClick={() => handleDelete(teacher.id)}>Eliminar</button>*/} 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {editingTeacher && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Docente</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <label>
                Nombre:
                <input type="text" name="teacherName" value={formData.teacherName} onChange={handleChange} />
              </label>
              <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </label>
              <label>
                URL de Imagen:
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
              </label>
              <label>
                Activo:
                <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
              </label>
              <div className="modal-buttons">
                <button type="submit" className="btn-save">Guardar</button>
                <button type="button" className="btn-cancel" onClick={() => setEditingTeacher(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherTable;
