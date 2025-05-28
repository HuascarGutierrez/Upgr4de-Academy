import React, { useState } from 'react'; // Importa useState
import './styles/PaymentSimulationModal.css';
import qrImage from '/images/qr.webp';

function PaymentSimulationModal({ plan, onPaymentComplete, onClose }) {
    const [selectedFile, setSelectedFile] = useState(null); // Nuevo estado para el archivo
    const [fileName, setFileName] = useState(''); // Nuevo estado para el nombre del archivo

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        } else {
            setSelectedFile(null);
            setFileName('');
        }
    };

    const handleSubmit = () => {
        if (selectedFile) {
            onPaymentComplete(selectedFile); // Pasa el archivo al handler del padre
        } else {
            alert("Por favor, selecciona un archivo para subir tu comprobante.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content bento-box">
                <h2>Pago del plan {plan}</h2>
                <p>Escanea el código QR para realizar el pago.</p>
                <div className="qr-code-container">
                    <img src={qrImage} alt="Código QR de pago" className="qr-code" />
                </div>
                <p>Una vez realizado el pago, **sube tu comprobante** y haz clic en "Listo".</p>

                {/* Nuevo Input para subir comprobante */}
                <div className="file-upload-section">
                    <label htmlFor="comprobante-upload" className="custom-file-upload">
                        {fileName ? `Archivo: ${fileName}` : 'Subir Comprobante'}
                    </label>
                    <input
                        id="comprobante-upload"
                        type="file"
                        accept="image/*" // Solo acepta imágenes
                        onChange={handleFileChange}
                        style={{ display: 'none' }} // Oculta el input original
                    />
                </div>

                <div className="modal-actions">
                    <button onClick={handleSubmit} className="save-button" disabled={!selectedFile}>
                        Listo
                    </button>
                    <button onClick={onClose} className="cancel-button">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentSimulationModal;