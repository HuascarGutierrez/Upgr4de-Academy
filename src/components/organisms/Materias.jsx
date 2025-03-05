import Materia from '../molecules/Materia'
import './styles/Materias.css'

function Materias({materias}) {
  return (
    <>
      <h2 className='materias_title'>Materias</h2>
      <section className="materias">
          {materias.map((materia, index)=>(
              <Materia materia={materia} key={index}/>
          ))}
      </section>
    </>
  )
}

export default Materias