import React from "react";
import "../styles/Relatorios.css";
import { Navbar } from "../components/Navbar.jsx";

const resumo = [
	{
		label: "Receita total",
		valor: "R$ 8.500,00",
		tipo: "positivo",
		icone: "↑",
	},
	{
		label: "Despesa total",
		valor: "R$ 5.230,00",
		tipo: "negativo",
		icone: "↓",
	},
	{
		label: "Saldo do mês",
		valor: "R$ 3.270,00",
		tipo: "positivo",
		icone: "=",
	},
	{ label: "Investido", valor: "R$ 1.700,00", tipo: "neutro", icone: "★" },
];

const meses = [
	{ nome: "Jan", receita: 60, despesa: 45 },
	{ nome: "Fev", receita: 75, despesa: 55 },
	{ nome: "Mar", receita: 65, despesa: 70 },
	{ nome: "Abr", receita: 80, despesa: 50 },
	{ nome: "Mai", receita: 70, despesa: 60 },
	{ nome: "Jun", receita: 90, despesa: 65 },
	{ nome: "Jul", receita: 85, despesa: 62 },
];

const categorias = [
	{ nome: "Moradia", valor: 1800, percentual: 34 },
	{ nome: "Alimentação", valor: 1200, percentual: 23 },
	{ nome: "Transporte", valor: 750, percentual: 14 },
	{ nome: "Lazer", valor: 620, percentual: 12 },
	{ nome: "Saúde", valor: 480, percentual: 9 },
	{ nome: "Outros", valor: 380, percentual: 8 },
];

const transacoes = [
	{
		data: "12/05",
		descricao: "Salário",
		categoria: "Receita",
		valor: "+ R$ 8.500,00",
		tipo: "positivo",
	},
	{
		data: "10/05",
		descricao: "Aluguel",
		categoria: "Moradia",
		valor: "- R$ 1.800,00",
		tipo: "negativo",
	},
	{
		data: "08/05",
		descricao: "Supermercado",
		categoria: "Alimentação",
		valor: "- R$ 620,00",
		tipo: "negativo",
	},
	{
		data: "07/05",
		descricao: "Aporte Tesouro",
		categoria: "Investimento",
		valor: "- R$ 1.000,00",
		tipo: "neutro",
	},
	{
		data: "05/05",
		descricao: "Restaurante",
		categoria: "Lazer",
		valor: "- R$ 180,00",
		tipo: "negativo",
	},
];

function Relatorios() {
	return (
		<>
			<Navbar />
			<section className="relatorios">
				<div className="relatorios__container">
					<header className="relatorios__header">
						<div>
							<h1 className="relatorios__title">
								Relatórios Financeiros
							</h1>
							<p className="relatorios__subtitle">
								Visão completa das suas finanças em Maio de 2026
							</p>
						</div>
						<div className="relatorios__filtros">
							<button className="filtro filtro--ativo">
								Mês
							</button>
							<button className="filtro">Trimestre</button>
							<button className="filtro">Ano</button>
						</div>
					</header>

					<div className="cards-resumo">
						{resumo.map((item) => (
							<div
								key={item.label}
								className={`card-resumo card-resumo--${item.tipo}`}
							>
								<div className="card-resumo__icone">
									{item.icone}
								</div>
								<div className="card-resumo__info">
									<span className="card-resumo__label">
										{item.label}
									</span>
									<strong className="card-resumo__valor">
										{item.valor}
									</strong>
								</div>
							</div>
						))}
					</div>

					<div className="painel painel--grafico">
						<div className="painel__header">
							<h2>Receita vs Despesa</h2>
							<div className="legenda">
								<span className="legenda__item">
									<span className="legenda__cor legenda__cor--receita"></span>
									Receita
								</span>
								<span className="legenda__item">
									<span className="legenda__cor legenda__cor--despesa"></span>
									Despesa
								</span>
							</div>
						</div>
						<div className="grafico-barras">
							{meses.map((m) => (
								<div
									key={m.nome}
									className="grafico-barras__grupo"
								>
									<div className="grafico-barras__barras">
										<div
											className="barra barra--receita"
											style={{ height: `${m.receita}%` }}
										></div>
										<div
											className="barra barra--despesa"
											style={{ height: `${m.despesa}%` }}
										></div>
									</div>
									<span className="grafico-barras__label">
										{m.nome}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="painel-grid">
						<div className="painel">
							<div className="painel__header">
								<h2>Despesas por categoria</h2>
								<span className="painel__total">
									Total: R$ 5.230,00
								</span>
							</div>
							<ul className="categorias">
								{categorias.map((c) => (
									<li key={c.nome} className="categoria">
										<div className="categoria__topo">
											<span className="categoria__nome">
												{c.nome}
											</span>
											<span className="categoria__valor">
												R${" "}
												{c.valor.toLocaleString(
													"pt-BR",
												)}
											</span>
										</div>
										<div className="categoria__barra">
											<div
												className="categoria__preenchimento"
												style={{
													width: `${c.percentual}%`,
												}}
											></div>
										</div>
										<span className="categoria__percent">
											{c.percentual}%
										</span>
									</li>
								))}
							</ul>
						</div>

						<div className="painel">
							<div className="painel__header">
								<h2>Últimas transações</h2>
								<a className="painel__link" href="#">
									Ver todas
								</a>
							</div>
							<ul className="transacoes">
								{transacoes.map((t, i) => (
									<li key={i} className="transacao">
										<div className="transacao__esquerda">
											<span className="transacao__data">
												{t.data}
											</span>
											<div>
												<strong className="transacao__descricao">
													{t.descricao}
												</strong>
												<span className="transacao__categoria">
													{t.categoria}
												</span>
											</div>
										</div>
										<span
											className={`transacao__valor transacao__valor--${t.tipo}`}
										>
											{t.valor}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default Relatorios;
