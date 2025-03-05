import FooterItem from "../molecules/FooterItem"
import './styles/Footer.css'

function Footer() {
  return (
    <footer className='footer'>
      <section className='footer_section'>
        <FooterItem imageUrl={'assets/phone.svg'} text={'+591 12341234'}/>
        <FooterItem imageUrl={'assets/clock.svg'} text={'Response hours: 8 to 20'}/>
        <FooterItem imageUrl={'assets/mail.svg'} text={'Email: info@SAPI.edu.com'}/>
      </section>
      <section className='footer_section footer_section_materias'>
        <span className='footer_section_title'>Materias</span>
          <p>Algebra</p>
          <p>Calculo</p>
          <p>Fisica</p>
          <p>Quimica</p>
      </section>
      <section className='footer_section footer_section_links'>
        <span className='footer_section_title'>Links</span>
          <p>Sobre Nosotros</p>
          <p>Por qué SAPI</p>
      </section>
    </footer>
  )
}

export default Footer