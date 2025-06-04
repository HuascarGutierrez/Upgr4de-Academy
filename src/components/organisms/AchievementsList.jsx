// src/components/organisms/AchievementsList.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/app';
import AchievementItem from '../molecules/AchievementItem';
import './styles/AchievementsList.css';

function AchievementsList({ user, userAchievements }) {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'achievements'));
            const fetchedAchievements = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAchievements(fetchedAchievements);
            setLoading(false);
        };
        fetchAchievements();
    }, []);

    if (loading) {
        return <p>Cargando logros...</p>;
    }

    return (
        <div className="achievements-list">
            <h3>Tus Logros</h3>
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