// src/components/organisms/AchievementsList.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/app';
import AchievementItem from '../molecules/AchievementItem';
import './styles/AchievementsList.css'; // Asegúrate de que esta ruta sea correcta

function AchievementsList({ user, userAchievements }) {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'achievements'));
                const fetchedAchievements = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAchievements(fetchedAchievements);
            } catch (error) {
                console.error("Error fetching achievements:", error);
                // Opcional: Podrías usar Swal.fire para notificar al usuario sobre el error
                // Swal.fire('Error', 'No se pudieron cargar los logros.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

    if (loading) {
        return (
            <div className="achievements-list-loading"> {/* Nueva clase para el spinner */}
                <p>Cargando logros...</p>
                <div className="spinner"></div> {/* Reutilizamos el spinner global */}
            </div>
        );
    }

    // Si no hay logros después de cargar
    if (achievements.length === 0) {
        return (
            <div className="achievements-list no-achievements">
                <p>Aún no hay logros disponibles. ¡Sigue jugando para desbloquearlos!</p>
            </div>
        );
    }

    return (
        <div className="achievements-list">
            <h3 className="achievements-title">Tus Logros</h3>
            <div className="achievements-grid">
                {achievements.map(achievement => (
                    <AchievementItem
                        key={achievement.id}
                        achievement={achievement}
                        userProgress={userAchievements[achievement.id] || { unlocked: false, progress: 0 }}
                    />
                ))}
            </div>
        </div>
    );
}

export default AchievementsList;