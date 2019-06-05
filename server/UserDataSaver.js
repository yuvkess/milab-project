const DBConnector = require('./DBConnector.js');
const userCoordinatesData = new DBConnector('gps-data-user');

class UserDataSaver{
    constructor(io) {
        this.numberOfCoordinates = 0;
        this.numberOfDifferentCoordinates = 0;
        this.lastCoordinates = {};
        this.initSocket(io);
    }

    initSocket(io){
        this.io = io;
        this.io.on('connection', (socket)=>{
            var updates = ['ON_BUS', 'OFF_BUS'];
            var index = -1;
            console.log('connected');
        
            socket.on("user_gps_data", function(data){
                if (data){
                    console.log('data was received from socket io');
                    this.insertCoordinates(data);
                }
            }. bind(this))
        
            var serverUpdate = setInterval(()=>{
                index = (index + 1) % 3;
                socket.emit('server_update', {update: `${updates[index]}`});
            }, 30000);
        });
    }

    insertCoordinates(data) {
        var parsedData = this.parseCoordinates(data);
        userCoordinatesData.saveDataToDb(parsedData);
        this.numberOfCoordinates++;
        if (this.lastCoordinates !== data) {
            this.numberOfDifferentCoordinates++;
        }
        this.lastCoordinates = data;
    }

    parseCoordinates(data){
        return {
            _id: `${data.timestamp}_${Date.now()}`,
            sessionId: '//TODO??',
            timestamp: Number(data.timestamp),
            userid: data.userId,
            loc : { type: "Point", coordinates: [ data.longitude, data.latitude ] }
        }
    }
}

module.exports = UserDataSaver;
