import React from "react";
import { Link } from "react-router-dom";

const formatarBRL = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatarData = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
};

function MetaCard({ meta, onAportar, onRemover }) {
  const {
    id,
    titulo,
    categoria,
    valorAlvo,
    valorAtual,
    prazo,
    progresso,
    faltam,
    diasRestantes,
    aporteSugerido,
    status,
  } = meta;

  const percentual = Math.round(progresso * 100);

  return (
    <article className={`meta-card meta-card--${status}`}>
      <header className="meta-card__header">
        <div>
          <h3 className="meta-card__titulo">{titulo}</h3>
          {categoria && <span className="meta-card__categoria">{categoria}</span>}
        </div>
        <span className={`meta-card__status meta-card__status--${status}`}>
          {status === "concluida" && "Concluída"}
          {status === "atrasada" && "Atrasada"}
          {status === "em_dia" && "Em dia"}
        </span>
      </header>

      <div className="meta-card__progresso">
        <div className="meta-card__barra">
          <div
            className="meta-card__barra-preenchida"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <div className="meta-card__progresso-info">
          <span>
            {formatarBRL(valorAtual)} / {formatarBRL(valorAlvo)}
          </span>
          <strong>{percentual}%</strong>
        </div>
      </div>

      <dl className="meta-card__detalhes">
        <div>
          <dt>Falta</dt>
          <dd>{formatarBRL(faltam)}</dd>
        </div>
        {prazo && (
          <div>
            <dt>Prazo</dt>
            <dd>
              {formatarData(prazo)}
              {diasRestantes != null && (
                <small>
                  {" "}
                  ({diasRestantes >= 0
                    ? `${diasRestantes} dias`
                    : `${Math.abs(diasRestantes)} dias em atraso`})
                </small>
              )}
            </dd>
          </div>
        )}
        {aporteSugerido != null && faltam > 0 && (
          <div>
            <dt>Aporte sugerido/mês</dt>
            <dd>{formatarBRL(aporteSugerido)}</dd>
          </div>
        )}
      </dl>

      <footer className="meta-card__acoes">
        <button
          type="button"
          className="meta-card__btn meta-card__btn--primario"
          onClick={() => onAportar(meta)}
          disabled={status === "concluida"}
        >
          Aportar
        </button>
        <Link to={`/metas/${id}/editar`} className="meta-card__btn">
          Editar
        </Link>
        <button
          type="button"
          className="meta-card__btn meta-card__btn--perigo"
          onClick={() => onRemover(meta)}
        >
          Excluir
        </button>
      </footer>
    </article>
  );
}

export default MetaCard;
