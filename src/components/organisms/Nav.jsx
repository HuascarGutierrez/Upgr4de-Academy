import "./styles/Nav.css";
import { useNavigate } from 'react-router-dom'

function Nav() {
  const navigate = useNavigate()
  return (
    <nav className="nav">
      <div className="nav_logo">
        <img className="logo_img" src="assets/Zowl-icon.svg" alt="U4A" />
        <span className="logo_title">Upgr4de Academy</span>
      </div>
      <ul className="nav_items">
        <li onClick={() => {navigate('/')}} className="nav_item">
          <p>Home</p>
        </li>
        <li onClick={() => {navigate('/SAPI')}} className="nav_item">
          <p>SAPI</p>
        </li>
        {/**<li className="nav_item">
          <p>Blog</p>
        </li> */}
        <li onClick={() => {navigate('/sobreNosotros')}} className="nav_item">
          <p>Sobre Nosotros</p>
        </li>
      </ul>

      {/**<button className="nav_list_icon" onClick={()=>{setShowList(!showList)}}>
        <svg
          fill="#E6C151"
          viewBox="0 -2 28 28"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#E6C151"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g>
            <path d="m5.216 11.998c0 1.44-1.168 2.608-2.608 2.608s-2.608-1.168-2.608-2.608 1.168-2.608 2.608-2.608 2.608 1.168 2.608 2.608z"></path>
            <path d="m5.216 2.608c0 1.44-1.168 2.608-2.608 2.608s-2.608-1.168-2.608-2.608 1.168-2.608 2.608-2.608 2.608 1.168 2.608 2.608z"></path>
            <path d="m5.216 21.389c0 1.44-1.168 2.608-2.608 2.608s-2.608-1.168-2.608-2.608 1.168-2.608 2.608-2.608 2.608 1.168 2.608 2.608z"></path>
            <path d="m9.794 0h15.247c1.441 0 2.61 1.168 2.61 2.61s-1.168 2.61-2.61 2.61h-15.247c-1.441 0-2.61-1.168-2.61-2.61s1.168-2.61 2.61-2.61z"></path>
            <path d="m9.794 9.39h15.247c1.441 0 2.61 1.168 2.61 2.61s-1.168 2.61-2.61 2.61h-15.247c-1.441 0-2.61-1.168-2.61-2.61s1.168-2.61 2.61-2.61z"></path>
            <path d="m9.794 18.781h15.247c1.441 0 2.61 1.168 2.61 2.61s-1.168 2.61-2.61 2.61h-15.247c-1.441 0-2.61-1.168-2.61-2.61s1.168-2.61 2.61-2.61z"></path>
          </g>
        </svg>
      </button> */}
    </nav>
  );
}

export default Nav;
