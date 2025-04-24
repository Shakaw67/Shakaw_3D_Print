
const catalog = document.getElementById("catalog");
const loader = document.getElementById("loader");
const interests = [];
let currentSlide = 0;
let carouselItems = [];
let carouselInterval;
let currentModalImageIndex = 0;
let modalImages = [];
let currentZoom = 1;

    function addToInterests(codigo, descricao, preco, imagem) {
      interests.push({ codigo, descricao, preco, imagem });
      updateInterestList();
    }

    function updateInterestList() {
      const list = document.getElementById("interestList");
      list.innerHTML = '';
      
      if (interests.length === 0) {
        list.innerHTML = '<li style="color: gray;">Nenhum item adicionado.</li>';
        return;
      }
      
      interests.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div style="margin-bottom: 10px;">
            <strong>Código ${item.codigo}</strong><br>
            <small>${item.descricao}</small><br>
            <strong>${item.preco}</strong><br>
            <img src="${item.imagem}" style="width: 50px; margin-top: 5px;"><br>
            <button onclick="removeInterest(${index})" style="margin-top: 5px; padding: 4px 8px; font-size: 12px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Remover</button>
          </div>
        `;
        list.appendChild(li);
      });
      
      updateContactMessage();
    }

    function updateContactMessage() {
      const summaryContainer = document.getElementById('selectedItemsSummary');
      const itemsDataField = document.getElementById('itemsData');
      
      summaryContainer.innerHTML = '';
      
      if (interests.length === 0) {
        summaryContainer.innerHTML = '<div>Nenhum item selecionado</div>';
        itemsDataField.value = '';
        return;
      }
      
      const itemsGrouped = {};
      
      interests.forEach(item => {
        if (!itemsGrouped[item.codigo]) {
          itemsGrouped[item.codigo] = {
            ...item,
            quantity: 1
          };
        } else {
          itemsGrouped[item.codigo].quantity++;
        }
      });
      
      let summaryHTML = '';
      let itemsData = [];
      
      Object.values(itemsGrouped).forEach(item => {
        summaryHTML += `
          <div>
            <strong>Código ${item.codigo}:</strong> 
            ${item.quantity}x - ${item.preco}
          </div>
        `;
        
        itemsData.push({
          codigo: item.codigo,
          quantidade: item.quantity,
          preco: item.preco,
          descricao: item.descricao
        });
      });
      
      summaryContainer.innerHTML = summaryHTML;
      itemsDataField.value = JSON.stringify(itemsData);
      
      const defaultMessage = `Olá, tenho interesse nos seguintes produtos:\n\n${
        Object.values(itemsGrouped).map(item => 
          `Código: ${item.codigo} (${item.quantity}x) - ${item.preco}`
        ).join('\n')
      }\n\nPor favor, entre em contato comigo para mais informações.`;
      
      document.getElementById('customMessage').value = defaultMessage;
    }

    // Máscara para WhatsApp
    document.getElementById('whatsapp').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.substring(0, 11);
      
      if (value.length > 0) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        if (value.length > 10) {
          value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
      }
      
      e.target.value = value;
    });

    // Feedback após envio do formulário
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      const whatsapp = document.getElementById('whatsapp').value.replace(/\D/g, '');
      if (whatsapp.length < 11) {
        alert('Por favor, insira um número de WhatsApp válido com DDD.');
        e.preventDefault();
        return;
      }
      
      interests.length = 0;
      updateInterestList();
    });

    // Inicializa a página
    window.onload = function() {
      initCarousel();
      loadProducts();
      
      const btn = document.getElementById("backToTopBtn");
      window.onscroll = function() {
        btn.style.display = window.scrollY > 200 ? "block" : "none";
      };
    };
  

document.getElementById('whatsapp').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.substring(0, 11);
  if (value.length > 0) {
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    if (value.length > 10) {
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
  }
  e.target.value = value;
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
  const whatsapp = document.getElementById('whatsapp').value.replace(/\D/g, '');
  if (whatsapp.length < 11) {
    alert('Por favor, insira um número de WhatsApp válido com DDD.');
    e.preventDefault();
    return;
  }
  interests.length = 0;
  updateInterestList();
});
