import React, { useState } from "react";
import "../styles/Planejamento.css";
import { Navbar } from "../components/Navbar.jsx";

const blocos = [
	{
		chave: "necessidades",
		percentual: 50,
		titulo: "Necessidades",
		cor: "#9a0000",
		descricao:
			"Gastos essenciais que você precisa cobrir todo mês para manter sua vida funcionando.",
		exemplos: [
			"Aluguel / Financiamento",
			"Contas (água, luz, internet)",
			"Mercado",
			"Transporte",
			"Plano de saúde",
		],
	},
	{
		chave: "desejos",
		percentual: 30,
		titulo: "Desejos",
		cor: "#ff5555",
		descricao:
			"Aquilo que melhora sua qualidade de vida mas não é estritamente necessário.",
		exemplos: [
			"Restaurantes e delivery",
			"Streaming e assinaturas",
			"Viagens",
			"Hobbies",
			"Compras pessoais",
		],
	},
	{
		chave: "investimentos",
		percentual: 20,
		titulo: "Poupança & Investimentos",
		cor: "#2ecc71",
		descricao:
			"A fatia que constrói seu futuro: reserva de emergência, investimentos e quitação de dívidas.",
		exemplos: [
			"Reserva de emergência",
			"Tesouro Direto",
			"Ações e ETFs",
			"Previdência",
			"Amortização de dívidas",
		],
	},
];

function formatarBRL(valor) {
	return valor.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}

function Planejamento() {
	const [renda, setRenda] = useState(5000);

	const necessidades = renda * 0.5;
	const desejos = renda * 0.3;
	const investimentos = renda * 0.2;

	return (
		<>
			<Navbar />
			<section className="planejamento">
				<div className="planejamento__container">
					<header className="planejamento__header">
						<span className="planejamento__tag">
							Método 50 / 30 / 20
						</span>
						<h1 className="planejamento__title">
							Organize sua renda em três pilares
						</h1>
						<p className="planejamento__subtitle">
							Uma divisão simples e poderosa: metade para o
							essencial, um terço para o que você ama, e um quinto
							para construir o seu futuro.
						</p>
					</header>

					<div className="calculadora">
						<div className="calculadora__input">
							<label htmlFor="renda">
								Sua renda líquida mensal
							</label>
							<div className="calculadora__campo">
								<span className="calculadora__prefixo">R$</span>
								<input
									id="renda"
									type="number"
									min="0"
									step="100"
									value={renda}
									onChange={(e) =>
										setRenda(Number(e.target.value) || 0)
									}
								/>
							</div>
						</div>

						<div className="calculadora__visual">
							<div className="donut">
								<div className="donut__grafico"></div>
								<div className="donut__centro">
									<span className="donut__label">Renda</span>
									<strong className="donut__valor">
										{formatarBRL(renda)}
									</strong>
								</div>
							</div>

							<div className="distribuicao">
								<div className="distribuicao__item">
									<span
										className="distribuicao__cor"
										style={{ background: "#9a0000" }}
									></span>
									<div>
										<span className="distribuicao__label">
											50% Necessidades
										</span>
										<strong>
											{formatarBRL(necessidades)}
										</strong>
									</div>
								</div>
								<div className="distribuicao__item">
									<span
										className="distribuicao__cor"
										style={{ background: "#ff5555" }}
									></span>
									<div>
										<span className="distribuicao__label">
											30% Desejos
										</span>
										<strong>{formatarBRL(desejos)}</strong>
									</div>
								</div>
								<div className="distribuicao__item">
									<span
										className="distribuicao__cor"
										style={{ background: "#2ecc71" }}
									></span>
									<div>
										<span className="distribuicao__label">
											20% Investimentos
										</span>
										<strong>
											{formatarBRL(investimentos)}
										</strong>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="barra-total">
						<div className="barra-total__segmento barra-total__segmento--necessidades">
							<span>50%</span>
						</div>
						<div className="barra-total__segmento barra-total__segmento--desejos">
							<span>30%</span>
						</div>
						<div className="barra-total__segmento barra-total__segmento--investimentos">
							<span>20%</span>
						</div>
					</div>

					<div className="blocos">
						{blocos.map((bloco) => (
							<article
								key={bloco.chave}
								className={`bloco bloco--${bloco.chave}`}
							>
								<div className="bloco__topo">
									<span
										className="bloco__percentual"
										style={{ color: bloco.cor }}
									>
										{bloco.percentual}%
									</span>
									<h2 className="bloco__titulo">
										{bloco.titulo}
									</h2>
								</div>
								<p className="bloco__descricao">
									{bloco.descricao}
								</p>
								<ul className="bloco__exemplos">
									{bloco.exemplos.map((ex) => (
										<li key={ex}>
											<span
												className="bloco__bullet"
												style={{
													background: bloco.cor,
												}}
											></span>
											{ex}
										</li>
									))}
								</ul>
								<div className="bloco__rodape">
									<span className="bloco__rodape-label">
										Para sua renda:
									</span>
									<strong className="bloco__rodape-valor">
										{formatarBRL(
											(renda * bloco.percentual) / 100,
										)}
									</strong>
								</div>
							</article>
						))}
					</div>

					<div className="dica">
						<span className="dica__icone">★</span>
						<div>
							<strong>Dica do Ye:</strong>
							<p>
								Se hoje você ainda não consegue separar 20% para
								investir, comece com qualquer porcentagem e
								aumente gradualmente. O hábito vale mais que o
								valor inicial.
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default Planejamento;
