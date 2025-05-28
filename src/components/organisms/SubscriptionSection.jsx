import React from 'react';
// Asumo que tus estilos globales y variables ya están importados o accesibles globalmente
import './styles/SubscriptionSection.css'; // Creamos un CSS específico para esta sección

function SubscriptionSection({ user, subscriptionPlans, cambiarPlan: handleInitiatePayment, className }) {
  const formatCurrency = (amount) => {
    return amount === 0 ? 'Gratis' : `${amount} Bs.`;
  };

  const isPlanActive = (plan) => {
    return user?.planType === plan.plan || user?.planType === plan.name;
  };

  const getPlanDisplayName = (plan) => {
    return plan.name || plan.plan || 'Plan desconocido';
  };

  const handleSubscriptionClick = (plan) => {
    if (plan.price === 0) {
      if (window.confirm('¿Deseas cambiar al plan gratuito?')) {
        handleInitiatePayment(plan.name);
      }
      return;
    }

    handleInitiatePayment(plan.name);
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