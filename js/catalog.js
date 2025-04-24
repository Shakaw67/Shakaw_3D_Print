
const catalog = document.getElementById("catalog");
const loader = document.getElementById("loader");
const interests = [];
let currentSlide = 0;
let carouselItems = [];
let carouselInterval;
let currentModalImageIndex = 0;
let modalImages = [];
let currentZoom = 1;

    function checkImageExists(url, callback) {
      const img = new Image();
      img.onload = function() {
        callback(true);
      };
      img.onerror = function() {
        callback(false);
      };
      img.src = url;
    }

    // Funções do carrossel
    async function createProduct(i) {
      const index = i.toString().padStart(2, '0');
      const mainImageUrl = `https://shakaw3dprint.github.io/Shakaw_3D_Print/uploads/${index}.png`;
      
      return new Promise((resolve) => {
        checkImageExists(mainImageUrl, (exists) => {
          if (!exists) {
            resolve(null);
            return;
          }

          const product = document.createElement('div');
          product.className = 'product';

          const imageColumn = document.createElement('div');
          imageColumn.className = 'image-column';

          const mainImg = document.createElement('img');
          mainImg.src = mainImageUrl;
          mainImg.alt = `Produto ${i}`;
          mainImg.className = 'main-img';
          mainImg.onclick = function() {
            // Coletar todas as imagens disponíveis para este produto
            modalImages = [mainImg];
            
            // Verificar miniaturas adicionais
            const thumbnails = this.parentNode.querySelectorAll('.thumbnail-container img');
            thumbnails.forEach(thumb => {
              if (thumb.src !== mainImg.src) {
                modalImages.push(thumb);
              }
            });
            
            // Encontrar o índice da imagem clicada
            currentModalImageIndex = 0;
            for (let j = 0; j < modalImages.length; j++) {
              if (modalImages[j].src === this.src) {
                currentModalImageIndex = j;
                break;
              }
            }
            
            document.getElementById('imgModal').style.display = 'block';
            document.getElementById('modalImg').src = this.src;
            resetZoom(); // Resetar zoom ao abrir nova imagem
          };

          const thumbnails = document.createElement('div');
          thumbnails.className = 'thumbnail-container';

          // Adiciona a miniatura principal
          const mainThumb = document.createElement('img');
          mainThumb.src = mainImg.src;
          mainThumb.alt = `Produto ${i} ângulo 0`;
          mainThumb.onclick = function() {
            mainImg.src = this.src;
          };
          thumbnails.appendChild(mainThumb);

          // Verifica e adiciona miniaturas adicionais
          for (let j = 1; j <= 5; j++) {
            const thumbUrl = `https://shakaw3dprint.github.io/Shakaw_3D_Print/uploads/${index}_${j}.png`;
            
            checkImageExists(thumbUrl, function(exists) {
              if (exists) {
                const thumb = document.createElement('img');
                thumb.src = thumbUrl;
                thumb.alt = `Produto ${i} ângulo ${j}`;
                thumb.onclick = function() {
                  mainImg.src = this.src;
                };
                thumbnails.appendChild(thumb);
              }
            });
          }

          imageColumn.appendChild(mainImg);
          imageColumn.appendChild(thumbnails);

          const details = document.createElement('div');
          details.className = 'product-details';

          // Define descrição e preço usando os objetos de mapeamento
          let descricao = (descricoesEspeciais[i] || 
            'Modelo <br> Imagem Real <br> Escala 1/18. Tamanho entre 8cm e 11cm de altura. <br> Observação: Os itens do cenário não acompanham o produto.') + 
            observacaoPadrao;
          
          let preco = precosEspeciais[i] || 'R$ 60,00';

          details.innerHTML = `
            <h2>Código ${i}</h2>
            <p><strong>Descrição:</strong> ${descricao}</p>
            <p class="price">${preco}</p>
          `;

          // Adiciona botão de interesse
          const interestBtn = document.createElement('button');
          interestBtn.textContent = 'Adicionar aos interesses';
          interestBtn.style.marginTop = '10px';
          interestBtn.style.padding = '8px 12px';
          interestBtn.style.backgroundColor = '#0077cc';
          interestBtn.style.color = 'white';
          interestBtn.style.border = 'none';
          interestBtn.style.borderRadius = '5px';
          interestBtn.style.cursor = 'pointer';
          interestBtn.onclick = function() {
            addToInterests(i, descricao, preco, mainImg.src);
            interestBtn.textContent = 'Adicionado!';
            interestBtn.disabled = true;
          };

          details.appendChild(interestBtn);

          product.appendChild(imageColumn);
          product.appendChild(details);
          
          resolve(product);
        });
      });
    }

    // Função para carregar produtos dinamicamente
    async function loadProducts() {
      loader.style.display = 'block';
      catalog.innerHTML = '';
      
      const maxProducts = 100;
      let loadedProducts = 0;
      
      for (let i = 1; i <= maxProducts; i++) {
        const product = await createProduct(i);
        if (product) {
          catalog.appendChild(product);
          loadedProducts++;
          
          // Atualiza periodicamente para não travar a UI
          if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }
      }
      
      loader.style.display = 'none';
      
      if (loadedProducts === 0) {
        catalog.innerHTML = '<p style="text-align: center; color: white;">Nenhum produto encontrado.</p>';
      }
    }

    // Funções para gerenciar interesses

window.onload = function() {
  initCarousel();
  loadProducts();
  const btn = document.getElementById("backToTopBtn");
  window.onscroll = function() {
    btn.style.display = window.scrollY > 200 ? "block" : "none";
  };
};
