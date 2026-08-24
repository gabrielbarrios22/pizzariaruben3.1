document.getElementById("pizzaToggleBtn").addEventListener("click", function () {
    const pizzaMenu = document.getElementById("pizzaMenu");
    const isVisible = pizzaMenu.style.display === "block";
    
    // Alterna entre exibir e esconder
    pizzaMenu.style.display = isVisible ? "none" : "block";
    
    // Alterna a setinha
    this.innerHTML = isVisible ? "&#x2193;" : "&#x2191;"; // Setinha para baixo e para cima
  });
  

