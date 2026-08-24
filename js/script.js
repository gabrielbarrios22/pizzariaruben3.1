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



const saboresSelecionados = {
  "4sabores": [],
  "3sabores": [],
  "2sabores": [],
  "combo1": [],
  "combo2-pizza1": [],
  "combo2-pizza2": [],
  "combo3": [],
   "combo4": []
};

// Abrir
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.classList.remove("hidden");
  cartModal.classList.add("flex");
});

// Fechar
function closeCart() {
  cartModal.classList.add("hidden");
  cartModal.classList.remove("flex");
}

// Clique fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    closeCart();
  }
});


// Botão fechar
closeModalBtn.addEventListener("click", closeCart);

document.addEventListener("click", function (event) {

  // 🍕 PIZZA
  let pizzaBtn = event.target.closest(".add-to-cart-btn");

  if (pizzaBtn) {
    const name = pizzaBtn.getAttribute("data-name");
    const sizeSelectId = pizzaBtn.getAttribute("data-size-id");
    const sizeSelect = document.getElementById(sizeSelectId);
    const fatiasId = pizzaBtn.getAttribute("data-fatias-id");
    const fatiasElement = fatiasId ? document.getElementById(fatiasId) : null;
    const fatias = fatiasElement ? fatiasElement.textContent.trim() : "";

    if (sizeSelect) {
      const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
      const price = parseFloat(selectedOption.getAttribute("data-price"));
      const size = selectedOption.value;

      const saboresContainerId = pizzaBtn.getAttribute("data-sabores-id");
      let sabores = [];

      if (saboresContainerId) {
        const container = document.getElementById(saboresContainerId);
        if (container) {
          sabores = Array.from(container.children).map((span) =>
            span.textContent.trim().replace("x", "").trim()
          );
        }
      }

      addToCart(name, price, size, sabores, fatias);

      Toastify({
        text: "Pizza adicionada ao carrinho!",
        duration: 2000,
        gravity: "top",
        position: "right",
        style: { background: "#22c55e" },
      }).showToast();
    }
  }

  // 🥤 BEBIDA
  let drinkBtn = event.target.closest(".drink-add-to-cart-btn");

  if (drinkBtn) {
    const name = drinkBtn.getAttribute("data-name");
    const price = parseFloat(drinkBtn.getAttribute("data-price"));

    addDrinkToCart(name, price);

    Toastify({
      text: `${name} adicionada ao carrinho!`,
      duration: 2000,
      gravity: "top",
      position: "right",
      style: { background: "#22c55e" },
    }).showToast();
  }

  // 🍔 X-SALADA (AGORA FUNCIONANDO)
  let burgerBtn = event.target.closest(".burger-add-to-cart-btn");

  if (burgerBtn) {
    const name = burgerBtn.getAttribute("data-name");
    const price = parseFloat(burgerBtn.getAttribute("data-price"));

    addBurgerToCart(name, price);

    Toastify({
      text: `${name} adicionado ao carrinho!`,
      duration: 2000,
      gravity: "top",
      position: "right",
      style: { background: "#22c55e" },
    }).showToast();
  }

 let friesBtn = event.target.closest(".fries-add-to-cart-btn");

  if (friesBtn) {
    const name = friesBtn.getAttribute("data-name");
    const price = parseFloat(friesBtn.getAttribute("data-price"));

    addFriesToCart(name, price);

    Toastify({
      text: `${name} adicionada ao carrinho!`,
      duration: 2000,
      gravity: "top",
      position: "right",
      style: { background: "#22c55e" },
    }).showToast();
  }


// 🍱 COMBOS
let comboBtn = event.target.closest(".combo-add-to-cart-btn");

if (comboBtn) {
  const name = comboBtn.getAttribute("data-name");
  const price = parseFloat(comboBtn.getAttribute("data-price"));
  const description = comboBtn.getAttribute("data-description");

  let sabores = [];
  let pizza1Sabores = [];
  let pizza2Sabores = [];

  // Combos com apenas uma pizza
  const saboresContainerId = comboBtn.getAttribute("data-sabores-id");

  if (saboresContainerId) {
    const container = document.getElementById(saboresContainerId);

    if (container) {
      sabores = Array.from(container.children).map((span) =>
        span.textContent.trim().replace(/x$/, "").trim()
      );
    }

    if (sabores.length === 0) {
      Toastify({
        text: "Escolha o sabor da pizza.",
        duration: 2500,
        gravity: "top",
        position: "right",
        style: { background: "#ef4444" },
      }).showToast();

      return;
    }
  }

  // Combo 2: duas pizzas separadas
  const pizza1ContainerId = comboBtn.getAttribute(
    "data-pizza1-sabores-id"
  );

  const pizza2ContainerId = comboBtn.getAttribute(
    "data-pizza2-sabores-id"
  );

  if (pizza1ContainerId && pizza2ContainerId) {
    const pizza1Container = document.getElementById(pizza1ContainerId);
    const pizza2Container = document.getElementById(pizza2ContainerId);

    if (pizza1Container) {
      pizza1Sabores = Array.from(pizza1Container.children).map((span) =>
        span.textContent.trim().replace(/x$/, "").trim()
      );
    }

    if (pizza2Container) {
      pizza2Sabores = Array.from(pizza2Container.children).map((span) =>
        span.textContent.trim().replace(/x$/, "").trim()
      );
    }

    if (pizza1Sabores.length === 0) {
      Toastify({
        text: "Escolha os sabores da Pizza 1.",
        duration: 2500,
        gravity: "top",
        position: "right",
        style: { background: "#ef4444" },
      }).showToast();

      return;
    }

    if (pizza2Sabores.length === 0) {
      Toastify({
        text: "Escolha os sabores da Pizza 2.",
        duration: 2500,
        gravity: "top",
        position: "right",
        style: { background: "#ef4444" },
      }).showToast();

      return;
    }
  }

  addComboToCart(
    name,
    price,
    description,
    sabores,
    pizza1Sabores,
    pizza2Sabores
  );

  Toastify({
    text: `${name} adicionado ao carrinho!`,
    duration: 2000,
    gravity: "top",
    position: "right",
    style: { background: "#22c55e" },
  }).showToast();
}

  });


