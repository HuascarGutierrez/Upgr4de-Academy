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
            try {
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
            } catch (error) {
                console.error("Error fetching badges or user count:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar las insignias o el conteo de usuarios.',
                    icon: 'error',
                    confirmButtonColor: 'var(--brandy-punch-500)', // Coherente con otros Swal
                    background: 'var(--black-900)',
                    color: 'var(--black-50)'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBadgeClick = async (badgeId, badgeName) => {
        const selectedBadge = badges.find(b => b.id === badgeId);

        if (!selectedBadge) {
            Swal.fire({
                title: 'Error',
                text: 'Insignia no encontrada.',
                icon: 'error',
                confirmButtonColor: 'var(--brandy-punch-500)',
                background: 'var(--black-900)',
                color: 'var(--black-50)'
            });
            return;
        }

        const isUserUnlocked = userBadges.includes(badgeId);

        if (!isUserUnlocked) {
            Swal.fire({
                title: 'Insignia Bloqueada',
                html: `
                    <p>Aún no has desbloqueado la insignia: <strong>"${badgeName}"</strong>.</p>
                    <p>¡Sigue interactuando para obtenerla!</p>
                `,
                icon: 'info',
                confirmButtonColor: 'var(--swans-down-500)',
                background: 'var(--black-900)',
                color: 'var(--black-50)'
            });
            return;
        }

        // Si la insignia está desbloqueada, obtener el porcentaje
        let countWithBadge = 0;
        // Considera si esta consulta es escalable. Para muchos usuarios,
        // una Cloud Function o un contador precalculado sería mejor.
        const usersSnapshot = await getDocs(collection(db, 'users'));
        usersSnapshot.forEach(userDoc => {
            const userData = userDoc.data();
            if (userData.badges && userData.badges.includes(badgeId)) {
                countWithBadge++;
            }
        });

        const percentage = totalUsersCount > 0 ? ((countWithBadge / totalUsersCount) * 100).toFixed(2) : 0;

        Swal.fire({
            title: `Insignia Obtenida: ${badgeName}`,
            html: `
                <p><strong>Descripción:</strong> ${selectedBadge.description || 'No disponible'}</p>
                <p class="swal-percentage">Esta insignia ha sido obtenida por el <strong>${percentage}%</strong> de los estudiantes.</p>
            `,
            icon: 'success', // Icono de éxito si la tienes
            confirmButtonColor: 'var(--swans-down-500)',
            background: 'var(--black-900)',
            color: 'var(--black-50)',
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                htmlContainer: 'swal-custom-html'
            }
        });
    };

    if (loading) {
        return (
            <div className="badges-gallery-loading">
                <p>Cargando insignias...</p>
                <div className="spinner"></div> {/* Reutilizamos el spinner global */}
            </div>
        );
    }

    // Si no hay insignias disponibles
    if (badges.length === 0) {
        return (
            <div className="badges-gallery no-badges">
                <p>Aún no hay insignias disponibles para coleccionar.</p>
            </div>
        );
    }

    return (
        <div className="badges-gallery">
            <h3 className="badges-gallery-title">Tu Colección de Insignias</h3>
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