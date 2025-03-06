import './styles/SobreNosotrosHeader.css'

function SobreNosotrosHeader() {
  return (
    <header className='sn_header'>
        <div className='sn_overlay'></div>
        <div className='sn_content'>
            <div className="sn_description">
                <h2 className="sn_title">Sobre <span>Nosotros</span></h2>
                <p className="sn_text">Nuestra misión es proporcionar un apoyo para cualquier persona en cualquier lugar</p>
                <a className='sn_more' href="">Ver más...</a>
            </div>
            <img src="images/zowl_header.webp" alt="" className="sn_img" />
        </div>
    </header>
  )
}

export default SobreNosotrosHeader