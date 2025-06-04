// src/components/organisms/BadgesGallery.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getCountFromServer } from 'firebase/firestore';
import { db } from '../../config/app';
import BadgeItem from '../molecules/BadgeItem';
import './styles/BadgesGallery.css';
import Swal from 'sweetalert2';

function BadgesGallery({ user, userBadges }) {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUsersCount, setTotalUsersCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Obtener todas las insignias disponibles
            const badgesSnapshot = await getDocs(collection(db, 'badges'));
            const fetchedBadges = badgesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBadges(fetchedBadges);

            // Obtener el total de usuarios para el cálculo de porcentaje
            const usersCol = collection(db, 'users');
            const snapshot = await getCountFromServer(usersCol);
            setTotalUsersCount(snapshot.data().count);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleBadgeClick = async (badgeId, badgeName) => {
        if (!userBadges.includes(badgeId)) {
            Swal.fire({
                title: 'Insignia no obtenida',
                text: `Aún no has desbloqueado la insignia "${badgeName}".`,
                icon: 'info'
            });
            return;
        }

        // Calcular el porcentaje de estudiantes que tienen esta insignia
        // Esto es un ejemplo, la lógica real de conteo de insignias podría ser compleja
        // y podrías necesitar una función de Cloud Function para eficiencia.
        // Por simplicidad, asumiremos que los badges de cada usuario están en su documento.

        let countWithBadge = 0;
        const usersSnapshot = await getDocs(collection(db, 'users'));
        usersSnapshot.forEach(userDoc => {
            const userData = userDoc.data();
            if (userData.badges && userData.badges.includes(badgeId)) {
                countWithBadge++;
            }
        });

        const percentage = totalUsersCount > 0 ? ((countWithBadge / totalUsersCount) * 100).toFixed(2) : 0;

        Swal.fire({
            title: `Insignia: ${badgeName}`,
            html: `
        <p><strong>Descripción:</strong> ${badges.find(b => b.id === badgeId)?.description || 'No disponible'}</p>
        <p>Esta insignia ha sido obtenida por el <strong>${percentage}%</strong> de los estudiantes.</p>
      `,
            icon: 'info'
        });
    };

    if (loading) {
        return <p>Cargando insignias...</p>;
    }

    return (
        <div className="badges-gallery">
            <h3>Tus Insignias</h3>
            <div className="badges-grid">
                {badges.map(badge => (
                    <BadgeItem
                        key={badge.id}
                        badge={badge}
                        isUnlocked={userBadges.includes(badge.id)}
                        onClick={() => handleBadgeClick(badge.id, badge.name)}
                    />
                ))}
            </div>
        </div>
    );
}

export default BadgesGallery;