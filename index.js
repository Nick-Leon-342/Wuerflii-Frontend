




/*
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Array, um aktive Sitzungen zu speichern
const activeSessions = [];

// Server-Port festlegen
const port = 3000;

// Middleware für JSON-Body-Parsing
app.use(express.json());

// Route zum Erstellen einer neuen Sitzung
app.post('/create-session', (req, res) => {
  const sessionName = req.body.sessionName;
  const sessionCode = generateUniqueCode();

  activeSessions.push({ name: sessionName, code: sessionCode });

  res.status(200).json({ sessionCode });
});

// Socket.IO-Verbindung für Echtzeitkommunikation
io.on('connection', (socket) => {
  console.log('Neuer Spieler verbunden:', socket.id);

  // Wenn sich ein Spieler mit einem Sitzungscode verbindet
  socket.on('join-session', (sessionCode) => {
    const session = activeSessions.find((s) => s.code === sessionCode);
    if (session) {
      socket.join(sessionCode);
      console.log('Spieler mit Socket ID', socket.id, 'tritt Sitzung', sessionCode, 'bei');
    } else {
      console.log('Ungültiger Sitzungscode:', sessionCode);
    }
  });
});

// Funktion zum Generieren eines eindeutigen Sitzungscodes
function generateUniqueCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Server starten
server.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
}); */