const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
// const request = require('request');
const UserDataSaver = require('./UserDataSaver');
const userDataSaver = new UserDataSaver(io);

app.use(bodyParser.json());

server.listen(3000,() => {
	console.log('Listening on port 3000!');
});

app.post('/gps_data',(req, res) => {
	data = req.body;
	userDataSaver.insertCoordinates(data);
  	res.writeHead(200);
  	res.end("yo");
});