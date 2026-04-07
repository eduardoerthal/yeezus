import React from "react";
import "../styles/Sobre.css";
import { Navbar } from "../components/Navbar.jsx";
import { Link } from "react-router-dom";

function Sobre() {
return ( 
    <>
    <Navbar />
    <section className="hero-sobre">

    <div className="sobre-container">
        <h1>Sobre Nós</h1>

        <p>
        Nosso projeto foi criado com o objetivo de oferecer uma plataforma
        moderna e eficiente para gestão de investimentos e educação
        financeira. Buscamos simplificar processos e ajudar usuários a
        entender melhor o mundo financeiro.
        </p>

        <p>
        A aplicação simula funcionalidades de uma corretora de investimentos,
        permitindo que usuários explorem conceitos de investimento, gestão
        de carteira e planejamento financeiro de forma prática.
        </p>

        <Link to="/">
        <button className="btn-voltar">Voltar para o início</button>
        </Link>
        
    </div>
    </section>
    </>
    );
}

export default Sobre;
