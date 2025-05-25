// Referências Firebase (já inicializados no index.html)
const messagesRef = firebase.database().ref('chatMensagens');
const cartinhasRef = firebase.database().ref('cartinhas');
const fotosRef = firebase.database().ref('fotos'); // opcional, se quiser listar no DB

// --- CHAT ---
// Envia mensagem do chat
function sendMessage() {
  const input = document.getElementById('chat-input');
  const texto = input.value.trim();
  if (texto === '') return;

  messagesRef.push({
    user: 'Visitante', // aqui pode trocar por nome do usuário, se quiser
    message: texto,
    timestamp: Date.now()
  });

  input.value = '';
}

// Exibe mensagens do chat em tempo real
messagesRef.on('child_added', snapshot => {
  const msg = snapshot.val();
  const container = document.getElementById('chat-box');
  const el = document.createElement('div');
  const data = new Date(msg.timestamp).toLocaleString();
  el.textContent = `${msg.user} (${data}): ${msg.message}`;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight; // scroll automático para baixo
});

// --- CARTINHAS ---
// Envia cartinha texto ou com arquivo (imagem)
function sendCartinha() {
  const nome = document.getElementById('cartinha-nome').value.trim();
  const mensagem = document.getElementById('cartinha-msg').value.trim();
  const fileInput = document.getElementById('cartinha-file');
  if (!nome || (!mensagem && fileInput.files.length === 0)) {
    alert('Por favor, preencha nome e mensagem ou envie uma imagem.');
    return;
  }

  if (fileInput.files.length > 0) {
    // Envia a imagem para o Firebase Storage
    const file = fileInput.files[0];
    const storageRef = firebase.storage().ref('cartinhas/' + Date.now() + '_' + file.name);
    storageRef.put(file).then(() => {
      storageRef.getDownloadURL().then(url => {
        // Salva no database a cartinha com imagem
        cartinhasRef.push({
          user: nome,
          mensagem: mensagem || '',
          imageUrl: url,
          timestamp: Date.now()
        });
      });
    });
  } else {
    // Só texto
    cartinhasRef.push({
      user: nome,
      mensagem: mensagem,
      imageUrl: '',
      timestamp: Date.now()
    });
  }

  // limpa inputs
  document.getElementById('cartinha-nome').value = '';
  document.getElementById('cartinha-msg').value = '';
  fileInput.value = '';
}

// Exibe as cartinhas em tempo real
cartinhasRef.on('child_added', snapshot => {
  const c = snapshot.val();
  const container = document.getElementById('cartinhas-box');
  const el = document.createElement('div');
  const data = new Date(c.timestamp).toLocaleString();

  el.innerHTML = `<strong>${c.user}</strong> (${data}):<br>${c.mensagem ? c.mensagem : ''} <br>`;
  if (c.imageUrl) {
    el.innerHTML += `<img src="${c.imageUrl}" style="max-width:200px; display:block; margin-top:5px;" />`;
  }
  el.style.border = '1px solid #ccc';
  el.style.padding = '10px';
  el.style.margin = '10px 0';

  container.appendChild(el);
});

// --- FOTOS (upload e listagem) ---
function sendPhoto() {
  const fileInput = document.getElementById('photo-input');
  if (fileInput.files.length === 0) {
    alert('Selecione uma foto para enviar.');
    return;
  }
  const file = fileInput.files[0];
  const storageRef = firebase.storage().ref('fotos/' + Date.now() + '_' + file.name);

  storageRef.put(file).then(() => {
    storageRef.getDownloadURL().then(url => {
      // Opcional: Salvar URL no Realtime Database para listar
      fotosRef.push({
        url: url,
        timestamp: Date.now()
      });

      alert('Foto enviada com sucesso!');
      fileInput.value = '';
      loadFotos(); // Atualiza lista de fotos
    });
  }).catch(error => {
    alert('Erro ao enviar foto: ' + error.message);
  });
}

// Função para carregar e mostrar fotos
function loadFotos() {
  const container = document.getElementById('photos-box');
  container.innerHTML = '';

  fotosRef.once('value', snapshot => {
    snapshot.forEach(childSnap => {
      const foto = childSnap.val();
      const el = document.createElement('img');
      el.src = foto.url;
      el.style.maxWidth = '150px';
      el.style.margin = '5px';
      container.appendChild(el);
    });
  });
}

// Chamar para carregar fotos quando a página carregar
window.onload = () => {
  loadFotos();
};
