function updateFatiasAndPrice(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];

  const price = selectedOption.getAttribute('data-price');
  const fatias = selectedOption.getAttribute('data-fatias');

  // Atualiza o preço
  const priceElement = document.getElementById('price-portuguesabacon');
  priceElement.textContent = `R$ ${parseFloat(price).toFixed(2)}`;

  // Atualiza o número de fatias
  const fatiasElement = document.getElementById('fatias-2sabores');
  fatiasElement.textContent = fatias;
}

