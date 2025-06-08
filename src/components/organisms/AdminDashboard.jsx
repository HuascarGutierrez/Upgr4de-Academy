// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import './styles/AdminDashboard.css';

// Helper function to clean plan names (añadida para consistencia)
const getCleanPlanName = (planName) => {
    if (typeof planName === 'string' && planName.startsWith('Plan ')) {
        return planName.replace('Plan ', '');
    }
    return planName;
};

function AdminDashboard({user}) {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const db = getFirestore();
        const solicitudesRef = collection(db, 'solicitudesPagos');
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

        return () => unsubscribe();
    }, []);

    const handleApprove = async (solicitudId, userId, planSolicitadoRaw) => {
        const db = getFirestore();
        const solicitudDocRef = doc(db, 'solicitudesPagos', solicitudId);
        const userDocRef = doc(db, 'users', userId);

        // Asegurarse de que el planSolicitado esté limpio para la lógica
        const planSolicitado = getCleanPlanName(planSolicitadoRaw);

        try {
            // Mostrar confirmación antes de aprobar con SweetAlert2
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: `¿Deseas aprobar la solicitud de ${planSolicitado} para este usuario?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, aprobar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                let planEndDate = null;
                // La comparación ya se hace con el nombre limpio 'Mensual'
                if (planSolicitado === 'Mensual') {
                    const now = new Date();
                    const oneMonthLater = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
                    planEndDate = oneMonthLater;
                }

                // 1. Actualizar el estado de la solicitud a 'aprobado'
                await updateDoc(solicitudDocRef, {
                    estado: 'aprobado',
                    fechaAprobacion: serverTimestamp(),
                });

                // 2. Actualizar el plan del usuario
                const updateUserData = {
                    planType: planSolicitado, // Esto ya debería estar limpio si viene de Perfil.jsx
                    planStartDate: serverTimestamp(),
                };

                if (planEndDate) {
                    updateUserData.planEndDate = planEndDate;
                } else {
                    // Si el plan no tiene fecha de fin (ej. Gratuito), asegúrate de que se borre
                    updateUserData.planEndDate = null;
                }


                await updateDoc(userDocRef, updateUserData);

                Swal.fire(
                    '¡Aprobado!',
                    'La solicitud ha sido aprobada y el plan del usuario actualizado.',
                    'success'
                );
            }
        } catch (error) {
            console.error("Error al aprobar la solicitud:", error);
            Swal.fire(
                'Error',
                `Hubo un error al aprobar la solicitud: ${error.message}`,
                'error'
            );
        }
    };

    const handleReject = async (solicitudId) => {
        const db = getFirestore();
        const solicitudDocRef = doc(db, 'solicitudesPagos', solicitudId);

        try {
            // Mostrar confirmación antes de rechazar con SweetAlert2
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Deseas rechazar esta solicitud de pago? Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, rechazar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await updateDoc(solicitudDocRef, {
                    estado: 'rechazado',
                    fechaRechazo: serverTimestamp(),
                });
                Swal.fire(
                    '¡Rechazado!',
                    'La solicitud ha sido rechazada.',
                    'info'
                );
            }
        } catch (error) {
            console.error("Error al rechazar la solicitud:", error);
            Swal.fire(
                'Error',
                'Hubo un error al rechazar la solicitud: ${error.message}',
                'error'
            );
        }
    };

    if (loading) return <div className="admin-loading">Cargando solicitudes...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-dashboard-container">
            <h1>Solicitudes de Pago</h1>
            {solicitudes.length === 0 ? (
                <p>No hay solicitudes de pago pendientes.</p>
            ) : (
                <div className="solicitudes-list">
                    {solicitudes.map((solicitud) => (
                        <div key={solicitud.id} className="solicitud-item bento-box">
                            <p><strong>Usuario:</strong> {solicitud.userName} ({solicitud.userEmail})</p>
                            {/* Mostrar el plan solicitado tal como está en la DB, ya debería venir limpio */}
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