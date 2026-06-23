import React, { useEffect, useMemo, useState } from "react";
import {
	AlertTriangle,
	CalendarCheck,
	CheckCircle2,
	Heart,
	Home,
	Loader2,
	PiggyBank,
	RefreshCcw,
	Route,
	ShieldCheck,
	Sparkles,
	Target,
	WalletCards,
} from "lucide-react";

import "../styles/Planejamento.css";
import { Navbar } from "../components/Navbar.jsx";
import acompanhamentoService from "../api/acompanhamentoService";
import { getGeminiResponse } from "../services/geminiService";

const palavrasNecessidades = [
	"aluguel",
	"financiamento",
	"condominio",
	"condomínio",
	"mercado",
	"supermercado",
	"alimentacao",
	"alimentação",
	"agua",
	"água",
	"luz",
	"energia",
	"internet",
	"telefone",
	"transporte",
	"combustivel",
	"combustível",
	"saude",
	"saúde",
	"farmacia",
	"farmácia",
	"plano",
	"faculdade",
	"educacao",
	"educação",
];

const palavrasDesejos = [
	"lazer",
	"restaurante",
	"delivery",
	"ifood",
	"streaming",
	"netflix",
	"spotify",
	"cinema",
	"jogo",
	"games",
	"roupa",
	"compras",
	"shopping",
	"viagem",
	"hobby",
	"bar",
	"festa",
	"assinatura",
];

const pilaresBase = [
	{
		chave: "necessidades",
		titulo: "Necessidades",
		percentual: 50,
		icone: Home,
		descricao:
			"Essenciais para manter sua vida funcionando sem comprometer estabilidade.",
	},
	{
		chave: "desejos",
		titulo: "Desejos",
		percentual: 30,
		icone: Heart,
		descricao:
			"Qualidade de vida, lazer e escolhas que podem ser ajustadas com mais flexibilidade.",
	},
	{
		chave: "investimentos",
		titulo: "Investimentos",
		percentual: 20,
		icone: PiggyBank,
		descricao:
			"Construção de reserva, crescimento patrimonial e proteção financeira futura.",
	},
];

function formatarBRL(valor = 0) {
	return Number(valor || 0).toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}

