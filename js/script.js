const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const namewarn = document.getElementById("name-warn");
const phonewarn = document.getElementById("phone-warn");

let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const sizeSelectId = parentButton.getAttribute("data-size-id");
    const sizeSelect = document.getElementById(sizeSelectId);
    const fatiasId = parentButton.getAttribute("data-fatias-id");
    const fatiasElement = fatiasId ? document.getElementById(fatiasId) : null;
    const fatias = fatiasElement ? fatiasElement.textContent.trim() : "";

    if (sizeSelect) {
      const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
      const price = parseFloat(selectedOption.getAttribute("data-price"));
      const size = selectedOption.value;

      // Pegando o ID de sabores da pizza clicada
      const saboresContainerId = parentButton.getAttribute("data-sabores-id");
      let sabores = [];

      if (saboresContainerId) {
        const container = document.getElementById(saboresContainerId);
        if (container) {
          sabores = Array.from(container.children).map((span) =>
            span.textContent.trim().replace("x", "").trim()
          );

          // Limpa o array de sabores da pizza
          const pizzaId = parentButton.getAttribute("data-pizza-id");
          if (pizzaId) {
            saboresSelecionados[pizzaId] = [];
            limparSabores(pizzaId);  // Limpando os sabores na UI e no array
          }
        }
      }

      // Adiciona ao carrinho
      addToCart(name, price, size, sabores, fatias);

      // Feedback ao usuário
      Toastify({
        text: "Pizza adicionada ao carrinho!",
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
          background: "#22c55e",
        },
      }).showToast();
    }
  }
});


function addToCart(name, price, size, sabores = [], fatias = "") {
  const existingItem = cart.find(
    (item) =>
      item.name === name &&
      item.size === size &&
      JSON.stringify(item.sabores) === JSON.stringify(sabores) &&
      item.fatias === fatias
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      size,
      sabores,
      fatias,
      quantity: 1,
    });
  }

  updateCartModal();
}

function removeFromCart(name, size) {
  cart = cart.filter((item) => !(item.name === name && item.size === size));

  updateCartModal();
}
//CART ITEMS
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-04",
      "flex-col"
    );

    // Verifica se há tamanho ou não (pizzas têm tamanho, bebidas não)
    const itemSizeDisplay = item.size ? ` (${item.size})` : "";

    // Exibe a quantidade personalizada (bebidas podem ser mostradas como "1,5L", ou o tamanho da pizza)
    const quantityDisplay = item.name.toLowerCase().includes("bebida")
      ? "1,5L"
      : item.size || ""; // Exibe o tamanho se houver

    // Exibe os sabores, caso existam

    const saboresDisplay =
      item.sabores && item.sabores.length > 0
        ? `<p class="font-medium text-xl text-gray-600 mt-1 w-full break-words">Sabores: ${item.sabores.join(
            ", "
          )}</p>`
        : "";

    const fatiasDisplay = item.fatias
      ? `<p class="text-xl text-gray-600">Fatias: ${item.fatias}</p>`
      : "";

    // Criando o HTML para o item no carrinho
    cartItemElement.innerHTML = `
  <div class="flex items-center justify-between">
    <div>
      <p class="font-medium">${item.name} ${itemSizeDisplay}</p>
      <p class="text-base">Quantidade: ${item.quantity}</p>
      ${saboresDisplay}
       ${fatiasDisplay}
      <p class="font-medium mt-2">R$ ${(item.price * item.quantity).toFixed(
        2
      )}</p>
    </div>
    <button class="remove-from-cart-btn" data-name="${item.name}" data-size="${
      item.size
    }">
      Remover
    </button>
  </div>`;
    // Adicionando o evento de remoção
    cartItemElement
      .querySelector(".remove-from-cart-btn")
      .addEventListener("click", function () {
        removeFromCart(item.name, item.size);
      });

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  // Exibindo o total do carrinho formatado
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Atualizando o contador de itens no carrinho
  cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCounter() {
  cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}
//TERSTE chatgpt
function removeSabor(name, size, saborToRemove) {
  const item = cart.find((item) => item.name === name && item.size === size);

  if (item) {
    // Remove o sabor
    item.sabores = item.sabores.filter((sabor) => sabor !== saborToRemove);

    if (item.sabores.length === 0) {
      // Se não houver mais sabores, remova o item do carrinho
      cart = cart.filter((i) => i !== item);
    }

    updateCartModal(); // Atualiza a visualização no modal
    updateCartMessage(); // Atualiza a mensagem para o WhatsApp
  }
}

