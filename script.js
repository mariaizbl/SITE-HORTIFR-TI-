// CARRINHO 

// para armazenar os itens do carrinho
let carrinho = [];
let totalGeral = 0;
// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(nome, preco) {
  const precoNumerico = parseFloat(preco);
  
  // Verificar se o item já existe no carrinho
  const itemExistente = carrinho.find(item => item.nome === nome);
  
  if (itemExistente) {
    // Se existe, aumentar a quantidade
    itemExistente.quantidade += 1;
    itemExistente.subtotal = itemExistente.quantidade * itemExistente.preco;
  } else {
    // Se não existe, adicionar novo item
    carrinho.push({
      nome: nome,
      preco: precoNumerico,
      quantidade: 1,
      subtotal: precoNumerico
    });
  }
  
  atualizarCarrinho();
  atualizarContador();
  
}
// Função para remover item do carrinho
function removerItem(nome) {
  carrinho = carrinho.filter(item => item.nome !== nome);
  atualizarCarrinho();
  atualizarContador();
}

// Função para alterar quantidade
function alterarQuantidade(nome, novaQuantidade) {
  const item = carrinho.find(item => item.nome === nome);
  if (item) {
    if (novaQuantidade <= 0) {
      removerItem(nome);
    } else {
      item.quantidade = parseInt(novaQuantidade);
      item.subtotal = item.quantidade * item.preco;
      atualizarCarrinho();
      atualizarContador();
    }
  }
}

// Função para atualizar o contador do carrinho
function atualizarContador() {
  const contador = document.getElementById("cart-counter");
  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
  contador.textContent = totalItens;
}

// Função para atualizar a exibição do carrinho
function atualizarCarrinho() {
  const itensCarrinho = document.getElementById('itens-carrinho');
  const totalCarrinho = document.getElementById('total-carrinho');
  
  // Limpar conteúdo atual
  itensCarrinho.innerHTML = '';
  
  if (carrinho.length === 0) {
    itensCarrinho.innerHTML = '<p class="carrinho-vazio">Carrinho vazio</p>';
    totalGeral = 0;
  } else {
    totalGeral = 0;
    
    carrinho.forEach(item => {
      totalGeral += item.subtotal;
      
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item-carrinho';
      itemDiv.innerHTML = `
        <div class="item-info">
          <strong>${item.nome}</strong>
          <p>R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
        </div>
        <div class="item-controles">
          <button onclick="alterarQuantidade('${item.nome}', ${item.quantidade - 1})" class="btn-quantidade">-</button>
          <span class="quantidade">${item.quantidade}</span>
          <button onclick="alterarQuantidade('${item.nome}', ${item.quantidade + 1})" class="btn-quantidade">+</button>
          <button onclick="removerItem('${item.nome}')" class="remover-item">🗑️</button>
        </div>
        <div class="item-subtotal">
          R$ ${item.subtotal.toFixed(2).replace('.', ',')}
        </div>
      `;
      itensCarrinho.appendChild(itemDiv);
    });
  }
  
  // Atualizar total
  totalCarrinho.textContent = totalGeral.toFixed(2).replace('.', ',');
}

// Função para finalizar compra
function finalizarCompra(event) {
  event.preventDefault();
  
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  
  // Obter dados do formulário
  const form = document.getElementById('form-compra');
  const formData = new FormData(form);
  
  const nome = formData.get('nome');
  const email = formData.get('email');
  const telefone = formData.get('telefone');
  const endereco = formData.get('endereco');
  const numero = formData.get('numero');
  const complemento = formData.get('complemento');
  const bairro = formData.get('bairro');
  const cidade = formData.get('cidade');
  const cep = formData.get('cep');
  
  // Validar campos obrigatórios
  if (!nome || !email || !telefone || !endereco || !numero || !bairro || !cidade || !cep) {
    alert('Por favor, preencha todos os campos obrigatórios!');
    return;
  }
  

  // Mostrar alerta de confirmação
  setTimeout(() => {
    alert('✅ Pedido enviado via WhatsApp!\n\nSeu pedido foi enviado com sucesso. Aguarde a confirmação no WhatsApp.');
    
    // Limpar carrinho e formulário
    carrinho = [];
    atualizarCarrinho();
    atualizarContador();
    form.reset();
    fecharFormCarrinho();
  }, 1000);
}

// Função para rolar até os produtos
function scrollToProducts() {
  document.getElementById("produtos").scrollIntoView({ behavior: "smooth" });
}

// FILTRO 

let categoriaAtual = 'todos';

