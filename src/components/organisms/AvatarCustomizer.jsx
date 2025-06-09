import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/app';
import './styles/AvatarCustomizer.css';
import Swal from 'sweetalert2';
import { FaCoins } from 'react-icons/fa';
import html2canvas from 'html2canvas';

function AvatarCustomizer({ user, userAvatarParts, userPoints, setUserData, onAvatarExport }) {
    const [avatarItems, setAvatarItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentAvatar, setCurrentAvatar] = useState(userAvatarParts);
    const [availablePoints, setAvailablePoints] = useState(userPoints);
    const [pendingChanges, setPendingChanges] = useState({});
    const [pointsDeductedInSession, setPointsDeductedInSession] = useState(0);

    const partTypeDisplayNames = {
        body: 'Cuerpo',
        head: 'Cabeza',
        eyes: 'Ojos',
        mouth: 'Boca',
        hair: 'Cabello',
        outfit: 'Atuendo',
        accessory: 'Accesorio',
        background: 'Fondo'
    };

    useEffect(() => {
        const fetchAvatarItems = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'avatarItems'));
                const fetchedItems = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAvatarItems(fetchedItems);
            } catch (error) {
                console.error("Error fetching avatar items:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar las opciones del avatar.',
                    icon: 'error',
                    confirmButtonColor: 'var(--brandy-punch-500)',
                    background: 'var(--black-900)',
                    color: 'var(--black-50)'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchAvatarItems();
    }, []);

    useEffect(() => {
        setAvailablePoints(userPoints);
        setCurrentAvatar(userAvatarParts);
        setPendingChanges({});
        setPointsDeductedInSession(0);
    }, [userPoints, userAvatarParts]);

    const handlePartSelect = useCallback((item) => {
        const newAvatarPartId = item.id;
        const partType = item.type;
        const cost = item.pointsCost;

        if (currentAvatar[partType] === newAvatarPartId && !pendingChanges[partType]) {
            return;
        }

        const isPartOwnedInitially = Object.values(userAvatarParts).includes(newAvatarPartId);
        const isPartOwnedInPending = Object.values(pendingChanges).some(pendingId =>
            pendingId === newAvatarPartId);

        const isCurrentlyOwned = isPartOwnedInitially || isPartOwnedInPending;

        let actualCost = 0;
        if (!isCurrentlyOwned) {
            actualCost = cost;
        }

        if ((availablePoints - pointsDeductedInSession) < actualCost) {
            Swal.fire({
                title: 'Puntos insuficientes',
                text: `Necesitas ${cost} puntos para desbloquear esta parte. Tienes ${availablePoints - pointsDeductedInSession} puntos disponibles actualmente.`,
                icon: 'warning',
                confirmButtonColor: 'var(--brandy-punch-500)',
                background: 'var(--black-900)',
                color: 'var(--black-50)'
            });
            return;
        }

        setCurrentAvatar(prev => ({ ...prev, [partType]: newAvatarPartId }));
        setPendingChanges(prev => ({ ...prev, [partType]: newAvatarPartId }));

        if (!isCurrentlyOwned && actualCost > 0) {
            setPointsDeductedInSession(prev => prev + actualCost);
        }
    }, [currentAvatar, availablePoints, pendingChanges, pointsDeductedInSession, userAvatarParts]);

    const handleSaveChanges = useCallback(async () => {
        if (Object.keys(pendingChanges).length === 0) {
            Swal.fire({
                title: 'No hay cambios',
                text: 'No has realizado ninguna selección para guardar.',
                icon: 'info',
                confirmButtonColor: 'var(--swans-down-500)',
                background: 'var(--black-900)',
                color: 'var(--black-50)'
            });
            return;
        }

        const userRef = doc(db, 'users', user.uid);
        let finalUpdatedPoints = userPoints;
        const newAvatarPartsForDB = { ...userAvatarParts };

        let totalCostForPendingChanges = 0;
        for (const type in pendingChanges) {
            const itemId = pendingChanges[type];
            newAvatarPartsForDB[type] = itemId;

            const item = avatarItems.find(i => i.id === itemId && i.type === type);
            if (item) {
                if (!Object.values(userAvatarParts).includes(itemId)) {
                    totalCostForPendingChanges += item.pointsCost;
                }
            }
        }

        finalUpdatedPoints = userPoints - totalCostForPendingChanges;
        if (finalUpdatedPoints < 0) {
            Swal.fire({
                title: 'Error de cálculo',
                text: 'Parece que no tienes suficientes puntos para todos los cambios. Por favor, revisa tus selecciones.',
                icon: 'error',
                confirmButtonColor: 'var(--brandy-punch-500)',
                background: 'var(--black-900)',
                color: 'var(--black-50)'
            });
            return;
        }

        try {
            await updateDoc(userRef, {
                avatarParts: newAvatarPartsForDB,
                points: finalUpdatedPoints
            });
            setAvailablePoints(finalUpdatedPoints);
            setCurrentAvatar(newAvatarPartsForDB);
            setPendingChanges({});
            setPointsDeductedInSession(0);

            if (setUserData) {
                setUserData(prev => ({ ...prev, avatarParts: newAvatarPartsForDB, points: finalUpdatedPoints }));
            }

            Swal.fire({
                title: '¡Éxito!',
                text: '¡Tu avatar ha sido actualizado y los puntos deducidos!',
                icon: 'success',
                confirmButtonColor: 'var(--swans-down-500)',
                background: 'var(--black-900)',
                color: 'var(--black-50)'
            });
        } catch (error) {
            console.error("Error updating avatar or points:", error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al guardar tu avatar. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonColor: 'var(--brandy-punch-500)',
                background: 'var(--black-900)',
                color: 'var(--black-50)'
            });
        }
    }, [pendingChanges, user.uid, userPoints, userAvatarParts, avatarItems, setUserData]);

    const handleCancelChanges = useCallback(() => {
        setCurrentAvatar(userAvatarParts);
        setAvailablePoints(userPoints);
        setPendingChanges({});
        setPointsDeductedInSession(0);
        Swal.fire({
            title: 'Cambios Descartados',
            text: 'Tus selecciones no guardadas han sido revertidas.',
            icon: 'info',
            confirmButtonColor: 'var(--swans-down-500)',
            background: 'var(--black-900)',
            color: 'var(--black-50)'
        });
    }, [userAvatarParts, userPoints]);

    const handleExportAvatarAsProfilePicture = async () => {
        if (!user || !user.uid) {
            Swal.fire('Error', 'No se pudo obtener la información del usuario para guardar el avatar.', 'warning');
            return;
        }

        const avatarPreviewElement = document.querySelector('.current-avatar-preview');
        if (!avatarPreviewElement) {
            Swal.fire('Error', 'No se encontró el previsualizador del avatar.', 'error');
            return;
        }

        setLoading(true);
        try {
            const canvas = await html2canvas(avatarPreviewElement, {
                backgroundColor: null,
                useCORS: true,
            });

            canvas.toBlob(async (blob) => {
                if (blob) {
                    if (onAvatarExport) {
                        await onAvatarExport(blob);
                        Swal.fire('Éxito', 'Avatar guardado como foto de perfil.', 'success');
                    }
                } else {
                    Swal.fire('Error', 'No se pudo generar la imagen del avatar.', 'error');
                }
                setLoading(false);
            }, 'image/png');
        } catch (error) {
            console.error("Error al exportar el avatar:", error);
            Swal.fire('Error', 'Hubo un error al exportar el avatar.', 'error');
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="avatar-customizer-loading">
                <p>Cargando opciones de avatar...</p>
                <div className="spinner"></div>
            </div>
        );
    }

    const groupedItems = avatarItems.reduce((acc, item) => {
        (acc[item.type] = acc[item.type] || []).push(item);
        return acc;
    }, {});
    const hasPendingChanges = Object.keys(pendingChanges).length > 0;

    const renderOrder = ['background', 'body', 'outfit', 'head', 'hair', 'eyes', 'mouth', 'accessory'];
    const categoryDisplayOrder = ['eyes', 'head', 'background', 'body', 'outfit', 'hair', 'mouth', 'accessory'];

    return (
        <div className="avatar-customizer">
            <h3 className="customizer-title">Personaliza Tu Avatar</h3>
            <p className="available-points">
                Puntos Disponibles: <FaCoins className="points-icon" />{' '}
                <span>{availablePoints - pointsDeductedInSession}</span>
            </p>

            <div className="current-avatar-preview">
                {renderOrder.map(type => {
                    const itemId = currentAvatar[type];
                    if (!itemId) return null;
                    const item = avatarItems.find(i => i.id === itemId && i.type === type);
                    return item ? <img key={item.id} src={item.imageUrl} alt={type} className={`avatar-part ${type}`} style={{ zIndex: renderOrder.indexOf(type) }} /> :
                        null;
                })}
                {Object.keys(currentAvatar).length === 0 && (
                    <p className="no-avatar-parts">Crea tu avatar seleccionando partes.</p>
                )}
            </div>

            <div className="customizer-actions">
                <button
                    className="save-changes-btn"
                    onClick={handleSaveChanges}
                    disabled={!hasPendingChanges}
                >
                    Guardar Cambios
                </button>
                <button
                    className="cancel-changes-btn"
                    onClick={handleCancelChanges}
                    disabled={!hasPendingChanges}
                >
                    Descartar
                </button>
                <button
                    className="export-profile-pic-btn"
                    onClick={handleExportAvatarAsProfilePicture}
                    disabled={loading}
                >
                    Establecer como Foto de Perfil
                </button>
            </div>

            <div
                className="avatar-parts-selection">
                {Object.keys(groupedItems).length === 0 && <p className="no-items-message">No hay partes de avatar disponibles para personalizar.</p>}
                {categoryDisplayOrder.map(type => {
                    if (!groupedItems[type]) return null;
                    return (
                        <div key={type} className="avatar-part-category">
                            <h4>{partTypeDisplayNames[type] || type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                            <div className="part-options">
                                {groupedItems[type].map(item => {
                                    const isSelected = currentAvatar[type] === item.id;
                                    const isOwned = Object.values(userAvatarParts).includes(item.id) || Object.values(pendingChanges).includes(item.id);
                                    const isLockedByPoints = item.pointsCost > 0 && (availablePoints - pointsDeductedInSession) < item.pointsCost && !isOwned;

                                    return (
                                        <div
                                            key={item.id}
                                            className={`part-option ${isSelected ? 'selected' : ''} ${isLockedByPoints ? 'locked-by-points' : ''}`}
                                            onClick={() => !isLockedByPoints && handlePartSelect(item)}
                                            aria-label={`${partTypeDisplayNames[item.type] || item.type}: ${item.id} - ${isLockedByPoints ?
                                                'Bloqueado' : 'Seleccionar'}`}
                                        >
                                            <img src={item.imageUrl} alt={item.id} />
                                            {item.pointsCost > 0 && !isOwned && (
                                                <p className="item-cost">{item.pointsCost} Puntos</p>
                                            )}
                                            {isSelected && (
                                                <div className="selected-overlay">
                                                    <span className="checkmark" >✔</ span>
                                                </div>
                                            )}
                                            {isLockedByPoints && (
                                                <div className="locked-overlay">🔒</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AvatarCustomizer;