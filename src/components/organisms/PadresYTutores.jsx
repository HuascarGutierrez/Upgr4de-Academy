import './styles/PadresYTutores.css';

function PadresYTutores() {
    const title = 'Para Padres y Tutores';
    const list = [
        'Recibe reportes detallados del avance de tu hijo y celebra sus logros junto a él.',
        'Planes flexibles y precios ajustados para que la educación de calidad no sea una ilusión.',
        'Que tu hijo desarrolle habilidades STEM críticas para carreras universitarias y profesionales en auge.'
    ];

    return (
        <section className="padres-tutores-section" id='PadresyTutores'>
            <h2 className="padres-tutores-title">{title}</h2>
            <div className="padres-tutores-content">
                <div className="padres-tutores-text-container">
                    <div className="padres-tutores-grid">
                        {list.map((item, index) => (
                            <div 
                                key={index} 
                                className={`padres-tutores-grid-item padres-tutores-text padres-tutores-text-${index + 1}`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="padres-tutores-image-container">
                    <img 
                        src="images/PadresYTutores.webp" 
                        alt="Padres y Tutores" 
                        className="padres-tutores-image" 
                    />
                </div>
            </div>
        </section>
    );
}

export default PadresYTutores;
