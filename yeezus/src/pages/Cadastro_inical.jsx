import React from "react";
import "../App.css";

function Cadastro() {
  return (
    <div className="container">

      <div className="form">
        <h1>Cadastro</h1>

        <input type="text" placeholder="Nome" />
        <a className="cadastro" href="/cadastro_resto">Continuar Cadastro</a>
      </div>

    </div>
  );
}

export default Cadastro;