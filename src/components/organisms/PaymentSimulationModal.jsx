import React from 'react';
import './styles/PaymentSimulationModal.css'; 
import qrImage from '/images/qr.webp'; 


function PaymentSimulationModal({ plan, onPaymentComplete, onClose }) {
    const qrCodePlaceholder = '/images/qr-placeholder.png'; 
    return (
        <div className="modal-overlay"> {/* Fondo oscuro semitransparente */}
            <div className="modal-content bento-box"> {/* Contenedor del contenido del modal */}
                <h2>Pago del plan {plan}</h2>
                <p>Escanea el código QR para realizar el pago.</p>
                <div className="qr-code-container">
                    <img src={qrImage} alt="Código QR de ejemplo" className="qr-code" />
                    {/* O si no tienes la imagen, podrías usar un div con estilo */}
                    {/* <div className="qr-code-placeholder">QR Code Placeholder</div> */}
                </div>
                <p>Una vez "realizado" el pago, haz clic en "Listo".</p>
                <div className="modal-actions">
                    {/* Los botones llaman a las funciones pasadas como props */}
                    <button onClick={onPaymentComplete} className="save-button">Listo</button>
                    <button onClick={onClose} className="cancel-button">Cancelar</button> {/* Botón de cancelar opcional */}
                </div>
            </div>
        </div>
    );
}


export default PaymentSimulationModal;