function normalizarTexto(texto = "") {
	return String(texto)
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

function getValor(item) {
	return Number(item?.valor || 0);
}

function getCategoriaNome(item) {
	return (
		item?.categoria?.nome ||
		item?.categoria?.name ||
		item?.categoriaNome ||
		item?.categoria ||
		"Sem categoria"
	);
}

function getDataItem(item) {
	return item?.dataCriacao || item?.data || item?.createdAt || item?.created_at || null;
}

function filtrarMesAtual(lista = []) {
	const agora = new Date();
	const temAlgumaData = lista.some((item) => Boolean(getDataItem(item)));

	if (!temAlgumaData) {
		return lista;
	}

	return lista.filter((item) => {
		const dataOriginal = getDataItem(item);

		if (!dataOriginal) {
			return false;
		}

		const data = new Date(dataOriginal);

		return (
			data.getMonth() === agora.getMonth() &&
			data.getFullYear() === agora.getFullYear()
		);
	});
}

function somar(lista = []) {
	return lista.reduce((acc, item) => acc + getValor(item), 0);
}

function agruparPorCategoria(lista = []) {
	return lista.reduce((acc, item) => {
		const categoria = getCategoriaNome(item);
		acc[categoria] = (acc[categoria] || 0) + getValor(item);
		return acc;
	}, {});
}

function montarRanking(objeto = {}, total = 0) {
	return Object.entries(objeto)
		.sort((a, b) => b[1] - a[1])
		.map(([categoria, valor]) => ({
			categoria,
			valor,
			percentual: total > 0 ? (valor / total) * 100 : 0,
		}));
}

function montarRankingParaPrompt(ranking = []) {
	if (!ranking.length) {
		return "- Nenhum dado cadastrado.";
	}

	return ranking
		.map(
			(item) =>
				`- ${item.categoria}: ${formatarBRL(item.valor)} (${item.percentual.toFixed(
					1,
				)}%)`,
		)
		.join("\n");
}

function classificarDespesa(categoria) {
	const categoriaNormalizada = normalizarTexto(categoria);

	const ehNecessidade = palavrasNecessidades.some((palavra) =>
		categoriaNormalizada.includes(normalizarTexto(palavra)),
	);

	if (ehNecessidade) {
		return "necessidades";
	}

	const ehDesejo = palavrasDesejos.some((palavra) =>
		categoriaNormalizada.includes(normalizarTexto(palavra)),
	);

	if (ehDesejo) {
		return "desejos";
	}

	return "outros";
}

function calcularBaseFinanceira(receitas, despesas, investimentos) {
	const totalReceitas = somar(receitas);
	const totalDespesas = somar(despesas);
	const totalInvestimentos = somar(investimentos);
	const saldoLivre = totalReceitas - totalDespesas - totalInvestimentos;

	const despesasPorCategoria = agruparPorCategoria(despesas);
	const receitasPorCategoria = agruparPorCategoria(receitas);
	const investimentosPorCategoria = agruparPorCategoria(investimentos);

	const rankingDespesas = montarRanking(despesasPorCategoria, totalDespesas);
	const rankingReceitas = montarRanking(receitasPorCategoria, totalReceitas);
	const rankingInvestimentos = montarRanking(
		investimentosPorCategoria,
		totalInvestimentos,
	);

	const usoAtual = {
		necessidades: 0,
		desejos: 0,
		outros: 0,
	};

	rankingDespesas.forEach((item) => {
		const tipo = classificarDespesa(item.categoria);
		usoAtual[tipo] += item.valor;
	});

	const metas = {
		necessidades: totalReceitas * 0.5,
		desejos: totalReceitas * 0.3,
		investimentos: totalReceitas * 0.2,
	};

	const percentuais = {
		despesas:
			totalReceitas > 0 ? (totalDespesas / totalReceitas) * 100 : 0,
		investimentos:
			totalReceitas > 0
				? (totalInvestimentos / totalReceitas) * 100
				: 0,
		saldo:
			totalReceitas > 0 ? (saldoLivre / totalReceitas) * 100 : 0,
	};

	return {
		totalReceitas,
		totalDespesas,
		totalInvestimentos,
		saldoLivre,
		despesasPorCategoria,
		receitasPorCategoria,
		investimentosPorCategoria,
		rankingDespesas,
		rankingReceitas,
		rankingInvestimentos,
		usoAtual,
		metas,
		percentuais,
		quantidades: {
			receitas: receitas.length,
			despesas: despesas.length,
			investimentos: investimentos.length,
		},
	};
}

function extrairJsonDaResposta(texto) {
	if (!texto) return null;

	try {
		const limpo = texto
			.replace(/```json/g, "")
			.replace(/```/g, "")
			.trim();

		const inicio = limpo.indexOf("{");
		const fim = limpo.lastIndexOf("}");

		if (inicio === -1 || fim === -1) {
			return null;
		}

		return JSON.parse(limpo.slice(inicio, fim + 1));
	} catch (error) {
		console.error("Erro ao converter resposta da IA em JSON:", error);
		return null;
	}
}

function criarPlanoFallback(base) {
	if (!base || base.totalReceitas <= 0) {
		return {
			status: "neutro",
			statusLabel: "Dados insuficientes",
			headline: "Cadastre sua renda para montar um plano real",
			diagnostico:
				"Ainda não há receita suficiente cadastrada neste mês para montar um planejamento financeiro personalizado.",
			focoDoMes:
				"O primeiro passo é cadastrar suas receitas, despesas e investimentos para que o YeBOT consiga construir um plano coerente.",
			pilares: [],
			prioridades: [
				{
					titulo: "Cadastrar receitas",
					motivo:
						"Sem renda cadastrada, não existe base confiável para distribuir o orçamento.",
					acao: "Adicione sua renda líquida mensal na tela de acompanhamento.",
				},
				{
					titulo: "Cadastrar despesas fixas",
					motivo:
						"As despesas fixas definem quanto da sua renda está comprometida.",
					acao: "Registre aluguel, mercado, transporte, internet e demais custos recorrentes.",
				},
			],
			plano30Dias: [
				{
					semana: "Semana 1",
					titulo: "Organizar a base",
					tarefas: [
						"Cadastrar todas as receitas do mês.",
						"Cadastrar despesas fixas.",
						"Separar gastos essenciais de gastos flexíveis.",
					],
				},
			],
			regrasDoMes: [
				"Não tome decisões com dados incompletos.",
				"Atualize os lançamentos sempre que houver movimentação relevante.",
			],
			fraseFinal:
				"Com os dados cadastrados, o planejamento fica mais preciso e útil.",
		};
	}

	return {
		status: base.saldoLivre >= 0 ? "positivo" : "critico",
		statusLabel: base.saldoLivre >= 0 ? "Plano viável" : "Ajuste necessário",
		headline: "Plano mensal baseado nos seus dados atuais",
		diagnostico:
			base.saldoLivre >= 0
				? `Sua renda cadastrada é de ${formatarBRL(
						base.totalReceitas,
				  )}. Após despesas e investimentos, o saldo livre estimado é de ${formatarBRL(
						base.saldoLivre,
				  )}.`
				: `Sua renda cadastrada é de ${formatarBRL(
						base.totalReceitas,
				  )}, mas seus gastos e investimentos ultrapassam esse valor em ${formatarBRL(
						Math.abs(base.saldoLivre),
				  )}.`,
		focoDoMes:
			base.totalInvestimentos >= base.metas.investimentos
				? "Manter a consistência sem aumentar gastos flexíveis."
				: "Ajustar gastos flexíveis para aproximar os investimentos da meta de 20%.",
		pilares: [
			{
				chave: "necessidades",
				titulo: "Necessidades",
				meta: formatarBRL(base.metas.necessidades),
				atual: formatarBRL(base.usoAtual.necessidades),
				status:
					base.usoAtual.necessidades <= base.metas.necessidades
						? "positivo"
						: "alerta",
				orientacao:
					base.usoAtual.necessidades <= base.metas.necessidades
						? "As necessidades parecem controladas dentro da referência de 50%."
						: "As necessidades estão acima da referência. Revise custos fixos e contratos recorrentes.",
				ajusteRecomendado:
					"Use essa meta como teto para gastos essenciais recorrentes.",
			},
			{
				chave: "desejos",
				titulo: "Desejos",
				meta: formatarBRL(base.metas.desejos),
				atual: formatarBRL(base.usoAtual.desejos + base.usoAtual.outros),
				status:
					base.usoAtual.desejos + base.usoAtual.outros <=
					base.metas.desejos
						? "positivo"
						: "alerta",
				orientacao:
					"Essa é a área mais flexível do orçamento e costuma ser a primeira a ser ajustada.",
				ajusteRecomendado:
					"Defina um teto semanal para lazer, delivery, assinaturas e compras pessoais.",
			},
			{
				chave: "investimentos",
				titulo: "Investimentos",
				meta: formatarBRL(base.metas.investimentos),
				atual: formatarBRL(base.totalInvestimentos),
				status:
					base.totalInvestimentos >= base.metas.investimentos
						? "positivo"
						: "alerta",
				orientacao:
					base.totalInvestimentos >= base.metas.investimentos
						? "Você está dentro ou acima da referência de 20% para construção patrimonial."
						: "O valor investido ainda está abaixo da referência de 20%.",
				ajusteRecomendado:
					"Automatize um valor fixo no início do mês para não depender apenas do que sobrar.",
			},
		],
		prioridades: [
			{
				titulo: "Definir teto para gastos flexíveis",
				motivo:
					"Os gastos flexíveis são os mais fáceis de ajustar sem mexer na estrutura básica da vida.",
				acao: "Crie um limite semanal para lazer, delivery e compras pessoais.",
			},
			{
				titulo: "Separar investimento no começo do mês",
				motivo:
					"Investir apenas o que sobra reduz a consistência.",
				acao: "Reserve a meta de investimento assim que a renda cair.",
			},
		],
		plano30Dias: [
			{
				semana: "Semana 1",
				titulo: "Organizar o orçamento",
				tarefas: [
					"Confirmar renda líquida real.",
					"Separar despesas fixas de gastos flexíveis.",
					"Definir teto para desejos.",
				],
			},
			{
				semana: "Semana 2",
				titulo: "Reduzir vazamentos",
				tarefas: [
					"Revisar assinaturas pouco usadas.",
					"Reduzir compras impulsivas.",
					"Evitar parcelamentos novos.",
				],
			},
			{
				semana: "Semana 3",
				titulo: "Fortalecer investimentos",
				tarefas: [
					"Separar valor fixo para investir.",
					"Priorizar reserva de emergência se ela ainda não existir.",
					"Evitar usar o saldo livre sem planejamento.",
				],
			},
			{
				semana: "Semana 4",
				titulo: "Fechar o mês",
				tarefas: [
					"Comparar planejado vs realizado.",
					"Ajustar metas do próximo mês.",
					"Manter somente hábitos que funcionaram.",
				],
			},
		],
		regrasDoMes: [
			"Não gastar o saldo livre antes de decidir uma finalidade para ele.",
			"Evitar novas despesas fixas enquanto a meta de investimento não estiver estável.",
			"Revisar gastos flexíveis semanalmente, não apenas no fim do mês.",
		],
		fraseFinal:
			"Planejamento bom não é o mais rígido; é o que você consegue repetir todos os meses.",
	};
}

function montarPromptPlanejamento(base) {
	return `
[PLANEJAMENTO FINANCEIRO PERSONALIZADO]

Você é o YeBOT, um assistente financeiro especialista, objetivo e cauteloso.

Você deve gerar um PLANEJAMENTO, não um relatório.
Não faça gráfico, não liste transações e não escreva como dashboard.
Use os dados abaixo apenas como base para criar um plano prático para o próximo mês.

DADOS REAIS DO USUÁRIO:

RESUMO:
- Receita total do mês: ${formatarBRL(base.totalReceitas)}
- Despesas totais do mês: ${formatarBRL(base.totalDespesas)}
- Investimentos do mês: ${formatarBRL(base.totalInvestimentos)}
- Saldo livre atual: ${formatarBRL(base.saldoLivre)}

REFERÊNCIA 50/30/20:
- Necessidades: ${formatarBRL(base.metas.necessidades)}
- Desejos: ${formatarBRL(base.metas.desejos)}
- Investimentos: ${formatarBRL(base.metas.investimentos)}

USO ATUAL ESTIMADO:
- Necessidades identificadas: ${formatarBRL(base.usoAtual.necessidades)}
- Desejos identificados: ${formatarBRL(base.usoAtual.desejos)}
- Despesas não classificadas: ${formatarBRL(base.usoAtual.outros)}
- Investimentos realizados: ${formatarBRL(base.totalInvestimentos)}

PERCENTUAIS:
- Despesas sobre renda: ${base.percentuais.despesas.toFixed(1)}%
- Investimentos sobre renda: ${base.percentuais.investimentos.toFixed(1)}%
- Saldo livre sobre renda: ${base.percentuais.saldo.toFixed(1)}%

CATEGORIAS DE DESPESAS PARA CONTEXTO:
${montarRankingParaPrompt(base.rankingDespesas)}

RECEITAS PARA CONTEXTO:
${montarRankingParaPrompt(base.rankingReceitas)}

INVESTIMENTOS PARA CONTEXTO:
${montarRankingParaPrompt(base.rankingInvestimentos)}

QUANTIDADE DE LANÇAMENTOS:
- Receitas: ${base.quantidades.receitas}
- Despesas: ${base.quantidades.despesas}
- Investimentos: ${base.quantidades.investimentos}

RESPONDA EXCLUSIVAMENTE EM JSON VÁLIDO.
Não use markdown.
Não use crase.
Não escreva nenhum texto antes ou depois do JSON.

Formato obrigatório:

{
  "status": "positivo | alerta | critico | neutro",
  "statusLabel": "Resumo curto do estado do plano",
  "headline": "Título forte para o planejamento",
  "diagnostico": "Diagnóstico personalizado em até 3 frases",
  "focoDoMes": "Principal foco financeiro para o próximo mês",
  "pilares": [
    {
      "chave": "necessidades",
      "titulo": "Necessidades",
      "meta": "Valor em reais",
      "atual": "Valor em reais",
      "status": "positivo | alerta | critico | neutro",
      "orientacao": "Orientação prática para esse pilar",
      "ajusteRecomendado": "Ajuste recomendado para o próximo mês"
    },
    {
      "chave": "desejos",
      "titulo": "Desejos",
      "meta": "Valor em reais",
      "atual": "Valor em reais",
      "status": "positivo | alerta | critico | neutro",
      "orientacao": "Orientação prática para esse pilar",
      "ajusteRecomendado": "Ajuste recomendado para o próximo mês"
    },
    {
      "chave": "investimentos",
      "titulo": "Investimentos",
      "meta": "Valor em reais",
      "atual": "Valor em reais",
      "status": "positivo | alerta | critico | neutro",
      "orientacao": "Orientação prática para esse pilar",
      "ajusteRecomendado": "Ajuste recomendado para o próximo mês"
    }
  ],
  "prioridades": [
    {
      "titulo": "Prioridade objetiva",
      "motivo": "Por que isso importa",
      "acao": "Ação prática"
    }
  ],
  "plano30Dias": [
    {
      "semana": "Semana 1",
      "titulo": "Título da etapa",
      "tarefas": ["Tarefa 1", "Tarefa 2", "Tarefa 3"]
    }
  ],
  "regrasDoMes": ["Regra prática 1", "Regra prática 2", "Regra prática 3"],
  "fraseFinal": "Fechamento objetivo"
}

REGRAS:
- Responda em Português do Brasil.
- Não invente valores.
- Não recomende investimentos específicos como certeza.
- Não dê garantia de rentabilidade.
- Seja personalizado, mas curto.
- Trate categorias não classificadas como ponto de atenção, não como erro.
`;
}

function getStatusClasse(status) {
	if (!status) return "neutro";

	const normalizado = normalizarTexto(status);

	if (normalizado.includes("critico")) return "critico";
	if (normalizado.includes("alerta")) return "alerta";
	if (normalizado.includes("positivo")) return "positivo";

	return "neutro";
}

function Planejamento() {
	const [dados, setDados] = useState({
		receitas: [],
		despesas: [],
		investimentos: [],
	});

	const [baseFinanceira, setBaseFinanceira] = useState(null);
	const [planoIA, setPlanoIA] = useState(null);
	const [loadingDados, setLoadingDados] = useState(true);
	const [loadingIA, setLoadingIA] = useState(false);
	const [erro, setErro] = useState("");
	const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);

	async function gerarPlanoIA(base) {
		if (!base) return;

		setLoadingIA(true);

		try {
			if (base.totalReceitas <= 0) {
				setPlanoIA(criarPlanoFallback(base));
				return;
			}

			const resposta = await getGeminiResponse(
				montarPromptPlanejamento(base),
				[],
			);

			const json = extrairJsonDaResposta(resposta);

			if (json) {
				setPlanoIA(json);
			} else {
				setPlanoIA(criarPlanoFallback(base));
			}
		} catch (error) {
			console.error("Erro ao gerar planejamento com IA:", error);
			setPlanoIA(criarPlanoFallback(base));
		} finally {
			setLoadingIA(false);
		}
	}

	async function carregarDados() {
		setLoadingDados(true);
		setErro("");

		try {
			const userId = Number(localStorage.getItem("userId"));

			if (!userId) {
				setErro("Usuário não encontrado. Faça login novamente.");
				setBaseFinanceira(null);
				setPlanoIA(null);
				return;
			}

			const [resReceitas, resDespesas, resInvestimentos] =
				await Promise.all([
					acompanhamentoService.getReceitas(userId),
					acompanhamentoService.getDespesas(userId),
					acompanhamentoService.getInvestimentos(userId),
				]);

			const receitas = filtrarMesAtual(resReceitas.data || []);
			const despesas = filtrarMesAtual(resDespesas.data || []);
			const investimentos = filtrarMesAtual(resInvestimentos.data || []);

			const dadosCarregados = {
				receitas,
				despesas,
				investimentos,
			};

			const base = calcularBaseFinanceira(
				receitas,
				despesas,
				investimentos,
			);

			setDados(dadosCarregados);
			setBaseFinanceira(base);
			setUltimaAtualizacao(new Date());

			await gerarPlanoIA(base);
		} catch (error) {
			console.error("Erro ao carregar planejamento:", error);
			setErro("Erro ao buscar dados financeiros no backend.");
			setBaseFinanceira(null);
			setPlanoIA(null);
		} finally {
			setLoadingDados(false);
		}
	}

	useEffect(() => {
		carregarDados();
	}, []);

	const pilaresRenderizados = useMemo(() => {
		if (!baseFinanceira) return [];

		return pilaresBase.map((pilar) => {
			const pilarIA = planoIA?.pilares?.find(
				(item) => item?.chave === pilar.chave,
			);

			const meta = baseFinanceira.metas[pilar.chave] || 0;

			const atual =
				pilar.chave === "investimentos"
					? baseFinanceira.totalInvestimentos
					: baseFinanceira.usoAtual[pilar.chave] || 0;

			const progresso = meta > 0 ? Math.min((atual / meta) * 100, 100) : 0;

			return {
				...pilar,
				meta,
				atual,
				progresso,
				status: getStatusClasse(pilarIA?.status),
				orientacao:
					pilarIA?.orientacao ||
					"Atualize seus dados para melhorar a recomendação deste pilar.",
				ajusteRecomendado:
					pilarIA?.ajusteRecomendado ||
					"Use essa referência como limite mensal.",
			};
		});
	}, [baseFinanceira, planoIA]);

	const statusPlano = getStatusClasse(planoIA?.status);

	return (
		<>
			<Navbar />

			<section className="planejamento">
				<div className="planejamento__container">
					<header className="planejamento__header">
						<div>
							<span className="planejamento__tag">
								<Sparkles size={15} />
								Planejamento personalizado
							</span>

							<h1 className="planejamento__title">
								Seu plano financeiro do mês
							</h1>

							<p className="planejamento__subtitle">
								O YeBOT usa seus dados cadastrados para montar um plano
								prático de distribuição da renda, prioridades e ações para
								os próximos 30 dias.
							</p>
						</div>

						<button
							type="button"
							className="planejamento__refresh"
							onClick={carregarDados}
							disabled={loadingDados || loadingIA}
						>
							{loadingDados || loadingIA ? (
								<Loader2 size={17} className="spin" />
							) : (
								<RefreshCcw size={17} />
							)}
							Atualizar plano
						</button>
					</header>

					{erro && (
						<div className="planejamento-alerta planejamento-alerta--erro">
							<AlertTriangle size={20} />
							<div>
								<strong>Atenção</strong>
								<p>{erro}</p>
							</div>
						</div>
					)}

					{loadingDados ? (
						<div className="planejamento-loading">
							<Loader2 size={24} className="spin" />
							<span>Buscando seus dados e preparando o planejamento...</span>
						</div>
					) : (
						<>
							<section className="planejamento-hero">
								<article className="planejamento-card planejamento-card--base">
									<div className="planejamento-card__icon">
										<WalletCards size={24} />
									</div>

									<span className="planejamento-card__label">
										Base usada no plano
									</span>

									<strong className="planejamento-card__valor">
										{formatarBRL(baseFinanceira?.totalReceitas || 0)}
									</strong>

									<p>
										Renda líquida identificada no mês atual. A partir
										dela, o YeBOT calcula uma referência de distribuição
										e monta um plano de ação.
									</p>

									<div className="planejamento-card__mini-grid">
										<div>
											<span>Saldo livre</span>
											<strong
												className={
													(baseFinanceira?.saldoLivre || 0) >= 0
														? "positivo"
														: "critico"
												}
											>
												{formatarBRL(
													baseFinanceira?.saldoLivre || 0,
												)}
											</strong>
										</div>

										<div>
											<span>Investido</span>
											<strong>
												{formatarBRL(
													baseFinanceira?.totalInvestimentos ||
														0,
												)}
											</strong>
										</div>
									</div>
								</article>

								<article
									className={`planejamento-card planejamento-card--status planejamento-card--${statusPlano}`}
								>
									<div className="planejamento-card__icon">
										<Target size={24} />
									</div>

									<span className="planejamento-card__label">
										Status do planejamento
									</span>

									{loadingIA ? (
										<div className="planejamento-card__loading">
											<Loader2 size={20} className="spin" />
											<span>Gerando análise personalizada...</span>
										</div>
									) : (
										<>
											<strong className="planejamento-card__valor planejamento-card__valor--menor">
												{planoIA?.statusLabel || "Plano em preparação"}
											</strong>

											<p>
												{planoIA?.focoDoMes ||
													"Atualize seus dados para receber um foco mensal mais preciso."}
											</p>
										</>
									)}

									{ultimaAtualizacao && (
										<span className="planejamento-card__data">
											Atualizado às{" "}
											{ultimaAtualizacao.toLocaleTimeString("pt-BR", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									)}
								</article>
							</section>

							<section className="planejamento-section">
								<div className="planejamento-section__header">
									<span>
										<ShieldCheck size={18} />
										Distribuição recomendada
									</span>

									<h2>Orçamento de referência</h2>

									<p>
										Não é um relatório: é um plano-base para orientar seus
										limites de gasto e sua meta de construção patrimonial.
									</p>
								</div>

								<div className="planejamento-pilares">
									{pilaresRenderizados.map((pilar) => {
										const Icone = pilar.icone;

										return (
											<article
												key={pilar.chave}
												className={`planejamento-pilar planejamento-pilar--${pilar.chave} planejamento-pilar--${pilar.status}`}
											>
												<div className="planejamento-pilar__topo">
													<div className="planejamento-pilar__icone">
														<Icone size={21} />
													</div>

													<div>
														<span>
															{pilar.percentual}% da renda
														</span>
														<h3>{pilar.titulo}</h3>
													</div>
												</div>

												<p className="planejamento-pilar__descricao">
													{pilar.descricao}
												</p>

												<div className="planejamento-pilar__valores">
													<div>
														<span>Meta</span>
														<strong>{formatarBRL(pilar.meta)}</strong>
													</div>

													<div>
														<span>Atual</span>
														<strong>{formatarBRL(pilar.atual)}</strong>
													</div>
												</div>

												<div className="planejamento-pilar__barra">
													<div
														style={{
															width: `${pilar.progresso}%`,
														}}
													></div>
												</div>

												<div className="planejamento-pilar__orientacao">
													<strong>Orientação</strong>
													<p>{pilar.orientacao}</p>
												</div>

												<div className="planejamento-pilar__ajuste">
													<strong>Ajuste recomendado</strong>
													<p>{pilar.ajusteRecomendado}</p>
												</div>
											</article>
										);
									})}
								</div>
							</section>

							<section className="planejamento-section planejamento-section--ia">
								<div className="planejamento-section__header">
									<span>
										<Sparkles size={18} />
										YeBOT
									</span>

									<h2>
										{loadingIA
											? "Montando seu plano..."
											: planoIA?.headline ||
											  "Plano personalizado"}
									</h2>

									<p>
										{loadingIA
											? "Cruzando seus dados financeiros com as regras de planejamento."
											: planoIA?.diagnostico ||
											  "Sem diagnóstico disponível no momento."}
									</p>
								</div>

								{loadingIA ? (
									<div className="planejamento-loading planejamento-loading--interno">
										<Loader2 size={23} className="spin" />
										<span>Gerando prioridades, regras e plano de 30 dias...</span>
									</div>
								) : (
									<>
										<div className="planejamento-grid-duplo">
											<article className="planejamento-painel">
												<div className="planejamento-painel__titulo">
													<Target size={19} />
													<h3>Prioridades do mês</h3>
												</div>

												<div className="planejamento-prioridades">
													{planoIA?.prioridades?.length > 0 ? (
														planoIA.prioridades.map(
															(item, index) => (
																<div
																	key={`${item.titulo}-${index}`}
																	className="planejamento-prioridade"
																>
																	<span>{index + 1}</span>

																	<div>
																		<strong>
																			{item.titulo}
																		</strong>
																		<p>{item.motivo}</p>
																		<em>{item.acao}</em>
																	</div>
																</div>
															),
														)
													) : (
														<p className="planejamento-vazio">
															Sem prioridades geradas.
														</p>
													)}
												</div>
											</article>

											<article className="planejamento-painel">
												<div className="planejamento-painel__titulo">
													<CalendarCheck size={19} />
													<h3>Regras do mês</h3>
												</div>

												<ul className="planejamento-regras">
													{planoIA?.regrasDoMes?.length > 0 ? (
														planoIA.regrasDoMes.map(
															(regra, index) => (
																<li key={`${regra}-${index}`}>
																	<CheckCircle2 size={16} />
																	<span>{regra}</span>
																</li>
															),
														)
													) : (
														<li>
															<CheckCircle2 size={16} />
															<span>
																Mantenha seus lançamentos
																atualizados para melhorar o
																planejamento.
															</span>
														</li>
													)}
												</ul>
											</article>
										</div>

										<article className="planejamento-painel planejamento-painel--roadmap">
											<div className="planejamento-painel__titulo">
												<Route size={19} />
												<h3>Plano de ação para 30 dias</h3>
											</div>

											<div className="planejamento-roadmap">
												{planoIA?.plano30Dias?.length > 0 ? (
													planoIA.plano30Dias.map(
														(semana, index) => (
															<div
																key={`${semana.semana}-${index}`}
																className="planejamento-semana"
															>
																<div className="planejamento-semana__marcador">
																	<span>{index + 1}</span>
																</div>

																<div className="planejamento-semana__conteudo">
																	<span className="planejamento-semana__label">
																		{semana.semana}
																	</span>

																	<h4>{semana.titulo}</h4>

																	<ul>
																		{semana.tarefas?.map(
																			(tarefa, tarefaIndex) => (
																				<li
																					key={`${tarefa}-${tarefaIndex}`}
																				>
																					{tarefa}
																				</li>
																			),
																		)}
																	</ul>
																</div>
															</div>
														),
													)
												) : (
													<p className="planejamento-vazio">
														Sem plano de 30 dias gerado.
													</p>
												)}
											</div>
										</article>

										{planoIA?.fraseFinal && (
											<div className="planejamento-frase-final">
												<Sparkles size={18} />
												<p>{planoIA.fraseFinal}</p>
											</div>
										)}
									</>
								)}
							</section>
						</>
					)}
				</div>
			</section>
		</>
	);
}

export default Planejamento;