function filtrarPorCategoria(categoria) {
  categoriaAtual = categoria;
  const produtos = document.querySelectorAll('#produtos-grid .produto');
  const noResults = document.getElementById('no-results');
  const searchInput = document.getElementById('search-input');
  let hasResults = false;

  // Limpar busca ao filtrar por categoria
  searchInput.value = '';

  // Atualizar botões 
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-categoria="${categoria}"]`).classList.add('active');

  produtos.forEach(produto => {
    const produtoCategoria = produto.getAttribute('data-categoria');
    
    if (categoria === 'todos' || produtoCategoria === categoria) {
      produto.style.display = 'block';
      hasResults = true;
    } else {
      produto.style.display = 'none';
    }
  });

  // Mostrar mensagem se não houver resultados
  if (!hasResults) {
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
  }
}

// ============================================
// FUNCIONALIDADE DE PESQUISA
// ============================================

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const produtosGrid = document.getElementById('produtos-grid');
const noResults = document.getElementById('no-results');

// Função de pesquisa
function pesquisarProdutos() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const produtos = produtosGrid.querySelectorAll('.produto');
  let hasResults = false;

  produtos.forEach(produto => {
    const productName = produto.getAttribute('data-name') || 
                       produto.querySelector('h3').textContent.toLowerCase();
    const produtoCategoria = produto.getAttribute('data-categoria');
    
    // Filtrar por categoria E por termo de busca
    const matchCategoria = categoriaAtual === 'todos' || produtoCategoria === categoriaAtual;
    const matchBusca = productName.includes(searchTerm) || searchTerm === '';
    
    if (matchCategoria && matchBusca) {
      produto.style.display = 'block';
      hasResults = true;
    } else {
      produto.style.display = 'none';
    }
  });

  // Mostrar mensagem se não houver resultados
  if (!hasResults && searchTerm !== '') {
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
  }

  // Scroll suave para a seção de produtos
  if (searchTerm !== '') {
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
  }
}

// Event listeners para pesquisa
if (searchBtn) {
  searchBtn.addEventListener('click', pesquisarProdutos);
}

if (searchInput) {
  searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      pesquisarProdutos();
    }
  });

  // Pesquisa em tempo real (opcional)
  searchInput.addEventListener('input', function() {
    pesquisarProdutos();
  });
}

// ============================================
// MODAL E FORMULÁRIOS
// ============================================

const btnConta = document.getElementById('btn-conta');
const modalConta = document.getElementById('modal-conta');
const cartIcon = document.querySelector('.cart-icon');
const formCarrinho = document.getElementById('form-carrinho');

// Abrir modal de conta
if (btnConta) {
  btnConta.addEventListener('click', function(e) {
    e.preventDefault();
    modalConta.style.display = 'flex';
  });
}

// Abrir carrinho
if (cartIcon) {
  cartIcon.addEventListener('click', function() {
    formCarrinho.style.display = 'flex';
    atualizarCarrinho(); // Atualizar carrinho ao abrir
  });
}

// Fechar modal
function fecharModal() {
  if (modalConta) {
    modalConta.style.display = 'none';
  }
}

// Fechar form carrinho
function fecharFormCarrinho() {
  if (formCarrinho) {
    formCarrinho.style.display = 'none';
  }
}

// Mostrar tela de cadastro
function mostrarCadastro() {
  document.getElementById('tela-login').style.display = 'none';
  document.getElementById('tela-cadastro').style.display = 'block';
}

// Mostrar tela de login
function mostrarLogin() {
  document.getElementById('tela-cadastro').style.display = 'none';
  document.getElementById('tela-login').style.display = 'block';
}

// Fechar modais ao clicar fora
window.addEventListener('click', function(event) {
  if (event.target === modalConta) {
    fecharModal();
  }
  if (event.target === formCarrinho) {
    fecharFormCarrinho();
  }
});

// Acessibilidade - Enter no ícone do carrinho
if (cartIcon) {
  cartIcon.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      formCarrinho.style.display = 'flex';
      atualizarCarrinho();
    }
  });
}

// Event listener para o formulário de compra
document.addEventListener('DOMContentLoaded', function() {
  const formCompra = document.getElementById('form-compra');
  if (formCompra) {
    formCompra.addEventListener('submit', finalizarCompra);
  }
  
  // Inicializar carrinho
  atualizarCarrinho();
  atualizarContador();
});
function filtrarPorCategoria(categoria) {
  categoriaAtual = categoria;
  const produtos = document.querySelectorAll('#produtos-grid .produto');
  const noResults = document.getElementById('no-results');
  let hasResults = false;

  searchInput.value = '';

  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-categoria="${categoria}"]`).classList.add('active');

  const container = document.getElementById('produtos-grid');
  let visiveis = [];

  produtos.forEach(produto => {
    const produtoCategoria = produto.getAttribute('data-categoria');
    
    if (categoria === 'todos' || produtoCategoria === categoria) {
      produto.style.display = 'block';
      visiveis.push(produto);
      hasResults = true;
    } else {
      produto.style.display = 'none';
    }
  });

  // === ORDENA APENAS QUANDO FOR "TODOS" ===
  if (categoria === 'todos') {
    visiveis.sort((a, b) => {
      const nomeA = a.querySelector('h3').textContent.trim().toLowerCase();
      const nomeB = b.querySelector('h3').textContent.trim().toLowerCase();
      return nomeA.localeCompare(nomeB);
    });

    container.innerHTML = '';
    visiveis.forEach(p => container.appendChild(p));
  }
  // ========================================

  noResults.style.display = hasResults ? 'none' : 'block';
}