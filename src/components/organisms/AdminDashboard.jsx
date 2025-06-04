// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import './styles/AdminDashboard.css'; // Crea este archivo CSS

function AdminDashboard({user}) {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Considera implementar un sistema de roles para asegurar que solo los admins accedan
    // Ejemplo: const auth = getAuth(); const currentUser = auth.currentUser;
    // Verifica si currentUser tiene rol de admin antes de cargar los datos.

    useEffect(() => {
        const db = getFirestore();
        const solicitudesRef = collection(db, 'solicitudesPagos');
        // Consulta para obtener solo las solicitudes pendientes inicialmente
        const q = query(solicitudesRef, where('estado', '==', 'pendiente'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSolicitudes(data);
            setLoading(false);
        }, (err) => {
            console.error("Error al cargar solicitudes:", err);
            setError("Error al cargar las solicitudes de pago.");
            setLoading(false);
        });

        // Limpieza de la suscripción al desmontar el componente
        return () => unsubscribe();
    }, []);

    const handleApprove = async (solicitudId, userId, planSolicitado) => {
        const db = getFirestore();
        const solicitudDocRef = doc(db, 'solicitudesPagos', solicitudId);
        const userDocRef = doc(db, 'users', userId); // Referencia al documento del usuario

        try {
            // 1. Actualizar el estado de la solicitud a 'aprobado'
            await updateDoc(solicitudDocRef, {
                estado: 'aprobado',
                fechaAprobacion: serverTimestamp(),
                // Puedes añadir quién aprobó: aprobadoPor: auth.currentUser.uid
            });

            // 2. Actualizar el plan del usuario
            // Asegúrate de calcular la fecha de fin si es un plan mensual
            const now = new Date();
            const oneMonthLater = new Date(now.setMonth(now.getMonth() + 1)); // Ejemplo para 1 mes
            
            await updateDoc(userDocRef, {
                planType: planSolicitado,
                planStartDate: serverTimestamp(),
                planEndDate: oneMonthLater, // Guarda la fecha de fin
                // Otros campos relacionados con la suscripción
            });

            alert("Solicitud aprobada y plan de usuario actualizado.");
        } catch (error) {
            console.error("Error al aprobar la solicitud:", error);
            alert("Hubo un error al aprobar la solicitud.");
        }
    };

    const handleReject = async (solicitudId) => {
        const db = getFirestore();
        const solicitudDocRef = doc(db, 'solicitudesPagos', solicitudId);
        try {
            await updateDoc(solicitudDocRef, {
                estado: 'rechazado',
                fechaRechazo: serverTimestamp(),
                // Puedes añadir quién rechazó: rechazadoPor: auth.currentUser.uid
            });
            alert("Solicitud rechazada.");
        } catch (error) {
            console.error("Error al rechazar la solicitud:", error);
            alert("Hubo un error al rechazar la solicitud.");
        }
    };

    if (loading) return <div className="admin-loading">Cargando solicitudes...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-dashboard-container">
            <h1>Panel de Administración - Solicitudes de Pago</h1>
            {solicitudes.length === 0 ? (
                <p>No hay solicitudes de pago pendientes.</p>
            ) : (
                <div className="solicitudes-list">
                    {solicitudes.map((solicitud) => (
                        <div key={solicitud.id} className="solicitud-item bento-box">
                            <p><strong>Usuario:</strong> {solicitud.userName} ({solicitud.userEmail})</p>
                            <p><strong>Plan Solicitado:</strong> {solicitud.planSolicitado}</p>
                            <p><strong>Monto:</strong> {solicitud.monto} Bs.</p>
                            <p><strong>Estado:</strong> {solicitud.estado}</p>
                            <p><strong>Fecha Solicitud:</strong> {solicitud.fechaSolicitud?.toDate().toLocaleString()}</p>
                            <div className="solicitud-actions">
                                <a
                                    href={solicitud.urlComprobante}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="view-comprobante-button"
                                >
                                    Ver Comprobante
                                </a>
                                {solicitud.estado === 'pendiente' && (
                                    <>
                                        <button onClick={() => handleApprove(solicitud.id, solicitud.userId, solicitud.planSolicitado)} className="approve-button">
                                            Aprobar
                                        </button>
                                        <button onClick={() => handleReject(solicitud.id)} className="reject-button">
                                            Rechazar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;