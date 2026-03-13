import React from "react";
import "../App.css";

function Cadastro() {
  return (
    <div className="container">

      <div className="form">
        <h1>Cadastro</h1>

        <input type="text" placeholder="Nome" />
        <input type="email" placeholder="E-mail" />
        <input type="password" placeholder="Senha" />

        <button>Cadastrar</button>
      </div>

    </div>
  );
}

export default Cadastro;