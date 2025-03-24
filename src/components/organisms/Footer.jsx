import FooterItem from "../molecules/FooterItem"
import './styles/Footer.css'
import { useNavigate } from "react-router-dom"

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className='footer'>
      <section className='footer_section'>
        <span className='footer_section_title'>Información</span>
        <FooterItem imageUrl={'Icons/Location.svg'} text={'Dirección: Ciudad Satelite, El Alto'}/>
        <FooterItem imageUrl={'assets/phone.svg'} text={'Celular: +591 12341234'}/>
        <FooterItem imageUrl={'assets/clock.svg'} text={'Horas de respuestar: 8:00 - 20:00'}/>
        <FooterItem imageUrl={'assets/mail.svg'} text={'Email: info@SAPI.edu.com'}/>
      </section>
      <section className='footer_section footer_section_materias'>
        <span className='footer_section_title'>Servicios</span>
          <li className="footer_item">
            <p onClick={()=> {navigate('/SAPI')}}>SAPI</p>
          </li>
      </section>
      <section className='footer_section footer_section_links'>
        <span className='footer_section_title'>Links</span>
        <li className="footer_item">
          <p>Sobre Nosotros</p>
        </li>
      </section>
    </footer>
  )
}

export default Footer