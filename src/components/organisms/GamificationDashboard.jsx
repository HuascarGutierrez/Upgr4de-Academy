// src/components/organisms/GamificationDashboard.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/app'; // Asegúrate de que tu configuración de Firebase esté bien importada
import AchievementsList from './AchievementsList';
import BadgesGallery from './BadgesGallery';
import AvatarCustomizer from './AvatarCustomizer';
import './styles/GamificationDashboard.css'; // Crea este archivo CSS para estilos

function GamificationDashboard({ user }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('achievements'); // 'achievements', 'badges', 'avatar'

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.uid) {
                setLoading(true);
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                } else {
                    console.log("No such user document!");
                }
                setLoading(false);
            }
        };
        fetchUserData();
    }, [user]);

    if (loading) {
        return <p>Cargando datos de gamificación...</p>;
    }

    if (!user || !userData) {
        return <p>Por favor, inicia sesión para ver tu progreso de gamificación.</p>;
    }

    return (
        <div className="gamification-dashboard">
            <h2>Tu Progreso de Gamificación</h2>
            <div className="points-display">
                <h3>Puntos Totales: {userData.points || 0}</h3>
            </div>

            <nav className="gamification-tabs">
                <button onClick={() => setActiveTab('achievements')} className={activeTab === 'achievements' ? 'active' : ''}>
                    Logros
                </button>
                <button onClick={() => setActiveTab('badges')} className={activeTab === 'badges' ? 'active' : ''}>
                    Insignias
                </button>
                <button onClick={() => setActiveTab('avatar')} className={activeTab === 'avatar' ? 'active' : ''}>
                    Avatar
                </button>
            </nav>

            <div className="tab-content">
                {activeTab === 'achievements' && <AchievementsList user={user} userAchievements={userData.achievements || {}} />}
                {activeTab === 'badges' && <BadgesGallery user={user} userBadges={userData.badges || []} />}
                {activeTab === 'avatar' && <AvatarCustomizer user={user} userAvatarParts={userData.avatarParts || {}} userPoints={userData.points || 0} />}
            </div>
        </div>
    );
}

export default GamificationDashboard;