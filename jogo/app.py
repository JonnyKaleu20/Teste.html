from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # permite conexões do frontend

@app.route('/')
def home():
    return render_template('home.html')  # só se tiver uma home

@app.route('/jogo')
def jogo():
    return render_template('jogo.html')

@socketio.on('draw')
def handle_draw(data):
    emit('draw', data, broadcast=True, include_self=False)

@socketio.on('clear')
def handle_clear():
    emit('clear', broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
