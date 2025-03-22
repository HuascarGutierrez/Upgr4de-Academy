import React, { useState } from 'react';
import './styles/Perfil.css';
import { getAuth, signOut } from 'firebase/auth';
import { alertSignOut, alertWarning } from '../../config/alerts';
import { useNavigate } from 'react-router-dom';
import { doc, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { useRef } from 'react';
import { handleUpdateImage } from '../../config/auth_functions';
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';

function Perfil({user}) {
  const usuario = user;

  
  console.log(usuario);

  const [wait, setWait] = useState(false);
  
  const [activeView, setActiveView] = useState('myProfile');
  const [description, setDescription] = useState('SOY EL FUTURO DEL PAÍS');
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
      name: 'Plan Gratuito',
      description: 'Inscríbete en el plan Gratuito para obtener los siguientes beneficios:',
      benefits: [
        'Acceso a algunas las unidades',
        'Acceso al 50% del contenido',
        'Evaluaciones y ejercicios',
      ],
      plan: 'free',
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
      plan: 'monthly',
    },
    
  ]);

  const fullNameRef = useRef('');
  const [imageUrl, setImageUrl] = useState('https://firebasestorage.googleapis.com/v0/b/sapi-5c389.firebasestorage.app/o/images_profiles%2Fdefault_img_profile.webp?alt=media&token=56d413c0-7595-4131-8a5d-2213d13c3cad');
  //const [email, setEmail] = useState('yourname@gmail.com');
  //const [mobileNumber, setMobileNumber] = useState('');
  //const [notification, setNotification] = useState('Allow');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [tutorName, setTutorName] = useState('');
  const [tutorEmail, setTutorEmail] = useState('');
  const [tutorPhone, setTutorPhone] = useState('');

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

  
  const handleNotificationChange = (e) => {
    setNotification(e.target.value);
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  const handleImageChange = async(e) => {
    setWait(true);
    if (e.target.files[0]) {
      setImageUrl(e.target.files[0]); // Guarda la imagen en el estado
      const imagen = e.target.files[0];
      const url = await handleUpdateImage({email: usuario?.email, image: imagen});
      const db = getFirestore();
      const userRef = doc(db, 'users', usuario?.uid);
      setDoc(userRef, {
        imageUrl: url,
      }, { merge: true }).then(() => {location.reload();});
    }
    setWait(true);
  };
  
  const handleSaveName = async (e) => {
    e.preventDefault();
    const fullName = fullNameRef.current.value;  
    console.log(fullName.length); 
    if(fullName.length < 8){
      alertWarning('El nombre debe tener al menos 8 caracteres');
      return;
    } 
    const db = getFirestore();
    const userRef = doc(db, 'users', usuario?.uid);
      setDoc(userRef, {
        userName: fullName,
      }, { merge: true }).then(() => {location.reload();});
  };

  const cambiarPlan = async (plan) => {
    const db = getFirestore();
    const userRef = doc(db, 'users', usuario?.uid);
    setDoc(userRef, {
      planType: plan,
    }, { merge: true }).then(() => {location.reload();});
  }

  /**const deactiveUser = async () => {
    const db = getFirestore();
    const userRef = doc(db, 'users', usuario?.uid);
    setDoc(userRef, {
      activo: false,
    }, { merge: true }).then(() => {location.reload();});
    signOut(getAuth())
      .then(() => {
        alertSignOut();
        navigate('/');
      })
      .catch((error) => {
        alertWarning(`Error de logout: ${error}`);
      });
  }

  const advice = async () => {
    Swal.fire({
      title: '¿Estás seguro de eliminar tu cuenta?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar cuenta',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ff0000',
      cancelButtonColor: '#ccccff',
      preConfirm: () => {
        deactiveUser();
      }
    })
  } */

  return (
    <div className="profile-container">
      <div className="menu-card">
        <div className="profile-header">
          <img src={usuario?.imageUrl} alt="Avatar" className="avatar" />
          <div className="profile-info">
            <div className="name">{usuario?.userName}</div>
          </div>
        </div>
        <div className="menu">
          {/**<a href='#perfilPublico'
            className={`menu-item ${activeView === 'publicProfile' ? 'active' : ''}`}
            onClick={() => handleViewChange('publicProfile')}
          >
            VER PERFIL PÚBLICO
          </a> */}
          <a href='#miPerfil'
            className={`menu-item ${activeView === 'myProfile' ? 'active' : ''}`}
            onClick={() => handleViewChange('myProfile')}
          >
            MI PERFIL
          </a>
          <a href='#suscripcion'
            className={`menu-item ${activeView === 'subscription' ? 'active' : ''}`}
            onClick={() => handleViewChange('subscription')}
          >
            SUSCRIPCIÓN
          </a>
          <a href='#metodoPago'
            className={`menu-item ${activeView === 'paymentMethod' ? 'active' : ''}`}
            onClick={() => handleViewChange('paymentMethod')}
          >
            MÉTODO DE PAGO
          </a>
          <button onClick={handleSignOut} className="menu-item" >
            CERRAR SESIÓN
          </button>
        </div>
      </div>

      {activeView === 'publicProfile' && (
        <div id='perfilPublico' className="public-profile-card">

          <div className="profile-info">
            <img src={usuario?.imageUrl} alt="" className="avatar-large" />
            <div className="name">{usuario?.userName}</div>
            <div className="description">{description}</div>
            <div className="rank">{rank}</div>
          </div>

          {/**<div className="recent-activity">
            <h3>ACTIVIDAD RECIENTE</h3>
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <h4>{activity.title}</h4>
                <p>{activity.time}</p>
                <p>{activity.lastSession}</p>
              </div>
            ))}
          </div>
          */}
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
        <div id='miPerfil' className="my-profile-card">
          <h2>Información Básica</h2>
          <form>
            {
              wait?
              <div style={{marginInline: 'auto', width: 'min-content'}}><ClipLoader color="var(--swans-down-400)" size={40}/></div>: 
              <label> Cambiar foto de perfil
              <input type="file" accept="image/*" onChange={handleImageChange}/>
              </label>
            }
            <label> Cambiar nombre completo
              <input minLength={8} type="text" ref={fullNameRef} placeholder={user?.userName}/>
              <button className="save-button" onClick={handleSaveName}>Guardar Nombre</button>
            </label>
            {/**<label>Descripción</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /> 
            <label>Teléfono</label>
            <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />*/}
            
            {/**<h3>Información del Tutor (opcional)</h3>
            <label>Nombres y Apellidos del Tutor</label>
            <input type="text" value={tutorName} onChange={(e) => setTutorName(e.target.value)} />
            <label>Correo Electrónico del Tutor</label>
            <input type="email" value={tutorEmail} onChange={(e) => setTutorEmail(e.target.value)} />
            <label>Teléfono del Tutor</label>
            <input type="text" value={tutorPhone} onChange={(e) => setTutorPhone(e.target.value)} /> */}
          </form>
        </div>
      )}

      {activeView === 'subscription' && (
        <div id='suscripcion' className="subscription-card">
          <h2>Suscripciones</h2>
          <div className="active-subscriptions">
            {subscriptionPlans.map((plan, index) => (
              plan.plan == usuario.planType? 
              <div key={index} className="plan-item">
                <h4>{plan.name}</h4>
                <p>{plan.description}</p>
                <ul>
                  {plan.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
                <button>Plan actual</button>
              </div> : <div style={{display: 'none'}}></div>
            ))}
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
              {plan.plan == usuario.planType?
              <p style={{textAlign: 'center'}}>Suscrito</p>:
              <button onClick={() => {cambiarPlan(plan.plan)}}>Suscribirse</button>
              }
            </div>
          ))}
        </div>
      )}

      {activeView === 'paymentMethod' && (
        <div id='metodoPago' className="payments-card">
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
