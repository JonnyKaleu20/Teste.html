// Referências Firebase
const messagesRef = firebase.database().ref('chatMensagens');

// --- CHAT ---
function sendMessage() {
  const input = document.getElementById('chat-input');
  const texto = input.value.trim();
  if (texto === '') return;

  messagesRef.push({
    user: 'Visitante', // pode mudar para nome de usuário depois
    message: texto,
    timestamp: Date.now()
  });

  input.value = '';
}

messagesRef.on('child_added', snapshot => {
  const msg = snapshot.val();
  const container = document.getElementById('chat-box');
  const el = document.createElement('div');
  const data = new Date(msg.timestamp).toLocaleString();
  el.textContent = `${msg.user} (${data}): ${msg.message}`;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight; // scroll automático
});
