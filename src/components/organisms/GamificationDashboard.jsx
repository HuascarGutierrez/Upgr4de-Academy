// src/components/organisms/GamificationDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/app';
import AchievementsList from './AchievementsList';
import BadgesGallery from './BadgesGallery';
import AvatarCustomizer from './AvatarCustomizer';
import './styles/GamificationDashboard.css';
import Swal from 'sweetalert2';

// Importa íconos de alguna librería (ej. react-icons, o tus propios SVGs)
// Si no quieres usar react-icons, puedes eliminar esta línea
// y usar etiquetas <img> con la ruta a tus archivos SVG.
import { FaTrophy, FaAward, FaUserCircle, FaCoins } from 'react-icons/fa';
import { GiGalaxy } from 'react-icons/gi'; // Icono para el título del dashboard


function GamificationDashboard({ user }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('achievements'); // 'achievements', 'badges', 'avatar'

    useEffect(() => {
        if (!user || !user.uid) {
            setLoading(false);
            setUserData(null);
            return;
        }

        setLoading(true);
        const userRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userRef, (userSnap) => {
            if (userSnap.exists()) {
                setUserData(userSnap.data());
            } else {
                console.log("No such user document! Initializing default data if needed.");
                setUserData({
                    points: 0,
                    achievements: {},
                    badges: [],
                    avatarParts: {
                        // Ensure these default IDs exist in your 'avatarItems' collection
                        body: 'default-body-id',
                        eyes: 'default-eyes-id',
                        hair: 'default-hair-id',
                        clothes: 'default-clothes-id', // Assuming you have a 'clothes' type
                        mouth: 'default-mouth-id', // Assuming you have a 'mouth' type
                        // ...other default parts
                    }
                });
                Swal.fire({
                    title: '¡Bienvenido!',
                    text: 'Parece que es tu primera vez aquí. ¡Comienza a ganar puntos y personalizar tu avatar!',
                    icon: 'info',
                    confirmButtonColor: 'var(--swans-down-500)',
                    background: 'var(--black-900)',
                    color: 'var(--black-50)'
                });
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching user data:", error);
            setLoading(false);
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar tus datos de progreso. Por favor, inténtalo de nuevo más tarde.',
                icon: 'error',
                confirmButtonColor: 'var(--brandy-punch-500)',
                background: 'var(--black-900)',
                color: 'var(--black-50)'
            });
        });

        return () => unsubscribe();
    }, [user]);

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    if (loading) {
        return (
            <div className="gamification-dashboard loading">
                <p>Cargando...</p>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="gamification-dashboard logged-out">
                <p>Para ver tu progreso de gamificación, por favor <a href="/login">inicia sesión</a>.</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="gamification-dashboard no-data">
                <p>No se encontraron datos de gamificación para tu cuenta. Si crees que es un error, contacta a soporte.</p>
            </div>
        );
    }

    return (
        <div className="gamification-dashboard">
            <div className="bento-grid-container">
                {/* Nuevo Bento Item para el Título con Ícono */}
                <div className="bento-item bento-item-title">
                    {/* Aquí usamos el ícono GiGalaxy de react-icons */}
                    <GiGalaxy className="title-icon" />
                    <h2 className="dashboard-title-bento">Tu Gamiificación</h2>
                </div>

                {/* Bento Grid Item 1: Points Display con Ícono de Moneda */}
                <div className="bento-item bento-item-points">
                    <div className="points-display">
                        <h3>Puntos Totales:</h3>
                        {/* Aquí usamos el ícono FaCoins de react-icons */}
                        <FaCoins className="coin-icon" />
                        <span className="points-value">{userData.points || 0}</span>
                    </div>
                </div>

                {/* Bento Grid Item 2: Tabs Navigation con Íconos */}
                <div className="bento-item bento-item-tabs">
                    <nav className="gamification-tabs">
                        <button
                            onClick={() => handleTabChange('achievements')}
                            className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
                            aria-controls="achievements-panel"
                            id="achievements-tab"
                            role="tab"
                            aria-selected={activeTab === 'achievements'}
                        >
                            {/* Ícono para Logros */}
                            <FaTrophy className="tab-icon" />
                            Logros
                        </button>
                        <button
                            onClick={() => handleTabChange('badges')}
                            className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
                            aria-controls="badges-panel"
                            id="badges-tab"
                            role="tab"
                            aria-selected={activeTab === 'badges'}
                        >
                            {/* Ícono para Insignias */}
                            <FaAward className="tab-icon" />
                            Insignias
                        </button>
                        <button
                            onClick={() => handleTabChange('avatar')}
                            className={`tab-button ${activeTab === 'avatar' ? 'active' : ''}`}
                            aria-controls="avatar-panel"
                            id="avatar-tab"
                            role="tab"
                            aria-selected={activeTab === 'avatar'}
                        >
                            {/* Ícono para Avatar */}
                            <FaUserCircle className="tab-icon" />
                            Avatar
                        </button>
                    </nav>
                </div>

                {/* Bento Grid Item 3: Tab Content (Main Area) */}
                <div className="bento-item bento-item-content">
                    <div className="tab-content" role="tabpanel" aria-labelledby={`${activeTab}-tab`}>
                        {activeTab === 'achievements' && (
                            <div id="achievements-panel">
                                <AchievementsList user={user} userAchievements={userData.achievements || {}} />
                            </div>
                        )}
                        {activeTab === 'badges' && (
                            <div id="badges-panel">
                                <BadgesGallery user={user} userBadges={userData.badges || []} />
                            </div>
                        )}
                        {activeTab === 'avatar' && (
                            <div id="avatar-panel">
                                <AvatarCustomizer
                                    user={user}
                                    userAvatarParts={userData.avatarParts || {}}
                                    userPoints={userData.points || 0}
                                    setUserData={setUserData}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GamificationDashboard;