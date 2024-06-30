
async function fetchProducts(query) {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await response.json();
  return data.results;
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'col-md-4';
  card.innerHTML = `
    <div class="product-card" onclick="location.href='product.html?id=${product.id}'">
      <div class="icons" onclick="event.stopPropagation(); toggleLike(this)">
        <i class="bi bi-heart"></i>
      </div>
      <img class="card-img-top" src="${product.thumbnail.replace('I.jpg', 'B.jpg')}" alt="${product.title}">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <div class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
        <div class="installments">${product.installments ? `até ${product.installments.quantity}x de R$ ${product.installments.amount.toFixed(2).replace('.', ',')} com juros` : ''}</div>
        <div class="free-shipping">${product.shipping.free_shipping ? 'Frete Grátis' : ''}</div>
      </div>
    </div>
  `;
  return card;
}

document.getElementById('searchButton').addEventListener('click', async function () {
  const query = document.getElementById('searchInput').value;
  const products = await fetchProducts(query);
  const productContainer = document.getElementById('productContainer');
  productContainer.innerHTML = '';
  products.forEach(product => {
    const card = createProductCard(product);
    productContainer.appendChild(card);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // JSON de exemplo com dados dos usuários
  var dadosRecuperados = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
    var usuario = JSON.stringify(dadosRecuperados);
    console.log("Usuário logado:",usuario);
    const user = document.getElementById('usuariologado');
    user.textContent = JSON.stringify(dadosRecuperados.nome);
});
     

