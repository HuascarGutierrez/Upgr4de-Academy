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
import { useNavigate } from 'react-router-dom'

function App() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate

  useEffect(()=> {
    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser){
        setUser(currentUser);
        navigate('/SAPI')
        console.log('currentUser');

      } else {setUser(null);
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
          <Route path='/' element={<Home/>}/>
          <Route path='/sobreNosotros' element={<SobreNosotros/>}/>
          <Route path='/SAPI' element={<SAPI user={user}/>}/>
          <Route path='/registro' element={<SignUp/>}/>
          <Route path='/iniciodesesion' element={<Login/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
