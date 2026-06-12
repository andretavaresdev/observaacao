// ===== CONFIGURAÇÃO DA API =====
const API_BASE = 'http://localhost:8080/api';

// ===== ESTADO GLOBAL =====
let categoriaSelecionada = null;

// ===== AUTENTICAÇÃO =====
const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario') || 'null');

const ABAS_POR_TIPO = {
    CIDADAO:  ['cidadao', 'denuncia', 'atendente'],
    SERVIDOR: ['atendente', 'gestora', 'admin']
};

function configurarTabs(tipo) {
    const abas = ABAS_POR_TIPO[tipo] || [];
    const chave = tipo === 'CIDADAO' ? 'cidadao' : 'atendente';
    document.querySelectorAll('.profile-btn').forEach(btn => {
        const tipos = (btn.dataset.tipos || '').split(',');
        btn.style.display = tipos.includes(chave) ? 'flex' : 'none';
    });
    const primeiroBtn = document.querySelector(`.profile-btn[data-screen="${abas[0]}"]`);
    if (primeiroBtn) primeiroBtn.click();
}

function fazerLogout() {
    sessionStorage.removeItem('usuario');
    window.location.replace('/login.html');
}


// ===== NAVEGAÇÃO ENTRE TELAS =====
document.querySelectorAll('.profile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.profile-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`screen-${btn.dataset.screen}`).classList.add('active');

        // Carregar dados ao entrar na tela
        if (btn.dataset.screen === 'gestora') carregarDashboardGestora();
        if (btn.dataset.screen === 'admin') carregarPainelAdmin();
        if (btn.dataset.screen === 'atendente') carregarFilaAtendimento();
    });
});

// ===== TELA 1: CIDADÃO =====
function selecionarCategoria(categoria) {
    categoriaSelecionada = categoria;
    document.querySelectorAll('.profile-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelector('[data-screen="denuncia"]').classList.add('active');
    document.getElementById('screen-denuncia').classList.add('active');
}

// ===== TELA 2: DENÚNCIA ANÔNIMA =====
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');

if (uploadArea) {
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--accent)';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
    });
}

// Contador de caracteres
const denunciaTextarea = document.getElementById('denuncia-descricao');
const charAtual = document.getElementById('char-atual');
if (denunciaTextarea && charAtual) {
    denunciaTextarea.addEventListener('input', () => {
        charAtual.textContent = denunciaTextarea.value.length;
    });
}

document.getElementById('form-denuncia')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const descricao = document.getElementById('denuncia-descricao').value.trim();
    if (!descricao) {
        mostrarNotificacao('Por favor, descreva o problema.', 'erro');
        return;
    }

    const data = {
        descricao: descricao,
        categoria: categoriaSelecionada || 'OUTRO',
        endereco: 'Não informado (denúncia anônima)',
        anonimo: true
    };

    try {
        const res = await fetch(`${API_BASE}/solicitacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        mostrarNotificacao(`Denúncia registrada! Protocolo: ${result.protocolo}`, 'sucesso');
        e.target.reset();
        if (charAtual) charAtual.textContent = '0';
        categoriaSelecionada = null;
    } catch (err) {
        mostrarNotificacao('Erro ao enviar denúncia. Verifique se o servidor está rodando.', 'erro');
    }
});

// ===== TELA 3: ATENDENTE =====
document.getElementById('form-atendimento')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const descricao = document.getElementById('atend-descricao').value.trim();
    const categoria = document.getElementById('atend-categoria').value;
    const endereco = document.getElementById('atend-endereco').value.trim();

    if (!descricao || !categoria || !endereco) {
        mostrarNotificacao('Preencha todos os campos obrigatórios.', 'erro');
        return;
    }

    const data = {
        descricao: descricao,
        categoria: categoria,
        endereco: endereco,
        anonimo: false
    };

    try {
        const res = await fetch(`${API_BASE}/solicitacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.mensagem || `HTTP ${res.status}`);
        }
        const result = await res.json();
        mostrarNotificacao(`Solicitação registrada! Protocolo: ${result.protocolo}`, 'sucesso');
        e.target.reset();
    } catch (err) {
        mostrarNotificacao(`Erro: ${err.message}`, 'erro');
    }
});

