
const catalog = document.getElementById("catalog");
const loader = document.getElementById("loader");
const interests = [];
let currentSlide = 0;
let carouselItems = [];
let carouselInterval;
let currentModalImageIndex = 0;
let modalImages = [];
let currentZoom = 1;

    async function initCarousel() {
      const carousel = document.getElementById('carousel');
      const indicators = document.getElementById('carouselIndicators');
      
      // Verifica quais imagens existem (de c_1.jpg até c_50.jpg)
      for (let i = 1; i <= 50; i++) {
        const imgUrl = `https://shakaw3dprint.github.io/Shakaw_3D_Print/uploads/carrossel/c_${i}.jpg`;
        
        await new Promise(resolve => {
          checkImageExists(imgUrl, function(exists) {
            if (exists) {
              const img = document.createElement('img');
              img.src = imgUrl;
              img.alt = `Imagem de catálogo ${i}`;
              carousel.appendChild(img);
              
              const indicator = document.createElement('div');
              indicator.className = 'carousel-indicator';
              indicator.onclick = () => goToSlide(carouselItems.length);
              indicators.appendChild(indicator);
              
              carouselItems.push(img);
            }
            resolve();
          });
        });
      }
      
      if (carouselItems.length > 0) {
        // Inicia o carrossel
        updateCarousel();
        startCarousel();
        
        // Adiciona evento para pausar o carrossel quando o mouse está sobre ele
        document.querySelector('.carousel-container').addEventListener('mouseenter', pauseCarousel);
        document.querySelector('.carousel-container').addEventListener('mouseleave', startCarousel);
      } else {
        // Se não encontrar imagens, oculta o carrossel
        document.querySelector('.carousel-container').style.display = 'none';
      }
    }

    function moveSlide(direction) {
      if (carouselItems.length <= 1) return;
      
      clearInterval(carouselInterval);
      
      currentSlide += direction;
      if (currentSlide >= carouselItems.length) {
        currentSlide = 0;
      } else if (currentSlide < 0) {
        currentSlide = carouselItems.length - 1;
      }
      
      updateCarousel();
      
      // Reinicia o carrossel automático, mas apenas se o mouse não estiver sobre ele
      if (!document.querySelector('.carousel-container').matches(':hover')) {
        startCarousel();
      }
    }

    function updateCarousel() {
      const carousel = document.getElementById('carousel');
      const indicators = document.querySelectorAll('.carousel-indicator');
      
      carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
      });
    }

    // Função para aplicar zoom