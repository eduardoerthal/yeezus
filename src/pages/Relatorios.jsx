import React, { useEffect, useState } from "react";
import "../styles/Relatorios.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid , ResponsiveContainer } from 'recharts';
import { Navbar } from "../components/Navbar.jsx";
import acompanhamentoService from "../api/acompanhamentoService";
import { CircularProgress } from "@mui/material";

function Relatorios() {
    const [loading, setLoading] = useState(true);
    const [dados, setDados] = useState({
        receitas: [],
        despesas: [],
        investimentos: [],
    });
    const [periodo, setPeriodo] = useState("mes");

    // Pega o ID do usuário como já é padrão no seu projeto
    const userId = Number(localStorage.getItem("userId"));

    const carregarDados = async () => {
        try {
            setLoading(true);

            // Chamando os seus endpoints oficiais
            const [receitas, despesas, investimentos] = await Promise.all([
                acompanhamentoService.getReceitas(userId),
                acompanhamentoService.getDespesas(userId),
                acompanhamentoService.getInvestimentos(userId),
            ]);

            setDados({
                receitas: receitas.data || [],
                despesas: despesas.data || [],
                investimentos: investimentos.data || [],
            });
        } catch (error) {
            console.error("Erro ao carregar relatórios:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

        const filtrarPeriodo = (lista) => {
            const agora = new Date();

            return lista.filter((item) => {
                if (!item.dataCriacao) return false;

                const data = new Date(item.dataCriacao);

                switch (periodo) {
                    case "mes":
                        return (
                            data.getMonth() === agora.getMonth() &&
                            data.getFullYear() === agora.getFullYear()
                        );

                    case "trimestre": {
                        const trimestreAtual =
                            Math.floor(agora.getMonth() / 3);

                        const trimestreItem =
                            Math.floor(data.getMonth() / 3);

                        return (
                            trimestreAtual === trimestreItem &&
                            data.getFullYear() === agora.getFullYear()
                        );
                    }

                    case "ano":
                        return (
                            data.getFullYear() ===
                            agora.getFullYear()
                        );

                    default:
                        return true;
                }
            });
        };

    const receitasFiltradas =
	    filtrarPeriodo(dados.receitas);

    const despesasFiltradas =
        filtrarPeriodo(dados.despesas);

    const investimentosFiltrados =
        filtrarPeriodo(dados.investimentos);

    // ==========================================
    // 1. CÁLCULO DOS TOTAIS E SALDO
    // ==========================================
    const totalReceita = receitasFiltradas.reduce((acc, item) => acc + item.valor, 0);
    const totalDespesa = despesasFiltradas.reduce((acc, item) => acc + item.valor, 0);
    const totalInvestimento = investimentosFiltrados.reduce((acc, item) => acc + item.valor, 0);
    const saldoDoMes = totalReceita - totalDespesa - totalInvestimento;

    const formatCurrency = (value) => {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const resumo = [
        { label: "Receita total", valor: formatCurrency(totalReceita), tipo: "positivo", icone: "↑" },
        { label: "Despesa total", valor: formatCurrency(totalDespesa), tipo: "negativo", icone: "↓" },
        { label: "Saldo do mês", valor: formatCurrency(saldoDoMes), tipo: saldoDoMes >= 0 ? "positivo-verde" : "negativo", icone: "=" },
        { label: "Investido", valor: formatCurrency(totalInvestimento), tipo: "neutro", icone: "★" },
    ];

    // ==========================================
    // 2. AGRUPAMENTO DE DESPESAS POR CATEGORIA
    // ==========================================
    const despesasAgrupadas = {};
    despesasFiltradas.forEach((d) => {
        const nomeCategoria = d.categoria?.nome || "Outros";
        if (!despesasAgrupadas[nomeCategoria]) {
            despesasAgrupadas[nomeCategoria] = 0;
        }
        despesasAgrupadas[nomeCategoria] += d.valor;
    });

    const categoriasParaRenderizar = Object.keys(despesasAgrupadas)
        .map((nome) => {
            const valor = despesasAgrupadas[nome];
            const percentual = totalDespesa > 0 ? Math.round((valor / totalDespesa) * 100) : 0;
            return { nome, valor, percentual };
        })
        .sort((a, b) => b.valor - a.valor); // Ordena da maior despesa para a menor

    // ==========================================
    // 3. UNIFICAÇÃO DAS ÚLTIMAS TRANSAÇÕES
    // ==========================================
    const formatarTransacao = (item, tipoNome, cssTipo) => {
        // Fallback caso não exista campo data no seu banco
        console.log(item)
        const dataFormatada = item.dataCriacao 
            ? new Date(item.dataCriacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) 
            : "Hoje";
        
        const sinal = cssTipo === "positivo" ? "+ " : cssTipo === "negativo" ? "- " : "";

        return {
            timestamp: item.dataCriacao ? new Date(item.dataCriacao).getTime() : Date.now(), // Usado para ordenar
            data: dataFormatada,
            descricao: item.titulo,
            categoria: item.categoria?.nome || tipoNome,
            valor: `${sinal}${formatCurrency(item.valor)}`,
            tipo: cssTipo,
        };
    };

    const todasTransacoes = [
        ...receitasFiltradas.map((r) => formatarTransacao(r, "Receita", "positivo")),
        ...despesasFiltradas.map((d) => formatarTransacao(d, "Despesa", "negativo")),
        ...investimentosFiltrados.map((i) => formatarTransacao(i, "Investimento", "neutro")),
    ]
        .sort((a, b) => b.timestamp - a.timestamp) // Ordena da mais recente para a mais antiga
        .slice(0, 5); // Pega apenas as 5 últimas

    // ==========================================
    // 4. MOCK DINÂMICO PARA O GRÁFICO (Exemplo)
    // ==========================================
    // Em um cenário real, você faria um .reduce para agrupar as datas por mês.
    // Aqui usamos um valor escalado do total atual para simular o gráfico não ficar vazio.
    const maxGrafico = Math.max(totalReceita, totalDespesa, 1000); // Evita divisão por zero
    const calcularAltura = (valor) => `${Math.round((valor / maxGrafico) * 100)}%`;

// ==========================================
    // 4. PROCESSAMENTO DE DADOS PARA O GRÁFICO
    // ==========================================




    const agruparPorMes = (lista) => {
        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const resultado = {};
        meses.forEach(m => resultado[m] = 0);
        
        lista.forEach(item => {
            if (!item.dataCriacao) return;
            const data = new Date(item.dataCriacao);
            const mesNome = meses[data.getMonth()];
            resultado[mesNome] += item.valor;
        });
        return resultado;
    };

    const receitasAgrupadas =
	agruparPorMes(receitasFiltradas);

    const despesasAgrupadasChart =
        agruparPorMes(despesasFiltradas);

    const dadosGraficoReais = Object.keys(receitasAgrupadas).map(mes => ({
        nome: mes,
        receita: receitasAgrupadas[mes],
        despesa: despesasAgrupadasChart[mes]
    }));

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress />
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <section className="relatorios">
                <div className="relatorios__container">
                    <header className="relatorios__header">
                        <div>
                            <h1 className="relatorios__title">Relatórios Financeiros</h1>
                            <p className="relatorios__subtitle">Visão completa das suas finanças</p>
                        </div>
                        <div className="relatorios__filtros">
                            <button
                                className={`filtro ${periodo === "mes" ? "filtro--ativo" : ""}`}
                                onClick={() => setPeriodo("mes")}
                            >
                                Mês
                            </button>

                            <button
                                className={`filtro ${periodo === "trimestre" ? "filtro--ativo" : ""}`}
                                onClick={() => setPeriodo("trimestre")}
                            >
                                Trimestre
                            </button>

                            <button
                                className={`filtro ${periodo === "ano" ? "filtro--ativo" : ""}`}
                                onClick={() => setPeriodo("ano")}
                            >
                                Ano
                            </button>
                        </div>
                    </header>

                    {/* CARDS DE RESUMO */}
                    <div className="cards-resumo">
                        {resumo.map((item) => (
                            <div key={item.label} className={`card-resumo card-resumo--${item.tipo}`}>
                                <div className="card-resumo__icone">{item.icone}</div>
                                <div className="card-resumo__info">
                                    <span className="card-resumo__label">{item.label}</span>
                                    <strong className="card-resumo__valor">{item.valor}</strong>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* GRÁFICO DE BARRAS */}
                    <div className="painel painel--grafico">
                        <div className="painel__header painel__header--grafico">
                            <div>
                                <h2>
                                    Receita vs Despesa
                                </h2>

                                <p className="painel__subtitle">
                                    {periodo === "mes"
                                        ? "Comparativo mensal"
                                        : periodo === "trimestre"
                                        ? "Comparativo trimestral"
                                        : "Comparativo anual"}
                                </p>
                            </div>

                            <div className="grafico__legendaCustom">
                                <div className="grafico__badge grafico__badge--receita">
                                    <span></span>
                                    Receitas
                                </div>

                                <div className="grafico__badge grafico__badge--despesa">
                                    <span></span>
                                    Despesas
                                </div>
                            </div>
                        </div>

                        <div className="graficoWrapper">
                            <ResponsiveContainer width="100%" height={340}>
                                <BarChart
                                    data={dadosGraficoReais}
                                    margin={{
                                        top: 20,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.06)"
                                    />

                                    <XAxis
                                        dataKey="nome"
                                        tick={{
                                            fill: "#8d8d8d",
                                            fontSize: 12,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        tick={{
                                            fill: "#8d8d8d",
                                            fontSize: 12,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) =>
                                            `R$ ${(value / 1000).toFixed(0)}k`
                                        }
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            background: "#111",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: "16px",
                                            color: "#fff",
                                        }}
                                        formatter={(value) =>
                                            formatCurrency(value)
                                        }
                                    />

                                    <Bar
                                        name="Receitas"
                                        dataKey="receita"
                                        fill="#22c55e"
                                        radius={[8, 8, 0, 0]}
                                    />

                                    <Bar
                                        name="Despesas"
                                        dataKey="despesa"
                                        fill="#ef4444"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="painel-grid">
                        {/* LISTA DE CATEGORIAS */}
                        <div className="painel">
                            <div className="painel__header">
                                <h2>Despesas por categoria</h2>
                                <span className="painel__total">
                                    Total: {formatCurrency(totalDespesa)}
                                </span>
                            </div>
                            <ul className="categorias">
                                {categoriasParaRenderizar.length > 0 ? (
                                    categoriasParaRenderizar.map((c) => (
                                        <li key={c.nome} className="categoria">
                                            <div className="categoria__topo">
                                                <span className="categoria__nome">{c.nome}</span>
                                                <span className="categoria__valor">{formatCurrency(c.valor)}</span>
                                            </div>
                                            <div className="categoria__barra">
                                                <div
                                                    className="categoria__preenchimento"
                                                    style={{ width: `${c.percentual}%` }}
                                                ></div>
                                            </div>
                                            <span className="categoria__percent">{c.percentual}%</span>
                                        </li>
                                    ))
                                ) : (
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Nenhuma despesa registrada.</p>
                                )}
                            </ul>
                        </div>

                        {/* LISTA DE TRANSAÇÕES GERAIS */}
                        <div className="painel">
                            <div className="painel__header">
                                <h2>Últimas transações</h2>
                                <a className="painel__link" href="#todas">Ver todas</a>
                            </div>
                            <ul className="transacoes">
                                {todasTransacoes.length > 0 ? (
                                    todasTransacoes.map((t, i) => (
                                        <li key={i} className="transacao">
                                            <div className="transacao__esquerda">
                                                <span className="transacao__data">{t.data}</span>
                                                <div>
                                                    <strong className="transacao__descricao">{t.descricao}</strong>
                                                    <span className="transacao__categoria">{t.categoria}</span>
                                                </div>
                                            </div>
                                            <span className={`transacao__valor transacao__valor--${t.tipo}`}>
                                                {t.valor}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Nenhuma transação encontrada.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Relatorios;