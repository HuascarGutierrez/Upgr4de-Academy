import React from 'react';
import './styles/PaymentSimulationModal.css'; // Necesitarás crear este archivo CSS
// Si utilizas PropTypes, importarlos aquí:
// import PropTypes from 'prop-types';

function PaymentSimulationModal({ plan, onPaymentComplete, onClose }) {
    // Aquí podrías tener lógica para generar un QR real si lo tuvieras,
    // pero para la simulación, usaremos una imagen o texto placeholder.
    const qrCodePlaceholder = '/images/qr-placeholder.png'; // Asegúrate de tener una imagen de QR en esta ruta o ajusta la ruta

    return (
        <div className="modal-overlay"> {/* Fondo oscuro semitransparente */}
            <div className="modal-content bento-box"> {/* Contenedor del contenido del modal */}
                <h2>Pago del plan {plan}</h2>
                <p>Escanea el código QR para realizar el pago.</p>
                <div className="qr-code-container">
                    <img src={qrCodePlaceholder} alt="Código QR de ejemplo" className="qr-code" />
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

// Si usas PropTypes, descomenta y define las validaciones para tus props
/*
PaymentSimulationModal.propTypes = {
  plan: PropTypes.string.isRequired, // plan debería ser un string y es requerido
  onPaymentComplete: PropTypes.func.isRequired, // onPaymentComplete debería ser una función y es requerida
  onClose: PropTypes.func.isRequired, // onClose debería ser una función y es requerida
};
*/

export default PaymentSimulationModal;