// 🍱 FUNÇÃO PARA COMBOS
function addComboToCart(
  name,
  price,
  description,
  sabores = [],
  pizza1Sabores = [],
  pizza2Sabores = []
) {
  const normalize = (arr) => (arr || []).slice().sort();

  const existingItem = cart.find((item) =>
    item.name === name &&
    item.type === "combo" &&
    JSON.stringify(normalize(item.sabores || [])) ===
      JSON.stringify(normalize(sabores || [])) &&
    JSON.stringify(normalize(item.pizza1Sabores || [])) ===
      JSON.stringify(normalize(pizza1Sabores || [])) &&
    JSON.stringify(normalize(item.pizza2Sabores || [])) ===
      JSON.stringify(normalize(pizza2Sabores || []))
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      description,
      sabores,
      pizza1Sabores,
      pizza2Sabores,
      quantity: 1,
      type: "combo"
    });
  }

  updateCartModal();
}


// 🥤 FUNÇÃO BEBIDA
function addDrinkToCart(name, price) {
  const existingDrink = cart.find(
    (item) => item.name === name && item.type === "drink"
  );

  if (existingDrink) {
    existingDrink.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
      type: "drink"
    });
  }

  updateCartModal();
}


// 🍔 FUNÇÃO X-SALADA
function addBurgerToCart(name, price) {
  const existingItem = cart.find(
    (item) => item.name === name && item.type === "burger"
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
      type: "burger"
    });
  }

  updateCartModal();
}


//FUNÇÃO BATATA FRITA
function addFriesToCart(name, price) {
  const existingItem = cart.find(
    (item) => item.name === name && item.type === "fries"
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
      type: "fries"
    });
  }

  updateCartModal();
}


/*function addToCart(name, price, size, sabores = [], fatias = "") {

  // Função para normalizar sabores (evita erro de ordem diferente)
  const normalize = (arr) => arr.slice().sort();

  const existingItem = cart.find((item) =>
    item.name === name &&
    item.size === size &&
    JSON.stringify(normalize(item.sabores || [])) === JSON.stringify(normalize(sabores)) &&
    item.fatias === fatias
  )


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
*/

function addToCart(name, price, size, sabores = [], fatias = "") {

  const normalize = (arr) => (arr || []).slice().sort();

  const existingItem = cart.find((item) =>
    item.name === name &&
    item.size === size &&
    item.type === "pizza" &&
    JSON.stringify(normalize(item.sabores || [])) === JSON.stringify(normalize(sabores || [])) &&
    item.fatias === fatias
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      size,
      sabores: sabores || [],
      fatias,
      quantity: 1,
      type: "pizza"
    });
  }

  updateCartModal();
}

//function removeItemCart(name, size) {
  //cart = cart.filter((item) => !(item.name === name && item.size === size));

  //updateCartModal();
//}
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

    const itemSizeDisplay = item.size ? ` (${item.size})` : "";

    // SABORES
    const saboresDisplay =
      item.sabores && item.sabores.length > 0
        ? `<p class="text-sm text-gray-600 mt-1">Sabores: ${item.sabores.join(", ")}</p>`
        : "";


        const pizza1SaboresDisplay =
  item.pizza1Sabores && item.pizza1Sabores.length > 0
    ? `<p class="text-sm text-gray-600 mt-1"><b>Pizza 1:</b> ${item.pizza1Sabores.join(", ")}</p>`
    : "";

const pizza2SaboresDisplay =
  item.pizza2Sabores && item.pizza2Sabores.length > 0
    ? `<p class="text-sm text-gray-600 mt-1"><b>Pizza 2:</b> ${item.pizza2Sabores.join(", ")}</p>`
    : "";



    // FATIAS
    const fatiasDisplay = item.fatias
      ? `<p class="text-sm text-gray-600">Fatias: ${item.fatias}</p>`
      : "";

    // ✅ DESCRIÇÃO DO COMBO
    const descriptionDisplay = item.description
      ? `<p class="text-sm text-gray-600 mt-1">${item.description}</p>`
      : "";

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}${itemSizeDisplay}</p>
         ${descriptionDisplay}
