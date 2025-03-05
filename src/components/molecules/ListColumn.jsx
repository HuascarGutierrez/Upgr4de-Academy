import './styles/ListColumn.css'

function ListColumn({title, list}) {
  return (
    <div className='list'>
        <h2 className='list_title'>{title}</h2>
        <ul className='list_ul'>
            {list.map((item, index)=> (
                <li className='list_item' key={index}>{item}</li>
            ))}
        </ul>
    </div>
  )
}

export default ListColumn