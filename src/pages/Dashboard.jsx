import React, { useState } from "react";
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";

function Dashboard() {
  // estados simulando
  const [resumo] = useState({
    saldo: 15450.00,
    receitas: 18000.00,
    despesas: 2550.00
  });

  return (
    <div className="dashboard-container">
      {/* Sidebar Lateral */}
      <aside className="sidebar">

      <div className="logo">
        <Link to="/">
          <img src={Logo} alt="Yeezus Logo" />
        </Link>
      </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">Visão Geral</button>
          <button className="nav-item">Transações</button>
          <button className="nav-item">Investimentos</button>
          <button className="nav-item">Metas</button>
        </nav>
        <div className="sidebar-footer">
          <button className="btn-sair">Sair</button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Olá, user1!</h1>
          <p>Aqui está o resumo da sua vida financeira</p>
        </header>

        {/* Cards de Resumo */}
        <section className="summary-cards">
          <div className="card">
            <h3>Saldo Atual</h3>
            <p className="valor saldo">
              R$ {resumo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="card">
            <h3>Receitas</h3>
            <p className="valor receita">
              + R$ {resumo.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="card">
            <h3>Despesas</h3>
            <p className="valor despesa">
              - R$ {resumo.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </section>

        {/* Ações Rápidas */}
        <section className="quick-actions">
          <button className="btn-action receita">+ Nova Receita</button>
          <button className="btn-action despesa">- Nova Despesa</button>
        </section>

        {/* Placeholder para Gráficos / Relatórios */}
        <section className="charts-section">
          <div className="chart-container">
            <h3>Fluxo de Caixa Mensal</h3>
            <div className="chart-placeholder">
              <p>Gráfico será renderizado aqui (Ex: Recharts)</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;