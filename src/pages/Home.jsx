import './styles/Home.css'
import Header from '../components/organisms/Header'
import Nav from '../components/organisms/Nav'
import AboutSapi from '../components/organisms/AboutSapi'
import Materias from '../components/organisms/Materias'
import Benefits from '../components/organisms/Benefits'

import materias from '../assets/materias'
import PadresYTutores from '../components/organisms/PadresYTutores'
import Footer from '../components/organisms/Footer'
import QuienesSomos from '../components/organisms/QuienesSomos'

function Home() {

  return (
    <div className='home'>
      <Header/>
      <main id='SAPIGrid' className='home_main'>
        <Nav/>
        <QuienesSomos/>
        {/**<Materias materias={materias}/> */}
        <Benefits/>
        <PadresYTutores/>
      </main>
      <Footer/>
    </div>
  )
}

export default Home