import Footer from "../components/organisms/Footer"
import Header from "../components/organisms/Header"
import InfoBlockList from "../components/organisms/InfoBlockList"
import Nav from "../components/organisms/Nav"
import SobreNosotrosHeader from "../components/organisms/SobreNosotrosHeader"
import nosotros from "../assets/sobreNosotros"

function SobreNosotros() {
  return (
    <div>
      <header>
        <SobreNosotrosHeader/>
      </header>
      <main>
        <Nav/>
        <InfoBlockList nosotros={nosotros}/>
      </main>
      <Footer/>
    </div>
  )
}

export default SobreNosotros