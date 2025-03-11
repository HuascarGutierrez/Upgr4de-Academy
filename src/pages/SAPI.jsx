import Footer from "../components/organisms/Footer"
import Nav from "../components/organisms/Nav"
import SAPIHeader from "../components/organisms/SAPIHeader"
import Materias from "../components/organisms/Materias"
import materias from "../assets/materias"
import './styles/SAPI.css'

function SAPI({user}) {
  return (
    <section className="SAPI">
        <SAPIHeader/>
        <main id="SAPIMain">
        <Nav/>
        <Materias materias={materias}/>
        </main>
        <Footer/>
    </section>
  )
}

export default SAPI