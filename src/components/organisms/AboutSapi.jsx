import './styles/AboutSapi.css'
import InfoBlockGrid3x6 from '../molecules/InfoBlockGrid3x6'

function AboutSapi() {
  return (
    <InfoBlockGrid3x6 title='PLATAFORMA EDUCATIVA (SAPI)'
    text1='Diseñada para reforzar los conocimientos de los estudiantes'
    text2='Enfocada en las unidades de cálculo, álgebra, física y química'
    text3='Cada materia se divide en unidades'
    imageLarge={'images/ivan-ceo.webp'}
    imageSmall={'images/sapi-pet.webp'}
    />
  )
}

export default AboutSapi