// Buscar protocolo
async function buscarProtocolo() {
    const input = document.getElementById('busca-protocolo');
    if (!input) return;
    const protocolo = input.value.trim();
    if (!protocolo) {
        mostrarNotificacao('Digite um número de protocolo.', 'erro');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/solicitacoes/protocolo/${protocolo}`);
        if (!res.ok) throw new Error('Protocolo não encontrado');
        const sol = await res.json();
        exibirDetalhesSolicitacao(sol);
    } catch (err) {
        mostrarNotificacao(err.message, 'erro');
    }
}

function exibirDetalhesSolicitacao(sol) {
    const container = document.getElementById('resultado-busca');
    if (!container) return;
    container.innerHTML = `
        <div class="resultado-card">
            <div class="resultado-header">
                <span class="protocolo-badge">${sol.protocolo}</span>
                <span class="status-badge status-${sol.status.toLowerCase()}">${sol.statusDescricao}</span>
            </div>
            <p><strong>Categoria:</strong> ${sol.categoriaDescricao}</p>
            <p><strong>Descrição:</strong> ${sol.descricao}</p>
            <p><strong>Endereço:</strong> ${sol.endereco}</p>
            <p><strong>Data:</strong> ${formatarData(sol.dataCriacao)}</p>
            <p><strong>Solicitante:</strong> ${sol.nomeUsuario || 'Anônimo'}</p>
            ${sol.historico && sol.historico.length > 0 ? `
                <div class="historico-section">
                    <h4>Histórico</h4>
                    ${sol.historico.map(h => `
                        <div class="historico-item">
                            <span class="historico-status">${h.statusDescricao}</span>
                            <span class="historico-data">${formatarData(h.dataAlteracao)}</span>
                            <span class="historico-resp">${h.responsavel}</span>
                            ${h.comentario ? `<p class="historico-comentario">${h.comentario}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

// Carregar fila de atendimento
async function carregarFilaAtendimento() {
    const lista = document.getElementById('lista-fila');
    if (!lista) return;

    try {
        const res = await fetch(`${API_BASE}/solicitacoes`);
        if (!res.ok) throw new Error('Erro ao carregar solicitações');
        const solicitacoes = await res.json();
        if (solicitacoes.length === 0) {
            lista.innerHTML = '<p class="vazio">Nenhuma solicitação encontrada.</p>';
            return;
        }
        lista.innerHTML = solicitacoes.map(sol => `
            <div class="fila-item" onclick="exibirDetalhesSolicitacao(${JSON.stringify(sol).replace(/"/g, '&quot;')})">
                <div class="fila-item-header">
                    <span class="protocolo-badge">${sol.protocolo}</span>
                    <span class="status-badge status-${sol.status.toLowerCase()}">${sol.statusDescricao}</span>
                </div>
                <p class="fila-item-desc">${sol.descricao.substring(0, 80)}${sol.descricao.length > 80 ? '...' : ''}</p>
                <div class="fila-item-footer">
                    <span>${sol.categoriaDescricao}</span>
                    <span>${formatarData(sol.dataCriacao)}</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        lista.innerHTML = '<p class="vazio">Servidor indisponível.</p>';
    }
}

// Dicas rápidas - auto preencher
document.querySelectorAll('.dica-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const textarea = document.getElementById('atend-descricao');
        textarea.value = tag.textContent + ' - ';
        textarea.focus();
    });
});

// ===== TELA 4: DASHBOARD GESTORA =====
// Dados de demonstração para os jurados
const DEMO_DATA = {
    total: 1247,
    taxaResolucao: 89,
    tempoMedio: '3.2 dias',
    pendentes: 156,
    concluidas: 1091,
    porCategoria: {
        'Iluminação Pública': 374,
        'Buraco / Pavimentação': 249,
        'Coleta de Lixo': 249,
        'Esgoto': 187,
        'Outros': 188
    },
    regioes: [
        { nome: 'Centro', count: 342 },
        { nome: 'Zona Norte', count: 287 },
        { nome: 'Zona Sul', count: 234 },
        { nome: 'Zona Leste', count: 198 },
        { nome: 'Zona Oeste', count: 186 }
    ],
    evolucaoMensal: [45, 60, 55, 75, 65, 80, 70, 90, 85, 95, 78, 88]
};

async function carregarDashboardGestora() {
    let total, taxaResolucao, pendentes, porCategoria;
    try {
        const [resTodas, resConcluidas] = await Promise.all([
            fetch(`${API_BASE}/solicitacoes`),
            fetch(`${API_BASE}/solicitacoes?status=CONCLUIDA`)
        ]);
        const todas = await resTodas.json();
        const concluidas = await resConcluidas.json();

        if (todas.length > 5) {
            total = todas.length;
            pendentes = todas.filter(s => s.status !== 'CONCLUIDA' && s.status !== 'CANCELADA').length;
            taxaResolucao = total > 0 ? Math.round((concluidas.length / total) * 100) : 0;
            porCategoria = {};
            todas.forEach(s => {
                porCategoria[s.categoriaDescricao] = (porCategoria[s.categoriaDescricao] || 0) + 1;
            });
        } else {
            // Poucos dados reais — usar demo
            total = DEMO_DATA.total;
            taxaResolucao = DEMO_DATA.taxaResolucao;
            pendentes = DEMO_DATA.pendentes;
            porCategoria = DEMO_DATA.porCategoria;
        }
    } catch (err) {
        total = DEMO_DATA.total;
        taxaResolucao = DEMO_DATA.taxaResolucao;
        pendentes = DEMO_DATA.pendentes;
        porCategoria = DEMO_DATA.porCategoria;
    }
    renderDashboardGestora(total, taxaResolucao, pendentes, porCategoria);
}

