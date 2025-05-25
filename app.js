// Inicializa Firebase (coloque sua config abaixo)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Referências Firebase
const db = firebase.database();
const storage = firebase.storage();
const messagesRef = db.ref('chatMensagens');
const cartinhasRef = db.ref('cartinhas');
const fotosRef = db.ref('fotos');

// ------------------- GALERIA DE FOTOS (ADMIN COM SENHA) -------------------
const photoInput = document.getElementById('photo-input');
const btnEnviarFoto = document.getElementById('btnEnviarFoto');
const galeria = document.getElementById('galeriaFotos');

btnEnviarFoto.addEventListener('click', () => {
  const senha = prompt('Digite a senha de administrador para enviar fotos:');
  if (senha !== '1234') {
    alert('Senha incorreta.');
    return;
  }

  if (photoInput.files.length === 0) {
    alert('Selecione uma foto.');
    return;
  }

  const file = photoInput.files[0];
  const storageRef = storage.ref('fotos/' + Date.now() + '_' + file.name);

  storageRef.put(file).then(() => {
    storageRef.getDownloadURL().then(url => {
      fotosRef.push({
        url: url,
        timestamp: Date.now()
      });
      alert('Foto enviada!');
      photoInput.value = '';
      carregarFotosGaleria();
    });
  }).catch(err => {
    alert('Erro: ' + err.message);
  });
});

function carregarFotosGaleria() {
  galeria.innerHTML = '';
  fotosRef.once('value', snapshot => {
    snapshot.forEach(childSnap => {
      const foto = childSnap.val();
      const img = document.createElement('img');
      img.src = foto.url;
      img.alt = "Foto";
      img.style.maxWidth = '150px';
      img.style.margin = '5px';
      galeria.appendChild(img);
    });
  });
}
carregarFotosGaleria();

// ------------------- BATE-PAPO ENTRE USUÁRIOS -------------------
const formBatePapo = document.getElementById('formBatePapo');
const listaMensagens = document.getElementById('listaMensagens');

formBatePapo.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nomeBatePapo').value.trim();
  const texto = document.getElementById('msgBatePapo').value.trim();

  if (!nome || !texto) {
    alert('Preencha nome e mensagem.');
    return;
  }

  messagesRef.push({
    user: nome,
    message: texto,
    timestamp: Date.now()
  });

  formBatePapo.reset();
});

messagesRef.on('child_added', snapshot => {
  const msg = snapshot.val();
  const div = document.createElement('div');
  const data = new Date(msg.timestamp).toLocaleString();

  div.className = 'mensagem-batepapo';
  div.textContent = `${msg.user} (${data}): ${msg.message}`;
  listaMensagens.appendChild(div);
  listaMensagens.scrollTop = listaMensagens.scrollHeight;
});

// ------------------- CARTINHAS COM ANEXO OPCIONAL -------------------
const formCartinha = document.getElementById('formCartinha');
const listaCartinhas = document.getElementById('listaCartinhas');

formCartinha.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nomeCartinha').value.trim();
  const texto = document.getElementById('textoCartinha').value.trim();
  const arquivoInput = document.getElementById('arquivoCartinha');
  const arquivo = arquivoInput.files[0];

  if (!nome || (!texto && !arquivo)) {
    alert('Preencha o nome e uma mensagem ou anexe uma imagem.');
    return;
  }

  if (arquivo) {
    const storageRef = storage.ref('cartinhas/' + Date.now() + '_' + arquivo.name);
    storageRef.put(arquivo).then(() => {
      storageRef.getDownloadURL().then(url => {
        cartinhasRef.push({
          user: nome,
          mensagem: texto,
          imageUrl: url,
          timestamp: Date.now()
        });
        formCartinha.reset();
      });
    }).catch(err => {
      alert('Erro ao enviar imagem: ' + err.message);
    });
  } else {
    cartinhasRef.push({
      user: nome,
      mensagem: texto,
      imageUrl: '',
      timestamp: Date.now()
    });
    formCartinha.reset();
  }
});

cartinhasRef.on('child_added', snapshot => {
  const c = snapshot.val();
  const div = document.createElement('div');
  const data = new Date(c.timestamp).toLocaleString();

  div.style.border = '1px solid #ccc';
  div.style.padding = '10px';
  div.style.margin = '10px 0';

  div.innerHTML = `<strong>${c.user}</strong> (${data}):<br>${c.mensagem ? c.mensagem : ''}<br>`;
  if (c.imageUrl) {
    div.innerHTML += `<img src="${c.imageUrl}" style="max-width:200px; display:block; margin-top:5px;" />`;
  }
  listaCartinhas.appendChild(div);
});
