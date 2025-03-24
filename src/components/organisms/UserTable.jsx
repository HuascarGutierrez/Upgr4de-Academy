import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import './styles/UserTable.css';
import {db} from "../../config/app"
import { toast } from 'react-toastify';

function UserTable() {
  const [data, setData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    planType: '',
    activo: false,
  });

  const [newUser, setNewUser] = useState({
    userName: '',
    email: '',
    planType: '',
    activo: false,
    imageUrl: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleDateString('en-GB') || 'N/A', 
        }));
        setData(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm("Estas Seguro?")){
      try {
        await deleteDoc(doc(db, "users", id));
        setData(data.filter((item) => item.id !== id));
        toast.success("Estudiante Eliminado");
      } catch (err) {
        console.log(err);
      }
    }

  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({
      userName: user.userName,
      email: user.email,
      planType: user.planType,
      activo: user.activo,
    });
  };

  const handleUpdate = async () => {
    try {
      const userDoc = doc(db, "users", editingUser);
      await updateDoc(userDoc, formData);
      setData(data.map((item) => (item.id === editingUser ? { ...item, ...formData } : item)));
      setEditingUser(null);
    } catch (err) {
      console.log(err);
    }
  };


  const handleChange = (e, isNewUser = false) => {
    const { name, value, type, checked } = e.target;
    if (isNewUser) {
      setNewUser({
        ...newUser,
        [name]: type === 'checkbox' ? checked : value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  return (
    <div className="Tabla">
      <h1>Lista de Estudiantes</h1>
      {/* Tabla de usuarios */}
      <div className='tablacontenedor'>
      <table className="styled-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha de Creación</th>
            <th>Plan</th>
            <th>Activo</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={user.id}>
              <th>{index + 1}</th>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.createdAt }</td>
              <td>{user.planType}</td>
              <td>{user.activo ? 'Si' : 'No'}</td>
              <td>
                <button className="btn btn-edit" onClick={() => handleEdit(user)}>
                  Editar
                </button>
                <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Cuadro de edición */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <label>
                Name:
                <input type="text" name="userName" value={formData.userName} onChange={handleChange}/>
              </label>
              <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </label>
              <label>
                Plan Type:
                <input  type="text" name="planType" value={formData.planType} onChange={handleChange} />
              </label>
              <label className='Active'>
                Active:
                <div className='check'>
                <input  type="checkbox"  name="activo" checked={formData.activo} onChange={handleChange} />
                </div>
                
              </label>
              <div className="modal-buttons">
                <button type="submit" className="btn-save">Save</button>
                <button type="button" className="btn-cancel" onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;
