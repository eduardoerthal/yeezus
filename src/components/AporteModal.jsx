import React, { useEffect, useState } from "react";

function AporteModal({ meta, onConfirmar, onFechar }) {
  const [valor, setValor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setValor("");
    setErro(null);
  }, [meta]);

  if (!meta) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numero = Number(valor);
    if (!numero || numero <= 0) {
      setErro("Informe um valor maior que zero");
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      await onConfirmar(meta.id, numero);
      onFechar();
    } catch (err) {
      setErro(err?.message || "Falha ao registrar aporte");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h2>Novo aporte</h2>
          <p className="modal__subtitulo">{meta.titulo}</p>
        </header>

        <form onSubmit={handleSubmit} className="modal__form">
          <label className="modal__campo">
            <span>Valor (R$)</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              autoFocus
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
            />
          </label>

          {erro && <p className="modal__erro">{erro}</p>}

          <footer className="modal__acoes">
            <button
              type="button"
              onClick={onFechar}
              className="modal__btn"
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="modal__btn modal__btn--primario"
              disabled={enviando}
            >
              {enviando ? "Salvando..." : "Confirmar aporte"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default AporteModal;
