// Configuração Firebase (substitua pelos seus dados)
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

// Elementos do DOM
const btnFotos = document.getElementById('btnFotos');
const modal = document.getElementById('modalFoto');
const closeModal = document.getElementById('closeModal');
const btnEnviarFoto = document.getElementById('btnEnviarFoto');
const senhaFoto = document.getElementById('senhaFoto');
const fotoUpload = document.getElementById('fotoUpload');
const msgFoto = document.getElementById('msgFoto');
const galeriaFotos = document.getElementById('galeriaFotos');

// Abre o modal de envio da foto
btnFotos.addEventListener('click', () => {
  modal.style.display = 'flex';
  msgFoto.textContent = '';
  senhaFoto.value = '';
  fotoUpload.value = '';
});

// Fecha o modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Envia a foto após validação da senha
btnEnviarFoto.addEventListener('click', () => {
  const senha = senhaFoto.value.trim();

  if (senha !== 'Kaleu') { // senha correta aqui
    msgFoto.textContent = 'Senha incorreta.';
    msgFoto.style.color = 'red';
    return;
  }

  const file = fotoUpload.files[0];
  if (!file) {
    msgFoto.textContent = 'Selecione uma foto para enviar.';
    msgFoto.style.color = 'red';
    return;
  }

  msgFoto.textContent = 'Enviando...';
  msgFoto.style.color = '#333';

  const ref = storage.ref('fotos/' + Date.now() + '_' + file.name);
  ref.put(file)
    .then(() => ref.getDownloadURL())
    .then(url => {
      return db.ref('fotos').push({ url, timestamp: Date.now() });
    })
    .then(() => {
      msgFoto.textContent = 'Foto enviada com sucesso!';
      msgFoto.style.color = 'green';
      senhaFoto.value = '';
      fotoUpload.value = '';
      modal.style.display = 'none';
      atualizarGaleria();
    })
    .catch(err => {
      msgFoto.textContent = 'Erro ao enviar: ' + err.message;
      msgFoto.style.color = 'red';
    });
});

// Atualiza a galeria de fotos em tempo real
function atualizarGaleria() {
  galeriaFotos.innerHTML = '';
  db.ref('fotos').orderByChild('timestamp').on('value', snapshot => {
    galeriaFotos.innerHTML = '';
    snapshot.forEach(child => {
      const foto = child.val();
      const img = document.createElement('img');
      img.src = foto.url;
      img.alt = 'Foto enviada';
      img.style.maxWidth = '180px';
      img.style.margin = '10px';
      img.style.borderRadius = '14px';
      img.style.boxShadow = '0 5px 12px rgba(255, 92, 141, 0.4)';
      galeriaFotos.appendChild(img);
    });
  });
}

// Inicializa a galeria
atualizarGaleria();

// Fecha modal se clicar fora dele
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
