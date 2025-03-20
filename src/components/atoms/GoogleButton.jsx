import './styles/GoogleButton.css'
import { useNavigate } from "react-router-dom";
import { handleAuth } from '../../config/auth_functions';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';

function GoogleButton() {
    const [wait, setWait] = useState(false);
    const navigate = useNavigate();

    const handleBtnAuth = async() => {
        setWait(true)
        await handleAuth({funcion: ()=>{navigate('/')}})
        setWait(false)
    }

    return (
        wait?
        <div style={{marginInline: 'auto'}}><ClipLoader color="var(--swans-down-400)" size={40}/></div> :
        
        <button onClick={handleBtnAuth} className="googleButton">
            <img src="assets/google-logo.svg" alt="google-icon"/>
            <p>Usar tu cuenta de Google</p>
        </button>
    )
    }

export default GoogleButton