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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const mensagem = document.getElementById("mensagem").value;

  const novaCartinha = {
    titulo,
    mensagem,
    likes: 0,
    dislikes: 0
  };

  db.ref("cartinhas").push(novaCartinha);
  form.reset();
});

function carregarCartinhas() {
  listaCartinhas.innerHTML = "";

  db.ref("cartinhas").on("value", snapshot => {
    listaCartinhas.innerHTML = ""; // limpar
    snapshot.forEach(child => {
      const key = child.key;
      const cartinha = child.val();

      const div = document.createElement("div");
      div.className = "cartinha";

      div.innerHTML = `
        <h3>${cartinha.titulo}</h3>
        <p>${cartinha.mensagem}</p>
        <div class="reacoes">
          <button onclick="votar('${key}', 'likes')">👍</button> <span>${cartinha.likes}</span>
          <button onclick="votar('${key}', 'dislikes')">👎</button> <span>${cartinha.dislikes}</span>
        </div>
      `;

      listaCartinhas.appendChild(div);
    });
  });
}

function votar(id, tipo) {
  const ref = db.ref("cartinhas/" + id + "/" + tipo);
  ref.transaction(valor => (valor || 0) + 1);
}

carregarCartinhas();
