import React from "react";
import "../styles/Cadastro.css";
import { Navbar } from "../components/Navbar.jsx";

function Cadastro() {
  return (
        <>
        <Navbar />
    <div className="container">

      <div className="form">
        <h1>Boas vindas ao Ye!</h1>
        <p>Para começar, qual seu nome?</p>
        <input type="text" placeholder="Nome completo" />
        <a className="cadastro" href="/cadastro_resto">Continuar Cadastro</a>
      </div>

    </div>
    </>
  );
}

export default Cadastro;