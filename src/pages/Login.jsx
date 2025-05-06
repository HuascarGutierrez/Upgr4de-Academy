import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import GoogleButton from "../components/atoms/GoogleButton";
import Nav from "../components/organisms/Nav";
import Buho from '/images/OrangeBuho.webp';
import { auth, db } from "../config/app"; // Asegúrate que esto esté bien importado
import './styles/Login.css';
import Swal from "sweetalert2";

function Login() {
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWaiting(true);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (email === "admin@admin.com") {
        navigate('/admin/usertable');
      } else {
        // Buscar al estudiante en Firestore
        const docRef = doc(db, "users", user.uid); // Asegúrate de que la colección se llama "users"
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.activo) {
            navigate('/main/courses');
          } else {
            await auth.signOut();
            Swal.fire({
              icon: "warning",
              title: "Cuenta Inactiva",
              text: "Tu cuenta aún no ha sido activada. Por favor, contacta a soporte.",
            });
          }
        } else {
          await auth.signOut();
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se encontró información del usuario.",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Error al Iniciar Sesión",
        text: "Correo o contraseña incorrectos.",
      });
    }

    setWaiting(false);
  };

  return (
    <section className="login">
      <Nav />
      <div className='login_message'>
        <span className='message_overlay'></span>
        <h3>¡Bienvenido de nuevo, estudiante SAPI!</h3>
        <p>Inicia Sesión para acceder al Material Educativo 📚</p>
        <GoogleButton />
      </div>
      <div className="login_container">
        <img src={Buho} alt="OrangeBuho" className="buho_logo" />
        <h2 className="login_title">Iniciar Sesión en SAPI</h2>
        <form className="login_formLogin" onSubmit={handleSubmit}>
          <label htmlFor="email">Correo Electrónico
            <input className="formLogin_input" type="email" id="email" placeholder="tucorreo@email.com" ref={emailRef} required />
          </label>
          <label htmlFor="password">Contraseña
            <input className="formLogin_input" type="password" id="password" placeholder="Contraseña" ref={passwordRef} required />
          </label>
          {
            waiting
              ? <div style={{ marginInline: 'auto' }}><ClipLoader color="var(--swans-down-400)" size={40} /></div>
              : <button className="formLogin_btn" type="submit">INICIAR SESIÓN</button>
          }
          <div className="googleButton_container">
            <GoogleButton />
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