document.querySelectorAll(".size-select").forEach((select) => {
  select.addEventListener("change", function (event) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const priceElementId = "price-" + event.target.id.split("-")[1];
    const priceElement = document.getElementById(priceElementId);

    const newPrice = selectedOption.getAttribute("data-price");
    priceElement.textContent = `R$ ${parseFloat(newPrice).toFixed(2)}`;
  });
});

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    const size = event.target.getAttribute("data-size");
    removeItemCart(name, size);
  }
});

function removeItemCart(name, size) {
  const index = cart.findIndex(
    (item) => item.name === name && item.size === size
  );

  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

// Selecionar os elementos

const cashPaymentRadio = document.getElementById("cash");
const changeSection = document.getElementById("change-section");
const changeAmountSection = document.getElementById("change-amount-section");
const changeRadios = document.getElementsByName("change-needed");

// Mostrar ou esconder a seção de troco com base na forma de pagamento
document.querySelectorAll('input[name="payment-method"]').forEach((input) => {
  input.addEventListener("change", function () {
    if (cashPaymentRadio.checked) {
      changeSection.classList.remove("hidden");
    } else {
      changeSection.classList.add("hidden");
      changeAmountSection.classList.add("hidden");

      // Limpar seleção dos radios
      changeRadios.forEach((radio) => {
        radio.checked = false;
      });
    }
  });
});

// Mostrar ou esconder o campo de valor com base na escolha "Sim" ou "Não"
changeRadios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "yes") {
      changeAmountSection.classList.remove("hidden");
    } else {
      changeAmountSection.classList.add("hidden");
    }
  });
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, Pizzaria Ruben está fechado no momento!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
      addressInput.classList.remove("border-red-500");
      addressWarn.classList.add("hidden");
    }
  });

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const paymentMethodInputs = document.querySelectorAll(
    'input[name="payment-method"]'
  );
  const paymentWarn = document.getElementById("payment-warn");
  let selectedPaymentMethod = null;

  paymentMethodInputs.forEach((input) => {
    if (input.checked) {
      selectedPaymentMethod = input.value;
    }
  });

  if (!selectedPaymentMethod) {
    paymentWarn.classList.remove("hidden");
    return;
  } else {
    paymentWarn.classList.add("hidden");
  }

  // Verifica troco apenas se for dinheiro
  let changeRequired = "";
  let changeAmount = "";

  if (selectedPaymentMethod === "Dinheiro") {
    const changeYes = document.getElementById("change-yes");
    const changeNo = document.getElementById("change-no");
    const changeAmountInput = document.getElementById("change-amount");
    const changeAmountWarn = document.getElementById("change-amount-warn");

    // Esconde alertas antes
    changeAmountWarn.classList.add("hidden");
    changeAmountInput.classList.remove("border-red-500");

    if (changeYes.checked) {
      changeRequired = "Precisa de troco.";

      if (changeAmountInput.value.trim() !== "") {
        changeAmount = `Troco para: R$ ${parseFloat(
          changeAmountInput.value
        ).toFixed(2)}`;
      } else {
        changeAmountWarn.classList.remove("hidden");
        changeAmountInput.classList.add("border-red-500");
        changeAmountInput.focus();
        return;
      }
    } else if (changeNo.checked) {
      changeRequired = "Não precisa de troco.";
    } else {
      alert("Por favor, informe se precisa de troco.");
      return;
    }
  }

  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const cartItems = cart
    .map((item) => {
      let tamanho = "";

      if (
        item.size &&
        !(
          item.name.toLowerCase().includes("coca") ||
          item.name.toLowerCase().includes("bebida")
        )
      ) {
        tamanho = ` |  ${item.size}`;
      }
      //ADICIONAR SABORES NO CART MODAL
      let sabores =
        item.sabores && item.sabores.length > 0
          ? ` | Sabores: ${item.sabores.join(", ")}`
          : "";

      // IMPLEMENTANDO AS FATIAS DENTRO DO CART MODAL
      let fatias = item.fatias ? ` | Fatias: ${item.fatias}` : "";

      return `Produto: ${item.name} ${sabores} ${fatias} | Quantidade: (${
        item.quantity
      })${tamanho}| Preço Unitário: R$ ${item.price.toFixed(2)} `;
    })
    .join("\n----------------------\n\n");

    // .join("\n");

  const manausTime = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Manaus",
    hour12: false,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const message = encodeURIComponent(
    `Pizzaria Ruben\n\nInformações do Cliente:\nNome: ${
      document.getElementById("customer-name").value
    }\nCelular: ${document.getElementById("customer-phone").value}\nEndereço: ${
      addressInput.value
    }\n\n----------------------\n\nForma de Pagamento: ${selectedPaymentMethod}\n${changeRequired}\n${changeAmount}\n----------------------\n\nHorário do Pedido: ${manausTime}\n----------------------\n\n${cartItems}\n\nTotal: R$ ${total.toFixed(
      2
    )}`
  );

  const phone = "5592982128930";
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = [];
  updateCartModal();

  saboresSelecionados["4sabores"] = [];
  saboresSelecionados["3sabores"] = [];
  saboresSelecionados["2sabores"] = [];
  updateSaboresUI("4sabores");
  updateSaboresUI("3sabores");
  updateSaboresUI("2sabores");

  // Resetando os campos do formulário
