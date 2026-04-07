import React from "react";
import "../styles/Inicio.css";
import { Navbar } from "../components/Navbar.jsx";
import { Link } from "react-router-dom";

function Inicio() {
  return (
    <>
      <Navbar />

      <section className="hero-ye">
        <div className="hero-ye__container" data-testid="container">
          <div className="hero-ye__content">
            
            <div className="hero-ye__header">
              <h1 className="hero-ye__title">Yeezus</h1>
              <p className="hero-ye__description">
                Onde sua vida financeira atinge o impossível
              </p>
              <div className="hero-ye__actions">
                <Link className="cadastre_aqui" to="/cadastro">Abra sua Conta</Link>
                <Link className="saiba_mais" to="/sobre">Saiba Mais</Link>
              </div>
            </div>


            <div className="hero-ye__footer-links">
              <a  className="card-link">
                <div className="card-link__wrapper">
                  <p className="card-link__text">
                    <strong>CONSULTORIA YE:</strong> 
                    <p>Planejamento exclusivo com visão de longo prazo</p>
                  </p>
                  <button className="btn--inline" type="button">
                    Saiba mais
                  </button>
                </div>
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default Inicio;