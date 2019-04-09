const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const request = require('request');
const UserDataHandler = require('./UserDataHandler');
const userDataHandler = new UserDataHandler();

let dataTemplate = `<?xml version="1.0" ?>
<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
	<S:Body>
		<siriWS:GetStopMonitoringService xmlns:siriWS="http://new.webservice.namespace" xmlns="" xmlns:ns4="http://www.ifopt.org.uk/ifopt" xmlns:ns3="http://www.ifopt.org.uk/acsb" xmlns:siri="http://www.siri.org.uk/siri">
			<Request>
				<siri:RequestTimestamp>2017-05-08T11:18:45.237+03:00</siri:RequestTimestamp>
				<siri:RequestorRef>YK565656</siri:RequestorRef>
				<siri:MessageIdentifier>AC:20170425:230410:981</siri:MessageIdentifier>
				<siri:StopMonitoringRequest version="2.7">
					<siri:RequestTimestamp>2017-05-08T11:18:45.237+03:00</siri:RequestTimestamp>
					<siri:MessageIdentifier>0</siri:MessageIdentifier>
					<siri:PreviewInterval>PT30M</siri:PreviewInterval>
					<siri:StartTime>2017-05-08T11:18:45.237+03:00</siri:StartTime>
					<siri:MonitoringRef>1786</siri:MonitoringRef>
					<siri:MaximumStopVisits>100</siri:MaximumStopVisits>
				</siri:StopMonitoringRequest>
			</Request>
		</siriWS:GetStopMonitoringService>
	</S:Body>
</S:Envelope>`;

app.use(bodyParser.json());

server.listen(3000, () => {
	console.log('Listening on port 3000!');
});

app.post('/gps_data',(req, res) => {
	data = req.body;
	userDataHandler.insertCoordinates(data);
  	res.writeHead(200);
  	res.end("yo");
});

app.post('/get_api_data',(req, res) => {
	data = req.body;
	getApiData(dataTemplate);
  	res.writeHead(200);
  	res.end("yo");
});

function getApiData(data) {
	request({
		url: 'http://siri.motrealtime.co.il:8081/Siri/SiriServices',
		method: 'POST',
		headers: {
			'Content-Type': 'text/xml',
			'Accept': 'text/xml',
			'Accept': 'multipart/related',
			'Content-Length': data.length
		},
		body: data
	}, function(err, res, body){
		if (err) {
			console.log(err);
		}
		console.log(res.body);
	})
}

io.on('connection', (socket)=>{
	var updates = ['you are on a bus', 'you got off the bus' , 'you are on a bird', 'you got off the bird'];
	var index = -1;
	console.log('connected');

	socket.on("user_gps_data", function(data){
		if (data){
			console.log('data was received from socket io');
			userDataHandler.insertCoordinates(data);
		}
	})

	serverUpdate = setInterval(()=>{
		index = (index + 1) % 3;
		socket.emit('server_update', {update: `${updates[index]}`});
	}, 30000);
});
