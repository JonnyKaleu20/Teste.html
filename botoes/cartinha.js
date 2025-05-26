// Coloque aqui a sua config do Firebase:
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

const form = document.getElementById("formCartinha");
const listaCartinhas = document.getElementById("listaCartinhas");

// Enviar cartinha para Firebase
form.addEventListener("submit", e => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();

  if (!titulo || !mensagem) {
    alert("Por favor, preencha título e mensagem!");
    return;
  }

  const novaCartinha = {
    titulo,
    mensagem,
    likes: 0,
    dislikes: 0
  };

  db.ref("cartinhas").push(novaCartinha)
    .then(() => {
      form.reset();
    })
    .catch(err => {
      alert("Erro ao enviar: " + err.message);
    });
});

// Carrega cartinhas em tempo real
function carregarCartinhas() {
  db.ref("cartinhas").on("value", snapshot => {
    listaCartinhas.innerHTML = "";

    snapshot.forEach(child => {
      const key = child.key;
      const cartinha = child.val();

      const jaVotouLike = checkVoto(key, 'likes');
      const jaVotouDislike = checkVoto(key, 'dislikes');

      const div = document.createElement("div");
      div.className = "cartinha";

      div.innerHTML = `
        <h3>${cartinha.titulo}</h3>
        <p>${cartinha.mensagem}</p>
        <div class="reacoes">
          <button aria-label="Curtir" title="Curtir" 
            onclick="votar('${key}', 'likes')" ${jaVotouLike ? "disabled" : ""}>👍</button>
          <span>${cartinha.likes}</span>

          <button aria-label="Não curtir" title="Não curtir" 
            onclick="votar('${key}', 'dislikes')" ${jaVotouDislike ? "disabled" : ""}>👎</button>
          <span>${cartinha.dislikes}</span>
        </div>
      `;

      listaCartinhas.appendChild(div);
    });
  });
}

// Verifica voto no localStorage
function checkVoto(id, tipo) {
  const votos = JSON.parse(localStorage.getItem("votos_cartinhas")) || {};
  return votos[id] && votos[id][tipo];
}

// Salva voto no localStorage
function salvarVoto(id, tipo) {
  const votos = JSON.parse(localStorage.getItem("votos_cartinhas")) || {};
  if (!votos[id]) votos[id] = {};
  votos[id][tipo] = true;
  localStorage.setItem("votos_cartinhas", JSON.stringify(votos));
}

// Função para votar (like ou dislike)
function votar(id, tipo) {
  if (checkVoto(id, tipo)) {
    alert("Você já votou nesta cartinha!");
    return;
  }

  const ref = db.ref(`cartinhas/${id}/${tipo}`);

  ref.transaction(current => (current || 0) + 1, (error, committed) => {
    if (error) {
      alert("Erro ao votar: " + error.message);
    } else if (committed) {
      salvarVoto(id, tipo);
      // Não precisa recarregar tudo, pois o "on" do Firebase atualiza automaticamente
    }
  });
}

carregarCartinhas();
