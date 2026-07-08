// Array com 9 imagens médicas de alta qualidade do Unsplash
const images = [
    "/img/hahfundo.jpg",
    "/img/auth/image1.png",
    "/img/auth/medicamento.jpeg",
    "/img/auth/analise_patogenica.jpeg",
    "/img/auth/bem-estar.jpeg",
    "/img/auth/cuidado-paciente.jpeg",
    "/img/auth/cirurgia.jpeg",
    "/img/auth/triagem.jpeg",
    "/img/auth/tratamentos.jpeg",
    "/img/auth/hospital.jpg"
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
setInterval(changeSlide, 3000);