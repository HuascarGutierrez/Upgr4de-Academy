import React, { useState } from 'react';
import './styles/PaymentSimulationModal.css';
import qrImage from '/images/qr.webp';
import { ClipLoader } from 'react-spinners';

function PaymentSimulationModal({ plan, onPaymentComplete, onClose, isLoading = false }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [dragOver, setDragOver] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        processFile(file);
    };

    const processFile = (file) => {
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                alert("Por favor selecciona una imagen válida (JPG, PNG, etc.)");
                return;
            }

            // Validar tamaño (máximo 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert("El archivo debe ser menor a 10MB");
                return;
            }

            setSelectedFile(file);
            setFileName(file.name);
        } else {
            setSelectedFile(null);
            setFileName('');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const handleSubmit = () => {
        if (selectedFile && !isLoading) {
            onPaymentComplete(selectedFile);
        } else if (!selectedFile) {
            alert("Por favor, selecciona un archivo para subir tu comprobante.");
        }
    };

    const formatPlanName = (planName) => {
        // Si el plan es un objeto, extraer el nombre
        if (typeof planName === 'object' && planName?.name) {
            return planName.name;
        }
        return planName || 'Plan desconocido';
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !isLoading && onClose()}>
            <div className="modal-content bento-box">
                <div className="modal-header">
                    <h2>Pago del {formatPlanName(plan)}</h2>
                    {!isLoading && (
                        <button 
                            className="close-button" 
                            onClick={onClose}
                            aria-label="Cerrar modal"
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className="modal-body">
                    <div className="payment-instructions">
                        <p>Sigue estos pasos para completar tu pago:</p>
                        <ol>
                            <li>Escanea el código QR con tu aplicación de banca móvil</li>
                            <li>Realiza el pago correspondiente</li>
                            <li>Sube una foto del comprobante de pago</li>
                            <li>Haz clic en "Confirmar Pago"</li>
                        </ol>
                    </div>

                    <div className="qr-code-container">
                        <img 
                            src={qrImage} 
                            alt="Código QR de pago" 
                            className="qr-code" 
                        />
                        <p className="qr-instructions">
                            Escanea este código QR para realizar el pago
                        </p>
                    </div>

                    <div className="file-upload-section">
                        <div 
                            className={`file-upload-area ${dragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                id="comprobante-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isLoading}
                                style={{ display: 'none' }}
                            />
                            
                            <label htmlFor="comprobante-upload" className="file-upload-label">
                                {selectedFile ? (
                                    <div className="file-selected">
                                        <div className="file-icon">📄</div>
                                        <div className="file-info">
                                            <div className="file-name">{fileName}</div>
                                            <div className="file-size">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </div>
                                        </div>
                                        <div className="file-status">✓ Listo</div>
                                    </div>
                                ) : (
                                    <div className="file-upload-prompt">
                                        <div className="upload-icon">📸</div>
                                        <div className="upload-text">
                                            <strong>Subir Comprobante</strong>
                                            <br />
                                            Haz clic aquí o arrastra tu imagen
                                        </div>
                                        <div className="upload-hint">
                                            Formatos: JPG, PNG (máx. 10MB)
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>

                        {selectedFile && (
                            <button 
                                type="button"
                                className="remove-file-btn"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setFileName('');
                                }}
                                disabled={isLoading}
                            >
                                Cambiar archivo
                            </button>
                        )}
                    </div>
                </div>

                <div className="modal-actions">
                    <button 
                        onClick={handleSubmit} 
                        className={`confirm-button ${!selectedFile || isLoading ? 'disabled' : ''}`}
                        disabled={!selectedFile || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <ClipLoader size={16} color="#ffffff" />
                                Procesando...
                            </>
                        ) : (
                            'Confirmar Pago'
                        )}
                    </button>
                    <button 
                        onClick={onClose} 
                        className="cancel-button"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                </div>

                {isLoading && (
                    <div className="loading-overlay-modal">
                        <div className="loading-content">
                            <ClipLoader size={30} color="var(--primary-color)" />
                            <p>Subiendo comprobante...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentSimulationModal;