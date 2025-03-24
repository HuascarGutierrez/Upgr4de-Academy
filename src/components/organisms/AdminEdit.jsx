import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import './styles/AdminEdit.css';

function AdminEdit() {
    const { id } = useParams(); // Obtiene el ID del usuario desde la URL
    const navigate = useNavigate();
    const db = getFirestore();
    const [formData, setFormData] = useState({
      userName: '',
      email: '',
      planType: '',
      activo: false,
    });
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', id));
          if (userDoc.exists()) {
            setFormData(userDoc.data());
          } else {
            console.log('No such document!');
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchUser();
    }, [db, id]);
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    };
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const userDoc = doc(db, 'users', id);
        await updateDoc(userDoc, formData);
        navigate('/usertable'); // Navega de regreso a la tabla de usuarios
      } catch (err) {
        console.log(err);
      }
    };
  
    return (
      <div className="edit-user">
        <h2>Edit User</h2>
        <form onSubmit={handleUpdate}>
          <label>
            Name:
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Plan Type:
            <input
              type="text"
              name="planType"
              value={formData.planType}
              onChange={handleChange}
              required
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
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate('/usertable')}>
            Cancel
          </button>
        </form>
      </div>
    );
}

export default AdminEdit