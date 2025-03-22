import React, { useState } from 'react';
import './styles/Perfil.css';
import { getAuth, signOut } from 'firebase/auth';
import { alertSignOut, alertWarning } from '../../config/alerts';
import { useNavigate } from 'react-router-dom';

function Perfil({user}) {
  const [activeView, setActiveView] = useState('publicProfile');
  const [name, setName] = useState('HELEN ARCO SENO');
  const [description, setDescription] = useState('SOY EL FUTURO DEL PAÍS AÑÁ');
  const [rank, setRank] = useState('RANGO PLATA');
  const [recentActivity, setRecentActivity] = useState([
    { title: 'Bread & Fred Demo', time: '6 h registradas', lastSession: 'última sesión: 29 DIC 2024' },
    { title: 'Left 4 Dead 2', time: '14 h registradas', lastSession: '29 DIC 2024' },
  ]);
  const [badges, setBadges] = useState([
    { title: 'Catacora Patana Helen Jazmin', icon: 'URL_ICONO_1' },
    { title: '', icon: 'URL_ICONO_2' },
  ]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      name: 'Plan Mensual',
      description: 'Te esperan nuevas oportunidades. Inscríbete en el plan Mensual para obtener muchos beneficios:',
      benefits: [
        'Acceso a todas las unidades',
        'Acceso al tutor artificial',
        'Acceso al apartado de supervisión',
        'Evaluaciones y ejercicios',
      ],
    },
  ]);

  const [email, setEmail] = useState('yourname@gmail.com');
  const [mobileNumber, setMobileNumber] = useState('');
  const [notification, setNotification] = useState('Allow');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [tutorName, setTutorName] = useState('');
  const [tutorEmail, setTutorEmail] = useState('');
  const [tutorPhone, setTutorPhone] = useState('');

  const navigate = useNavigate();

  const reloadPage = async () => {
    navigate('/');
    location.reload();
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        alertSignOut({ funcion: reloadPage });
      })
      .catch((error) => {
        alertWarning(`Error de logout: ${error}`);
      });
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleSave = () => {
    alert('Cambios guardados');
  };

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
          </div>
        </div>
        <div className="menu">
          <button
            className={`menu-item ${activeView === 'publicProfile' ? 'active' : ''}`}
            onClick={() => handleViewChange('publicProfile')}
          >
            VER PERFIL PÚBLICO
          </button>
          <button
            className={`menu-item ${activeView === 'myProfile' ? 'active' : ''}`}
            onClick={() => handleViewChange('myProfile')}
          >
            MI PERFIL
          </button>
          <button
            className={`menu-item ${activeView === 'subscription' ? 'active' : ''}`}
            onClick={() => handleViewChange('subscription')}
          >
            SUSCRIPCIÓN
          </button>
          <button
            className={`menu-item ${activeView === 'paymentMethod' ? 'active' : ''}`}
            onClick={() => handleViewChange('paymentMethod')}
          >
            MÉTODO DE PAGO
          </button>
          <button onClick={handleSignOut} className="menu-item">
            CERRAR CUENTA
          </button>
        </div>
      </div>

      {activeView === 'publicProfile' && (
        <div className="public-profile-card">
          <div className="profile-info">
            <img src="URL_DE_TU_AVATAR" alt="Avatar" className="avatar-large" />
            <div className="name">{name}</div>
            <div className="description">{description}</div>
            <div className="rank">{rank}</div>
          </div>
          <div className="recent-activity">
            <h3>ACTIVIDAD RECIENTE</h3>
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <h4>{activity.title}</h4>
                <p>{activity.time}</p>
                <p>{activity.lastSession}</p>
              </div>
            ))}
          </div>
          <div className="badges">
            <h3>INSIGNIAS</h3>
            {badges.map((badge, index) => (
              <div key={index} className="badge-item">
                <img src={badge.icon} alt={badge.title} />
                <p>{badge.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'myProfile' && (
        <div className="my-profile-card">
          <h2>Información Básica</h2>
          <button className="edit-profile-button">EDITAR FOTO DE PERFIL</button>
          <form>
            <label>Nombres y Apellidos</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Descripción</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            <label>Teléfono</label>
            <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />

            <h3>Información del Tutor (opcional)</h3>
            <label>Nombres y Apellidos del Tutor</label>
            <input type="text" value={tutorName} onChange={(e) => setTutorName(e.target.value)} />
            <label>Correo Electrónico del Tutor</label>
            <input type="email" value={tutorEmail} onChange={(e) => setTutorEmail(e.target.value)} />
            <label>Teléfono del Tutor</label>
            <input type="text" value={tutorPhone} onChange={(e) => setTutorPhone(e.target.value)} />

            <button className="save-button" onClick={handleSave}>Guardar</button>
          </form>
        </div>
      )}

      {activeView === 'subscription' && (
        <div className="subscription-card">
          <h2>Suscripciones</h2>
          <div className="active-subscriptions">
            <p>No tienes suscripciones activas</p>
          </div>
          <h3>Planes de Suscripción disponibles</h3>
          {subscriptionPlans.map((plan, index) => (
            <div key={index} className="plan-item">
              <h4>{plan.name}</h4>
              <p>{plan.description}</p>
              <ul>
                {plan.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
              <button>Suscribirse</button>
            </div>
          ))}
        </div>
      )}

      {activeView === 'paymentMethod' && (
        <div className="payments-card">
          <h2>Método de Pago</h2>
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
