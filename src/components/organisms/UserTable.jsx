import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import './styles/UserTable.css';

function UserTable() {
  const db = getFirestore();
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
        const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
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

  const handleCreate = async () => {
    try {
      const newUserWithDefaults = {
        ...newUser,
        createdAt: new Date().toISOString(),
        uid: crypto.randomUUID(), // Generar UID único
      };
      const docRef = await addDoc(collection(db, "users"), newUserWithDefaults);
      setData([...data, { id: docRef.id, ...newUserWithDefaults }]);
      setNewUser({ userName: '', email: '', planType: '', activo: false, imageUrl: '' });
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
      <h1>User Management</h1>
      
      {/* Formulario para crear un nuevo usuario */}
      <div className="create-user">
        <h2>Create New User</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <label>
            Name:
            <input
              type="text"
              name="userName"
              value={newUser.userName}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </label>
          <label>
            Plan Type:
            <input
              type="text"
              name="planType"
              value={newUser.planType}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </label>
          <label>
            Active:
            <input
              type="checkbox"
              name="activo"
              checked={newUser.activo}
              onChange={(e) => handleChange(e, true)}
            />
          </label>
          <label>
            Image URL:
            <input
              type="url"
              name="imageUrl"
              value={newUser.imageUrl}
              onChange={(e) => handleChange(e, true)}
            />
          </label>
          <button type="submit" className="btn-create">
            Create User
          </button>
        </form>
      </div>

      {/* Tabla de usuarios */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={user.id}>
              <th>{index + 1}</th>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.planType}</td>
              <td>{user.activo ? 'Yes' : 'No'}</td>
              <td>
                <button className="btn btn-edit" onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
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
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                Plan Type:
                <input
                  type="text"
                  name="planType"
                  value={formData.planType}
                  onChange={handleChange}
                />
              </label>
              <label>
                Active:
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                />
              </label>
              <div className="modal-buttons">
                <button type="submit" className="btn-save">Save</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingUser(null)}
                >
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
