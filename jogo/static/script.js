const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let currentColor = '#d63384';

const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', e => {
  currentColor = e.target.value;
});

canvas.addEventListener('mousedown', () => {
  drawing = true;
  ctx.beginPath();
});

canvas.addEventListener('mouseup', () => {
  drawing = false;
});

canvas.addEventListener('mouseout', () => {
  drawing = false;
});

canvas.addEventListener('mousemove', e => {
  if (!drawing) return;
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  // Desenha uma linha até a posição do mouse
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

// Função para limpar o canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Receber desenho dos outros
socket.on('draw', (data) => {
    const w = canvas.width;
    const h = canvas.height;
    drawLine(data.x1 * w, data.y1 * h, data.x2 * w, data.y2 * h, data.color, false);
});

// Função para limpar
function limpar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear');
}

// Limpar para todos
socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
