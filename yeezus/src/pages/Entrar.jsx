import React from "react";
import "../App.css";

function Entrar() {
  return (
    <div className="container">

      <div className="form">
        <h1>Entrar</h1>

        <input type="text" placeholder="CPF" />
        <input type="password" placeholder="Senha" />
        <input type="password" placeholder="Confirmar senha" />

        <button>Entrar</button>
      </div>

    </div>
  );
}

export default Entrar;