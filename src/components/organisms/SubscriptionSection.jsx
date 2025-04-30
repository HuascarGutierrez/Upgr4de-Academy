import React from 'react';
import './styles/Perfil.css';

function SubscriptionSection({ user, subscriptionPlans, cambiarPlan, className }) {
  return (
    <div id='suscripcion' className={`subscription-card ${className}`}>
      <h2>Suscripciones</h2>

      <h3>Planes Disponibles</h3>
      <div className="available-plans bento-grid">
        {subscriptionPlans.map((plan) => (
          <div key={plan.plan} className="plan-item bento-box">
            <h4>{plan.name}</h4>
            <p className="plan-description">{plan.description}</p>
            <ul className="plan-benefits">
              {plan.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
            {user?.planType === plan.plan ? (
              <p className="subscribed-text">Suscrito</p>
            ) : (
              <button onClick={() => cambiarPlan(plan.plan)} className="subscribe-button">Suscribirse</button>
            )}
          </div>
        ))}
      </div>

      {user?.planType && (
        <div className="current-plan-container">
          <h3>Tu Plan Actual</h3>
          {subscriptionPlans.map((plan) => (
            plan.plan === user.planType && (
              <div key={plan.plan} className="plan-item current bento-box">
                <h4>{plan.name}</h4>
                <p className="plan-description">{plan.description}</p>
                <ul className="plan-benefits">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
                <p className="current-text">Plan Actual</p>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default SubscriptionSection;