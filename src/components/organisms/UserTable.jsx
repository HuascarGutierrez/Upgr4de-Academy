import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import './styles/UserTable.css';
import { db } from "../../config/app";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

function UserTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    planType: '',
    activo: false,
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    swal({
      title: "¿Estás seguro de eliminar este usuario?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        try {
          await deleteDoc(doc(db, "users", id));
          setData(data.filter((item) => item.id !== id));
          toast.success("Usuario eliminado");
        } catch (err) {
          console.error(err);
          toast.error("Ocurrió un error al eliminar el usuario");
        }
      } else {
        swal("El usuario está a salvo.");
      }
    });
  };;

  const handleMassDelete = async () => {
    swal({
      title: "¿Estás seguro de eliminar los usuarios seleccionados?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        try {
          await Promise.all(selectedUsers.map(id => deleteDoc(doc(db, "users", id))));
          setData(data.filter(user => !selectedUsers.includes(user.id)));
          setSelectedUsers([]);
          setSelectAll(false);
          toast.success("Usuarios eliminados");
        } catch (err) {
          console.error(err);
          toast.error("Ocurrió un error al eliminar los usuarios");
        }
      } else {
        swal("Los usuarios seleccionados están a salvo.");
      }
    });
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
      toast.success("Usuario actualizado");
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = async(e) => {
    setWait(true);
    if (e.target.files[0]) {
      setImageUrl(e.target.files[0]); // Guarda la imagen en el estado
      const imagen = e.target.files[0];
      const url = await handleUpdateImage({email: usuario?.email, image: imagen});
      const db = getFirestore();
      const userRef = doc(db, 'users', usuario?.uid);
      setDoc(userRef, {
        imageUrl: url,
      }, { merge: true }).then(() => {location.reload();});
    }
    setWait(true);
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(data.map(user => user.id));
    }
    setSelectAll(!selectAll);
  };

  return (
    <>
    <div className="Tabla">
      <div className='Header_UserTable'>
      <h1>Lista de Estudiantes</h1>
      <button className="btn btn-edit" onClick={() => navigate("/admin/createuser")}>Crear Estudiante</button>
      {selectedUsers.length > 0 && (
        <button className="btn btn-delete" onClick={handleMassDelete}>Eliminar Seleccionados ({selectedUsers.length})</button>
      )}
      </div>
      <div className='tablacontenedor'>
        <table className="styled-table">
          <thead>
            <tr>
              <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
              <th>No.</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha de Creación</th>
              <th>Plan</th>
              <th>Activo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelectUser(user.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{user.imageUrl ? (
                    <img src={user.imageUrl} alt="User" className="user-image" />
                  ) : (
                    <img src="https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad" alt="User" className="user-image" />
                  )} {user.userName}</td>
                <td>{user.email}</td>
                <td>{user.createdAt}</td>
                <td>{user.planType}</td>
                <td>{user.activo ? 'Sí' : 'No'}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => handleEdit(user)}>Editar</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Usuario</h2>
            <form className='Form_edit' onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              
              {/* Imagen de perfil */}
              <div className="profile-section">
                <img 
                  src={formData.imageUrl || "https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad"} 
                  alt="Perfil" 
                  className="profile-image"
                />
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              <label><p>Nombre:</p> 
                <input type="text" name="userName" value={formData.userName} onChange={(e) => setFormData({ ...formData, userName: e.target.value })} />
              </label>

              <label><p>Email: </p>
                <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </label>

              <label className='TipoPlan'><p>Tipo de Plan: </p>
                <select 
                  name="planType" 
                  value={formData.planType} 
                  onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                >
                  <option value="Gratuito">Gratuito</option>
                  <option value="Mensual">Mensual</option>
                </select>
              </label>

              <label><p>Activo:</p>
                <div className='check'>
                  <input type="checkbox" name="activo" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })} />
                </div> 
              </label>

              <div className="modal-buttons">
                <button type="submit" className="btn-save">Guardar</button>
                <button type="button" className="btn-cancel" onClick={() => setEditingUser(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
    </>
  );
}

export default UserTable;
