import React from "react";
import "../styles/Inicio.css";

function Inicio() {
  return (
    <div>

      <header className="navbar">

        <div className="logo">Yeezus</div>

        <ul className="nav-links">
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Sobre</a></li>
          <li><a href="#">Support</a></li>
        </ul>

        <div className="nav-right">
          <a className="entrar" href="/entrar">Entrar</a>
          <a className="cadastrar" href="/cadastro">Cadastrar</a>
        </div>

      </header>

      <section className="hero">

        <h1>YE, onde sua vida financeira atinge o impossível</h1>

        <p>
          A Complete Tailwind CSS Web Template Crafted for Startup,
          SaaS, Business, Software and Agencies.
          Comes with high-quality design and everything you need!
        </p>

      </section>

    </div>
  );
}

export default Inicio;