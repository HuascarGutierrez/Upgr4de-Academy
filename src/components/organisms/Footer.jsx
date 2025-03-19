import FooterItem from "../molecules/FooterItem"
import './styles/Footer.css'

function Footer() {
  return (
    <footer className='footer'>
      <section className='footer_section'>
        <span className='footer_section_title'>Información</span>
        <FooterItem imageUrl={'assets/phone.svg'} text={'Direccion: Ciudad Satelite, El Alto'}/>
        <FooterItem imageUrl={'assets/phone.svg'} text={'Celular: +591 12341234'}/>
        <FooterItem imageUrl={'assets/clock.svg'} text={'Horas de respuestar: 8 to 20'}/>
        <FooterItem imageUrl={'assets/mail.svg'} text={'Email: info@SAPI.edu.com'}/>
      </section>
      <section className='footer_section footer_section_materias'>
        <span className='footer_section_title'>Servicios</span>
          <p>SAPI</p>
      </section>
      <section className='footer_section footer_section_links'>
        <span className='footer_section_title'>Links</span>
          <p>Sobre Nosotros</p>
      </section>
    </footer>
  )
}

export default Footer