import React, { useState, useRef, useEffect } from 'react'; // Importamos useEffect para sincronizar el ref
import './styles/Perfil.css';
import { getAuth, signOut } from 'firebase/auth';
import { alertSignOut, alertWarning } from '../../config/alerts';
import { useNavigate } from 'react-router-dom';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { handleUpdateImage } from '../../config/auth_functions'; // Asegúrate de que esta ruta es correcta
import { ClipLoader } from 'react-spinners';
import SubscriptionSection from './SubscriptionSection';
// Importa o define tu componente/lógica para la vista de pago simulada
import PaymentSimulationModal from './PaymentSimulationModal'; // Suponiendo que creas un nuevo componente

// Considera añadir PropTypes para la prop `user` si no usas TypeScript
function Perfil({ user }) {
  // Elimina la variable `usuario` redundante. Usa `user` directamente.
  // const usuario = user; // Eliminada

  const [activeView, setActiveView] = useState('myProfile');
  // Mantén los planes de suscripción aquí o cárgalos de otro lugar si son dinámicos
  // No es necesario que sea un estado si no esperas que cambien durante la vida del componente
  const [subscriptionPlans] = useState([
    {
      name: 'Plan Gratuito',
      description: 'Inscríbete en el plan Gratuito para obtener los siguientes beneficios:',
      benefits: [
        'Acceso a algunas las unidades',
        'Acceso al 50% del contenido',
        'Evaluaciones y ejercicios',
      ],
      plan: 'Gratuito',
      price: 0, // Precio en Bolivianos
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
      price: 120, // Precio en Bolivianos
    },
  ]);

  // Inicializa el valor del ref si quieres mostrar el nombre actual para editar
  // Usa user?.userName como valor inicial
  const fullNameRef = useRef(user?.userName || '');

  // Puedes considerar agrupar estados relacionados como estos
  // const [paymentDetails, setPaymentDetails] = useState({ method: '', cardNumber: '', expirationDate: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [wait, setWait] = useState(false);

  // Nuevo estado para el modal de pago
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [planToSubscribe, setPlanToSubscribe] = useState(null);

  const navigate = useNavigate();

  // Efecto para sincronizar el ref con el nombre del usuario si la prop `user` cambia
  // Esto asegura que si el nombre se actualiza externamente, el input refleje el cambio
  useEffect(() => {
    if (user?.userName) {
      fullNameRef.current.value = user.userName;
    }
  }, [user?.userName]); // Dependencia del nombre del usuario

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
    // Opcional: puedes añadir scroll smooth a la sección correspondiente aquí si usas IDs en tus divs de contenido
    // const section = document.getElementById(view);
    // if (section) {
    //   section.scrollIntoView({ behavior: 'smooth' });
    // }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    // Opcional: resetear otros campos de pago al cambiar de método
    // setCardNumber('');
    // setExpirationDate('');
  };

  const handleImageChange = async (e) => {
    setWait(true);
    // Verifica que hay un archivo y que la información del usuario es válida
    if (e.target.files && e.target.files[0] && user?.email && user?.uid) {
      const imagen = e.target.files[0];
      try {
        // Asegúrate de que handleUpdateImage espera un objeto con email e image
        const url = await handleUpdateImage({ email: user.email, image: imagen });
        const db = getFirestore();
        // Usa user.uid para la referencia al documento
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          imageUrl: url,
        }, { merge: true });
        // Considera actualizar el estado del usuario en lugar de recargar para una experiencia más fluida
        location.reload(); // Mantengo tu lógica original, pero es mejor evitarlo
      } catch (error) {
        alertWarning(`Error al actualizar la imagen: ${error}`);
      }
    } else if (!user?.email || !user?.uid) {
      alertWarning("No se pudo obtener la información del usuario para actualizar la imagen.");
    }
    setWait(false);
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    const fullName = fullNameRef.current.value.trim(); // Usa trim() para eliminar espacios en blanco
    if (fullName.length < 8) {
      alertWarning('El nombre debe tener al menos 8 caracteres');
      return;
    }
    if (!user?.uid) { // Verifica que el uid del usuario exista
      alertWarning("No se pudo obtener la información del usuario para actualizar el nombre.");
      return;
    }
    const db = getFirestore();
    // Usa user.uid para la referencia al documento
    const userRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userRef, {
        userName: fullName,
      }, { merge: true });
      // Considera actualizar el estado del usuario en lugar de recargar
      location.reload(); // Mantengo tu lógica original, pero es mejor evitarlo
    } catch (error) {
      alertWarning(`Error al guardar el nombre: ${error}`);
    }
  };

  // Función original renombrada y ahora llamada por handlePaymentComplete
  const updatePlanInFirestore = async (plan) => {
    if (!user?.uid) { // Usa user.uid
      alertWarning("No se pudo obtener la información del usuario para actualizar el plan.");
      return;
    }
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid); // Usa user.uid
    try {
      await setDoc(userRef, {
        planType: plan,
      }, { merge: true });
      // Considera actualizar el estado del usuario en lugar de recargar
      location.reload(); // Mantengo tu lógica original, pero es mejor evitarlo
    } catch (error) {
      alertWarning(`Error al actualizar el plan: ${error}`);
    }
  }

  // Nueva función para iniciar el proceso de pago (mostrar el modal)
  const handleInitiatePayment = (plan) => {
    setPlanToSubscribe(plan);
    setShowPaymentModal(true);
  };

  // Nueva función llamada cuando el usuario hace clic en "Listo" en el modal
  const handlePaymentComplete = async () => {
    // Aquí podrías añadir lógica para verificar el pago si no fuera una simulación
    // Como es simulación, simplemente actualizamos el plan
    if (planToSubscribe) {
      await updatePlanInFirestore(planToSubscribe);
    }
    // Ocultar el modal
    setShowPaymentModal(false);
    setPlanToSubscribe(null); // Limpiar el plan a suscribir
  };

  // Nueva función para cerrar el modal si el usuario cancela (opcional)
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPlanToSubscribe(null);
  };


  return (
    <div className="profile-container bento-grid">
      <h1 className="bento-title">Perfil</h1>

      <div className="menu-card bento-box">
        <div className="profile-header">
          {/* Simplifica la lógica para mostrar la imagen usando un operador ternario */}
          <img
            src={user?.imageUrl || "/images/default_img_profile.webp"}
            alt="Avatar"
            className="avatar"
          />
          <div className="profile-info">
            {/* Usa user?.userName directamente */}
            <div className="name">{user?.userName || 'Cargando Nombre...'}</div> {/* Muestra un placeholder si el nombre no está cargado */}
          </div>
        </div>
        <div className="menu">
          {/* Usa botones (<button>) para acciones interactivas en lugar de enlaces (<a>) */}
          <button
            className={`menu-item ${activeView === 'myProfile' ? 'active' : ''}`}
            onClick={() => handleViewChange('myProfile')}
            // Añade type="button" para evitar comportamientos inesperados de formulario
            type="button"
          >
            MI PERFIL
          </button>
          <button
            className={`menu-item ${activeView === 'subscription' ? 'active' : ''}`}
            onClick={() => handleViewChange('subscription')}
            type="button"
          >
            SUSCRIPCIÓN
          </button>
          <button onClick={handleSignOut} className="menu-item" type="button">
            CERRAR SESIÓN
          </button>
        </div>
      </div>

      {activeView === 'publicProfile' && (
        <div id="perfilPublico" className="public-profile-card bento-box">
          <div className="profile-info">
            {/* Simplifica la lógica para mostrar la imagen usando un operador ternario */}
            <img src={user?.imageUrl || "/images/default_img_profile.webp"} alt="" className="avatar-large" />
            {/* Usa user?.userName directamente */}
            <div className="name">{user?.userName || 'Cargando Nombre...'}</div>
            <div className="description">SOY EL FUTURO DEL PAÍS</div> {/* Considera que esta descripción sea configurable por el usuario */}
            <div className="rank">RANGO PLATA</div> {/* Considera que el rango sea dinámico */}
          </div>
          <div className="badges">
            <h3>INSIGNIAS</h3>
            {/* Asegúrate de renderizar las insignias de una lista o estado, no hardcodeado */}
            <div>
              <div className="badge-item">
                <p>Catacora Patana Helen Jazmin</p> {/* Esto parece un nombre hardcodeado, debería ser dinámico */}
              </div>
              <div className="badge-item">
                <p></p> {/* Este párrafo está vacío */}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'myProfile' && (
        <div id="miPerfil" className="my-profile-card bento-box">
          <h2>Información Básica</h2>
          {/* Asegúrate de que el formulario esté bien estructurado para manejar submisiones */}
          <form onSubmit={handleSaveName}> {/* Añadido onSubmit al form */}
            {wait ? (
              <div className="loader-container">
                <ClipLoader color="var(--swans-down-400)" size={40} />
              </div>
            ) : (
              // Etiqueta y input para cambiar foto de perfil
              <label className="form-label-box">
                Cambiar foto de perfil
                {/* El input type="file" no necesita un value ni placeholder */}
                {/* Usa accept para restringir tipos de archivo */}
                <input type="file" accept="image/*" onChange={handleImageChange} className="form-input-file" />
              </label>
            )}
            {/* Etiqueta y input para cambiar nombre completo */}
            <label className="form-label-box">
              Cambiar nombre completo
              {/* Usa ref para acceder al valor del input en handleSaveName */}
              <input
                minLength={8}
                type="text"
                ref={fullNameRef}
                placeholder={user?.userName || 'Nombre completo'} // Placeholder más descriptivo si user.userName no está
                className="form-input-text"
              />
              {/* El botón submit dentro del form activará handleSaveName */}
              {/* Añade type="submit" explícitamente */}
              <button className="subscribe-button">Guardar Cambios</button>
            </label>
          </form>
        </div>
      )}

      {activeView === 'subscription' && (
        <SubscriptionSection
          user={user} // Usa user directamente
          subscriptionPlans={subscriptionPlans}
          cambiarPlan={handleInitiatePayment} // Ahora pasamos la nueva función aquí
          className="bento-box"
        />
      )}

      {/* Renderiza el modal de pago condicionalmente */}
      {showPaymentModal && (
        <PaymentSimulationModal
          plan={planToSubscribe}
          onPaymentComplete={handlePaymentComplete}
          onClose={handleClosePaymentModal} // Pasa la función para cerrar
        // Opcional: Puedes pasar el usuario si el modal lo necesita
        // user={user}
        />
      )}

    </div>
  );
}

export default Perfil;