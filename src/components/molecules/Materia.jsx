import './styles/Materia.css'

function Materia({materia}) {
  return (
    <section className='card'>
        <img className='card_img' src={materia.imageUrl} alt="icon" />
        <h3 className='card_title'>{materia.name}</h3>
        <p className='card_text'>{materia.description}</p>
        {/** <button className='card_btn'>Ver mas ...</button>*/}
    </section>
  )
}

export default Materia