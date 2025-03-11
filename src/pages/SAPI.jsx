import Footer from "../components/organisms/Footer"
import Nav from "../components/organisms/Nav"
import SAPIHeader from "../components/organisms/SAPIHeader"

function SAPI() {
  return (
    <>
        <SAPIHeader/>
        <main id="SAPIMain">
        <Nav/>
        <div style={{width: '100%', height: '100dvh', backgroundColor: 'red'}}></div>
        </main>
        <Footer/>
    </>
  )
}

export default SAPI