function renderDashboardGestora(total, taxaResolucao, pendentes, porCategoria) {
    const container = document.getElementById('screen-gestora');

    const categorias = Object.entries(porCategoria).sort((a, b) => b[1] - a[1]);
    const cores = ['var(--accent-orange)', 'var(--accent-red)', 'var(--accent)', 'var(--accent-purple)', 'var(--accent-blue)'];
    const totalCat = categorias.reduce((sum, c) => sum + c[1], 0) || 1;

    const legendaHTML = categorias.slice(0, 5).map((cat, i) => {
        const pct = Math.round((cat[1] / totalCat) * 100);
        return `<div class="legend-item"><span class="legend-dot" style="background: ${cores[i]}"></span> ${cat[0]} (${pct}%)</div>`;
    }).join('');

    let gradientParts = [];
    let acumulado = 0;
    categorias.slice(0, 5).forEach((cat, i) => {
        const pct = (cat[1] / totalCat) * 100;
        gradientParts.push(`${cores[i]} ${acumulado}% ${acumulado + pct}%`);
        acumulado += pct;
    });
    const conicGradient = gradientParts.length > 0
        ? `conic-gradient(${gradientParts.join(', ')})`
        : 'conic-gradient(var(--accent) 0% 100%)';

    const barsHTML = DEMO_DATA.evolucaoMensal.map((v, i) => {
        const cor = i < 6 ? 'var(--accent)' : 'var(--accent-blue)';
        return `<div class="bar" style="height: ${v}%; background: ${cor};"></div>`;
    }).join('');

    const regioesHTML = DEMO_DATA.regioes.map((r, i) => `
        <li class="region-item">
            <span class="region-rank">${i + 1}</span>
            <span class="region-name">${r.nome}</span>
            <span class="region-count">${r.count}</span>
        </li>
    `).join('');

    container.innerHTML = `
        <div class="gestora-layout">
            <aside class="gestora-sidebar sidebar">
                <div class="sidebar-logo">
                    <i class="fas fa-eye"></i>
                    <span>Observ<span class="accent">Ação</span></span>
                </div>
                <nav class="sidebar-nav">
                    <a href="#" class="nav-item active" onclick="navGestora('gestora-dashboard', this)"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                    <a href="#" class="nav-item" onclick="navGestora('gestora-relatorios', this)"><i class="fas fa-chart-bar"></i> Relatórios</a>
                    <a href="#" class="nav-item" onclick="navGestora('gestora-mapa', this)"><i class="fas fa-map-marked-alt"></i> Mapa</a>
                    <a href="#" class="nav-item" onclick="navGestora('gestora-equipes', this)"><i class="fas fa-users"></i> Equipes</a>
                    <a href="#" class="nav-item" onclick="navGestora('gestora-config', this)"><i class="fas fa-cog"></i> Configurações</a>
                </nav>
            </aside>
            <main class="gestora-content">
                <div id="gestora-dashboard" class="gestora-secao">
                <div class="painel-header">
                    <h2><i class="fas fa-tachometer-alt"></i> Dashboard Geral</h2>
                    <div class="dashboard-filters">
                        <span class="filter-label">Período:</span>
                        <select class="filter-select">
                            <option>Últimos 30 dias</option>
                            <option>Últimos 7 dias</option>
                            <option>Hoje</option>
                        </select>
                    </div>
                </div>
                <div class="dashboard-indicators">
                    <div class="indicator-card green">
                        <div class="indicator-value">${total.toLocaleString('pt-BR')}</div>
                        <div class="indicator-label">Total de Solicitações</div>
                        <div class="indicator-change up"><i class="fas fa-arrow-up"></i> 12% vs mês anterior</div>
                    </div>
                    <div class="indicator-card blue">
                        <div class="indicator-value">${taxaResolucao}%</div>
                        <div class="indicator-label">Taxa de Resolução</div>
                        <div class="indicator-change up"><i class="fas fa-arrow-up"></i> 5% vs mês anterior</div>
                    </div>
                    <div class="indicator-card orange">
                        <div class="indicator-value">${DEMO_DATA.tempoMedio}</div>
                        <div class="indicator-label">Tempo Médio Resolução</div>
                        <div class="indicator-change up"><i class="fas fa-arrow-down"></i> 0.5 dias melhor</div>
                    </div>
                    <div class="indicator-card purple">
                        <div class="indicator-value">${pendentes}</div>
                        <div class="indicator-label">Pendentes</div>
                        <div class="indicator-change up"><i class="fas fa-arrow-down"></i> 8% vs mês anterior</div>
                    </div>
                </div>
                <div class="dashboard-charts">
                    <div class="chart-card">
                        <h3>Solicitações por Categoria</h3>
                        <div class="chart-placeholder" style="flex-direction: row; gap: 20px;">
                            <div class="donut-chart" style="background: ${conicGradient}"></div>
                            <div class="chart-legend">${legendaHTML}</div>
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3>Evolução Mensal</h3>
                        <div class="chart-placeholder">
                            <div class="bar-chart">${barsHTML}</div>
                        </div>
                    </div>
                </div>
                <div class="dashboard-bottom">
                    <div class="chart-card">
                        <h3>Top 5 Regiões com Mais Demandas</h3>
                        <ul class="region-list">${regioesHTML}</ul>
                    </div>
                    <div class="chart-card">
                        <h3>Mapa de Calor</h3>
                        <div class="heatmap-placeholder">
                            <i class="fas fa-map" style="font-size: 48px; opacity: 0.3;"></i>
                        </div>
                        <div class="tempo-medio">
                            <i class="fas fa-clock"></i>
                            <div>
                                <div class="tempo-value">${DEMO_DATA.tempoMedio}</div>
                                <div class="tempo-label">Tempo médio de resolução</div>
                            </div>
                        </div>
                    </div>
                </div>
                </div><!-- fim gestora-dashboard -->

                <div id="gestora-relatorios" class="gestora-secao" style="display:none;">
                    <div class="painel-header"><h2><i class="fas fa-chart-bar"></i> Relatórios</h2></div>
                    <div class="admin-grid">
                        <div class="chart-card">
                            <h3>Relatório Mensal - Junho 2025</h3>
                            <div class="service-item"><span class="service-name">Solicitações abertas</span><span class="service-status ok">187</span></div>
                            <div class="service-item"><span class="service-name">Solicitações resolvidas</span><span class="service-status ok">164</span></div>
                            <div class="service-item"><span class="service-name">Taxa de resolução</span><span class="service-status ok">87.7%</span></div>
                            <div class="service-item"><span class="service-name">Tempo médio</span><span class="service-status ok">2.8 dias</span></div>
                        </div>
                        <div class="chart-card">
                            <h3>Comparativo Trimestral</h3>
                            <div class="service-item"><span class="service-name">Abril</span><span class="service-status ok">412 solicitações</span></div>
                            <div class="service-item"><span class="service-name">Maio</span><span class="service-status ok">398 solicitações</span></div>
                            <div class="service-item"><span class="service-name">Junho</span><span class="service-status online">437 solicitações</span></div>
                        </div>
                    </div>
                </div>

                <div id="gestora-mapa" class="gestora-secao" style="display:none;">
                    <div class="painel-header"><h2><i class="fas fa-map-marked-alt"></i> Mapa de Ocorrências</h2></div>
                    <div class="chart-card" style="min-height: 400px; display:flex; align-items:center; justify-content:center;">
                        <div style="text-align:center; color: var(--text-muted);">
                            <i class="fas fa-map-marked-alt" style="font-size: 64px; opacity: 0.3; margin-bottom: 16px;"></i>
                            <p>Mapa interativo com geolocalização das solicitações</p>
                            <p style="font-size:12px; margin-top:8px;">Integração com Google Maps / OpenStreetMap</p>
                        </div>
                    </div>
                </div>

                <div id="gestora-equipes" class="gestora-secao" style="display:none;">
                    <div class="painel-header"><h2><i class="fas fa-users"></i> Equipes</h2></div>
                    <div class="admin-grid">
                        <div class="admin-panel">
                            <h3><i class="fas fa-hard-hat"></i> Equipe de Infraestrutura</h3>
                            <div class="service-item"><span class="service-name">João Pereira (Líder)</span><span class="service-status online">Ativo</span></div>
                            <div class="service-item"><span class="service-name">Ricardo Santos</span><span class="service-status online">Ativo</span></div>
                            <div class="service-item"><span class="service-name">Fernando Lima</span><span class="service-status online">Ativo</span></div>
                            <div class="service-item"><span class="service-name">Tarefas em aberto</span><span class="service-status ok">23</span></div>
                        </div>
                        <div class="admin-panel">
                            <h3><i class="fas fa-lightbulb"></i> Equipe de Iluminação</h3>
                            <div class="service-item"><span class="service-name">Marcos Oliveira (Líder)</span><span class="service-status online">Ativo</span></div>
                            <div class="service-item"><span class="service-name">Paulo Mendes</span><span class="service-status online">Ativo</span></div>
                            <div class="service-item"><span class="service-name">Carlos Neto</span><span class="service-status offline">Férias</span></div>
                            <div class="service-item"><span class="service-name">Tarefas em aberto</span><span class="service-status ok">18</span></div>
                        </div>
                    </div>
                </div>

                <div id="gestora-config" class="gestora-secao" style="display:none;">
                    <div class="painel-header"><h2><i class="fas fa-cog"></i> Configurações</h2></div>
                    <div class="admin-panel">
                        <h3><i class="fas fa-sliders-h"></i> Preferências do Dashboard</h3>
                        <div class="service-item"><span class="service-name">Atualização automática</span><span class="service-status ok">A cada 5 min</span></div>
                        <div class="service-item"><span class="service-name">Notificações por e-mail</span><span class="service-status online">Ativado</span></div>
                        <div class="service-item"><span class="service-name">Alertas de SLA</span><span class="service-status online">Ativado</span></div>
                        <div class="service-item"><span class="service-name">Exportar relatórios</span><span class="service-status ok">PDF / Excel</span></div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
async function carregarPainelAdmin() {
    let totalSolicitacoes = DEMO_DATA.total;
    let totalUsuarios = 384;
    try {
        const [resSolicitacoes, resUsuarios] = await Promise.all([
            fetch(`${API_BASE}/solicitacoes`),
            fetch(`${API_BASE}/usuarios`)
        ]);
        const solicitacoes = await resSolicitacoes.json();
        const usuarios = await resUsuarios.json();
        if (solicitacoes.length > 5) totalSolicitacoes = solicitacoes.length;
        if (usuarios.length > 3) totalUsuarios = usuarios.length;
    } catch (err) {
        // Usar dados demo
    }
    renderPainelAdmin(totalSolicitacoes, totalUsuarios);
}

function renderPainelAdmin(totalSolicitacoes, totalUsuarios) {
    const container = document.getElementById('screen-admin');
    container.innerHTML = `
        <div class="admin-layout">
            <aside class="admin-sidebar sidebar">
                <div class="sidebar-logo">
                    <i class="fas fa-eye"></i>
                    <span>Observ<span class="accent">Ação</span></span>
                </div>
                <nav class="sidebar-nav">
                    <a href="#" class="nav-item active" onclick="navAdmin('admin-monitoramento', this)"><i class="fas fa-server"></i> Monitoramento</a>
                    <a href="#" class="nav-item" onclick="navAdmin('admin-banco', this)"><i class="fas fa-database"></i> Banco de Dados</a>
                    <a href="#" class="nav-item" onclick="navAdmin('admin-seguranca', this)"><i class="fas fa-shield-alt"></i> Segurança</a>
                    <a href="#" class="nav-item" onclick="navAdmin('admin-usuarios', this)"><i class="fas fa-users-cog"></i> Usuários</a>
                    <a href="#" class="nav-item" onclick="navAdmin('admin-config', this)"><i class="fas fa-cogs"></i> Configurações</a>
                    <a href="#" class="nav-item" onclick="navAdmin('admin-logs', this)"><i class="fas fa-file-code"></i> Logs</a>
                </nav>
            </aside>
            <main class="admin-content">
                <div id="admin-monitoramento" class="admin-secao">
                <div class="admin-header">
                    <h2><i class="fas fa-server"></i> Monitoramento do Sistema</h2>
                    <div class="status-online">Sistema Online</div>
                </div>
                <div class="system-cards">
                    <div class="system-card">
                        <div class="system-card-icon green"><i class="fas fa-check-circle"></i></div>
                        <div class="system-card-value">5/5</div>
                        <div class="system-card-label">Serviços Ativos</div>
                        <div class="system-card-status ok">Todos operacionais</div>
                    </div>
                    <div class="system-card">
                        <div class="system-card-icon blue"><i class="fas fa-microchip"></i></div>
                        <div class="system-card-value">23%</div>
                        <div class="system-card-label">Uso de CPU</div>
                        <div class="progress-bar"><div class="progress-fill green" style="width: 23%"></div></div>
                    </div>
                    <div class="system-card">
                        <div class="system-card-icon orange"><i class="fas fa-memory"></i></div>
                        <div class="system-card-value">67%</div>
                        <div class="system-card-label">Memória RAM</div>
                        <div class="progress-bar"><div class="progress-fill orange" style="width: 67%"></div></div>
                    </div>
                    <div class="system-card">
                        <div class="system-card-icon purple"><i class="fas fa-hdd"></i></div>
                        <div class="system-card-value">45%</div>
                        <div class="system-card-label">Armazenamento</div>
                        <div class="progress-bar"><div class="progress-fill green" style="width: 45%"></div></div>
                    </div>
                </div>
                <div class="admin-grid">
                    <div class="admin-panel">
                        <h3><i class="fas fa-terminal"></i> Logs Recentes</h3>
                        <div class="log-entry">
                            <span class="log-time">10:42:15</span>
                            <span class="log-msg success">[INFO] Backup automático concluído com sucesso</span>
                        </div>
                        <div class="log-entry">
                            <span class="log-time">10:38:02</span>
                            <span class="log-msg">[INFO] Nova solicitação #${totalSolicitacoes} criada via API</span>
                        </div>
                        <div class="log-entry">
                            <span class="log-time">10:35:41</span>
                            <span class="log-msg warning">[WARN] Tentativa de login inválida - IP 192.168.1.45</span>
                        </div>
                        <div class="log-entry">
                            <span class="log-time">10:30:18</span>
                            <span class="log-msg success">[INFO] Serviço de e-mail reconectado</span>
                        </div>
                        <div class="log-entry">
                            <span class="log-time">10:25:03</span>
                            <span class="log-msg error">[ERROR] Timeout conexão SMTP - retry 3/3</span>
                        </div>
                        <div class="log-entry">
                            <span class="log-time">10:20:55</span>
                            <span class="log-msg">[INFO] Cache limpo - 234MB liberados</span>
                        </div>
                    </div>
                    <div class="admin-panel">
                        <h3><i class="fas fa-network-wired"></i> Serviços</h3>
                        <div class="service-item">
                            <span class="service-name">API Backend (Spring Boot 3.4.1)</span>
                            <span class="service-status online">Online</span>
                        </div>
                        <div class="service-item">
                            <span class="service-name">Banco de Dados (H2)</span>
                            <span class="service-status online">Online</span>
                        </div>
                        <div class="service-item">
                            <span class="service-name">Servidor de E-mail</span>
                            <span class="service-status online">Online</span>
                        </div>
                        <div class="service-item">
                            <span class="service-name">Serviço de Notificações</span>
                            <span class="service-status online">Online</span>
                        </div>
                        <div class="service-item">
                            <span class="service-name">CDN / Arquivos Estáticos</span>
                            <span class="service-status online">Online</span>
                        </div>
                    </div>
                </div>
                <div class="admin-grid">
                    <div class="admin-panel">
                        <h3><i class="fas fa-shield-alt"></i> Alertas de Segurança</h3>
                        <div class="alert-item warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>3 tentativas de login falhas nas últimas 2h</span>
                        </div>
                        <div class="alert-item info">
                            <i class="fas fa-info-circle"></i>
                            <span>Certificado SSL renova em 15 dias</span>
                        </div>
                        <div class="alert-item danger">
                            <i class="fas fa-ban"></i>
                            <span>IP 45.33.22.11 bloqueado (brute force)</span>
                        </div>
                    </div>
                    <div class="admin-panel">
                        <h3><i class="fas fa-database"></i> Banco de Dados</h3>
                        <div class="service-item">
                            <span class="service-name">Solicitações</span>
                            <span class="service-status ok">${totalSolicitacoes.toLocaleString('pt-BR')} registros</span>
                        </div>
                        <div class="service-item">
                            <span class="service-name">Usuários</span>
                            <span class="service-status ok">${totalUsuarios} registros</span>
                        </div>
                        <div class="service-item">
                            <span class="service-name">Último Backup</span>
                            <span class="service-status ok">Hoje 06:00</span>
                        </div>
                        <div class="service-item">
                            <span class="service-name">Tamanho do BD</span>
                            <span class="service-status ok">2.3 GB</span>
                        </div>
                        <div class="service-item">
                            <span class="service-name">Uptime</span>
                            <span class="service-status ok">99.97%</span>
                        </div>
                    </div>
                </div>
                </div><!-- fim admin-monitoramento -->

                <div id="admin-banco" class="admin-secao" style="display:none;">
                    <div class="admin-header"><h2><i class="fas fa-database"></i> Banco de Dados</h2></div>
                    <div class="admin-grid">
                        <div class="admin-panel">
                            <h3><i class="fas fa-table"></i> Tabelas</h3>
                            <div class="service-item"><span class="service-name">solicitacoes</span><span class="service-status ok">${totalSolicitacoes.toLocaleString('pt-BR')} registros</span></div>
                            <div class="service-item"><span class="service-name">usuarios</span><span class="service-status ok">${totalUsuarios} registros</span></div>
                            <div class="service-item"><span class="service-name">historico_status</span><span class="service-status ok">2.841 registros</span></div>
                        </div>
                        <div class="admin-panel">
                            <h3><i class="fas fa-cloud-download-alt"></i> Backup</h3>
                            <div class="service-item"><span class="service-name">Último backup completo</span><span class="service-status ok">Hoje 06:00</span></div>
                            <div class="service-item"><span class="service-name">Tamanho</span><span class="service-status ok">2.3 GB</span></div>
                            <div class="service-item"><span class="service-name">Backup diário</span><span class="service-status online">Ativo</span></div>
                            <div class="service-item"><span class="service-name">Retenção</span><span class="service-status ok">30 dias</span></div>
                        </div>
                    </div>
                </div>

                <div id="admin-seguranca" class="admin-secao" style="display:none;">
                    <div class="admin-header"><h2><i class="fas fa-shield-alt"></i> Segurança</h2></div>
                    <div class="admin-panel">
                        <h3><i class="fas fa-exclamation-triangle"></i> Alertas Recentes</h3>
                        <div class="alert-item warning"><i class="fas fa-exclamation-triangle"></i><span>3 tentativas de login falhas nas últimas 2h</span></div>
                        <div class="alert-item info"><i class="fas fa-info-circle"></i><span>Certificado SSL renova em 15 dias</span></div>
                        <div class="alert-item danger"><i class="fas fa-ban"></i><span>IP 45.33.22.11 bloqueado (brute force)</span></div>
                        <div class="alert-item info"><i class="fas fa-lock"></i><span>Criptografia AES-256 ativa em todos os endpoints</span></div>
                    </div>
                </div>

                <div id="admin-usuarios" class="admin-secao" style="display:none;">
                    <div class="admin-header"><h2><i class="fas fa-users-cog"></i> Usuários do Sistema</h2></div>
                    <div class="admin-grid">
                        <div class="admin-panel">
                            <h3><i class="fas fa-user-tie"></i> Servidores</h3>
                            <div class="service-item"><span class="service-name">Carlos Andrade</span><span class="service-status online">Ativo</span></div>
                            <div class="service-item"><span class="service-name">Maria Silva</span><span class="service-status online">Ativo</span></div>
                            <div class="service-item"><span class="service-name">Ana Gestora</span><span class="service-status online">Ativo</span></div>
                        </div>
                        <div class="admin-panel">
                            <h3><i class="fas fa-users"></i> Cidadãos Recentes</h3>
                            <div class="service-item"><span class="service-name">João Miguel</span><span class="service-status ok">Cidadão</span></div>
                            <div class="service-item"><span class="service-name">Maria Clara</span><span class="service-status ok">Cidadão</span></div>
                            <div class="service-item"><span class="service-name">Total cadastrados</span><span class="service-status ok">${totalUsuarios}</span></div>
                        </div>
                    </div>
                </div>

                <div id="admin-config" class="admin-secao" style="display:none;">
                    <div class="admin-header"><h2><i class="fas fa-cogs"></i> Configurações</h2></div>
                    <div class="admin-panel">
                        <h3><i class="fas fa-sliders-h"></i> Ambiente</h3>
                        <div class="service-item"><span class="service-name">Framework</span><span class="service-status ok">Spring Boot 3.4.1</span></div>
                        <div class="service-item"><span class="service-name">Java</span><span class="service-status ok">24</span></div>
                        <div class="service-item"><span class="service-name">Banco</span><span class="service-status ok">H2 (in-memory)</span></div>
                        <div class="service-item"><span class="service-name">CORS</span><span class="service-status ok">Permitido (*)</span></div>
                        <div class="service-item"><span class="service-name">H2 Console</span><span class="service-status ok">/h2-console</span></div>
                        <div class="service-item"><span class="service-name">Porta</span><span class="service-status ok">8080</span></div>
                    </div>
                </div>

                <div id="admin-logs" class="admin-secao" style="display:none;">
                    <div class="admin-header"><h2><i class="fas fa-file-code"></i> Logs Completos</h2></div>
                    <div class="admin-panel">
                        <h3><i class="fas fa-terminal"></i> Últimas 24h</h3>
                        <div class="log-entry"><span class="log-time">10:42:15</span><span class="log-msg success">[INFO] Backup automático concluído</span></div>
                        <div class="log-entry"><span class="log-time">10:38:02</span><span class="log-msg">[INFO] Nova solicitação criada via API</span></div>
                        <div class="log-entry"><span class="log-time">10:35:41</span><span class="log-msg warning">[WARN] Tentativa login inválida - IP 192.168.1.45</span></div>
                        <div class="log-entry"><span class="log-time">10:30:18</span><span class="log-msg success">[INFO] Serviço de e-mail reconectado</span></div>
                        <div class="log-entry"><span class="log-time">10:25:03</span><span class="log-msg error">[ERROR] Timeout SMTP - retry 3/3</span></div>
                        <div class="log-entry"><span class="log-time">10:20:55</span><span class="log-msg">[INFO] Cache limpo - 234MB liberados</span></div>
                        <div class="log-entry"><span class="log-time">09:15:30</span><span class="log-msg success">[INFO] Deploy v2.4.1 concluído</span></div>
                        <div class="log-entry"><span class="log-time">08:00:00</span><span class="log-msg success">[INFO] Sistema iniciado - porta 8080</span></div>
                    </div>
                </div>
            </main>
        </div>
    `;
}
function formatarData(dataStr) {
    if (!dataStr) return '-';
    const d = new Date(dataStr);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function mostrarNotificacao(mensagem, tipo) {
    // Remove notificação anterior se existir
    const existente = document.querySelector('.notificacao');
    if (existente) existente.remove();

    const div = document.createElement('div');
    div.className = `notificacao notificacao-${tipo}`;
    div.innerHTML = `
        <i class="fas ${tipo === 'sucesso' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${mensagem}</span>
    `;
    document.body.appendChild(div);

    setTimeout(() => div.classList.add('visivel'), 10);
    setTimeout(() => {
        div.classList.remove('visivel');
        setTimeout(() => div.remove(), 300);
    }, 4000);
}

// ===== ACESSIBILIDADE - FONTE =====
let tamanhoFonte = 16;
document.querySelectorAll('.btn-fonte').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('btn-fonte-grande')) {
            tamanhoFonte = Math.min(tamanhoFonte + 2, 24);
        } else {
            tamanhoFonte = Math.max(tamanhoFonte - 2, 12);
        }
        document.documentElement.style.fontSize = tamanhoFonte + 'px';
    });
});

// Botão de acessibilidade no header
document.querySelector('.access-link')?.addEventListener('click', () => {
    const rodape = document.querySelector('.cidadao-rodape .rodape-direita');
    if (rodape) {
        rodape.scrollIntoView({ behavior: 'smooth' });
        rodape.style.outline = '2px solid var(--accent)';
        setTimeout(() => rodape.style.outline = '', 2000);
    }
});

// ===== NAVEGAÇÃO SIDEBAR GESTORA =====
function navGestora(secaoId, linkClicado) {
    document.querySelectorAll('#screen-gestora .gestora-secao').forEach(s => s.style.display = 'none');
    const secao = document.getElementById(secaoId);
    if (secao) secao.style.display = 'block';
    if (linkClicado) {
        const nav = linkClicado.closest('.sidebar-nav');
        if (nav) {
            nav.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            linkClicado.classList.add('active');
        }
    }
}

// ===== NAVEGAÇÃO SIDEBAR ADMIN =====
function navAdmin(secaoId, linkClicado) {
    document.querySelectorAll('#screen-admin .admin-secao').forEach(s => s.style.display = 'none');
    const secao = document.getElementById(secaoId);
    if (secao) secao.style.display = 'block';
    if (linkClicado) {
        const nav = linkClicado.closest('.sidebar-nav');
        if (nav) {
            nav.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            linkClicado.classList.add('active');
        }
    }
}

// ===== NAVEGAÇÃO SIDEBAR ATENDENTE =====
function mostrarSecaoAtendente(secaoId, linkClicado) {
    // Esconder todas as seções
    document.getElementById('novo-atendimento-section').style.display = 'none';
    document.getElementById('busca-section').style.display = 'none';
    document.getElementById('fila-section').style.display = 'none';
    // Mostrar a seção desejada
    document.getElementById(secaoId).style.display = 'block';
    // Atualizar nav ativa
    if (linkClicado) {
        const sidebar = linkClicado.closest('.sidebar-nav');
        if (sidebar) {
            sidebar.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            linkClicado.classList.add('active');
        }
    }
}

// Botão cancelar no form atendente
document.querySelector('#form-atendimento .btn-secondary')?.addEventListener('click', () => {
    document.getElementById('form-atendimento').reset();
    mostrarNotificacao('Formulário limpo.', 'sucesso');
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    renderDashboardGestora(DEMO_DATA.total, DEMO_DATA.taxaResolucao, DEMO_DATA.pendentes, DEMO_DATA.porCategoria);
    renderPainelAdmin(DEMO_DATA.total, 384);

    // Configura menu e abas com o usuário da sessão
    if (usuarioLogado) {
        document.getElementById('profile-nav').style.display = 'flex';
        configurarTabs(usuarioLogado.tipo);
    }
});
