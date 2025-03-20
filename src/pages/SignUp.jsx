import './styles/Signup.css'
import { useState, useRef } from "react"
import LeftArrow from '../components/atoms/LeftArrow.jsx';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import GoogleButton from '../components/atoms/GoogleButton.jsx';
import Nav from '../components/organisms/Nav.jsx';
import { handleSignup } from '../config/auth_functions';

function SignUp() {
    const [waiting, setWaiting] = useState(false)

    const navigate = useNavigate();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordVerREf = useRef(null);

    const handleSubmit = async(e) => {
        setWaiting(true)

        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const passwordVer = passwordVerREf.current.value;
        
        await handleSignup({email: email, password: password, passwordVer: passwordVer,funcion: ()=>{navigate('/')}})

        setWaiting(false)
    }

  return (
    <section className="signup">
        <Nav/>
        <div className="signup_container">
            <h2 className="signup_title">Crea Una Cuenta</h2>
            <form className="signup_form" onSubmit={handleSubmit}>
                    <label htmlFor="fullName"> Nombre completo
                        <input className="form_input" type="text" id="fullName" placeholder='Veliz Benavidez' required/>
                    </label>
                    <label htmlFor="email"> Correo Electrónico
                        <input className="form_input"  type="email" id="email" placeholder="tucorreo@email.com" ref={emailRef} required/>
                    </label>
                    <label htmlFor="password"> Contraseña
                        <input className="form_input" type="password" id="password" placeholder="Contraseña" ref={passwordRef} required/>
                    </label>
                    <label htmlFor="confirmPassword"> Confirmar contraseña
                        <input className="form_input" type="password" id="confirmPassword" placeholder="Repita su contraseña" ref={passwordVerREf} required/>
                    </label>
                    {
                        waiting ? <div style={{marginInline: 'auto'}}><ClipLoader color="var(--swans-down-400)" size={40}/></div> :
                        <button className="form_btn" type="submit">CREAR MI CUENTA</button>
                    }
            </form>
        </div>
        <div className='signup_message'>
                    <span className='message_overlay'></span>
                    <h3>"En algún lugar, algo increíble está esperando a ser conocido."</h3>
                    <p>- Carl Sagan</p>
                    <GoogleButton/>
        </div>
    </section>
  )
}

export default SignUp