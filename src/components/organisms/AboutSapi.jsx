import './styles/AboutSapi.css'
import InfoBlockGrid3x6 from '../molecules/InfoBlockGrid3x6'

function AboutSapi() {
  return (
    <InfoBlockGrid3x6 title='PLATAFORMA EDUCATIVA (SAPI)'
    text1='Diseñada con el propósito de reforzar y afianzar los conocimientos adquiridos por los estudiantes en diversas áreas del aprendizaje.'
    textetiqueta={<p>Enfocada en las unidades de <span>cálculo, álgebra, física y química</span></p>}
    text3='Cada materia se divide en unidades'
    imageLarge={'images/ivan-ceo.webp'}
    imageSmall={'images/sapi-pet.webp'}
    />
  )
}

export default AboutSapi