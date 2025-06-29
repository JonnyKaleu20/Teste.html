
const palavras = [
  "beijo", "carinho", "abraço", "amor", "namoro", "coração",
  "paixão", "encontro", "saudade", "desejo",
  "casal", "alma gêmea", "amor eterno", "doçura", "sorriso",
  "romance", "declaração", "companheirismo", "cumplicidade", "sedução",
  "afeto", "sintonia", "harmonia", "encanto", "olhar",
  "suspiro", "confiança", "eternidade", "aliança", "emoção",
  "felicidade", "lealdade", "promessa", "atração", "magia",
  "flerte", "amado", "amada", "inspiração", "ternura"
];

let personagemAtual = "";
let palavraAtual = "";
let chances = 10;
let acertos = 0;
let letrasUsadas = [];
let rankings = {
  Mari: 0,
  Kaleu: 0
};

function selecionarPersonagem(nome) {
  personagemAtual = nome;
  document.getElementById('tela-inicial').classList.add('hidden');
  document.getElementById('tela-jogo').classList.remove('hidden');
  document.getElementById('personagem-selecionado').textContent = "Jogando com " + nome;
  iniciarJogo();
}

function iniciarJogo() {
  palavraAtual = palavras[Math.floor(Math.random() * palavras.length)].toUpperCase();
  chances = 10;
  letrasUsadas = [];
  atualizarPalavra();
  atualizarChances();
  criarTeclado();
}

function atualizarPalavra() {
  const display = palavraAtual.split("").map(letra => letrasUsadas.includes(letra) ? letra : "_").join(" ");
  document.getElementById("palavra").textContent = display;

  if (!display.includes("_")) {
    alert("Parabéns! Você acertou! 💖");
    rankings[personagemAtual]++;
    atualizarRanking();
    iniciarJogo();
  }
}

function atualizarChances() {
  document.getElementById("chances").textContent = chances;
  if (chances <= 0) {
    alert("Você perdeu! A palavra era: " + palavraAtual);
    iniciarJogo();
  }
}

function criarTeclado() {
  const teclado = document.getElementById("teclado");
  teclado.innerHTML = "";
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  letras.split("").forEach(letra => {
    const botao = document.createElement("button");
    botao.textContent = letra;
    botao.disabled = letrasUsadas.includes(letra);
    botao.onclick = () => tentarLetra(letra);
    teclado.appendChild(botao);
  });
}

function tentarLetra(letra) {
  letrasUsadas.push(letra);
  if (palavraAtual.includes(letra)) {
    atualizarPalavra();
  } else {
    chances--;
    atualizarChances();
  }
  criarTeclado();
}

function atualizarRanking() {
  document.getElementById("ranking-mari").textContent = `🏆 ${rankings.Mari}`;
  document.getElementById("ranking-kaleu").textContent = `🏆 ${rankings.Kaleu}`;
}

function voltarInicio() {
  document.getElementById('tela-inicial').classList.remove('hidden');
  document.getElementById('tela-jogo').classList.add('hidden');
  atualizarRanking();
}

const firebaseConfig = {
  apiKey: "AIzaSyDY4GfPbpE0b8fz6ZfUOsitiuu2pUcVqRU",
  authDomain: "amors-18a20.firebaseapp.com",
  databaseURL: "https://amors-18a20-default-rtdb.firebaseio.com",
  projectId: "amors-18a20",
  storageBucket: "amors-18a20.firebasestorage.app",
  messagingSenderId: "360392240276",
  appId: "1:360392240276:web:7910c99a560efc0c4b9881"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();
