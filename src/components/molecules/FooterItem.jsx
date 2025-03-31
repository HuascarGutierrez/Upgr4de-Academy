import './styles/FooterItem.css'

function FooterItem({imageUrl, text, refe}) {

  return (
    <div className='footerItem'>
        <img src={imageUrl} alt={text} />
        <a href={refe} target={'_blank'}>{text}</a>
    </div>
  )
}

export default FooterItem