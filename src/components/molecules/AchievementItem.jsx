// src/components/molecules/AchievementItem.jsx
import React from 'react';
import './styles/AchievementItem.css';

function AchievementItem({ achievement, userProgress }) {
    const isUnlocked = userProgress.unlocked;
    const progress = userProgress.progress || 0; // Asumimos un progreso de 0-100

    return (
        <div className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
            <img src={achievement.iconUrl || '/images/default_achievement.png'} alt={achievement.name} className="achievement-icon" />
            <div className="achievement-info">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
                {!isUnlocked && (
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        <span>{progress}%</span>
                    </div>
                )}
                {isUnlocked && <span className="achievement-status">¡Desbloqueado!</span>}
                <p className="points-awarded">+{achievement.pointsAwarded} Puntos</p>
            </div>
        </div>
    );
}

export default AchievementItem;