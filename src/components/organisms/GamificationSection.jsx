// src/components/GamificationSection.jsx
import React, { useState, useEffect, useMemo } from "react";
import "./styles/GamificationSection.css"; // Asegúrate de que esta ruta sea correcta

function GamificationSection({ userData }) {
    const [achievements, setAchievements] = useState([]);
    const [badges, setBadges] = useState([]);
    // Los puntos y el nivel ahora se calcularán internamente,
    // por lo que no los inicializamos desde userData.
    const [calculatedPoints, setCalculatedPoints] = useState(0);
    const [calculatedLevel, setCalculatedLevel] = useState(1);

    // --- VARIABLE PARA PRUEBA DE EJERCICIOS COMPLETADOS ---
    // Puedes cambiar este valor para simular los ejercicios completados
    // y ver cómo afecta el logro "Entrenador Novato" y, por ende, los puntos/nivel.
    const debugEjerciciosCompletados = 5; // <--- ¡MODIFICA ESTE VALOR PARA PROBAR!
    // --- FIN DE LA VARIABLE DE PRUEBA ---

    // Definimos los logros y sus puntos asociados usando useMemo
    // para evitar recálculos innecesarios en cada render
    const allAchievements = useMemo(() => [
        {
            id: "logro_inicio_sesion",
            name: "¡Bienvenido a la Ciencia!",
            description: "Iniciaste sesión y comenzaste tu camino en STEM. ¡Tu aventura inicia aquí!",
            icon: "🚀",
            points: 10, // Puntos por este logro
            condition: true, // Asumimos que si el usuario ve esto, ya inició sesión
        },
        {
            id: "logro_primer_curso",
            name: "Mi Primera Aventura",
            description: "Te has inscrito en tu primer curso. ¡Un gran paso hacia el conocimiento!",
            icon: "🌟",
            points: 20,
            condition: userData?.cursosActivos >= 1,
        },
        {
            id: "logro_primer_unidad",
            name: "Fundamentos Desbloqueados",
            description: "Completaste tu primera unidad de estudio. ¡Sigue explorando!",
            icon: "💡",
            points: 15,
            condition: userData?.unidadesCompletadas >= 1,
        },
        {
            id: "logro_primer_ejercicio",
            name: "Primer Reto Superado",
            description: "Resolviste tu primer ejercicio. ¡La práctica hace al maestro!",
            icon: "💪",
            points: 10,
            condition: debugEjerciciosCompletados >= 10,
        },
        // --- LOGRO ESPECÍFICO PARA TU EJEMPLO: "Entrenador Novato" ---
        {   
            id: "logro_entrenador_novato",
            name: "Entrenador Novato",
            description: `Resolviste 5 ejercicios. ¡Un excelente comienzo en tu entrenamiento! (Actualmente tienes ${debugEjerciciosCompletados} ejercicios)`,
            icon: "🏅",
            points: 50, // Puntos por este logro
            // Condición: Se gana cuando debugEjerciciosCompletados es EXACTAMENTE 5.
            // Si es superior a 5, la condición será falsa y se "bloqueará".
            condition: debugEjerciciosCompletados === 10,
        },
        // --- FIN LOGRO ESPECÍFICO ---
        {
            id: "logro_explorador_basico",
            name: "Explorador Novato",
            description: "Navegaste por la plataforma y alcanzaste 50 puntos. ¡Sigue sumando!",
            icon: "🧭",
            points: 30, // Puntos por este logro (no por los puntos acumulados, sino por el hito)
            condition: (userData?.gamification?.points || 0) >= 50, // Se basa en los puntos del backend o simulados
        },
        {
            id: "logro_colaborador_novato",
            name: "Voz de la Comunidad",
            description: "Realizaste tu primera contribución en el foro. ¡Tu opinión importa!",
            icon: "💬",
            points: 25,
            condition: userData?.forumContributions >= 1,
        },

        // LOGROS DE DIFICULTAD MEDIA
        {
            id: "logro_varios_cursos",
            name: "Coleccionista de Saberes",
            description: "Te inscribiste en 3 cursos diferentes. ¡Diversifica tu conocimiento!",
            icon: "📚",
            points: 75,
            condition: userData?.cursosActivos >= 3,
        },
        {
            id: "logro_varias_unidades",
            name: "Caminante del Saber",
            description: "Completaste 10 unidades de estudio. ¡Estás construyendo bases sólidas!",
            icon: "🌳",
            points: 60,
            condition: userData?.unidadesCompletadas >= 10,
        },
        {
            id: "logro_varios_ejercicios",
            name: "Entrenador Constante",
            description: "Resolviste 25 ejercicios. ¡Tu mente se está fortaleciendo!",
            icon: "🏋️",
            points: 100,
            condition: debugEjerciciosCompletados >= 25,
        },
        {
            id: "logro_puntos_intermedios",
            name: "Ascenso Constante",
            description: "Acumulaste 500 puntos. ¡Tu dedicación está dando frutos!",
            icon: "📈",
            points: 80,
            condition: (userData?.gamification?.points || 0) >= 500,
        },
        {
            id: "logro_interaccion_intermedia",
            name: "Dialogo Activo",
            description: "Realizaste 5 o más contribuciones en el foro. ¡Fomenta la discusión!",
            icon: "🗣️",
            points: 70,
            condition: userData?.forumContributions >= 5,
        },

        // LOGROS MÁS DIFÍCILES
        {
            id: "logro_maestro_matematico",
            name: "Maestro Analítico",
            description: "Demostraste tu dominio en matemáticas o lógica resolviendo 75 ejercicios y completando 5 cursos.",
            icon: "🧠",
            points: 200,
            condition: debugEjerciciosCompletados >= 75 && userData?.cursosActivos >= 5,
        },
        {
            id: "logro_cientifico_experto",
            name: "Científico Experimentado",
            description: "Completaste al menos 6 cursos, demostrando un amplio conocimiento en ciencias.",
            icon: "🔬",
            points: 180,
            condition: userData?.cursosActivos >= 6,
        },
        {
            id: "logro_pionero_total",
            name: "Pionero STEM",
            description: "Exploraste a fondo la plataforma y alcanzaste 2000 puntos. ¡Eres un experto!",
            icon: "🏆",
            points: 250,
            condition: (userData?.gamification?.points || 0) >= 2000,
        },
        {
            id: "logro_resolutor_desafios",
            name: "Experto en Desafíos",
            description: "Resolviste 50 o más ejercicios desafiantes de distintas áreas STEM.",
            icon: "🧩",
            points: 150,
            condition: debugEjerciciosCompletados >= 50,
        },
        {
            id: "logro_innovador",
            name: "Mente Innovadora",
            description: "Tu idea o sugerencia creativa fue implementada en la plataforma. ¡Inspiras el cambio!",
            icon: "✨",
            points: 300,
            condition: userData?.gamification?.innovatorAchieved || false,
        },
    ], [userData, debugEjerciciosCompletados]); // Dependencias del useMemo

    // Definimos las insignias
    const allBadges = useMemo(() => [
        {
            id: "insignia_nuevo_horizonte",
            name: "Nuevo Horizonte",
            icon: "🆕",
            description: "Por iniciar tu recorrido en la plataforma y completar una actividad básica.",
            condition: (userData?.cursosActivos >= 1 || userData?.unidadesCompletadas >= 1 || debugEjerciciosCompletados >= 1),
        },
        {
            id: "insignia_compromiso_inicial",
            name: "Primer Compromiso",
            icon: "🤝",
            description: "Demostraste tu compromiso al resolver 5 ejercicios y completar 2 unidades.",
            condition: debugEjerciciosCompletados >= 5 && userData?.unidadesCompletadas >= 2,
        },
        {
            id: "insignia_puntos_bronce",
            name: "Contribuyente Bronce",
            icon: "🥉",
            description: "Acumulaste tus primeros 250 puntos. ¡Vas por buen camino!",
            condition: calculatedPoints >= 250, // Ahora basado en los puntos calculados
        },
        {
            id: "insignia_explorador_activo",
            name: "Explorador Activo",
            icon: "🗺️",
            description: "Exploraste activamente al menos 4 cursos y completaste 15 unidades.",
            condition: userData?.cursosActivos >= 4 && userData?.unidadesCompletadas >= 15,
        },
        {
            id: "insignia_practicante_plata",
            name: "Practicante Plata",
            icon: "🥈",
            description: "Resolviste un total de 40 ejercicios. ¡Tu habilidad crece!",
            condition: debugEjerciciosCompletados >= 40,
        },
        {
            id: "insignia_puntos_plata",
            name: "Contribuyente Plata",
            icon: "⚪",
            description: "Alcanzaste los 1000 puntos. ¡Tu impacto es notable!",
            condition: calculatedPoints >= 1000, // Ahora basado en los puntos calculados
        },
        {
            id: "insignia_comunicador_junior",
            name: "Comunicador Junior",
            icon: "📢",
            description: "Realizaste al menos 10 contribuciones significativas en el foro.",
            condition: userData?.forumContributions >= 10,
        },
        {
            id: "insignia_maestro_gold",
            name: "Maestro STEM Oro",
            icon: "🥇",
            description: "Lograste un dominio excepcional: 8 cursos, 30 unidades y 100 ejercicios completados.",
            condition: userData?.cursosActivos >= 8 && userData?.unidadesCompletadas >= 30 && debugEjerciciosCompletados >= 100,
        },
        {
            id: "insignia_cientifico_estrella",
            name: "Estrella Científica",
            icon: "⭐",
            description: "Destacaste en ciencias con 10 o más cursos y 150 ejercicios resueltos.",
            condition: userData?.cursosActivos >= 10 && debugEjerciciosCompletados >= 150,
        },
        {
            id: "insignia_influencer_comunidad",
            name: "Líder de Comunidad",
            icon: "👑",
            description: "Eres una figura clave en la comunidad con 20+ contribuciones y 3000+ puntos.",
            condition: userData?.forumContributions >= 20 && calculatedPoints >= 3000, // Ahora basado en los puntos calculados
        },
        {
            id: "insignia_leyenda_stem",
            name: "Leyenda STEM",
            icon: "💎",
            description: "Alcanzaste el nivel 20, un verdadero ícono de la sabiduría STEM.",
            condition: calculatedLevel >= 20, // Ahora basado en el nivel calculado
        },
    ], [userData, debugEjerciciosCompletados, calculatedPoints, calculatedLevel]); // Dependencias del useMemo

    useEffect(() => {
        let totalPoints = 0;
        const evaluatedAchievements = allAchievements.map(ach => {
            const earned = ach.condition; // La condición del logro determina si está ganado
            if (earned) {
                totalPoints += ach.points;
            }
            return { ...ach, earned };
        });

        setAchievements(evaluatedAchievements);
        setCalculatedPoints(totalPoints);

        // Lógica simple para calcular el nivel. Puedes ajustarla a tus necesidades.
        // Por ejemplo, 100 puntos por nivel, o niveles que requieren más puntos a medida que suben.
        const pointsPerLevel = 100;
        const newLevel = Math.floor(totalPoints / pointsPerLevel) + 1;
        setCalculatedLevel(newLevel);

        // Evaluar insignias también
        const evaluatedBadges = allBadges.map(badge => {
            const earned = badge.condition;
            return { ...badge, earned };
        });
        setBadges(evaluatedBadges);

    }, [allAchievements, allBadges]); // Re-ejecutar cuando las definiciones de logros/insignias cambian

    return (
        <div id="gamification-content" className="gamification-inner-content">
            <h2 className="gamification-title">Tu Progreso de Gamificación</h2>

            <div className="gamification-summary bento-grid-2">
                <div className="summary-item bento-box">
                    <span className="summary-icon">✨</span>
                    <h3>Puntos Totales</h3>
                    <p className="summary-value">{calculatedPoints}</p> {/* Usamos los puntos calculados */}
                </div>
                <div className="summary-item bento-box">
                    <span className="summary-icon">⬆️</span>
                    <h3>Nivel Actual</h3>
                    <p className="summary-value">{calculatedLevel}</p> {/* Usamos el nivel calculado */}
                </div>
            </div>

            <div className="achievements-section">
                <h3>Logros Desbloqueados</h3>
                {achievements.length > 0 ? (
                    <div className="achievements-grid bento-grid-columns">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`achievement-item bento-box ${achievement.earned ? "earned" : "locked"
                                    }`}
                            >
                                <div className="achievement-header">
                                    <span className="achievement-icon">
                                        {achievement.earned ? achievement.icon : "🔒"}
                                    </span>
                                    <h4>{achievement.name}</h4>
                                </div>
                                <p className="achievement-description">
                                    {achievement.description}
                                </p>
                                <span
                                    className={`achievement-status ${achievement.earned ? "status-earned" : "status-locked"
                                        }`}
                                >
                                    {achievement.earned ? "¡Obtenido!" : "Bloqueado"}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-items-message">
                        Aún no tienes logros. ¡Completa actividades para desbloquearlos!
                    </p>
                )}
            </div>

            <div className="badges-section">
                <h3>Tus Insignias</h3>
                {badges.length > 0 ? (
                    <div className="badges-grid bento-grid-columns">
                        {badges.map((badge) => (
                            <div
                                key={badge.id}
                                className={`badge-item bento-box ${badge.earned ? "earned" : "locked"
                                    }`}
                            >
                                <span className="badge-icon">
                                    {badge.earned ? badge.icon : "❓"}
                                </span>
                                <h4>{badge.name}</h4>
                                <p className="badge-description">
                                    {badge.description}
                                </p>
                                <span
                                    className={`badge-status ${badge.earned ? "status-earned" : "status-locked"
                                        }`}
                                >
                                    {badge.earned ? "¡Obtenida!" : "Bloqueada"}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-items-message">
                        Aún no tienes insignias. ¡Desbloquea logros para ganarlas!
                    </p>
                )}
            </div>

            {/* Sección "Próximamente" */}
            <div className="coming-soon-section bento-box">
                <h4>Próximamente más características de Gamificación:</h4>
                <ul>
                    <li>🏆 Tabla de Clasificación Global</li>
                    <li>🎁 Tienda de Recompensas por Puntos</li>
                    <li>📊 Análisis de Progreso Personalizado</li>
                    <li>🤝 Desafíos entre Usuarios</li>
                </ul>
                <p>¡Sigue interactuando con la plataforma para más sorpresas y recompensas!</p>
            </div>
        </div>
    );
}

export default GamificationSection;