<p class="text-base">Quantidade: ${item.quantity}</p>
${saboresDisplay}
${pizza1SaboresDisplay}
${pizza2SaboresDisplay}
${fatiasDisplay}
          <p class="font-medium mt-2">R$ ${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <button class="remove-from-cart-btn" data-name="${item.name}" data-size="${item.size || ""}">
          Remover
        </button>
      </div>
    `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}
//TERSTE chatgpt
function removeSaborDocarrinho(name, size, saborToRemove) {
  const item = cart.find((item) => item.name === name && item.size === size);

  if (item) {
    // Remove o sabor
    item.sabores = item.sabores.filter((sabor) => sabor !== saborToRemove);

    if (item.sabores.length === 0) {
      // Se não houver mais sabores, remova o item do carrinho
      cart = cart.filter((i) => i !== item);
    }

    updateCartModal(); // Atualiza a visualização no modal
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



//FUNÇÃO PARA REMOVER DO CARRINHO PIZZAS E BEBIDAS
function removeItemCart(name, size) {
  const index = cart.findIndex((item) => {
    // Se for bebida (sem size)
    if (!item.size && !size) {
      return item.name === name;
    }

    // Se for pizza (com size)
    return item.name === name && item.size === size;
  });

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


//REMOVE DO CARRINHO PIZZAS E BEBIDAS!
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    const size = event.target.getAttribute("data-size");
    removeItemCart(name, size);
  }
});

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

  // CAMPOS (adiciona isso no topo do script)
const nameInput = document.getElementById("customer-name");
const nameWarn = document.getElementById("name-warn");

const phoneInput = document.getElementById("customer-phone");
const phoneWarn = document.getElementById("phone-warn");



// NOME
nameInput.addEventListener("input", function () {
  if (nameInput.value !== "") {
    nameInput.classList.remove("border-red-500");
    nameWarn.classList.add("hidden");
  }
});

// TELEFONE
phoneInput.addEventListener("input", function () {
  if (phoneInput.value !== "") {
    phoneInput.classList.remove("border-red-500");
    phoneWarn.classList.add("hidden");
  }
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



  


// ❌ NOME
if (nameInput.value === "") {
  nameWarn.classList.remove("hidden");
  nameInput.classList.add("border-red-500");
  return;
}

// ❌ TELEFONE
if (phoneInput.value === "") {
  phoneWarn.classList.remove("hidden");
  phoneInput.classList.add("border-red-500");
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

 /* const cartItems = cart
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
  */


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
      tamanho = ` | ${item.size}`;
    }

    // Descrição do combo
    let description = item.description ? ` | ${item.description}` : "";

    // Sabores (pizzas comuns e combos de 1 pizza)
    let sabores =
      item.sabores && item.sabores.length > 0
        ? ` | Sabores: ${item.sabores.join(", ")}`
        : "";

    // Combo 2 - Pizza 1
    let pizza1Sabores =
      item.pizza1Sabores && item.pizza1Sabores.length > 0
        ? `\n   🍕 Pizza 1: ${item.pizza1Sabores.join(" e ")}`
        : "";

    // Combo 2 - Pizza 2
    let pizza2Sabores =
      item.pizza2Sabores && item.pizza2Sabores.length > 0
        ? `\n   🍕 Pizza 2: ${item.pizza2Sabores.join(" e ")}`
        : "";

    // Fatias
    let fatias = item.fatias ? ` | Fatias: ${item.fatias}` : "";

    return `Produto: ${item.name}${description}${sabores}${pizza1Sabores}${pizza2Sabores}${fatias} | Quantidade: (${item.quantity})${tamanho} | Preço Unitário: R$ ${item.price.toFixed(2)}`;
  })
  .join("\n----------------------\n\n");


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

saboresSelecionados["combo1"] = [];
saboresSelecionados["combo2-pizza1"] = [];
saboresSelecionados["combo2-pizza2"] = [];
saboresSelecionados["combo3"] = [];
saboresSelecionados["combo4"] = [];

updateSaboresUI("combo1");
updateSaboresUI("combo2-pizza1");
updateSaboresUI("combo2-pizza2");
updateSaboresUI("combo3");
updateSaboresUI("combo4");


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
  




//FAZER A FUNÇÃO DO BOTAO ABRIR E FECHAR
  //function toggleMenu(id) {
    //const menu = document.getElementById(id);
    //const arrow = document.getElementById("arrow-" + id);

    //menu.classList.toggle("hidden");

    // gira a setinha
    //if (menu.classList.contains("hidden")) {
     // arrow.style.transform = "rotate(0deg)";
    //} else {
      //arrow.style.transform = "rotate(180deg)";
    //}
  //}


function toggleMenu(id) {
  const menu = document.getElementById(id);
  const arrow = document.getElementById("arrow-" + id);

  const isHidden = menu.classList.contains("hidden");

  if (isHidden) {
    menu.classList.remove("hidden");
    arrow.style.transform = "rotate(180deg)";
  } else {
    menu.classList.add("hidden");
    arrow.style.transform = "rotate(0deg)";
  }
}