import InfoBlockGrid3x6 from "../components/molecules/InfoBlockGrid3x6"
import Footer from "../components/organisms/Footer"
import GridProposito from "../components/organisms/GridProposito"
import GridVision from "../components/organisms/GridVision"
import Nav from "../components/organisms/Nav"
import SobreNosotrosHeader from "../components/organisms/SobreNosotrosHeader"

import './styles/SobreNosotros.css'

function SobreNosotros({user}) {
  return (
    <div className="sobreNosotros">
    <SobreNosotrosHeader/>
      <main id="snMain" className="sobreNosotros_main">
        <Nav user={user}/>
        <InfoBlockGrid3x6 
        title= 'MISIÓN'
        text1= 'Empoderar a estudiantes de Bolivia para superar sus desafíos en materias STEM'
        textetiqueta= {<p>Proporcionando una educación en línea <span>accesible y de alta calidad</span> a través de la plataforma SAPI.</p>}
        text3='Utilizando herramientas innovadoras y retroalimentación'
        imageLarge={'images/kid_study_1.webp'}
        imageSmall={'images/kid_study_2.webp'}
        displayBuho={0}
        />
        <GridVision/>
        <GridProposito/>
      </main>
      <Footer/>
    </div>
  )
}

export default SobreNosotros