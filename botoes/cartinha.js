// Config Firebase
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

const form = document.getElementById('formCartinha');
const tituloInput = document.getElementById('titulo');
const mensagemInput = document.getElementById('mensagem');
const lista = document.getElementById('listaCartinhas');

// Enviar cartinha
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const titulo = tituloInput.value.trim();
  const mensagem = mensagemInput.value.trim();

  if (!titulo || !mensagem) return alert('Preencha todos os campos.');

  db.ref('cartinhas').push({ titulo, mensagem });

  form.reset();
  alert('Cartinha enviada com sucesso!');
});

// Mostrar cartinhas em tempo real
db.ref('cartinhas').on('value', (snapshot) => {
  lista.innerHTML = '';
  snapshot.forEach((child) => {
    const { titulo, mensagem } = child.val();
    const div = document.createElement('div');
    div.className = 'cartinha';
    div.innerHTML = `<h3>${titulo}</h3><p>${mensagem}</p>`;
    lista.prepend(div);
  });
});
