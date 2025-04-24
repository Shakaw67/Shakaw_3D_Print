
const catalog = document.getElementById("catalog");
const loader = document.getElementById("loader");
const interests = [];
let currentSlide = 0;
let carouselItems = [];
let carouselInterval;
let currentModalImageIndex = 0;
let modalImages = [];
let currentZoom = 1;

    function zoomImage(zoomFactor) {
      const modalImg = document.getElementById('modalImg');
      currentZoom += zoomFactor;
      
      // Limites mínimos e máximos de zoom
      if (currentZoom < 0.5) currentZoom = 0.5;
      if (currentZoom > 3) currentZoom = 3;
      
      modalImg.style.transform = `scale(${currentZoom})`;
    }

    // Função para resetar o zoom
    function resetZoom() {
      currentZoom = 1;
      document.getElementById('modalImg').style.transform = 'scale(1)';
    }

    // Função para navegar entre imagens no modal
    function closeModal() {
      document.getElementById('imgModal').style.display = 'none';
      resetZoom(); // Resetar zoom ao fechar
    }

    // Função para criar um produto