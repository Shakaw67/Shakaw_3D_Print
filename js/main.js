// Funções principais
const interests = [];

document.addEventListener('DOMContentLoaded', function() {
  // Inicializações
  const backToTopBtn = document.getElementById("backToTopBtn");
  const interestBtn = document.querySelector(".interest-btn");
  const contactForm = document.getElementById("contactForm");

  // Event Listeners
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });

  interestBtn.addEventListener("click", toggleInterestPanel);
  contactForm.addEventListener("submit", handleFormSubmit);

  // ... (outras inicializações)
});

function addToInterests(codigo, descricao, preco, imagem) {
  // ... (código de gerenciamento de interesses)
}

// ... (todas as outras funções principais)