import './styles/Signup.css'
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useState, useRef } from "react"
import { auth } from '../config/app.js'
import LeftArrow from '../components/atoms/LeftArrow.jsx';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import GoogleButton from '../components/atoms/GoogleButton.jsx';
import Nav from '../components/organisms/Nav.jsx';

function SignUp() {
    const [waiting, setWaiting] = useState(false)

    const handleAlert = (text) => {
        Swal.fire({
            title: 'Cuidado',
            text: text,
            icon: 'question',
            iconColor: 'var(--brandy-punch-500)',
            confirmButtonText: 'Opps, Oki',
            background: 'var(--black-50)',
            color: 'var(--brandy-punch-500)',
            confirmButtonColor: 'var(--brandy-punch-500)',
        })
    }

    const handleSuccess = () => {
        Swal.fire({
            title: 'Verifica tu correo',
            text: 'Tu usuario ha sido creado, verifica el SPAM de tu correo para verificar.',
            icon: 'info',
            iconColor: '#ffff00',
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
            background: 'var(--black-200)',
            color: 'var(--swans-down-400)',
            confirmButtonColor: 'var(--swans-down-200)',
        })
        
    }

    const handleErrorNoti = (texto) => {
        Swal.fire({
            title: 'Error',
            text: texto,
            icon: 'warning',
            iconColor: '#ff0000',
            confirmButtonText: 'OK',
            background: 'var(--black-900)',
            color: '#ff0000',
            confirmButtonColor: '#ff0000',
        })
    }

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
        try{
            if (password != passwordVer){
                handleAlert('Su contraseña debe ser idéntica');
                return
            }
            //const userCRedential = await createUserWithEmailAndPassword(auth, email, password);
            await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(auth.currentUser);

            //console.log('Usuario registrado: ',userCRedential.user);
            handleSuccess();
            navigate('/')
        } catch(error){
            handleErrorNoti(`error en el registro: ${error.message}`)
        }
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