import InfoBlockGrid3x6 from "../components/molecules/InfoBlockGrid3x6"
import Footer from "../components/organisms/Footer"
import Nav from "../components/organisms/Nav"
import SobreNosotrosHeader from "../components/organisms/SobreNosotrosHeader"

import './styles/SobreNosotros.css'

function SobreNosotros() {
  return (
    <div className="sobreNosotros">
        <SobreNosotrosHeader/>
      <main>
        <Nav/>
        <InfoBlockGrid3x6 
        title= 'MISIÓN'
        text1= 'Empoderar a estudiantes de Bolivia para superar sus desafíos en materias STEM'
        textetiqueta= {<p>Proporcionando una educación en línea <span>accesible y de alta calidad</span> a través de la plataforma SAPI.</p>}
        text3='Utilizando herramientas innovadoras y retroalimentación'
        imageLarge={'images/ivan-ceo.webp'}
        imageSmall={'images/sapi-pet.webp'}
        displayBuho={0}
        />
      </main>
      <Footer/>
    </div>
  )
}

export default SobreNosotros