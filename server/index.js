const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const UserDataSaver = require('./UserDataSaver');
const Matcher = require('./Matcher');
var userDataSaver = new UserDataSaver(io);

app.use(bodyParser.json());

server.listen(process.env.PORT || 3000,() => {
	console.log('Listening on port 3000!');
});

app.post('/gps_data',(req, res) => {
	data = req.body;
	userDataSaver.insertCoordinates(data);
  	res.writeHead(200);
  	res.end("yo");
});

app.post('/activity_update',(req, res) => {
	data = req.body;
	if(data.activityType){
		new Matcher(data);
	}
  	res.writeHead(200);
	res.end(data.activityType);
});