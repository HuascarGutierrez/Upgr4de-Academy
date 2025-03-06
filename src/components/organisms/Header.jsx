import SplitText from '../atoms/SplitText'
import './styles/Header.css'

function Header() {
  return (
    <header className='header'>
        <video autoPlay muted loop className='header_video' src="video/header-bg.mp4"></video>
        <div className="header_overlay"></div>
        
        <div className="header_content">
            <h2 className='header_title'>Únete a <SplitText text='Upgr4de' delay={150}/><br />
            <SplitText text='Academy' delay={150}/> y aprende<br />
            con nosotros.</h2>
            {/**<p className='header_text'>Somos una academia enfocada en ayudar a estudiantes con dificultades en materias STEM.</p> */}
            <a className='header_btn' href="#SAPIGrid">Explora el lugar</a>
        </div>
    </header>
  )
}

export default Header