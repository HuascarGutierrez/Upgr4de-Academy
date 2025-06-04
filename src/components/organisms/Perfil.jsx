// src/components/Perfil.jsx
import React, { useState, useRef, useEffect } from "react";
import "./styles/Perfil.css";
import { getAuth, signOut } from "firebase/auth";
import { alertSignOut, alertWarning } from "../../config/alerts";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getFirestore,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { handleUpdateImage } from "../../config/auth_functions";
import { ClipLoader } from "react-spinners";
import Swal from 'sweetalert2'; // <-- Importar SweetAlert2

import SubscriptionSection from "./SubscriptionSection";
import PaymentSimulationModal from "./PaymentSimulationModal";
import GamificationSection from "./GamificationSection"; // Importa el componente

import { storage } from "../../config/app2"; // Asegúrate de que 'storage' de Firebase Storage esté correctamente exportado y sea accesible aquí.

function Perfil({ user }) {
  const [activeView, setActiveView] = useState("myProfile");
  const [subscriptionPlans] = useState([
    {
      name: "Plan Gratuito",
      description:
        "Inscríbete en el plan Gratuito para obtener los siguientes beneficios:",
      benefits: [
        "Acceso a algunas las unidades",
        "Evaluaciones y ejercicios",
      ],
      plan: "Gratuito", // Este campo 'plan' parece redundante si ya tienes 'name'. Podrías usar solo 'name'.
      price: 0,
    },
    {
      name: "Plan Mensual", // Mantengo "Plan Mensual" aquí para la UI, pero se limpia para DB si es necesario.
      description:
        "Te esperan nuevas oportunidades. Inscríbete en el plan Mensual para obtener muchos beneficios:",
      benefits: [
        "Acceso a todas las unidades",
        "Acceso al apartado de supervisión",
        "Evaluaciones y ejercicios",
      ],
      plan: "Mensual", // Este campo 'plan' parece redundante si ya tienes 'name'.
      price: 120,
    },
  ]);

  const fullNameRef = useRef(user?.userName || "");
  const fileInputRef = useRef(null); // Ref para el input de archivo
  const [wait, setWait] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // CAMBIO CLAVE: planToSubscribe ahora almacenará el OBJETO COMPLETO del plan
  const [planToSubscribe, setPlanToSubscribe] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.userName) {
      fullNameRef.current.value = user.userName;
    }
  }, [user?.userName]);

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro de cerrar sesión?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          alertSignOut();
          navigate("/");
        })
        .catch((error) => {
          alertWarning(`Error de logout: ${error.message}`);
        });
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    setWait(true);
    if (e.target.files && e.target.files[0] && user?.email && user?.uid) {
      const imagen = e.target.files[0];
      try {
        const url = await handleUpdateImage({
          email: user.email,
          image: imagen,
        });
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            imageUrl: url,
          },
          { merge: true }
        );
        Swal.fire({
          icon: 'success',
          title: '¡Imagen actualizada!',
          text: 'Tu foto de perfil se ha actualizado correctamente. Se recargará la página.',
          timer: 2000,
          timerProgressBar: true,
          didClose: () => {
            location.reload();
          }
        });
      } catch (error) {
        alertWarning(`Error al actualizar la imagen: ${error.message}`);
      }
    } else if (!user?.email || !user?.uid) {
      alertWarning(
        "No se pudo obtener la información del usuario para actualizar la imagen."
      );
    }
    setWait(false);
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    const fullName = fullNameRef.current.value.trim();
    if (fullName.length < 8) {
      alertWarning("El nombre debe tener al menos 8 caracteres");
      return;
    }
    if (!user?.uid) {
      alertWarning(
        "No se pudo obtener la información del usuario para actualizar el nombre."
      );
      return;
    }
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    try {
      await setDoc(
        userRef,
        {
          userName: fullName,
        },
        { merge: true }
      );
      Swal.fire({
        icon: 'success',
        title: '¡Nombre guardado!',
        text: 'Tu nombre ha sido actualizado correctamente. Se recargará la página.',
        timer: 2000,
        timerProgressBar: true,
        didClose: () => {
          location.reload();
        }
      });
    } catch (error) {
      alertWarning(`Error al guardar el nombre: ${error.message}`);
    }
  };

  // Esta función 'updatePlanInFirestore' ya no sería necesaria para planes de pago,
  // ya que SubscriptionSection y handlePaymentComplete manejan la lógica de Firebase.
  // La mantengo comentada o como referencia si alguna vez necesitas actualizar el plan
  // directamente sin pasar por el flujo de pago/solicitud.
  /*
  const updatePlanInFirestore = async (plan) => {
    if (!user?.uid) {
      alertWarning(
        "No se pudo obtener la información del usuario para actualizar el plan."
      );
      return;
    }
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    try {
      await setDoc(
        userRef,
        {
          planType: plan,
        },
        { merge: true }
      );
      Swal.fire({
        icon: 'success',
        title: '¡Plan actualizado!',
        text: 'Tu plan se ha actualizado correctamente.',
        timer: 1500,
        timerProgressBar: true
      });
    } catch (error) {
      alertWarning(`Error al actualizar el plan: ${error.message}`);
    }
  };
  */

  // CAMBIO CLAVE: Ahora recibe el OBJETO COMPLETO del plan
  const handleInitiatePayment = (plan) => {
    setPlanToSubscribe(plan); // Guardamos el objeto plan completo
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (fileComprobante) => {
    // Verificamos que planToSubscribe sea un objeto y tenga las propiedades necesarias
    if (!planToSubscribe || typeof planToSubscribe !== 'object' || !planToSubscribe.name || typeof planToSubscribe.price === 'undefined') {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: "Información del plan no válida para el pago.",
      });
      return;
    }
    if (!user?.uid) {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: "No se pudo obtener la información del usuario para registrar el pago.",
      });
      return;
    }
    if (!fileComprobante) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: "Por favor, sube una imagen de tu comprobante de pago.",
      });
      return;
    }

    setWait(true);

    try {
      const timestamp = Date.now();
      const fileName = fileComprobante.name;
      // Define una ruta de almacenamiento más específica si lo deseas, por ejemplo, incluyendo el ID de usuario
      const storagePath = `comprobantes/${user.uid}/${timestamp}-${fileName}`;

      const storageRef = ref(storage, storagePath);
      const uploadResult = await uploadBytes(storageRef, fileComprobante);
      const urlComprobante = await getDownloadURL(uploadResult.ref);

      const db = getFirestore();
      const solicitudesRef = collection(db, "solicitudesPagos");

      // CAMBIO CLAVE: Acceder directamente a las propiedades 'name' y 'price' del objeto planToSubscribe
      const planNameForDB = planToSubscribe.name;
      const montoPago = planToSubscribe.price;

      await addDoc(solicitudesRef, {
        userId: user.uid,
        userName: user.userName || "Usuario Desconocido",
        userEmail: user.email,
        planSolicitado: planNameForDB, // Utiliza el nombre del plan del objeto
        monto: montoPago, // ¡Aquí está el monto correcto!
        urlComprobante: urlComprobante,
        estado: "pendiente",
        fechaSolicitud: serverTimestamp(),
      });

      Swal.fire({
        icon: 'success',
        title: '¡Solicitud enviada!',
        text: 'Tu comprobante ha sido subido y tu solicitud de pago está pendiente de verificación por un administrador. Te notificaremos cuando tu plan sea activado.',
        confirmButtonText: 'Entendido'
      });
    } catch (error) {
      console.error("Error al procesar el pago y subir comprobante:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Hubo un error al procesar tu pago: ${error.message}`,
      });
    } finally {
      setWait(false);
      setShowPaymentModal(false);
      setPlanToSubscribe(null); // Resetea el plan seleccionado
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPlanToSubscribe(null);
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-title-card bento-box">
        <h1 className="profile-main-title">Perfil</h1>
      </div>

      <div className="profile-container bento-grid">
        <div className="menu-card bento-box">
          <div className="profile-header">
            <img
              src={user?.imageUrl || "/images/default_img_profile.webp"}
              alt="Avatar"
              className="avatar"
            />
            <div className="profile-info">
              <div className="name">{user?.userName || "Cargando Nombre..."}</div>
            </div>
          </div>
          <div className="menu">
            <button
              className={`menu-item ${activeView === "myProfile" ? "active" : ""}`}
              onClick={() => handleViewChange("myProfile")}
              type="button"
            >
              MI PERFIL
            </button>
            <button
              className={`menu-item ${activeView === "subscription" ? "active" : ""}`}
              onClick={() => handleViewChange("subscription")}
              type="button"
            >
              SUSCRIPCIÓN
            </button>
            <button
              className={`menu-item ${activeView === "gamification" ? "active" : ""}`}
              onClick={() => handleViewChange("gamification")}
              type="button"
            >
              GAMIFICACIÓN
            </button>
            <button onClick={handleSignOut} className="menu-item" type="button">
              CERRAR SESIÓN
            </button>
          </div>
        </div>

        {activeView === "publicProfile" && (
          <div className="content-wrapper bento-box">
            <div id="perfilPublico" className="public-profile-card">
              <div className="profile-info">
                <img
                  src={user?.imageUrl || "/images/default_img_profile.webp"}
                  alt=""
                  className="avatar-large"
                />
                <div className="name">{user?.userName || "Cargando Nombre..."}</div>
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
          </div>
        )}

        {activeView === "myProfile" && (
          <div className="content-wrapper bento-box">
            <div id="miPerfil" className="my-profile-card">
              <h2>Información Básica</h2>
              <form onSubmit={handleSaveName}>
                {wait ? (
                  <div className="loader-container">
                    <ClipLoader color="var(--swans-down-400)" size={40} />
                  </div>
                ) : (
                  <>
                    <label className="form-label-box custom-file-upload">
                      <span className="label-text">Cambiar foto de perfil</span>
                      <button type="button" onClick={handleButtonClick} className="form-input-button">
                        Seleccionar Archivo
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-input-file-hidden"
                        ref={fileInputRef}
                      />
                    </label>
                  </>
                )}
                <label className="form-label-box">
                  <span className="label-text">Cambiar nombre completo</span>
                  <input
                    minLength={8}
                    type="text"
                    ref={fullNameRef}
                    placeholder={user?.userName || "Nombre completo"}
                    className="form-input-text"
                  />
                  <button className="subscribe-button">Guardar Cambios</button>
                </label>
              </form>
            </div>
          </div>
        )}

        {activeView === "subscription" && (
          <div className="content-wrapper bento-box">
            <SubscriptionSection
              user={user}
              subscriptionPlans={subscriptionPlans}
              cambiarPlan={handleInitiatePayment} // Ahora pasa el OBJETO COMPLETO del plan
            />
          </div>
        )}

        {activeView === "gamification" && (
          <div className="content-wrapper bento-box">
            <GamificationSection user={user} />
          </div>
        )}

        {showPaymentModal && (
          <PaymentSimulationModal
            plan={planToSubscribe} // Pasa el OBJETO COMPLETO del plan al modal
            onPaymentComplete={handlePaymentComplete}
            onClose={handleClosePaymentModal}
            isLoading={wait}
          />
        )}
      </div>
    </div>
  );
}

export default Perfil;