import './styles/Home.css'
import Header from '../components/organisms/Header'
import Nav from '../components/organisms/Nav'
import AboutSapi from '../components/organisms/AboutSapi'

function Home() {

  return (
    <div className='home'>
      <Header/>
      <main className='home_main'>
        <Nav/>
        <AboutSapi/>
      </main>
    </div>
  )
}

export default Home