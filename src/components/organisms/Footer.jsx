import FooterItem from "../molecules/FooterItem"
import './styles/Footer.css'
import { useNavigate } from 'react-router-dom'
import { useState } from "react";


function Footer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <footer className='footer'>
      <section className='footer_section'>
        <span className='footer_section_title'>Información</span>
        <FooterItem imageUrl={'Icons/Location.svg'} text={'Dirección: Escalón y Agüero N° 344, Ciudad Satélite, El Alto.'} refe={'https://maps.app.goo.gl/YUnRX9TF2idCKLwi6'}/>
        <FooterItem imageUrl={'assets/phone.svg'} text={'Celular: +591 71832939'} refe={'https://wa.me/+59171832939'}/>
        <FooterItem imageUrl={'assets/clock.svg'} text={'Horas de respuesta: 8:00 - 20:00'} refe={'https://wa.me/+59171832939'}/>
        <FooterItem imageUrl={'assets/mail.svg'} text={'Email: info@SAPI.edu.com'} refe={'mailto:samuelantoni2002@gmail.com'}/>
      </section>
      <section className='footer_section footer_section_materias'>
        <span className='footer_section_title'>Servicios</span>
          <li onClick={() => {navigate('/SAPI')}} className="footer_item">
            <p>SAPI</p>
          </li>
      </section>
      <section className='footer_section footer_section_links'>
        <span className='footer_section_title'>Links</span>
        <li onClick={() => {navigate('/sobreNosotros')}} className="footer_item">
          <p>Sobre Nosotros</p>
        </li>
      </section>
    </footer>
  )
}

export default Footer