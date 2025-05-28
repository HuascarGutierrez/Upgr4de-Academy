import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/app';
import './styles/UserTable.css';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function AdminTable() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Rol: '',
    activo: false,
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "administrador"));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdmins(list);
      } catch (err) {
        console.error("Error al cargar administradores:", err);
      }
    };
    fetchAdmins();
  }, []);

  const handleEdit = (admin) => {
    setEditingAdmin(admin.id);
    setFormData({
      Name: admin.Name,
      Email: admin.Email,
      Rol: admin.Rol,
      activo: admin.activo,
    });
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "administrador", editingAdmin);
      await updateDoc(docRef, formData);

      setAdmins(admins.map(a =>
        a.id === editingAdmin ? { ...a, ...formData } : a
      ));

      Swal.fire({
        title: "Administrador actualizado",
        icon: "success",
      });
      setEditingAdmin(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salió mal al actualizar.",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCancel = () => {
    setEditingAdmin(null);
  };

  return (
    <div className="Tabla">
      <div className='Header_UserTable'>
        <h2>Lista de Administradores</h2>
        <button className="btn btn-create" onClick={() => navigate("/admin/crearadmin")}>Crear Administrador</button>
      </div>
      <div className='tablacontenedor'>
        <table className="styled-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Activo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={admin.id}>
                <td>{index + 1}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.activo ? 'Sí' : 'No'}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(admin)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingAdmin && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Administrador</h2>
            <form className='Form_edit' onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <label>
                Nombre:
                <input type="text" name="Name" value={formData.Name} onChange={handleChange} />
              </label>
              <label>
                Email:
                <input type="email" name="Email" value={formData.Email} onChange={handleChange} />
              </label>
              <label>
                Activo
                <div className='check'>
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    style={{ marginLeft: '10px' }}
                  />
                </div>
              </label>

              <div className="modal-buttons">
                <button type="submit" className="btn-save">Guardar</button>
                <button type="button" className="btn-cancel" onClick={handleCancel}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTable;
