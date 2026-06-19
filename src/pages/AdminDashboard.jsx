import React, { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  LogOut, 
  Activity, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ListFilter
} from "lucide-react";
import "../styles/AdminDashboard.css"; 

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const response = await fetch("http://localhost:8080/api/admin/logs", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar os logs da API");
        }
        
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
        setErro("Não foi possível conectar ao servidor de logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/"; 
  };

  const getStatusStyle = (status) => {
    if (status >= 500) return { bg: "#fee2e2", text: "#991b1b", icon: <AlertCircle size={16}/> };
    if (status >= 400) return { bg: "#ffedd5", text: "#9a3412", icon: <AlertCircle size={16}/> };
    return { bg: "#dcfce7", text: "#166534", icon: <CheckCircle2 size={16}/> };
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return '#6b7280';
      case 'POST': return '#2563eb';
      case 'DELETE': return '#dc2626';
      case 'PUT': return '#d97706';
      default: return '#4b5563';
    }
  };

  return (
    <div className="admin-container">
      
      {/* Menu Lateral */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            <ShieldAlert size={24} />
            Yeezus TI
          </h1>
          <p className="sidebar-subtitle">Monitoramento de Sistemas</p>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-button-active">
            <Activity size={20} />
            Logs da API
          </button>
        </nav>

        <div className="logout-container">
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            Sair e Voltar
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="admin-main">
        <header className="main-header">
          <h2 className="main-title">Tráfego em Tempo Real</h2>
          <p className="main-desc">Acompanhe as requisições realizadas na API do Yeezus.</p>
        </header>

        {erro && <div className="error-banner">{erro}</div>}

        {/* Cards Superiores */}
        <div className="cards-grid">
          <div className="summary-card">
            <div className="card-header">
              <ListFilter size={20} />
              <span className="card-title">Total de Requisições</span>
            </div>
            <span className="card-value">{logs.length}</span>
          </div>

          <div className="summary-card">
            <div className="card-header">
              <AlertCircle size={20} color="#dc2626" />
              <span className="card-title">Erros Registrados</span>
            </div>
            <span className="card-value text-red">
              {logs.filter(l => l.status >= 400).length}
            </span>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="table-container">
          {loading ? (
            <div className="empty-state">Carregando dados da API...</div>
          ) : (
            <table className="logs-table">
              <thead>
                <tr className="table-head-row">
                  <th className="table-th">Data e Hora</th>
                  <th className="table-th">Método</th>
                  <th className="table-th">Rota</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Usuário</th>
                  <th className="table-th">Latência</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const statusStyle = getStatusStyle(log.status);
                  return (
                    <tr key={log.id} className="table-row">
                      <td className="table-td">
                        {new Date(log.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })}
                      </td>
                      <td className="table-td">
                        <span className="method-badge" style={{ color: getMethodColor(log.metodo) }}>
                          {log.metodo}
                        </span>
                      </td>
                      <td className="table-td td-rota">{log.rota}</td>
                      <td className="table-td">
                        <div className="status-badge" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                          {statusStyle.icon}
                          {log.status}
                        </div>
                      </td>
                      <td className="table-td">{log.usuario}</td>
                      <td className="table-td">
                        <div className="latency-cell">
                          <Clock size={16} color={log.tempoProcessamentoMs > 500 ? '#d97706' : '#9ca3af'} />
                          {log.tempoProcessamentoMs}ms
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {logs.length === 0 && !loading && !erro && (
                  <tr>
                    <td colSpan="6" className="empty-state">Nenhum log registrado ainda.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}