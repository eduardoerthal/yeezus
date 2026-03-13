import React from "react";
import "../App.css";

function Cadastro_resto(){
    return(
        <div className="container">
            <h1>Cadastro</h1>

            <input className="campo" type="text" placeholder="CPF" />
            <input className="campo" type="email" placeholder="E-mail" />
            <input className="campo" type="password" placeholder="Senha" />
            <button className="botao">Cadastrar</button>
        </div>
    );
}

export default Cadastro_resto;