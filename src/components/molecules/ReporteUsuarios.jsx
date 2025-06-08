import React, { useState, useEffect } from 'react';
import { auth, db } from "../../config/app";
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './styles/ReporteUsuarios.css'; 

const ReporteUsuarios = ({ reportType, startDate, endDate }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase Auth is not available.");
      setError("Firebase Auth not available. Cannot load data.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        try {
          const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
        } catch (anonSignInError) {
          console.error("Error signing in:", anonSignInError);
          setError("Authentication error. Cannot load data.");
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!db || !isAuthReady) return;

      setLoading(true);
      setError(null);
      
      try {
        const usersCollectionRef = collection(db, 'users');
        let q = query(usersCollectionRef);
        
        // Aplicar filtros de fecha si están presentes
        if (startDate && endDate) {
          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);
          endDateObj.setHours(23, 59, 59, 999);
          
          q = query(
            usersCollectionRef,
            where('createdAt', '>=', startDateObj),
            where('createdAt', '<=', endDateObj)
          );
        }

        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setUsers(usersData);
        
        if (usersData.length === 0) {
          console.warn("No se encontraron usuarios en el rango de fechas especificado.");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Error loading user data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [db, isAuthReady, startDate, endDate]);

  const getRoleCounts = () => {
    const counts = { Administrador: 0, Estudiante: 0, Docente: 0 };
    users.forEach(user => {
      if (user.hasOwnProperty('Rol') && counts.hasOwnProperty(user.Rol)) {
        counts[user.Rol]++;
      }
    });
    return counts;
  };

  const getRolePercentage = (roleCounts) => {
    const totalUsers = users.length;
    if (totalUsers === 0) return { Administrador: 0, Estudiante: 0, Docente: 0 };

    const percentages = {};
    for (const role in roleCounts) {
      percentages[role] = ((roleCounts[role] / totalUsers) * 100).toFixed(2);
    }
    return percentages;
  };

  const filterUsersByRole = (role) => {
    return users.filter(user => user.Rol === role);
  };

  const formatActiveStatus = (isActive) => {
    return isActive ? 'Sí' : 'No';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') return 'N/A';
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return 'Invalid Date';
    }
  };

  const roleCounts = getRoleCounts();
  const rolePercentages = getRolePercentage(roleCounts);

  const adminUsers = filterUsersByRole('Administrador');
  const studentUsers = filterUsersByRole('Estudiante');
  const teacherUsers = filterUsersByRole('Docente');

  if (loading) {
    return <div className="reporte-detalle-loading">Cargando datos del reporte...</div>;
  }

  if (error) {
    return <div className="reporte-detalle-error">Error: {error}</div>;
  }

  return (
    <div className="reporte-detalle-container">
      <h2>Reporte de usuarios</h2>
      
      {startDate && endDate && (
        <p className="date-range-info">
          Mostrando usuarios registrados entre: <strong>{new Date(startDate).toLocaleDateString('es-ES')}</strong> y <strong>{new Date(endDate).toLocaleDateString('es-ES')}</strong>
        </p>
      )}

      <div className="reporte-table-section">
        <h3>Resumen de usuarios</h3>
        <table className="reporte-table">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Cantidad</th>
              <th>Porcentaje (%)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(roleCounts).map(role => (
              <tr key={role}>
                <td>{role}</td>
                <td>{roleCounts[role]}</td>
                <td>{rolePercentages[role]}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="reporte-table-section">
        <h3>Detalle de Administradores ({adminUsers.length})</h3>
        {adminUsers.length > 0 ? (
          <table className="reporte-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Activo</th>
                <th>Fecha de registro</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{formatActiveStatus(user.activo)}</td>
                  <td>{formatTimestamp(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay administradores registrados.</p>
        )}
      </div>

      <div className="reporte-table-section">
        <h3>Detalle de Estudiantes ({studentUsers.length})</h3>
        {studentUsers.length > 0 ? (
          <table className="reporte-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Activo</th>
                <th>Fecha de registro</th>
              </tr>
            </thead>
            <tbody>
              {studentUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{formatActiveStatus(user.activo)}</td>
                  <td>{formatTimestamp(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay estudiantes registrados.</p>
        )}
      </div>

      <div className="reporte-table-section">
        <h3>Detalle de Docentes ({teacherUsers.length})</h3>
        {teacherUsers.length > 0 ? (
          <table className="reporte-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Activo</th>
                <th>Fecha de registro</th>
              </tr>
            </thead>
            <tbody>
              {teacherUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{formatActiveStatus(user.activo)}</td>
                  <td>{formatTimestamp(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay docentes registrados.</p>
        )}
      </div>
    </div>
  );
};

export default ReporteUsuarios;