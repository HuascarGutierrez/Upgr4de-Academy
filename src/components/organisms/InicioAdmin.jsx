import React from 'react'
import "./styles/InicioAdmin.css"

const users = [
    { id: 1, name: "Helen Jazmín Catacora Patana", date: "23.06.2018", plan: "Ninguno", status: "Activo" },
    { id: 2, name: "Huascar Aaron Gutiérrez Castro", date: "18.05.2018", plan: "Plan Mensual", status: "Activo" },
    { id: 3, name: "Iván Condori Choquehuanca", date: "03.05.2018", plan: "Plan Anual", status: "Activo" },
    { id: 4, name: "Samuel Antonio Veliz Benavidez", date: "24.04.2018", plan: "Plan Mensual", status: "Activo" },
    { id: 5, name: "José José Pérez", date: "23.06.2018", plan: "Ninguno", status: "Baja" },
  ];

function InicioAdmin() {
  return (
    <>
    <section className='InicioAdmin'>
    <h2>Lista de Estudiantes </h2>    
    <div className="Tabla-Contenedor">
      <div className="EncabezadoLista">
        <div>Nombres y Apellidos</div>
        <div>Fecha de Ingreso</div>
        <div>Plan de Suscripción</div>
        <div>Status</div>
        <div>Acciones</div>
      </div>
      {users.map((user) => (
        <div key={user.id} className="table-row">
          <div>{user.name}</div>
          <div>{user.date}</div>
          <div>{user.plan}</div>
          <div>
            <span className={`status ${user.status === "Activo" ? "active" : "inactive"}`}>
              {user.status}
            </span>
          </div>
          <div>


          <ul className="acciones">
            <li className='items'>
                <img src="/Icons/eye.svg" alt="" />
            </li>
            <li className='items'>
                <img src="/Icons/edit.svg" alt="" />
            </li>
            <li className='items'>
                <img src="/Icons/trash.svg" alt="" />
            </li>
            
          </ul>
          </div>
        </div>
      ))}
    </div>
    </section>
    </>
  )
}

export default InicioAdmin