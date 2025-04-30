import { useState, useRef } from "react";
import { useNavigate /**useSearchParams */ } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import GoogleButton from "../components/atoms/GoogleButton";
import Nav from "../components/organisms/Nav";
import './styles/Login.css'
import { handleLogin } from "../config/auth_functions";
import Buho from '/images/OrangeBuho.webp';

function Login() {
    const [waiting, setWaiting] = useState(false);
    const navigate = useNavigate();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = async(e) => {
        setWaiting(true);
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if(email == "admin@admin.com" && password =="admin1234"){
            navigate('/admin/usertable')
        }else{
            await handleLogin({email: email, password: password, funcion: ()=>{navigate('/main/courses')}})
        }
        setWaiting(false);
    }
  return (
    <section className="login">
        <Nav/>
        <div className='login_message'>
                    <span className='message_overlay'></span>
                    {/*<img src="src\assets\images\zowl-white.svg" alt="buho" className="imglg" />*/}
                    <h3>¡Bienvenido de nuevo, estudiante SAPI!<br></br>¡Nos alegra verte otra vez!</h3>
                    <p>Inicia Sesion para acceder a todo el Material Educativo de SAPI <br></br>📚 ¡Tu camino al aprendizaje sigue aquí!</p>
                    <GoogleButton/>
        </div>
        <div className="login_container">
        <img src={Buho} alt="OrangeBuho" className="buho_logo" />
            <h2 className="login_title">Iniciar Sesión en SAPI</h2>
            <form className="login_formLogin" onSubmit={handleSubmit}>   
                    <label htmlFor="email"> Correo Electrónico
                        <input className="formLogin_input"  type="email" id="email" placeholder="tucorreo@email.com" ref={emailRef} required/>
                    </label>
                    <label htmlFor="password"> Contraseña
                        <input className="formLogin_input" type="password" id="password" placeholder="Contraseña" ref={passwordRef} required/>
                    </label>
                    {
                        waiting ? <div style={{marginInline: 'auto'}}><ClipLoader color="var(--swans-down-400)" size={40}/></div> :
                        <button className="formLogin_btn" type="submit">INICIAR SESIÓN</button>
                        
                    }

                    <div className="googleButton_container">
                        <GoogleButton/>
                    </div>
            </form>
        </div>
    </section>
  )
}

export default Login