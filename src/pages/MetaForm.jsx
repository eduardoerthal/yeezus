import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/Metas.css";
import Logo from "../assets/logo.svg";
import metaService from "../api/metaService";

const CATEGORIAS = [
  { id: "emergencia", label: "Reserva de emergência" },
  { id: "viagem", label: "Viagem" },
  { id: "compra", label: "Compra" },
  { id: "investimento", label: "Investimento" },
  { id: "outro", label: "Outro" },
];

const estadoInicial = {
  titulo: "",
  valorAlvo: "",
  valorAtual: "",
  prazo: "",
  categoria: "outro",
};

function MetaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [form, setForm] = useState(estadoInicial);
  const [carregando, setCarregando] = useState(editando);
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);

  useEffect(() => {
    if (!editando) return;
    let cancelado = false;
    (async () => {
      try {
        const meta = await metaService.buscar(id);
        if (cancelado) return;
        setForm({
          titulo: meta.titulo || "",
          valorAlvo: meta.valorAlvo ?? "",
          valorAtual: meta.valorAtual ?? "",
          prazo: meta.prazo ? meta.prazo.slice(0, 10) : "",
          categoria: meta.categoria || "outro",
        });
      } catch (e) {
        if (!cancelado) setErroGeral(e?.message || "Falha ao carregar meta");
      } finally {
        if (!cancelado) setCarregando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [id, editando]);

  const atualizarCampo = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  const validar = () => {
    const novos = {};
    if (!form.titulo.trim()) novos.titulo = "Informe um título";
    const alvo = Number(form.valorAlvo);
    if (!alvo || alvo <= 0) novos.valorAlvo = "Valor alvo deve ser maior que zero";
    const atual = Number(form.valorAtual || 0);
    if (atual < 0) novos.valorAtual = "Valor inicial não pode ser negativo";
    if (atual > alvo) novos.valorAtual = "Valor inicial não pode passar o alvo";
    if (form.prazo) {
      const data = new Date(form.prazo);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      if (data < hoje && !editando) novos.prazo = "Prazo deve ser hoje ou no futuro";
    }
    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    setErroGeral(null);

    const payload = {
      titulo: form.titulo.trim(),
      valorAlvo: Number(form.valorAlvo),
      valorAtual: Number(form.valorAtual || 0),
      prazo: form.prazo || null,
      categoria: form.categoria,
    };

    try {
      if (editando) {
        await metaService.atualizar(id, payload);
      } else {
        await metaService.criar(payload);
      }
      navigate("/metas");
    } catch (err) {
      setErroGeral(err?.message || "Falha ao salvar meta");
    } finally {
      setEnviando(false);
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
            <h1>{editando ? "Editar meta" : "Nova meta"}</h1>
            <p>
              {editando
                ? "Atualize os dados da sua meta financeira"
                : "Defina um objetivo e acompanhe seu progresso"}
            </p>
          </div>
          <Link to="/metas" className="btn-voltar">
            ← Voltar
          </Link>
        </header>

        {carregando && <p className="metas-vazio">Carregando...</p>}

        {!carregando && (
          <form className="meta-form" onSubmit={handleSubmit} noValidate>
            <div className="meta-form__linha">
              <label className="meta-form__campo">
                <span>Título</span>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={atualizarCampo("titulo")}
                  placeholder="Ex.: Reserva de emergência"
                />
                {erros.titulo && <small className="meta-form__erro">{erros.titulo}</small>}
              </label>

              <label className="meta-form__campo">
                <span>Categoria</span>
                <select value={form.categoria} onChange={atualizarCampo("categoria")}>
                  {CATEGORIAS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="meta-form__linha">
              <label className="meta-form__campo">
                <span>Valor alvo (R$)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.valorAlvo}
                  onChange={atualizarCampo("valorAlvo")}
                  placeholder="0,00"
                />
                {erros.valorAlvo && (
                  <small className="meta-form__erro">{erros.valorAlvo}</small>
                )}
              </label>

              <label className="meta-form__campo">
                <span>Valor inicial (opcional)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.valorAtual}
                  onChange={atualizarCampo("valorAtual")}
                  placeholder="0,00"
                />
                {erros.valorAtual && (
                  <small className="meta-form__erro">{erros.valorAtual}</small>
                )}
              </label>
            </div>

            <label className="meta-form__campo">
              <span>Prazo (opcional)</span>
              <input
                type="date"
                value={form.prazo}
                onChange={atualizarCampo("prazo")}
              />
              {erros.prazo && <small className="meta-form__erro">{erros.prazo}</small>}
            </label>

            {erroGeral && <p className="meta-form__erro-geral">{erroGeral}</p>}

            <div className="meta-form__acoes">
              <Link to="/metas" className="meta-form__btn">
                Cancelar
              </Link>
              <button
                type="submit"
                className="meta-form__btn meta-form__btn--primario"
                disabled={enviando}
              >
                {enviando ? "Salvando..." : editando ? "Salvar alterações" : "Criar meta"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default MetaForm;
