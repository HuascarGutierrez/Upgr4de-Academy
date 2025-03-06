import './App.css'
import ScrollToTop from './components/atoms/ScrollToTop'
import Home from './pages/Home'
import SobreNosotros from './pages/SobreNosotros'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Router>
        <ScrollToTop/> {/**por temas del scroll */}
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sobreNosotros' element={<SobreNosotros/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
