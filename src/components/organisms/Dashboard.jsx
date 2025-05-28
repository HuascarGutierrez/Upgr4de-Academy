// src/components/Dashboard.jsx (o tu componente padre donde llamas a Supervision y GamificationSection)
import React, { useState, useCallback, useEffect } from 'react';
import Supervision from './Supervision'; // Ajusta la ruta si es necesario
import GamificationSection from './GamificationSection'; // Ajusta la ruta si es necesario
// Asegúrate de importar 'db' si necesitas Firebase aquí directamente,
// aunque la recolección de forum_activity ya se movió a Supervision para simplificar.

function Dashboard({ user }) {
    const [gamificationData, setGamificationData] = useState(null);
    const [loadingGamification, setLoadingGamification] = useState(true);

    // Esta función se ejecutará cuando Supervision haya cargado sus datos
    const handleSupervisionDataLoaded = useCallback((dataFromSupervision) => {
        console.log("Datos recibidos de Supervision para gamificación:", dataFromSupervision);

        // Extrae los valores numéricos, asegurando que sean 0 si son nulos/indefinidos
        const cursosActivos = Number(dataFromSupervision.cursosActivos || 0);
        const unidadesCompletadas = Number(dataFromSupervision.unidadesCompletadas || 0);
        const ejerciciosCompletados = Number(dataFromSupervision.ejerciciosCompletados || 0);
        const forumContributions = Number(dataFromSupervision.forumContributions || 0);

        // Lógica para calcular Puntos y Nivel
        // Puedes ajustar las ponderaciones según tu modelo de gamificación
        const points = (ejerciciosCompletados * 10) + (unidadesCompletadas * 5) + (cursosActivos * 100) + (forumContributions * 20);
        const level = Math.floor(points / 200) + 1; // Un nuevo nivel cada 200 puntos, empezando en 1

        // Determinar el logro 'innovatorAchieved'
        // Por ejemplo, si se logra a partir de cierto umbral de puntos o alguna otra condición
        const innovatorAchieved = points >= 5000; // Ejemplo: alcanzar 5000 puntos para ser innovador

        // Construye el objeto userData para GamificationSection
        setGamificationData({
            gamification: { // Objeto 'gamification' para encapsular puntos, nivel y logros específicos
                points: points,
                level: level,
                innovatorAchieved: innovatorAchieved,
            },
            cursosActivos: cursosActivos,
            unidadesCompletadas: unidadesCompletadas,
            ejerciciosCompletados: ejerciciosCompletados,
            forumContributions: forumContributions, // Pasa esto directamente
        });
        setLoadingGamification(false);
    }, []); // El useCallback no tiene dependencias si no usa variables de su scope padre

    // Efecto para inicializar la carga o reaccionar a cambios de usuario
    useEffect(() => {
        if (!user) {
            setLoadingGamification(false);
            setGamificationData(null); // Limpiar datos si no hay usuario
            return;
        }
        // Si hay usuario, activamos la carga para esperar los datos de Supervision
        setLoadingGamification(true);
    }, [user]);

    return (
        <div className="user-dashboard">
            {/* Supervision es quien realmente obtiene los datos primarios y los pasa a handleSupervisionDataLoaded */}
            <Supervision user={user} onDataLoaded={handleSupervisionDataLoaded} />

            {loadingGamification ? (
                <p>Cargando tu progreso de gamificación...</p>
            ) : (
                gamificationData ? (
                    <GamificationSection userData={gamificationData} />
                ) : (
                    <p>No hay datos de gamificación disponibles. Asegúrate de iniciar sesión y comenzar tu aprendizaje.</p>
                )
            )}
        </div>
    );
}

export default Dashboard;