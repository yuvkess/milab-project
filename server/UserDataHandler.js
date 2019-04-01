const DBConnector = require('./DBConnector.js');
const userCoordinatesData = new DBConnector('gps-data-user');

class UserDataHandler {
    constructor() {
        this.numberOfCoordinates = 0;
        this.numberOfDifferentCoordinates = 0;
        this.lastCoordinates = {};
        this.events = this.initEvents();
    }

    initEvents() {
        // return {'enoughData': 'enoughData'};
    }

    insertCoordinates(data) {
        userCoordinatesData.saveDataToDb(data);
        this.numberOfCoordinates++;
        if (this.lastCoordinates !== data) {
            this.numberOfDifferentCoordinates++;
        }
        this.lastCoordinates = data;
    }

    subscribe(eventName) {
        // dispatch event
    }
}

module.exports = UserDataHandler;
