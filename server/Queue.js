const EventEmitter = require('events');
const APIDataHandler = require('./APIDataHandler');
const DBConnector = require('./DBConnector.js');
const userCoordinatesData = new DBConnector('gps-data-user');
const minSize = 2; //???

class Queue extends EventEmitter {
    constructor(userStartTimestamp){
        super();
        this.fillQueue();
        this.lastTimeStamp = userStartTimestamp;
        
    }

    fillQueue(){
        this.filling = true;
        var findParams = {
            timestamp: { $lt: this.lastTimeStamp }
        }
        userCoordinatesData.find(findParams, function(docs){
            // fill points
            // update this.lastTimeStamp
            this.filling = false;
        }.bind(this));
    }

    size(){

    }
    
    getNext(){


        if(this.size() < minSize && !this.filling){
            this.fillQueue();
        }
    }

    isEmpty(){

    }

    insert(){

        // insert

        if(this.isEmpty()){
            this.emit('match');
        }
    }

    
    

}

module.exports = Queue;