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

import SubscriptionSection from "./SubscriptionSection";
import PaymentSimulationModal from "./PaymentSimulationModal";
import GamificationSection from "./GamificationSection"; // Importa el componente

function Perfil({ user }) {
  const [activeView, setActiveView] = useState("myProfile");
  const [subscriptionPlans] = useState([
    {
      name: "Plan Gratuito",
      description:
        "Inscríbete en el plan Gratuito para obtener los siguientes beneficios:",
      benefits: [
        "Acceso a algunas las unidades",
        "Acceso al 50% del contenido",
        "Evaluaciones y ejercicios",
      ],
      plan: "Gratuito",
      price: 0,
    },
    {
      name: "Plan Mensual",
      description:
        "Te esperan nuevas oportunidades. Inscríbete en el plan Mensual para obtener muchos beneficios:",
      benefits: [
        "Acceso a todas las unidades",
        "Acceso al tutor artificial",
        "Acceso al apartado de supervisión",
        "Evaluaciones y ejercicios",
      ],
      plan: "Mensual",
      price: 120,
    },
  ]);

  const fullNameRef = useRef(user?.userName || "");
  const fileInputRef = useRef(null); // Ref para el input de archivo
  const [wait, setWait] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [planToSubscribe, setPlanToSubscribe] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.userName) {
      fullNameRef.current.value = user.userName;
    }
  }, [user?.userName]);

  const handleSignOut = async () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        alertSignOut();
        navigate("/");
      })
      .catch((error) => {
        alertWarning(`Error de logout: ${error}`);
      });
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  // Función para abrir el selector de archivos al hacer clic en el botón
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
        location.reload();
      } catch (error) {
        alertWarning(`Error al actualizar la imagen: ${error}`);
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
      location.reload();
    } catch (error) {
      alertWarning(`Error al guardar el nombre: ${error}`);
    }
  };

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
      location.reload();
    } catch (error) {
      alertWarning(`Error al actualizar el plan: ${error}`);
    }
  };

  const handleInitiatePayment = (plan) => {
    setPlanToSubscribe(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (fileComprobante) => {
    if (!planToSubscribe) {
      alertWarning("No hay un plan seleccionado para el pago.");
      return;
    }
    if (!user?.uid) {
      alertWarning(
        "No se pudo obtener la información del usuario para registrar el pago."
      );
      return;
    }
    if (!fileComprobante) {
      alertWarning("Por favor, sube una imagen de tu comprobante de pago.");
      return;
    }

    setWait(true);

    try {
      const storage = getStorage();
      const timestamp = Date.now();
      const fileName = fileComprobante.name;
      const storagePath = `comprobantes/${timestamp}-${fileName}`;

      const storageRef = ref(storage, storagePath);
      const uploadResult = await uploadBytes(storageRef, fileComprobante);
      const urlComprobante = await getDownloadURL(uploadResult.ref);

      const db = getFirestore();
      const solicitudesRef = collection(db, "solicitudesPagos");

      const selectedPlanDetails = subscriptionPlans.find(
        (plan) => plan.name === planToSubscribe
      );
      const montoPago = selectedPlanDetails ? selectedPlanDetails.price : 0;

      await addDoc(solicitudesRef, {
        userId: user.uid,
        userName: user.userName || "Usuario Desconocido",
        userEmail: user.email,
        planSolicitado: planToSubscribe,
        monto: montoPago,
        urlComprobante: urlComprobante,
        estado: "pendiente",
        fechaSolicitud: serverTimestamp(),
      });

      alert(
        "Comprobante subido y solicitud registrada. Tu pago está pendiente de verificación."
      );
    } catch (error) {
      console.error("Error al procesar el pago y subir comprobante:", error);
      alertWarning(`Error al procesar el pago: ${error.message}`);
    } finally {
      setWait(false);
      setShowPaymentModal(false);
      setPlanToSubscribe(null);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPlanToSubscribe(null);
  };

  return (
    // Contenedor principal para el título y el grid
    <div className="profile-page-wrapper">
      {/* Nueva caja para el título de perfil */}
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
          // Usamos la nueva clase de envoltorio general
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
          // Usamos la nueva clase de envoltorio general
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
                    <label className="form-label-box custom-file-upload"> {/* Añadimos una clase para el botón */}
                      <span className="label-text">Cambiar foto de perfil</span> {/* Envolvemos el texto */}
                      <button type="button" onClick={handleButtonClick} className="form-input-button">
                        Seleccionar Archivo
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-input-file-hidden" // Ocultamos el input de archivo
                        ref={fileInputRef} // Asignamos la ref
                      />
                    </label>
                  </>
                )}
                <label className="form-label-box">
                  <span className="label-text">Cambiar nombre completo</span> {/* Envolvemos el texto */}
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
          // Usamos la nueva clase de envoltorio general
          <div className="content-wrapper bento-box">
            <SubscriptionSection
              user={user}
              subscriptionPlans={subscriptionPlans}
              cambiarPlan={handleInitiatePayment}
            />
          </div>
        )}

        {activeView === "gamification" && (
          <div className="content-wrapper bento-box">
            {" "}
            {/* Usamos la nueva clase de envoltorio general */}
            <GamificationSection user={user} />
          </div>
        )}

        {showPaymentModal && (
          <PaymentSimulationModal
            plan={planToSubscribe}
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