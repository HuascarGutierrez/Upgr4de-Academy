import React, { useState } from 'react';
import './styles/Perfil.css';
import { getAuth, signOut } from 'firebase/auth'
import {alertSignOut, alertWarning} from '../../config/alerts'
import { useNavigate } from 'react-router-dom';


function Perfil({user}) {
  const [activeView, setActiveView] = useState('myProfile');
  const [name, setName] = useState('Your Name');
  const [email, setEmail] = useState('yourname@gmail.com');
  const [mobileNumber, setMobileNumber] = useState('');
  const [notification, setNotification] = useState('Allow');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const navigate = useNavigate()
  const reloadPage = async() => {
    navigate('/');
    location.reload()
}


  const handleSignOut = async() => {
    const auth = getAuth();
    signOut(auth).then(() => {
      alertSignOut({funcion: reloadPage})
    }).catch((error) => {
      alertWarning(`Error de logout: ${error}`);
    })
  }

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSave = () => {
    // Aquí puedes añadir la lógica para guardar los cambios
    alert('Cambios guardados');
  };

  {/**const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  }; */}

  const handleNotificationChange = (e) => {
    setNotification(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div className="profile-container">
      <div className="menu-card">
        <div className="profile-header">
          <img src={user.imageUrl} alt="Avatar" className="avatar" />
          <div className="profile-info">
            <div className="name">{name}</div>
            <div className="email">{email}</div>
          </div>
        </div>
        <div className="menu">
          <div
            className={`menu-item ${activeView === 'myProfile' ? 'active' : ''}`}
            onClick={() => handleViewChange('myProfile')}
          >
            Mi Perfil {'>'}
          </div>
          <div
            className={`menu-item ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => handleViewChange('settings')}
          >
            Ajustes {'>'}
          </div>
          <div
            className={`menu-item ${activeView === 'payments' ? 'active' : ''}`}
            onClick={() => handleViewChange('payments')}
          >
            Pagos {'>'}
          </div>
          <div className="menu-item">
            Notificaciones{' '}
            <select value={notification} onChange={handleNotificationChange}>
              <option value="Allow">Permitir</option>
              <option value="Mute">Silenciar</option>
            </select>
          </div>
          <div onClick={handleSignOut} className="menu-item">
            Cerrar Sesión
          </div>
        </div>
      </div>

      {activeView === 'settings' && (
        <div className="settings-card">
          <div className="settings-header">
            <h2 className="settings-title">Ajustes</h2>
            <button className="close-button" onClick={() => handleViewChange('myProfile')}>
              X
            </button>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Número de Teléfono</label>
              <input
                type="text"
                className="form-input"
                placeholder="Añadir número"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>

            <button className="save-button" onClick={handleSave}>Guardar Cambios</button>
          </div>
        </div>
      )}

      {activeView === 'payments' && (
        <div className="payments-card">
          <div className="payments-header">
            <h2 className="payments-title">Pagos</h2>
            <button className="close-button" onClick={() => handleViewChange('myProfile')}>
              X
            </button>
          </div>
          <div className="payments-form">
            <div className="form-group">
              <label className="form-label">Método de Pago</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <option value="">Seleccione un método</option>
                <option value="tarjeta">Tarjeta de Crédito</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            {paymentMethod === 'tarjeta' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Número de Tarjeta</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha de Expiración</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MM/AA"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>
              </div>
            )}
            <button className="save-button" onClick={handleSave}>Guardar Cambios</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
