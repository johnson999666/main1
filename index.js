require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.set('view engine', 'ejs');
const io = require('socket.io')(server);




app.get('/', (req, res) => {
  res.render('index', { name: 'World' });
});

app.get('/pics', (req, res) => {
  res.render('pics', { name: 'World' });
});

app.get('/face', (req, res) => {
  res.render('face', { name: 'World' });
});



app.listen(process.env.PORT ||3000, "0.0.0.0", () => {
  console.log('Server listening on port 3000');
});
