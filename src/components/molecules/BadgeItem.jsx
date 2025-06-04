// src/components/molecules/BadgeItem.jsx
import React from 'react';
import './styles/BadgeItem.css';

function BadgeItem({ badge, isUnlocked, onClick }) {
    return (
        <div className={`badge-item ${isUnlocked ? 'unlocked' : 'locked'}`} onClick={onClick}>
            <img src={badge.imageUrl || '/images/default_badge.png'} alt={badge.name} className="badge-icon" />
            <div className="badge-info">
                <h4>{badge.name}</h4>
                {!isUnlocked && <p className="badge-locked-text">Bloqueada</p>}
            </div>
        </div>
    );
}

export default BadgeItem;