import React, { useState, useEffect, useRef } from 'react';
import './styles/Reportes.css';
import ReporteUsuarios from '../molecules/ReporteUsuarios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import ReportePagos from '../molecules/ReportePagos';
import ReporteCursos from '../molecules/ReporteCursos';

const Reportes = () => {
    const [selectedReport, setSelectedReport] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showReportPreview, setShowReportPreview] = useState(false);
    const [shouldShowReport, setShouldShowReport] = useState(false);
    const reportRef = useRef(null);

    const LOGO_BASE64 = 'data:image/png;base64,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';

    // Resetear la previsualización cuando cambia el tipo de reporte
    useEffect(() => {
        setShowReportPreview(false);
        setShouldShowReport(false);
    }, [selectedReport]);

    // Resetear la previsualización cuando cambian las fechas
    useEffect(() => {
        if (showReportPreview) {
            setShowReportPreview(false);
            setShouldShowReport(false);
        }
    }, [startDate, endDate]);

    const handleGenerateReport = async () => {
        if (!selectedReport || !startDate || !endDate) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Incompletos',
                text: 'Por favor, selecciona un reporte e ingresa las fechas de inicio y fin.',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        Swal.fire({
            icon: 'info',
            title: 'Generando Reporte',
            text: `Preparando reporte: ${selectedReport} desde ${startDate} hasta ${endDate}`,
            showConfirmButton: false,
            timer: 2000 // Puedes ajustar este tiempo
        });

        // Llamar a handleGeneratePDF, que ya tiene sus propias notificaciones Swal
        await handleGeneratePDF();

        setShowReportPreview(false);
        setShouldShowReport(false);
    };

    const handlePreviewReport = () => {
        if (!selectedReport || !startDate || !endDate) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Incompletos',
                text: 'Por favor, selecciona un reporte e ingresa las fechas de inicio y fin para previsualizar.',
                confirmButtonText: 'Entendido'
            });
            return;
        }
        setShowReportPreview(true);
        setShouldShowReport(true);
        Swal.fire({
            icon: 'success',
            title: 'Previsualización Lista',
            text: 'El reporte está listo para previsualizar.',
            timer: 1500,
            showConfirmButton: false
        });
    };

    const handleGeneratePDF = async () => {
        if (!reportRef.current || !selectedReport) {
            Swal.fire({
                icon: 'warning',
                title: 'Selección Incompleta',
                text: 'Por favor, asegúrate de que el reporte y su contenido estén cargados.',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        try {
            Swal.fire({
                title: 'Generando PDF',
                text: `Generando PDF del reporte ${selectedReport}...`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                logging: false, // Desactiva el logging de html2canvas
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'letter');

            // Tamaños
            const pageWidth = 210;
            const pageHeight = 295;
            const margin = 15; // margen más grande

            // Insertar logo (ajustar tamaño y posición)
            const logoWidth = 40; // ancho del logo en mm
            const logoHeight = 20; // alto del logo en mm
            pdf.addImage(LOGO_BASE64, 'PNG', margin, 10, logoWidth, logoHeight);

            // Añadir espacio debajo del logo (para que el contenido no se encime)
            const contentYStart = 10 + logoHeight + 5;

            // Escalar imagen del reporte
            const imgWidth = pageWidth - margin * 2;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let currentY = contentYStart; // Posición Y actual para el contenido

            // Añadir imagen del reporte, gestionando múltiples páginas si es necesario
            let remainingHeight = imgHeight;
            let imgX = margin;
            let imgY = contentYStart;

            while (remainingHeight > 0) {
                const pageRemainingSpace = pageHeight - imgY - margin;
                if (imgY === contentYStart && imgHeight <= pageRemainingSpace) {
                    // Si la imagen completa cabe en la primera página
                    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);
                    currentY = imgY + imgHeight + 10; // Actualizar currentY después de la imagen
                    remainingHeight = 0;
                } else {
                    // Dividir la imagen en varias páginas
                    const sHeight = pageRemainingSpace; // Altura del "slice" de la imagen para la página actual
                    const sY = imgHeight - remainingHeight; // Posición de inicio del "slice" en la imagen original

                    // Crear un canvas temporal para el "slice"
                    const sliceCanvas = document.createElement('canvas');
                    sliceCanvas.width = canvas.width;
                    sliceCanvas.height = (sHeight / imgHeight) * canvas.height;
                    const sliceCtx = sliceCanvas.getContext('2d');
                    sliceCtx.drawImage(canvas, 0, sY / (imgHeight / canvas.height), canvas.width, sliceCanvas.height, 0, 0, sliceCanvas.width, sliceCanvas.height);
                    const sliceImgData = sliceCanvas.toDataURL('image/png');

                    pdf.addImage(sliceImgData, 'PNG', imgX, imgY, imgWidth, sHeight);
                    remainingHeight -= sHeight;

                    if (remainingHeight > 0) {
                        pdf.addPage();
                        imgY = margin; // Reiniciar Y para la nueva página
                    } else {
                        currentY = imgY + sHeight + 10; // Actualizar currentY después del último "slice"
                    }
                }
            }

            // --- Sección del pie de firma ---
            // Calcular la posición Y para el pie de firma, asegurándose de que esté en la parte inferior de la última página.
            const signatureTextHeight = 7; // Altura estimada para las dos líneas de texto de la firma
            let signatureY = pageHeight - margin - signatureTextHeight;

            // Asegurarse de que la firma no se superponga con el contenido existente
            if (currentY > signatureY - 20) { // Si el contenido está muy abajo, añadir una nueva página
                pdf.addPage();
                signatureY = pageHeight - margin - signatureTextHeight;
                currentY = margin; // Reiniciar currentY para la nueva página
            }

            pdf.setFontSize(10);
            pdf.text("Travis Catacora", pageWidth / 2, signatureY, { align: 'center' });
            pdf.setFontSize(9);
            pdf.text("Administrador", pageWidth / 2, signatureY + 5, { align: 'center' });
            // --- Fin de la sección del pie de firma ---

            pdf.save(`reporte_${selectedReport}_${new Date().toISOString().slice(0, 10)}.pdf`);

            Swal.fire({
                icon: 'success',
                title: 'PDF Generado',
                text: 'El reporte PDF se ha generado exitosamente.',
                confirmButtonText: 'Ok'
            });

        } catch (error) {
            console.error('Error al generar PDF:', error); // Mantener para depuración en consola
            Swal.fire({
                icon: 'error',
                title: 'Error al Generar PDF',
                text: 'Ocurrió un error al generar el PDF. Por favor, inténtelo de nuevo.',
                confirmButtonText: 'Cerrar'
            });
        }
    };


    const renderReportComponent = () => {
        switch (selectedReport) {
            case 'usuarios':
                return (
                    <ReporteUsuarios
                        reportType={selectedReport}
                        startDate={startDate}
                        endDate={endDate}
                    />
                );
            case 'cursos':
                return (
                  <ReporteCursos
                    reportType={selectedReport}
                    startDate={startDate}
                    endDate={endDate}
                  />
                );
                return <p>Componente ReporteCursos no definido</p>; // Placeholder
            case 'historial-pagos':
                return (
                  <ReportePagos
                    reportType={selectedReport}
                    startDate={startDate}
                    endDate={endDate}
                  />
                );
                return <p>Componente ReportePagos no definido</p>; // Placeholder
            default:
                return null;
        }
    };

    return (
        <div className="reportes-container">
            <div className="reportes-title-container">
                <h1 className="reportes-title">Reportes</h1>
            </div>

            <div className="reportes-toolbar">
                <div className="reportes-form-group">
                    <label htmlFor="report-select" className="reportes-label">Seleccione un reporte:</label>
                    <select
                        id="report-select"
                        className="reportes-dropdown"
                        value={selectedReport}
                        onChange={(e) => setSelectedReport(e.target.value)}
                    >
                        <option value="">-- Seleccionar --</option>
                        <option value="cursos">Cursos existentes</option>
                        <option value="historial-pagos">Historial de pagos</option>
                        <option value="usuarios">Usuarios</option>
                    </select>
                </div>

                <div className="reportes-form-group">
                    <label htmlFor="start-date" className="reportes-label">Fecha de inicio:</label>
                    <input
                        type="date"
                        id="start-date"
                        className="reportes-date-input"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="reportes-form-group">
                    <label htmlFor="end-date" className="reportes-label">Fecha de fin:</label>
                    <input
                        type="date"
                        id="end-date"
                        className="reportes-date-input"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <button
                    className="reportes-generate-button"
                    onClick={handlePreviewReport}
                    disabled={!selectedReport || !startDate || !endDate}
                >
                    Previsualizar
                </button>

                <button
                    className="reportes-generate-button"
                    onClick={handleGenerateReport}
                    disabled={!selectedReport || !startDate || !endDate}
                >
                    Generar Pdf
                </button>
            </div>

            <div ref={reportRef}>
                {shouldShowReport && showReportPreview && renderReportComponent()}
            </div>
        </div>
    );
};

export default Reportes;
