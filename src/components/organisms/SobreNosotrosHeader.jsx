import './styles/SobreNosotrosHeader.css'
import SplitText from '../atoms/SplitText'

function SobreNosotrosHeader() {
  
  return (
    <header className='sn_header'>
        <video className='sn_video' autoPlay muted loop src="video/sn_header_video.mp4"></video>
        <div className='sn_overlay'></div>
        <div className='sn_content'>
            <div className="sn_description">
                <h2 className="sn_title">Sobre <SplitText
                    text="Nosotros!"
                    className="text-2xl font-bold text-center"
                    delay={150}
                    animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                    animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                    easing="easeOutCubic"
                    threshold={0.2}
                    rootMargin="-50px"
                  /></h2>
                <p className="sn_text">Nuestra misión es proporcionar un apoyo para cualquier persona en cualquier lugar</p>
                <a className='sn_more' href="#snMain">Ver más...</a>
            </div>
            <div className='sn_img_container'>
              <img src="images/zowl_header.webp" alt="" className="sn_img" />
            </div>
        </div>
    </header>
  )
}

export default SobreNosotrosHeader