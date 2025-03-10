import ListColumn from "../molecules/ListColumn"
import './styles/PadresYTutores.css'

function PadresYTutores() {
    const title = 'Para Padres y Tutores'
    const list = ['Recibe reportes detallados del avance de tu hijo y celebra sus logros junto a él.',
        'Planes flexibles y precios ajustados para que la educación de calidad no sea una ilusión.',
        'Que tu hijo desarrolle habilidades STEM críticas para carreras universitarias y profesionales en auge.'
    ]
  return (
    <section className="padresTutores">
        <img src="images/PadresYTutores.webp" alt="" className="padresTutores_img" />
        <div className="benefits_container">
            <ListColumn title={title} list={list}/>
        </div>
    </section>
  )
}

export default PadresYTutores