const firebaseConfig = {
  apiKey: "AIzaSyDY4GfPbpE0b8fz6ZfUOsitiuu2pUcVqRU",
  authDomain: "amors-18a20.firebaseapp.com",
  databaseURL: "https://amors-18a20-default-rtdb.firebaseio.com",
  projectId: "amors-18a20",
  storageBucket: "amors-18a20.appspot.com",
  messagingSenderId: "360392240276",
  appId: "1:360392240276:web:bdad911a67a074904b9881"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const form = document.getElementById('formBatePapo');
const lista = document.getElementById('listaMensagens');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome || !mensagem) {
    alert("Preencha o nome e a mensagem.");
    return;
  }

  db.ref("mensagens").push({
    nome,
    mensagem,
    timestamp: Date.now()
  });

  form.reset();
});

// Mostrar mensagens
db.ref("mensagens").on("child_added", (snap) => {
  const msg = snap.val();
  const data = new Date(msg.timestamp).toLocaleString();

  const div = document.createElement("div");
  div.className = "mensagem-batepapo";
  div.innerHTML = `<strong>${msg.nome}</strong> (${data}): ${msg.mensagem}`;
  lista.appendChild(div);
  lista.scrollTop = lista.scrollHeight;
});
