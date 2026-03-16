import { Link } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  return (
    <header className="navbar">

      <div className="logo">Yeezus</div>

      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/sobre">Sobre</Link></li>
        <li><Link to="/support">Support</Link></li>
      </ul>

      <div className="nav-right">
        <Link className="entrar" to="/entrar">Entrar</Link>
        <Link className="cadastrar" to="/cadastro">Abra sua Conta</Link>
      </div>

    </header>
  );
}

export default Navbar;