import './styles/Signup.css'
import './styles/TuEspacio.css'
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useState, useRef } from "react"
import { auth } from '../config/app.js'
import LeftArrow from '../components/atoms/LeftArrow.jsx';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import GoogleButton from '../components/atoms/GoogleButton.jsx';

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
    const handleReturn = () => {
        navigate('../');
    }

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
            navigate('/main')
        } catch(error){
            handleErrorNoti(`error en el registro: ${error.message}`)
        }
        setWaiting(false)
    }
  return (
    <section className="signup signup_tuEspacio">
        <button onClick={handleReturn} className='signup_volver'>
            <LeftArrow color={'var(--swans-down-200)'} size={'2em'}/>
            Volver
        </button>
        <div className='signup_form'>
            <form className='signup_form_formulario' onSubmit={handleSubmit}>
                <h2 className='signup_form_h2'>Crea Una Cuenta</h2>
                <p className='signup_form_p'>Inicia la experiencia donde aprenderás nuevas cosas junto con SAPI</p>
                <section className='signup_form_inputs'> 
                    <input className='signup_form_input'  type="email" placeholder="tucorreo@email.com" ref={emailRef} required/>
                    <input className='signup_form_input' type="password" placeholder="Contraseña" ref={passwordRef} required/>
                    <input className='signup_form_input' type="password" placeholder="Repita su contraseña" ref={passwordVerREf} required/>
                    {
                        waiting ? <div style={{marginInline: 'auto'}}><ClipLoader color="var(--swans-down-400)" size={40}/></div> :
                        <button className='signup_form_button' type="submit">CREAR MI CUENTA</button>
                    }
                </section>
            </form>
            <GoogleButton/>
        </div>
    </section>
  )
}

export default SignUp