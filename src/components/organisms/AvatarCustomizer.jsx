// src/components/organisms/AvatarCustomizer.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/app';
import './styles/AvatarCustomizer.css';
import Swal from 'sweetalert2';

function AvatarCustomizer({ user, userAvatarParts, userPoints, setUserData }) { // Agregamos setUserData para actualizar puntos
    const [avatarItems, setAvatarItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentAvatar, setCurrentAvatar] = useState(userAvatarParts);
    const [availablePoints, setAvailablePoints] = useState(userPoints);

    useEffect(() => {
        const fetchAvatarItems = async () => {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'avatarItems'));
            const fetchedItems = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAvatarItems(fetchedItems);
            setLoading(false);
        };
        fetchAvatarItems();
    }, []);

    const handlePartSelect = async (item) => {
        const userRef = doc(db, 'users', user.uid);
        const newAvatar = { ...currentAvatar, [item.type]: item.id };
        const cost = item.pointsCost;

        // Si la parte ya está seleccionada o no tiene costo, no hace nada
        if (currentAvatar[item.type] === item.id) {
            return;
        }

        // Si el usuario no tiene la parte y no tiene suficientes puntos
        if (!userAvatarParts[item.type] || userAvatarParts[item.type] !== item.id) {
            if (availablePoints < cost) {
                Swal.fire('Puntos insuficientes', 'No tienes suficientes puntos para desbloquear esta parte del avatar.', 'warning');
                return;
            }
            // Restar puntos y actualizar el avatar
            const newPoints = availablePoints - cost;
            setAvailablePoints(newPoints);
            setCurrentAvatar(newAvatar);
            // Actualizar en Firestore
            await updateDoc(userRef, {
                avatarParts: newAvatar,
                points: newPoints // Restar los puntos
            });
            Swal.fire('¡Avatar Actualizado!', `Gastaste ${cost} puntos.`, 'success');
        } else {
            // Si ya tiene la parte (pero la selecciona de nuevo), simplemente actualiza el avatar sin costo
            setCurrentAvatar(newAvatar);
            await updateDoc(userRef, { avatarParts: newAvatar });
        }

        // Opcional: Actualizar el estado del usuario en el componente padre si `setUserData` es provisto
        // if (setUserData) {
        //   setUserData(prev => ({ ...prev, avatarParts: newAvatar, points: newPoints }));
        // }
    };

    if (loading) {
        return <p>Cargando opciones de avatar...</p>;
    }

    // Agrupar items por tipo
    const groupedItems = avatarItems.reduce((acc, item) => {
        (acc[item.type] = acc[item.type] || []).push(item);
        return acc;
    }, {});

    return (
        <div className="avatar-customizer">
            <h3>Personaliza Tu Avatar</h3>
            <p>Puntos Disponibles: {availablePoints}</p>

            <div className="current-avatar-preview">
                {/* Aquí puedes renderizar el avatar actual combinando las partes */}
                {Object.keys(currentAvatar).map(type => {
                    const itemId = currentAvatar[type];
                    const item = avatarItems.find(i => i.id === itemId && i.type === type);
                    return item ? <img key={item.id} src={item.imageUrl} alt={item.type} className={`avatar-part ${item.type}`} /> : null;
                })}
                {/* Puedes añadir un fondo o una forma base si tu avatar es más complejo */}
                {Object.keys(groupedItems).length === 0 && <p>No hay partes de avatar disponibles.</p>}
            </div>

            <div className="avatar-parts-selection">
                {Object.keys(groupedItems).map(type => (
                    <div key={type} className="avatar-part-category">
                        <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4> {/* Capitalizar el tipo */}
                        <div className="part-options">
                            {groupedItems[type].map(item => (
                                <div
                                    key={item.id}
                                    className={`part-option ${currentAvatar[type] === item.id ? 'selected' : ''} ${availablePoints < item.pointsCost && currentAvatar[type] !== item.id ? 'locked-by-points' : ''}`}
                                    onClick={() => handlePartSelect(item)}
                                >
                                    <img src={item.imageUrl} alt={item.id} />
                                    <p>{item.pointsCost > 0 && currentAvatar[type] !== item.id ? `${item.pointsCost} Puntos` : ''}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AvatarCustomizer;