import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Metas.css";
import Logo from "../assets/logo.svg";
import useMetas from "../hooks/useMetas";
import MetaCard from "../components/MetaCard";
import AporteModal from "../components/AporteModal";

const formatarBRL = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

function Metas() {
  const { metas, loading, erro, resumo, aportar, remover } = useMetas();
  const [metaParaAporte, setMetaParaAporte] = useState(null);
  const [filtro, setFiltro] = useState("todas");

  const metasFiltradas = metas.filter((m) => {
    if (filtro === "ativas") return !m.concluida;
    if (filtro === "concluidas") return m.concluida;
    if (filtro === "atrasadas") return m.status === "atrasada";
    return true;
  });

  const handleRemover = async (meta) => {
    if (!window.confirm(`Excluir a meta "${meta.titulo}"?`)) return;
    try {
      await remover(meta.id);
    } catch (e) {
      alert(e?.message || "Falha ao excluir meta");
    }
  };

  return (
    <div className="metas-container">
      <aside className="sidebar">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Yeezus Logo" />
          </Link>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">Visão Geral</Link>
          <button className="nav-item">Transações</button>
          <button className="nav-item">Investimentos</button>
          <Link to="/metas" className="nav-item active">Metas</Link>
        </nav>
        <div className="sidebar-footer">
          <button className="btn-sair">Sair</button>
        </div>
      </aside>

      <main className="metas-main">
        <header className="metas-header">
          <div>
            <h1>Suas metas</h1>
            <p>Acompanhe o progresso dos seus objetivos financeiros</p>
          </div>
          <Link to="/metas/nova" className="btn-nova-meta">
            + Nova Meta
          </Link>
        </header>

        <section className="metas-resumo">
          <div className="resumo-card">
            <h3>Total de metas</h3>
            <p className="resumo-valor">{resumo.total}</p>
          </div>
          <div className="resumo-card">
            <h3>Concluídas</h3>
            <p className="resumo-valor resumo-valor--ok">{resumo.concluidas}</p>
          </div>
          <div className="resumo-card">
            <h3>Atrasadas</h3>
            <p className="resumo-valor resumo-valor--alerta">{resumo.atrasadas}</p>
          </div>
          <div className="resumo-card">
            <h3>Acumulado</h3>
            <p className="resumo-valor">
              {formatarBRL(resumo.totalAtual)}
              <small> / {formatarBRL(resumo.totalAlvo)}</small>
            </p>
          </div>
        </section>

        <nav className="metas-filtros">
          {[
            { id: "todas", label: "Todas" },
            { id: "ativas", label: "Ativas" },
            { id: "concluidas", label: "Concluídas" },
            { id: "atrasadas", label: "Atrasadas" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filtro ${filtro === f.id ? "filtro--ativo" : ""}`}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
            </button>
          ))}
        </nav>

        {loading && <p className="metas-vazio">Carregando metas...</p>}
        {erro && !loading && (
          <p className="metas-vazio metas-vazio--erro">
            Não foi possível carregar suas metas. {erro}
          </p>
        )}

        {!loading && !erro && metasFiltradas.length === 0 && (
          <div className="metas-vazio">
            <p>Você ainda não tem metas neste filtro.</p>
            <Link to="/metas/nova" className="btn-nova-meta">
              Criar primeira meta
            </Link>
          </div>
        )}

        {!loading && !erro && metasFiltradas.length > 0 && (
          <section className="metas-grid">
            {metasFiltradas.map((meta) => (
              <MetaCard
                key={meta.id}
                meta={meta}
                onAportar={setMetaParaAporte}
                onRemover={handleRemover}
              />
            ))}
          </section>
        )}
      </main>

      <AporteModal
        meta={metaParaAporte}
        onConfirmar={aportar}
        onFechar={() => setMetaParaAporte(null)}
      />
    </div>
  );
}

export default Metas;
