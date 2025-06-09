import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import './styles/UsersSection.css';
import { db } from '../../config/app';
import UserTable from './UserTable';
import TeacherTable from './TeacherTable';
import AdminTable from './AdminTable';

function UsersSection({user}) {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const allUsers = snapshot.docs.map((doc, i) => ({
          id: doc.id,
          idx: i + 1,
          ...doc.data(),
        }));

        setStudents(allUsers.filter(user => user.Rol === 'Estudiante'));
        setTeachers(allUsers.filter(user => user.Rol === 'Docente'));
        setAdmins(allUsers.filter(user => user.Rol === 'Administrador'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="users-section">
      <div className='contenedor-title-users'>
        <h1 className="users-unidad-title">Gestión de Usuarios</h1>
      </div>

      <div className="users-summary">
        <div className="summary-box">Estudiantes: {students.length}</div>
        <div className="summary-box">Docentes: {teachers.length}</div>
        <div className="summary-box">Administradores: {admins.length}</div>
      </div>

      <UserTable data={students} />
      <TeacherTable data={teachers} />
      <AdminTable data={admins} />
    </div>
  );
}

export default UsersSection;
