import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'; // Asegúrate de que updateDoc esté importado
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../config/app';
import { storage } from '../../config/app2';
import AchievementsList from './AchievementsList';
import BadgesGallery from './BadgesGallery';
import AvatarCustomizer from './AvatarCustomizer';
import './styles/GamificationDashboard.css';
import Swal from 'sweetalert2';
import { FaTrophy, FaAward, FaUserCircle, FaCoins } from 'react-icons/fa';
import { GiGalaxy } from 'react-icons/gi';

function GamificationDashboard({ user }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('achievements');

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
                        body: 'default-body-id',
                        eyes: 'default-eyes-id',
                        hair: 'default-hair-id',
                        outfit: 'default-outfit-id', // Cambiado de 'clothes' a 'outfit'
                        mouth: 'default-mouth-id',
                        background: 'default-background-id',
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

    // **FUNCIÓN PARA MANEJAR LA EXPORTACIÓN DEL AVATAR**
    const handleAvatarExport = async (avatarBlob) => {
        if (!user || !user.uid) {
            Swal.fire('Error', 'No se pudo obtener la información del usuario para guardar el avatar.', 'warning');
            return;
        }

        try {
            const storagePath = `profile_avatars/${user.uid}/${Date.now()}.png`;
            const storageRef = ref(storage, storagePath);

            const uploadResult = await uploadBytes(storageRef, avatarBlob);
            const downloadURL = await getDownloadURL(uploadResult.ref);

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                imageUrl: downloadURL,
            });

            // Actualiza el estado local de userData para reflejar el cambio en la imagen de perfil
            setUserData(prev => ({ ...prev, imageUrl: downloadURL }));

            Swal.fire('Éxito', 'Tu avatar se ha establecido como foto de perfil.', 'success');
        } catch (error) {
            console.error("Error al subir el avatar exportado o al actualizar el perfil:", error);
            Swal.fire('Error', `Hubo un problema al establecer el avatar como foto de perfil: ${error.message}`, 'error');
        }
    };

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
                <div className="bento-item bento-item-title">
                    <GiGalaxy className="title-icon" />
                    <h2 className="dashboard-title-bento">Tu Gamiificación</h2>
                </div>

                <div className="bento-item bento-item-points">
                    <div className="points-display">
                        <h3>Puntos Totales:</h3>
                        <FaCoins className="coin-icon" />
                        <span className="points-value">{userData.points || 0}</span>
                    </div>
                </div>

                <div className="bento-item bento-item-tabs">
                    <nav className="gamification-tabs">
                        <button
                            onClick={() => handleTabChange('achievements')}
                            className={`tab-button ${activeTab === 'achievements' ?
                                'active' : ''}`}
                            aria-controls="achievements-panel"
                            id="achievements-tab"
                            role="tab"
                            aria-selected={activeTab === 'achievements'}
                        >
                            <FaTrophy className="tab-icon" />
                            Logros
                        </button>
                        <button
                            onClick={() => handleTabChange('badges')}
                            className={`tab-button ${activeTab === 'badges' ?
                                'active' : ''}`}
                            aria-controls="badges-panel"
                            id="badges-tab"
                            role="tab"
                            aria-selected={activeTab === 'badges'}
                        >
                            <FaAward className="tab-icon" />
                            Insignias
                        </button>
                        <button
                            onClick={() => handleTabChange('avatar')}
                            className={`tab-button ${activeTab === 'avatar' ?
                                'active' : ''}`}
                            aria-controls="avatar-panel"
                            id="avatar-tab"
                            role="tab"
                            aria-selected={activeTab === 'avatar'}
                        >
                            <FaUserCircle className="tab-icon" />
                            Avatar
                        </button>
                    </nav>
                </div>

                <div className="bento-item bento-item-content">
                    <div className="tab-content" role="tabpanel" aria-labelledby={`${activeTab}-tab`}>
                        {activeTab === 'achievements' && (
                            <div id="achievements-panel">
                                <AchievementsList user={user} userAchievements={userData.achievements || {}} />
                            </div>
                        )}
                        {activeTab === 'badges' && (
                            <div id="badges-panel">
                                <BadgesGallery user={user} userBadges={userData.badges ||
                                    []} />
                            </div>
                        )}
                        {activeTab === 'avatar' && (
                            <div id="avatar-panel">
                                <AvatarCustomizer
                                    user={user}
                                    userAvatarParts={userData.avatarParts || {}}
                                    userPoints={userData.points || 0}
                                    setUserData={setUserData}
                                    onAvatarExport={handleAvatarExport}
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