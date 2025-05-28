// src/components/GamificationSection.jsx
import React, { useState, useEffect } from "react";
import "./styles/GamificationSection.css"; // Estilos para este componente

function GamificationSection({ user }) {
    const [achievements, setAchievements] = useState([]);
    const [badges, setBadges] = useState([]);
    const [points, setPoints] = useState(0);
    const [level, setLevel] = useState(1);

    useEffect(() => {
        // Valores por defecto para demostración
        setPoints(user?.gamification?.points || 2150);
        setLevel(user?.gamification?.level || 15);

        setAchievements([
            { id: "logro1", name: "Primer Curso Completado", description: "Finalizaste tu primer curso de STEM.", icon: "✅", earned: true },
            { id: "logro2", name: "Estudiante Constante", description: "Estudiaste activamente por 7 días consecutivos.", icon: "📅", earned: true },
            { id: "logro3", name: "Maestro Matemático", description: "Dominas los conceptos clave de matemáticas.", icon: "🧠", earned: false },
            { id: "logro4", name: "Científico Curioso", description: "Completaste tu primera unidad de ciencias experimentales.", icon: "🔬", earned: false },
            { id: "logro5", name: "Ingeniero en Formación", description: "Resolviste un problema de diseño o lógica aplicado a la ingeniería.", icon: "⚙️", earned: true },
            { id: "logro6", name: "Analista de Datos", description: "Completaste una sección sobre interpretación y análisis de datos.", icon: "📊", earned: false },
            { id: "logro7", name: "Explorador de Abri", description: "Accediste y exploraste todas las secciones de la plataforma.", icon: "🧭", earned: true },
            { id: "logro8", name: "Resolutor de Desafíos", description: "Resolviste 20 ejercicios difíciles de distintas áreas STEM.", icon: "💡", earned: false },
            { id: "logro9", name: "Colaborador Activo", description: "Participaste en debates y foros de ayuda sobre temas STEM.", icon: "🤝", earned: true },
            { id: "logro10", name: "Innovador", description: "Sugeriste una mejora para la plataforma o una idea creativa STEM.", icon: "✨", earned: false },
        ]);

        setBadges([
            { id: "insignia1", name: "Iniciado STEM", icon: "🔰", earned: true },
            { id: "insignia2", name: "Resolutor Analítico", icon: "🏆", earned: true },
            { id: "insignia3", name: "Genio Lógico", icon: "🌟", earned: false },
            { id: "insignia4", name: "Pionero Digital", icon: "🚀", earned: false },
            { id: "insignia5", name: "Mentor del Conocimiento", icon: "👨‍🏫", earned: true },
            { id: "insignia6", name: "Comunicador Científico", icon: "🗣️", earned: true },
            { id: "insignia7", name: "Perseverante STEM", icon: "💪", earned: false },
            { id: "insignia8", name: "Explorador Científico", icon: "🔭", earned: false },
        ]);
    }, [user]);

    return (
        <div id="gamification-content" className="gamification-inner-content">
            <h2 className="gamification-title">Tu Progreso de Gamificación</h2>

            <div className="gamification-summary bento-grid-2">
                <div className="summary-item bento-box">
                    <span className="summary-icon">✨</span>
                    <h3>Puntos Totales</h3>
                    <p className="summary-value">{points}</p>
                </div>
                <div className="summary-item bento-box">
                    <span className="summary-icon">⬆️</span>
                    <h3>Nivel Actual</h3>
                    <p className="summary-value">{level}</p>
                </div>
            </div>

            <div className="achievements-section">
                <h3>Logros Desbloqueados</h3>
                {achievements.length > 0 ? (
                    <div className="achievements-grid bento-grid-columns">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`achievement-item bento-box ${achievement.earned ? "earned" : "locked"}`}
                            >
                                <div className="achievement-header">
                                    <span className="achievement-icon">{achievement.earned ? achievement.icon : "🔒"}</span>
                                    <h4>{achievement.name}</h4>
                                </div>
                                <p className="achievement-description">{achievement.description}</p>
                                <span className={`achievement-status ${achievement.earned ? "status-earned" : "status-locked"}`}>
                                    {achievement.earned ? "¡Obtenido!" : "Bloqueado"}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-items-message">Aún no tienes logros. ¡Completa actividades para desbloquearlos!</p>
                )}
            </div>

            <div className="badges-section">
                <h3>Tus Insignias</h3>
                {badges.length > 0 ? (
                    <div className="badges-grid bento-grid-columns">
                        {badges.map((badge) => (
                            <div
                                key={badge.id}
                                className={`badge-item bento-box ${badge.earned ? "earned" : "locked"}`}
                            >
                                <span className="badge-icon">{badge.earned ? badge.icon : "❓"}</span>
                                <h4>{badge.name}</h4>
                                <span className={`badge-status ${badge.earned ? "status-earned" : "status-locked"}`}>
                                    {badge.earned ? "¡Obtenida!" : "Bloqueada"}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-items-message">Aún no tienes insignias. ¡Desbloquea logros para ganarlas!</p>
                )}
            </div>

            <div className="coming-soon-section bento-box">
                <h4>Próximamente más características de Gamificación:</h4>
                <ul>
                    <li>🏆 Tabla de Clasificación Global</li>
                    <li>🎁 Tienda de Recompensas por Puntos</li>
                    <li>📊 Análisis de Progreso Personalizado</li>
                </ul>
                <p>¡Sigue interactuando con la plataforma para más sorpresas!</p>
            </div>
        </div>
    );
}

export default GamificationSection;