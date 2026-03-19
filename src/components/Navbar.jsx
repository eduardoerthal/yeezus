import { Link } from "react-router-dom";
import "./Navbar.css";
import Logo from "../assets/logo.svg";

export function Navbar() {
  return (
    <header className="navbar">

      <div className="logo">
        <Link to="/">
          <img src={Logo} alt="Yeezus Logo" />
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>

        <li className="menu-item">
          <Link>Sobre</Link>

          <ul className="dropdown">

            <div className="dropdown-column">
              <h4>A Yeezus</h4>
              <li><Link to="/empresa">Sobre a empresa</Link></li>
              <li><Link to="/historia">História</Link></li>
            </div>

            <div className="dropdown-column">
              <h4>Nossa atuação</h4>
              <li><Link to="/equipe">Equipe</Link></li>
              <li><Link to="/compliance">Compliance</Link></li>
            </div>

            <div className="dropdown-column">
              <h4>Educação</h4>
              <li><Link to="/educacao">Yeezus Educação</Link></li>
              <li><Link to="/escritorio">Encontre um escritório</Link></li>
            </div>

            <div className="dropdown-column">
              <h4>Trabalhe conosco</h4>
              <li><Link to="/assessor">Seja um assessor</Link></li>
              <li><Link to="/consultor">Seja um consultor</Link></li>
              <li><Link to="/fornecedor">Seja um fornecedor</Link></li>
            </div>

          </ul>
        </li>

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