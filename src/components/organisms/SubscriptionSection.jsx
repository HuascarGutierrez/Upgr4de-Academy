// src/components/SubscriptionSection.jsx
import React from 'react';
import './styles/SubscriptionSection.css';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore'; // Importar Firestore
import { getAuth } from 'firebase/auth'; // Importar Auth

// Helper function to clean plan names
const getCleanPlanName = (planName) => {
  if (typeof planName === 'string' && planName.startsWith('Plan ')) {
    return planName.replace('Plan ', '');
  }
  return planName;
};

function SubscriptionSection({ user, subscriptionPlans, cambiarPlan: handleInitiatePayment, className }) {
  const db = getFirestore(); // Inicializar Firestore
  const auth = getAuth();   // Inicializar Auth

  const formatCurrency = (amount) => {
    return amount === 0 ? 'Gratis' : `${amount} Bs.`;
  };

  const isPlanActive = (plan) => {
    // Comparar el plan del usuario (limpio) con el nombre limpio del plan actual
    const userCleanPlanType = getCleanPlanName(user?.planType);
    const planCleanName = getCleanPlanName(plan.name || plan.plan); // Asegurarse de limpiar también aquí
    return userCleanPlanType === planCleanName;
  };

  const getPlanDisplayName = (plan) => {
    // Esta función es solo para mostrar en la UI, así que puede mantener "Plan Mensual" si se desea
    return plan.name || plan.plan || 'Plan desconocido';
  };

  const handleSubscriptionClick = async (plan) => { // Cambiado a async
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Debes iniciar sesión para cambiar tu plan.',
      });
      return;
    }

    // Obtener el nombre "limpio" del plan para guardar en DB y pasar a funciones
    const planNameToSave = getCleanPlanName(plan.name);

    if (plan.price === 0) { // Si el plan es el "Gratuito"
      // Confirmación para cambiar a plan gratuito
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estás a punto de cambiar al plan Gratuito. Perderás los beneficios de tu plan actual de pago.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar a Gratuito',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        try {
          // **Aquí es donde actualizamos directamente el plan en Firebase**
          const userDocRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userDocRef, {
            planType: planNameToSave, // <-- Usa el nombre limpio (ej. "Gratuito")
            planStartDate: serverTimestamp(), // O podrías usar null si no aplica fecha de inicio para gratuitos
            planEndDate: null, // El plan gratuito no tiene fecha de fin
            // Asegúrate de resetear cualquier campo relacionado con pagos si los tienes (ej. paymentPending: false)
          });

          Swal.fire(
            '¡Plan Actualizado!',
            `Tu plan ha sido cambiado a ${planNameToSave} exitosamente.`, // Mensaje también usa el nombre limpio
            'success'
          );

        } catch (error) {
          console.error("Error al cambiar a plan gratuito:", error);
          Swal.fire(
            'Error',
            `No se pudo cambiar al plan Gratuito: ${error.message}`,
            'error'
          );
        }
      }
      return;
    }

    // Para planes de pago (price > 0), sí llamamos a handleInitiatePayment
    // Esta función (pasada como prop) es la que debería abrir el PaymentSimulationModal
    handleInitiatePayment(planNameToSave); // <-- Pasa el nombre limpio (ej. "Mensual")
  };

  return (
    <div id='suscripcion' className={`subscription-card ${className}`}>
      <div className="subscription-header">
        <h2 className="subscription-title">Gestionar Suscripción</h2>
        <p className="subscription-subtitle">
          Elige el plan que mejor se adapte a tus necesidades
        </p>
      </div>

      {/* Plan Actual */}
      {user?.planType && (
        <div className="current-plan-section">
          <h3 className="section-heading">Tu Plan Actual</h3>
          {subscriptionPlans.map((plan) => (
            isPlanActive(plan) && (
              <div key={plan.id || plan.plan} className="plan-item current-plan-display bento-box">
                <div className="plan-badge current-badge">Plan Actual</div>
                <div className="plan-details">
                  <h4 className="plan-name">{getPlanDisplayName(plan)}</h4>
                  <div className="plan-price-display current-price-display">
                    {formatCurrency(plan.price)}
                  </div>
                </div>
                <p className="plan-description-display">{plan.description}</p>
                <div className="plan-benefits-list">
                  <h5 className="benefits-heading">Beneficios incluidos:</h5>
                  <ul>
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="benefit-item">
                        <span className="benefit-icon">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Planes Disponibles */}
      <div className="available-plans-section">
        <h3 className="section-heading">Planes Disponibles</h3>
        <div className="plans-grid">
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = isPlanActive(plan);

            return (
              <div
                key={plan.id || plan.plan}
                className={`plan-item available-plan-card bento-box ${isCurrentPlan ? 'current-plan' : ''} ${plan.price > 0 ? 'premium-plan' : 'free-plan'}`}
              >
                {isCurrentPlan && <div className="plan-badge active-badge">Activo</div>}
                {plan.price > 0 && !isCurrentPlan && <div className="plan-badge premium-badge">Premium</div>}

                <div className="plan-details">
                  <h4 className="plan-name">{getPlanDisplayName(plan)}</h4>
                  <div className={`plan-price-display ${plan.price === 0 ? 'free-price' : 'paid-price'}`}>
                    {formatCurrency(plan.price)}
                    {plan.price > 0 && <span className="price-period">/mes</span>}
                  </div>
                </div>

                <p className="plan-description-card">{plan.description}</p>

                <div className="plan-benefits-list">
                  <ul>
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="benefit-item">
                        <span className="benefit-icon">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="plan-action">
                  {isCurrentPlan ? (
                    <button className="action-button current-button" disabled>
                      Plan Actual
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscriptionClick(plan)}
                      className={`action-button ${plan.price === 0 ? 'free-button' : 'premium-button'}`}
                    >
                      {plan.price === 0 ? 'Cambiar a Gratuito' : 'Suscribirse'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Información adicional */}
      <div className="subscription-info">
        <div className="info-card bento-box">
          <h4 className="info-heading">💡 Información importante</h4>
          <ul className="info-list">
            <li className="info-item">• Los pagos son procesados de forma segura</li>
            <li className="info-item">• Puedes cambiar tu plan en cualquier momento</li>
            <li className="info-item">• El acceso premium se activa tras verificar el pago</li>
            <li className="info-item">• Para soporte, contacta al administrador</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionSection;