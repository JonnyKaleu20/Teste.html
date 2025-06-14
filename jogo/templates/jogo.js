const characterButtons = document.querySelectorAll('.char-btn');
const characterSelectSection = document.getElementById('characterSelect');
const gameSection = document.getElementById('gameSection');
const heartBtn = document.getElementById('heartBtn');
const scoreDisplay = document.getElementById('scoreDisplay');
const startBtn = document.getElementById('startBtn');

const firstNameSpan = document.getElementById('firstName');
const firstScoreSpan = document.getElementById('firstScore');
const secondNameSpan = document.getElementById('secondName');
const secondScoreSpan = document.getElementById('secondScore');

let playerName = '';
let score = 0;
let gameActive = false;
let gameTimer = null;

let ranking = [
  { name: '-', score: 0 },
  { name: '-', score: 0 }
];

// Selecionar personagem
characterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    characterButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    playerName = btn.dataset.name;

    // Mostrar seção do jogo e esconder seleção
    characterSelectSection.classList.add('hidden');
    gameSection.classList.remove('hidden');

    score = 0;
    updateScoreDisplay();
  });
});

// Atualiza a pontuação na tela
function updateScoreDisplay() {
  scoreDisplay.textContent = `Sua pontuação: ${score}`;
}

// Atualiza o ranking de acordo com a pontuação atual
function updateRanking() {
  // Atualiza o ranking só se pontuação for maior que um dos dois
  if (score > ranking[0].score) {
    if (playerName !== ranking[0].name) {
      ranking[1] = { ...ranking[0] }; // passa o atual 1º para 2º
    }
    ranking[0] = { name: playerName, score };
  } else if (score > ranking[1].score && playerName !== ranking[0].name) {
    ranking[1] = { name: playerName, score };
  }

  firstNameSpan.textContent = ranking[0].name;
  firstScoreSpan.textContent = ranking[0].score;
  secondNameSpan.textContent = ranking[1].name;
  secondScoreSpan.textContent = ranking[1].score;
}

// Tocar som de clique no coração
function playClickSound() {
  const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/01/audio_6d3ccf9c3d.mp3?filename=pop-click-6360.mp3');
  audio.volume = 0.3;
  audio.play().catch(() => {});
}

// Começar o jogo
startBtn.addEventListener('click', () => {
  if (gameActive) return;

  score = 0;
  updateScoreDisplay();
  gameActive = true;
  startBtn.disabled = true;

  // Duração do jogo: 15 segundos
  gameTimer = setTimeout(() => {
    gameActive = false;
    startBtn.disabled = false;
    updateRanking();
    alert(`Tempo esgotado! Sua pontuação final: ${score}`);
  }, 15000);
});

// Clique no coração aumenta a pontuação se o jogo estiver ativo
heartBtn.addEventListener('click', () => {
  if (!gameActive) return;

  score++;
  updateScoreDisplay();
  playClickSound();

  // Move o coração para uma nova posição aleatória dentro da área do jogo
  moveHeartRandomly();
});

// Função para mover o coração aleatoriamente dentro do gameArea
function moveHeartRandomly() {
  const area = document.getElementById('gameArea');
  const maxX = area.clientWidth - heartBtn.clientWidth;
  const maxY = area.clientHeight - heartBtn.clientHeight;

  const randX = Math.random() * maxX;
  const randY = Math.random() * maxY;

  heartBtn.style.position = 'absolute';
  heartBtn.style.left = `${randX}px`;
  heartBtn.style.top = `${randY}px`;
}
