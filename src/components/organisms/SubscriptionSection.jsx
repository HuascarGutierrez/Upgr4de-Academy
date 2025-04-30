import React from 'react';
import './styles/Perfil.css'; // Asegúrate de que esta ruta es correcta

// Renombramos la prop `cambiarPlan` a `handleInitiatePayment` para claridad
function SubscriptionSection({ user, subscriptionPlans, cambiarPlan: handleInitiatePayment, className }) {

    // Encontramos el plan actual del usuario
    const currentPlan = subscriptionPlans.find(plan => user?.planType === plan.plan);

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
                        {/* Usa optional chaining para acceder a user.planType */}
                        {user?.planType === plan.plan ? (
                            <p className="subscribed-text">Suscrito</p>
                        ) : (
                            // Llama a la nueva prop handleInitiatePayment
                            <button onClick={() => handleInitiatePayment(plan.plan)} className="subscribe-button">Suscribirse</button>
                        )}
                    </div>
                ))}
            </div>

            {/* Renderiza el plan actual solo si existe */}
            {currentPlan && (
                <div className="current-plan-container">
                    <h3>Tu Plan Actual</h3>
                    {/* Renderizamos directamente el plan encontrado */}
                    <div key={currentPlan.plan} className="plan-item current bento-box">
                        <h4>{currentPlan.name}</h4>
                        <p className="plan-description">{currentPlan.description}</p>
                        <ul className="plan-benefits">
                            {currentPlan.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                            ))}
                        </ul>
                        <p className="current-text">Plan Actual</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SubscriptionSection;