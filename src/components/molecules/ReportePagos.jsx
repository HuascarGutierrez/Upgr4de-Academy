import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/app';
import './styles/ReportePagos.css';

const ReportePagos = ({ startDate, endDate }) => {
    const [pagosAprobados, setPagosAprobados] = useState([]);
    const [pagosPendientes, setPagosPendientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Monto constante por pago
    const MONTO_POR_PAGO = 120;

    useEffect(() => {
        const fetchPagos = async () => {
            try {
                setLoading(true);
                setError(null);

                const solicitudesRef = collection(db, 'solicitudesPagos');
                let q = query(solicitudesRef);

                // Aplicar filtro de fechas si están presentes
                if (startDate && endDate) {
                    const startDateObj = new Date(startDate);
                    const endDateObj = new Date(endDate);
                    endDateObj.setHours(23, 59, 59, 999);

                    q = query(
                        solicitudesRef,
                        where('fechaSolicitud', '>=', startDateObj),
                        where('fechaSolicitud', '<=', endDateObj)
                    );
                }

                const querySnapshot = await getDocs(q);
                const allPagos = [];

                querySnapshot.forEach((doc) => {
                    allPagos.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                // Filtrar pagos por estado
                const aprobados = allPagos.filter(pago => pago.estado === 'aprobado');
                const pendientes = allPagos.filter(pago => pago.estado === 'pendiente');

                setPagosAprobados(aprobados);
                setPagosPendientes(pendientes);

            } catch (err) {
                console.error("Error al obtener los pagos:", err);
                setError("Error al cargar los datos de pagos");
            } finally {
                setLoading(false);
            }
        };

        fetchPagos();
    }, [startDate, endDate]);

    // Función para formatear fechas
    const formatDate = (timestamp) => {
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
            console.error("Error formateando fecha:", e);
            return 'Fecha inválida';
        }
    };

    if (loading) {
        return <div className="reporte-loading">Cargando datos de pagos...</div>;
    }

    if (error) {
        return <div className="reporte-error">Error: {error}</div>;
    }

    const totalAprobados = pagosAprobados.length * MONTO_POR_PAGO;
    const totalPendientes = pagosPendientes.length * MONTO_POR_PAGO;
    const totalGeneral = totalAprobados + totalPendientes;

    return (
        <div className="reporte-container">
            <div className="reporte-header">
                <h2 className="reporte-title">Reporte de Pagos</h2>
                {startDate && endDate && (
                    <p className="reporte-periodo">
                        Periodo: {new Date(startDate).toLocaleDateString('es-ES')} - {new Date(endDate).toLocaleDateString('es-ES')}
                    </p>
                )}
            </div>

            {/* Tabla de Pagos Aprobados */}
            <div className="reporte-section">
                <h3>Pagos Aprobados ({pagosAprobados.length})</h3>
                {pagosAprobados.length > 0 ? (
                    <table className="reporte-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Monto</th>
                                <th>Fecha Solicitud</th>
                                <th>Fecha Aprobación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagosAprobados.map((pago) => (
                                <tr key={pago.id}>
                                    <td data-label="Nombre">{pago.userName || 'N/A'}</td>
                                    <td data-label="Email">{pago.userEmail || 'N/A'}</td>
                                    <td data-label="Monto">${MONTO_POR_PAGO.toFixed(2)}</td> {/* Monto constante */}
                                    <td data-label="Fecha Solicitud">{formatDate(pago.fechaSolicitud)}</td>
                                    <td data-label="Fecha Aprobación">{formatDate(pago.fechaAprovacion)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay pagos aprobados en este periodo.</p>
                )}
            </div>

            {/* Tabla de Pagos Pendientes */}
            <div className="reporte-section">
                <h3>Pagos Pendientes ({pagosPendientes.length})</h3>
                {pagosPendientes.length > 0 ? (
                    <table className="reporte-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Monto</th>
                                <th>Fecha Solicitud</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagosPendientes.map((pago) => (
                                <tr key={pago.id}>
                                    <td data-label="Nombre">{pago.userName || 'N/A'}</td>
                                    <td data-label="Email">{pago.userEmail || 'N/A'}</td>
                                    <td data-label="Monto">${MONTO_POR_PAGO.toFixed(2)}</td> {/* Monto constante */}
                                    <td data-label="Fecha Solicitud">{formatDate(pago.fechaSolicitud)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay pagos pendientes en este periodo.</p>
                )}
            </div>

            {/* Tabla de Totales */}
            <div className="reporte-section reporte-totales-section">
                <h3>Resumen de Totales</h3>
                <table className="reporte-table reporte-totales-table">
                    <tbody>
                        <tr>
                            <td>Total Pagos Aprobados</td>
                            <td>${totalAprobados.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Total Pagos Pendientes</td>
                            <td>${totalPendientes.toFixed(2)}</td>
                        </tr>
                        <tr className="total-general-row">
                            <td>Total General</td>
                            <td>${totalGeneral.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportePagos;
