import './styles/FooterItem.css'

function FooterItem({imageUrl, text}) {
  return (
    <div className='footerItem'>
        <img src={imageUrl} alt={text} />
        <p>{text}</p>
    </div>
  )
}

export default FooterItem