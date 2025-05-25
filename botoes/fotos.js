// Config Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO",
  databaseURL: "https://SEU_PROJETO.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

const senhaInput = document.getElementById('senhaInput');
const fotoInput = document.getElementById('fotoInput');
const enviarBtn = document.getElementById('enviarFotoBtn');
const galeria = document.getElementById('galeria');

function carregarGaleria() {
  galeria.innerHTML = '';
  db.ref('fotos').once('value', snapshot => {
    snapshot.forEach(child => {
      const foto = child.val();
      const img = document.createElement('img');
      img.src = foto.url;
      galeria.appendChild(img);
    });
  });
}

enviarBtn.addEventListener('click', () => {
  const senha = senhaInput.value;
  const file = fotoInput.files[0];

  if (senha !== 'Kaleu') {
    alert('Senha incorreta!');
    return;
  }

  if (!file) {
    alert('Selecione uma imagem primeiro.');
    return;
  }

  const storageRef = storage.ref('fotos/' + Date.now() + '-' + file.name);
  const uploadTask = storageRef.put(file);

  uploadTask.on('state_changed', null, error => {
    alert('Erro ao enviar: ' + error.message);
  }, () => {
    uploadTask.snapshot.ref.getDownloadURL().then(url => {
      db.ref('fotos').push({ url });
      alert('Foto enviada com sucesso!');
      carregarGaleria();
    });
  });
});

carregarGaleria();
