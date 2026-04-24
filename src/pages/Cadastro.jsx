import React from "react";
import "../styles/Cadastro.css";

function Cadastro_resto(){
    return(
        <div className="container">
            
      <div className="form">
        <h1>Vamos continuar seu cadastro!</h1>
        <p>Preencha os campos abaixo</p>
        <input className="campo" type="text" placeholder="CPF" />
        <input className="campo" type="email" placeholder="E-mail" />
        <input className="campo" type="password" placeholder="Senha" />
        <button className="botao">Cadastrar</button>
      </div>
        </div>
    );
}

export default Cadastro_resto;