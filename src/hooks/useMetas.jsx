import { useCallback, useEffect, useMemo, useState } from "react";
import metaService from "../api/metaService";

const diasAteHoje = (dataIso) => {
  const alvo = new Date(dataIso);
  const hoje = new Date();
  return Math.ceil((alvo - hoje) / (1000 * 60 * 60 * 24));
};

const enriquecer = (meta) => {
  const valorAlvo = Number(meta.valorAlvo) || 0;
  const valorAtual = Number(meta.valorAtual) || 0;
  const progresso = valorAlvo > 0 ? Math.min(valorAtual / valorAlvo, 1) : 0;
  const faltam = Math.max(valorAlvo - valorAtual, 0);
  const concluida = valorAtual >= valorAlvo && valorAlvo > 0;

  let diasRestantes = null;
  let aporteSugerido = null;
  let status = "em_dia";

  if (meta.prazo) {
    diasRestantes = diasAteHoje(meta.prazo);
    const mesesRestantes = Math.max(diasRestantes / 30, 0);
    aporteSugerido = mesesRestantes > 0 ? faltam / mesesRestantes : faltam;
    if (!concluida && diasRestantes < 0) status = "atrasada";
  }

  if (concluida) status = "concluida";

  return {
    ...meta,
    progresso,
    faltam,
    diasRestantes,
    aporteSugerido,
    status,
    concluida,
  };
};

export default function useMetas() {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await metaService.listar();
      setMetas(Array.isArray(data) ? data : []);
    } catch (e) {
      setErro(e?.message || "Falha ao carregar metas");
      setMetas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const adicionar = async (meta) => {
    const criada = await metaService.criar(meta);
    setMetas((prev) => [...prev, criada]);
    return criada;
  };

  const atualizar = async (id, meta) => {
    const atualizada = await metaService.atualizar(id, meta);
    setMetas((prev) => prev.map((m) => (m.id === id ? atualizada : m)));
    return atualizada;
  };

  const remover = async (id) => {
    await metaService.remover(id);
    setMetas((prev) => prev.filter((m) => m.id !== id));
  };

  const aportar = async (id, valor) => {
    const atualizada = await metaService.aportar(id, valor);
    setMetas((prev) => prev.map((m) => (m.id === id ? atualizada : m)));
    return atualizada;
  };

  const enriquecidas = useMemo(() => metas.map(enriquecer), [metas]);

  const resumo = useMemo(() => {
    const total = enriquecidas.length;
    const concluidas = enriquecidas.filter((m) => m.concluida).length;
    const atrasadas = enriquecidas.filter((m) => m.status === "atrasada").length;
    const totalAlvo = enriquecidas.reduce((s, m) => s + Number(m.valorAlvo || 0), 0);
    const totalAtual = enriquecidas.reduce((s, m) => s + Number(m.valorAtual || 0), 0);
    return { total, concluidas, atrasadas, totalAlvo, totalAtual };
  }, [enriquecidas]);

  return {
    metas: enriquecidas,
    loading,
    erro,
    resumo,
    recarregar: carregar,
    adicionar,
    atualizar,
    remover,
    aportar,
  };
}
