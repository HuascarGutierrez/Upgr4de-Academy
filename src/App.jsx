import './App.css'
import ScrollToTop from './components/atoms/ScrollToTop'
import Home from './pages/Home'
import Login from './pages/Login'
import SAPI from './pages/SAPI'
import SignUp from './pages/SignUp'
import SobreNosotros from './pages/SobreNosotros'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/app'
import SAPIMain from './pages/SAPIMain'
import { getFirestore } from 'firebase/firestore'
import { getDoc, doc } from 'firebase/firestore'

function App() {

  const [userdb, setUserdb] = useState(null);

  


  useEffect(()=> {
    const db = getFirestore();
    
        const getUserData = async (uid) => {
          if (!auth.currentUser) return null; // Verificamos si hay un usuario autenticado
        
          const userRef = doc(db, "users", uid); // Referencia al documento con el uid
            await getDoc(userRef).then((userSnap) => {
                if (userSnap.exists()) {
                    console.log("Usuario encontrado");
                    const userData =userSnap.data();
                    setUserdb(userData);
                  } else {
                    console.log("No se encontró el usuario");
                    return null;
                  }
            }
          )
        };

    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.emailVerified){
        getUserData(currentUser.uid);
        console.log(currentUser);
      } else {setUserdb(null);
        console.log('nada')
      }
    })
    /**getRedirectResult(auth)
      .then((result) => {
        console.log(result)
        if (result?.user) {
          setUser(result.user);
          console.log("Usuario autenticado con Google:", result.user);
        }
      })
      .catch((error) => {
        console.error("Error en la autenticación con Google:", error);
      });*/    return () => unsubcribe();
  }, [])

  return (
    <>
      <Router>
        <ScrollToTop/> {/**por temas del scroll */}
        <Routes>
          <Route path='/' element={<Home user={userdb}/>}/>
          <Route path='/sobreNosotros' element={<SobreNosotros user={userdb}/>}/>
          <Route path='/SAPI' element={<SAPI user={userdb}/>}/>
          <Route path='/registro' element={<SignUp/>}/>
          <Route path='/iniciodesesion' element={<Login/>}/>
          <Route path='/main/*' element={<SAPIMain user={userdb}/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
