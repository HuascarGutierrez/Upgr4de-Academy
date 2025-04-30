import React, { useState } from 'react';
import './styles/Perfil.css';
import { getAuth, signOut } from 'firebase/auth';
import { alertSignOut, alertWarning } from '../../config/alerts';
import { useNavigate } from 'react-router-dom';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useRef } from 'react';
import { handleUpdateImage } from '../../config/auth_functions';
import { ClipLoader } from 'react-spinners';
import SubscriptionSection from './SubscriptionSection';

function Perfil({ user }) {
  const usuario = user;
  const [activeView, setActiveView] = useState('myProfile');
  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      name: 'Plan Gratuito',
      description: 'Inscríbete en el plan Gratuito para obtener los siguientes beneficios:',
      benefits: [
        'Acceso a algunas las unidades',
        'Acceso al 50% del contenido',
        'Evaluaciones y ejercicios',
      ],
      plan: 'Gratuito',
    },
    {
      name: 'Plan Mensual',
      description: 'Te esperan nuevas oportunidades. Inscríbete en el plan Mensual para obtener muchos beneficios:',
      benefits: [
        'Acceso a todas las unidades',
        'Acceso al tutor artificial',
        'Acceso al apartado de supervisión',
        'Evaluaciones y ejercicios',
      ],
      plan: 'Mensual',
    },
  ]);

  const fullNameRef = useRef('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [wait, setWait] = useState(false);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        alertSignOut();
        navigate('/');
      })
      .catch((error) => {
        alertWarning(`Error de logout: ${error}`);
      });
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleImageChange = async (e) => {
    setWait(true);
    if (e.target.files[0]) {
      const imagen = e.target.files[0];
      const url = await handleUpdateImage({ email: usuario?.email, image: imagen });
      const db = getFirestore();
      const userRef = doc(db, 'users', usuario?.uid);
      setDoc(userRef, {
        imageUrl: url,
      }, { merge: true }).then(() => { location.reload(); });
    }
    setWait(false);
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    const fullName = fullNameRef.current.value;
    if (fullName.length < 8) {
      alertWarning('El nombre debe tener al menos 8 caracteres');
      return;
    }
    const db = getFirestore();
    const userRef = doc(db, 'users', usuario?.uid);
    setDoc(userRef, {
      userName: fullName,
    }, { merge: true }).then(() => { location.reload(); });
  };

  const cambiarPlan = async (plan) => {
    const db = getFirestore();
    const userRef = doc(db, 'users', usuario?.uid);
    setDoc(userRef, {
      planType: plan,
    }, { merge: true }).then(() => { location.reload(); });
  }

  return (
    <div className="profile-container bento-grid">
      <h1 className="bento-title">Perfil</h1>

      <div className="menu-card bento-box">
        <div className="profile-header">
          <img src={usuario?.imageUrl} alt="Avatar" className="avatar" />
          <div className="profile-info">
            <div className="name">{usuario?.userName}</div>
          </div>
        </div>
        <div className="menu">
          <a
            href="#miPerfil"
            className={`menu-item ${activeView === 'myProfile' ? 'active' : ''}`}
            onClick={() => handleViewChange('myProfile')}
          >
            MI PERFIL
          </a>
          <a
            href="#suscripcion"
            className={`menu-item ${activeView === 'subscription' ? 'active' : ''}`}
            onClick={() => handleViewChange('subscription')}
          >
            SUSCRIPCIÓN
          </a>
          <a
            href="#metodoPago"
            className={`menu-item ${activeView === 'paymentMethod' ? 'active' : ''}`}
            onClick={() => handleViewChange('paymentMethod')}
          >
            MÉTODO DE PAGO
          </a>
          <button onClick={handleSignOut} className="menu-item">
            CERRAR SESIÓN
          </button>
        </div>
      </div>

      {activeView === 'publicProfile' && (
        <div id="perfilPublico" className="public-profile-card bento-box">
          <div className="profile-info">
            <img src={usuario?.imageUrl} alt="" className="avatar-large" />
            <div className="name">{usuario?.userName}</div>
            <div className="description">SOY EL FUTURO DEL PAÍS</div>
            <div className="rank">RANGO PLATA</div>
          </div>
          <div className="badges">
            <h3>INSIGNIAS</h3>
            <div>
              <div className="badge-item">
                <p>Catacora Patana Helen Jazmin</p>
              </div>
              <div className="badge-item">
                <p></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'myProfile' && (
        <div id="miPerfil" className="my-profile-card bento-box">
          <h2>Información Básica</h2>
          <form>
            {wait ? (
              <div className="loader-container">
                <ClipLoader color="var(--swans-down-400)" size={40} />
              </div>
            ) : (
              <label className="form-label-box">
                Cambiar foto de perfil
                <input type="file" accept="image/*" onChange={handleImageChange} className="form-input-file" />
              </label>
            )}
            <label className="form-label-box">
              Cambiar nombre completo
              <input minLength={8} type="text" ref={fullNameRef} placeholder={user?.userName} className="form-input-text" />
              <button className="save-button">Guardar Nombre</button>
            </label>
          </form>
        </div>
      )}

      {activeView === 'subscription' && (
        <SubscriptionSection
          user={usuario}
          subscriptionPlans={subscriptionPlans}
          cambiarPlan={cambiarPlan}
          className="bento-box" // Añade la clase bento-box aquí
        />
      )}

      {activeView === 'paymentMethod' && (
        <div id="metodoPago" className="payments-card bento-box">
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
            <button className="save-button">Guardar Cambios</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;