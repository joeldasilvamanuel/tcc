// Array com 9 imagens médicas de alta qualidade do Unsplash
const images = [
    "/public/img/auth/monitoramento.jpeg",
    "/public/img/auth/medicamentos.jpg",
    "/public/img/auth/analise-patogenica.jpg",
    "/public/img/auth/bem-estar.jpg",
    "/public/img/auth/cuidado-paciente.jpg",
    "/public/img/auth/cirurgia.jpg",
    "/public/img/auth/triagem.jpg",
    "/public/img/auth/tratamentos.jpg",
    "/public/img/auth/hospital.jpg"
];

const slides = document.querySelectorAll('.slide');
const cardLeft = document.querySelector('.card-left');
let currentIndex = 0;

function changeSlide() {
    // 1. Remover classe active do slide de texto anterior
    slides[currentIndex].classList.remove('active');

    // 2. Avançar o index de forma circular
    currentIndex = (currentIndex + 1) % slides.length;

    // 3. Adicionar classe active ao novo slide de texto
    slides[currentIndex].classList.add('active');

    // 4. Mudar a imagem de fundo do Card Esquerdo condizente com o tema do slide
    cardLeft.style.backgroundImage = `url('${images[currentIndex]}')`;
}

// Inicializa o primeiro fundo imediatamente ao carregar a página
cardLeft.style.backgroundImage = `url('${images[0]}')`;

// Configura o loop para rodar estritamente de 2 em 2 segundos (2000 milissegundos)
setInterval(changeSlide, 2000);