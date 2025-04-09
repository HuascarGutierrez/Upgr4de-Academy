import InfoBlockGrid3x6 from "../components/molecules/InfoBlockGrid3x6"
import Footer from "../components/organisms/Footer"
import GridProposito from "../components/organisms/GridProposito"
import GridVision from "../components/organisms/GridVision"
import GridMision from "../components/organisms/GridMision"
import Nav from "../components/organisms/Nav"
import SobreNosotrosHeader from "../components/organisms/SobreNosotrosHeader"

import './styles/SobreNosotros.css'

function SobreNosotros({user}) {
  return (
    <div className="sobreNosotros">
    <SobreNosotrosHeader/>
      <main id="snMain" className="sobreNosotros_main">
        <Nav user={user}/>
        <GridMision/>
        <GridVision/>
        <GridProposito/>
      </main>
      <Footer/>
    </div>
  )
}

export default SobreNosotros