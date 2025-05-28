import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import './styles/UsersSection.css';
import { db } from '../../config/app';
import { useNavigate } from 'react-router-dom';
import UserTable from './UserTable';
import TeacherTable from './TeacherTable';
import AdminTable from './AdminTable';

function UsersSection() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [stuSnap, teaSnap, admSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'teacher')),
          getDocs(collection(db, 'administrador'))
        ]);
        setStudents(stuSnap.docs.map((d, i) => ({ id: d.id, idx: i + 1, ...d.data() })));
        setTeachers(teaSnap.docs.map((d, i) => ({ id: d.id, idx: i + 1, ...d.data() })));
        setAdmins(admSnap.docs.map((d, i) => ({ id: d.id, idx: i + 1, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;

const renderTable = (items, role) => (
    <div className="table-block">
      <h2>{role} ({items.length})</h2>
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
          {items.map(user => (
            <tr key={user.id}>
              <td>{user.idx}</td>
              <td>{user.userName || user.teacherName || user.name}</td>
              <td>{user.email}</td>
              <td>{user.activo ? 'Sí' : 'No'}</td>
              <td>
                <button onClick={() => navigate('/admin/user-actions', { state: { user } })} className="btn-action">
                  Más acciones
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="users-section">
      <h1 className="users-unidad-title">Usuarios</h1>
      <div className="users-summary">
        <div className="summary-box">Estudiantes: {students.length}</div>
        <div className="summary-box">Docentes: {teachers.length}</div>
        <div className="summary-box">Administradores: {admins.length}</div>
      </div>
      <UserTable/>
      <TeacherTable/>
      <AdminTable/>
    </div>
  );
}

export default UsersSection;