document.getElementById("customer-name").value = "";
document.getElementById("customer-phone").value = "";
addressInput.value = "";

// Resetando os radios de pagamento (desmarca todos)
document.querySelectorAll('input[name="payment-method"]').forEach(input => {
  input.checked = false;
});
 

changeSection.classList.add("hidden");
changeAmountSection.classList.add("hidden");
document.getElementById("change-yes").checked = false;
document.getElementById("change-no").checked = false;
document.getElementById("change-amount").value = "";


});

// Função para adicionar bebidas ao carrinho (sem tamanho)
document.querySelectorAll(".drink-add-to-cart-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));

    addDrinkToCart(name, price); // Chama a função específica para bebidas
  });
});

// Função para adicionar a bebida no carrinho
function addDrinkToCart(name, price) {
  const existingDrink = cart.find((item) => item.name === name && !item.size); // Procura sem o tamanho

  if (existingDrink) {
    existingDrink.quantity += 1; // Aumenta a quantidade se a bebida já existir no carrinho
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// Função para remover itens do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeDrinkFromCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

//Verificar a hora e manipular o card e horário
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 17 && hora < 24;
  //true = restaurante está aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
  }

  const saboresSelecionados = {
    "4sabores": [],
    "3sabores": [],
    "2sabores": []
  };


  function handleSaborSelect(selectElement, pizzaId, maxSabores) {
    const sabor = selectElement.value;
    
    // Se o sabor não for válido ou já estiver na lista, não faz nada
    if (!sabor || saboresSelecionados[pizzaId].includes(sabor)) return;
  
    // Verifica se o número de sabores ultrapassou o limite permitido
    if (saboresSelecionados[pizzaId].length >= maxSabores) {
      Toastify({
        text: `Você só pode escolher até ${maxSabores} sabores.`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#ef4444",
        },
      }).showToast();
      selectElement.value = "";
      return;
    }
  
    // Adiciona o sabor à lista de sabores selecionados
    saboresSelecionados[pizzaId].push(sabor);
    updateSaboresUI(pizzaId);  // Atualiza a interface com os novos sabores
    selectElement.value = "";  // Limpa a seleção do dropdown
  }
  
  // Função para remover sabor
  function removeSabor(pizzaId, sabor) {
    // Filtra o array de sabores, removendo o sabor desejado
    saboresSelecionados[pizzaId] = saboresSelecionados[pizzaId].filter(
      (s) => s !== sabor
    );
    updateSaboresUI(pizzaId);  // Atualiza a UI após remoção
  }
  
  // Função para atualizar a interface com os sabores selecionados
  function updateSaboresUI(pizzaId) {
    const container = document.getElementById(`saboresSelecionados-${pizzaId}`);
    container.innerHTML = "";  // Limpa a interface antes de adicionar os novos sabores
  
    // Adiciona cada sabor selecionado à interface
    saboresSelecionados[pizzaId].forEach((sabor) => {
      const saborTag = document.createElement("span");
      saborTag.className =
        "flex items-center gap-4 bg-red-500 border border-gray-400 text-sm text-white rounded-full px-2 py-1";
      saborTag.innerHTML = `
        ${sabor}
        <button class="text-white font-bold ml-1 px-1" onclick="removeSabor('${pizzaId}', '${sabor}')">x</button>
      `;
      container.appendChild(saborTag);
    });
  }
  
  // Função para limpar os sabores de uma pizza (para reiniciar a escolha)
  function limparSabores(pizzaId) {
    // Limpa os sabores no array
    saboresSelecionados[pizzaId] = [];
    updateSaboresUI(pizzaId);  // Atualiza a interface para refletir a limpeza
  }
  
  const sabores = saboresSelecionados["4sabores"]  || saboresSelecionados["3sabores"]  || saboresSelecionados["2sabores"] ; // ou "2sabores", "3sabores" conforme a pizza

  // Para incluir na mensagem/carrinho
  const saboresTexto = sabores.length > 0 ? `Sabores: ${sabores.join(", ")}` : "";


