import LeftArrow from "../components/atoms/LeftArrow"
import { useState, useRef } from "react";
import { useNavigate /**useSearchParams */ } from "react-router-dom";
import { auth } from "../config/app";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ClipLoader } from "react-spinners";
import { handleErrorNoti, handleSuccess } from "../config/alerts";
import GoogleButton from "../components/atoms/GoogleButton";
import './styles/Signup.css'
import './styles/TuEspacio.css'

function Login() {
    const [waiting, setWaiting] = useState(false);
    const navigate = useNavigate();
    const handleReturn = () => {
        navigate('../');
    }

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = async(e) => {
        setWaiting(true)
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        try{
            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                if(userCredential.user.emailVerified){
                    handleSuccess({texto: "Inicio de sesión exitoso."})
                    navigate('/SAPI');
                } else {
                    signOut(auth)
                    handleErrorNoti({texto: "Error al iniciar sesión", title: 'Error', color: '#ccccff'})
                }
            })
            
        } catch(error){
            handleErrorNoti(`error en el registro: ${error.message}`)
        }
        setWaiting(false)
    }

  return (
    <section className="signup">
            <button onClick={handleReturn} className='signup_volver'>
                <LeftArrow color={'var(--swans-down-200)'} size={'2em'}/>
                Volver
            </button>
            <div className="signup_form">
                <form className="signup_form_formulario" onSubmit={handleSubmit}>
                    <h2 className='signup_form_h2'>Inicia Sesion</h2>
                    <p className='signup_form_p'>Entra a los mejores recursos en el línea.</p>
                    <section className='signup_form_inputs'> 
                        <input className='signup_form_input'  type="email" placeholder="tucorreo@email.com" ref={emailRef} required/>
                        <input className='signup_form_input' type="password" placeholder="Contraseña" ref={passwordRef} required/>
                        {
                            waiting? <div style={{marginInline: 'auto'}}><ClipLoader color="var(--swans-down-400)" size={40}/></div> : <button className='signup_form_button' type="submit">INGRESAR</button>
                        }
                    </section>
                </form>
                <GoogleButton/>
            </div>
    </section>
  )
}

export default Login