// ==================== CARROSSEL ====================
const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

let currentIndex = 0;
const totalSlides = slides.length;
let autoPlayInterval;

// Criar os dots (indicadores)
function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

// Atualizar os dots
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Ir para um slide específico
function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
    resetAutoPlay();
}

// Próximo slide
function nextSlide() {
    goToSlide(currentIndex + 1);
}

// Slide anterior
function prevSlide() {
    goToSlide(currentIndex - 1);
}

// Resetar o autoplay
function resetAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Inicializar carrossel
createDots();
resetAutoPlay();

// Pausar autoplay quando mouse está sobre o carrossel
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', () => {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
});
carouselContainer.addEventListener('mouseleave', resetAutoPlay);

// ==================== BACK TO TOP BUTTON ====================
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==================== ADD TO CART FUNCTIONALITY ====================
const addToCartButtons = document.querySelectorAll('.btn-add-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const product = button.getAttribute('data-product');
        const price = button.getAttribute('data-price');
        
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${product} adicionado ao carrinho por R$ ${price}
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            background-color: #2c7a4d;
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
        
        // Adicionar estilo de animação
        if (!document.querySelector('#cart-animation-style')) {
            const style = document.createElement('style');
            style.id = 'cart-animation-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Salvar no localStorage
        let cart = JSON.parse(localStorage.getItem('cacauShowCart') || '[]');
        cart.push({
            product: product,
            price: parseFloat(price),
            date: new Date().toISOString()
        });
        localStorage.setItem('cacauShowCart', JSON.stringify(cart));
        
        console.log('Carrinho atual:', cart);
    });
});

// ==================== HEADER ACTIONS ====================
const searchIcon = document.querySelector('.header-actions .fa-search');
const userIcon = document.querySelector('.header-actions .fa-user');
const bagIcon = document.querySelector('.header-actions .fa-shopping-bag');

if (searchIcon) {
    searchIcon.addEventListener('click', () => {
        alert('🔍 Busca de produtos - funcionalidade em desenvolvimento');
    });
}

if (userIcon) {
    userIcon.addEventListener('click', () => {
        alert('👤 Área do cliente - faça login ou cadastre-se');
    });
}

if (bagIcon) {
    bagIcon.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cacauShowCart') || '[]');
        if (cart.length === 0) {
            alert('🛒 Seu carrinho está vazio');
        } else {
            let total = cart.reduce((sum, item) => sum + item.price, 0);
            alert(`🛒 Você tem ${cart.length} item(ns) no carrinho\nTotal: R$ ${total.toFixed(2)}`);
        }
    });
}

// ==================== ANIMAÇÃO DE ENTRADA DOS PRODUTOS ====================
const productCards = document.querySelectorAll('.product-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            setTimeout(() => {
                entry.target.style.transition = 'all 0.5s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

productCards.forEach(card => observer.observe(card));

console.log('🍫 Site Cacau Show carregado! Carrossel com 4 banners pronto para suas imagens 🍫');