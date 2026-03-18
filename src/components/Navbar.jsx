import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.svg";

export function Navbar() {
  return (
    <header className="navbar">

      <div className="logo">
  <img src={logo} alt="Yeezus Logo" />
  </div>

      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/sobre">Sobre</Link></li>
        <li><Link to="/support">Support</Link></li>
        <li><Link to="/YeBOT">yeBOT</Link></li>
      </ul>

      <div className="nav-right">
        <Link className="entrar" to="/entrar">Entrar</Link>
        <Link className="cadastrar" to="/cadastro">Abra sua Conta</Link>
      </div>

    </header>
  );
}

export default Navbar;