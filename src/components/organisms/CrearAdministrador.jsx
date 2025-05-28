import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import "./styles/CreateUserA.css";

function CrearAdministrador() {
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleCreateAdmin = async (name, email, password) => {
    setWaiting(true);

    try {
      const db = getFirestore();
      const adminCollection = collection(db, "administrador");

      await addDoc(adminCollection, {
        name: name,
        email: email,
        password: password,
        Rol: "Administrador",
        activo: true,
        createdAt: new Date(),
      });

      Swal.fire({
        title: "Administrador registrado exitosamente",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/admin/usersSection");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error al registrar administrador: ${error.message}`,
      });
    } finally {
      setWaiting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!name || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos.",
      });
      return;
    }

    handleCreateAdmin(name, email, password);
  };

  return (
    <div className="CreateUser">
      <div className="CreateUser_container">
        <div className="Header_CreateUser">
          <button type="button" className="btn-volver" onClick={() => navigate("/admin/usersSection")}>
            <img src="/assets/circle-arrow-left.svg" alt="Volver" />
          </button>
          <h2 className="CreateUser_title">Registrar Administrador</h2>
        </div>

        <div className="CreateUser_form_container">
          <form className="CreateUser_form" onSubmit={handleSubmit}>
            <label>
              <p>Nombre completo</p>
              <input type="text" className="CreateUser_input" ref={nameRef} required />
            </label>
            <label>
              <p>Correo Electrónico</p>
              <input type="email" className="CreateUser_input" ref={emailRef} required />
            </label>
            <label>
              <p>Contraseña</p>
              <input type="password" className="CreateUser_input" ref={passwordRef} required />
            </label>

            {waiting ? (
              <ClipLoader color="var(--swans-down-400)" size={40} />
            ) : (
              <button type="submit" className="form_btn">REGISTRAR ADMINISTRADOR</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearAdministrador;
