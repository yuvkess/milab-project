const Point = require('./Point');
const GeoCalculator = require('./GeoCalculator');
const Queue = require('./Queue');
const scoreBoundry = 1;

class Matcher {
    constructor(userData){
        this.userData = userData;
        this.startPointUser = new Point(userData.lat, userData.lon, userData.timestamp);
        this.currentScore = 0;
    //   // we need to have different sessions for different journeys so we can ask for the right Point from db;
    //   this.sessionId = sessionId;
        this.queue = new Queue(startPointUser.timestamp);
        this.queue.on('match', this.match.bind(this));
        this.scores = [];
    }

    match(){
        while(!this.queue.isEmpty()){
            let points = queue.getNext(); // points={userPrev: Point, userCurrent: Point, vehicle: Point}
            let prevUserPoint = points.userPrev;
            let currentUserPoint = points.userCurrent;
            let vehiclePoint = points.vehicle;
            let timeStampRatio = (vehiclePoint.timestamp - prevUserPoint.timestamp) / (currentUserPoint.timestamp - prevUserPoint.timestamp);
            let guessedUserPoint = GeoCalculator.intermediatePointTo(prevUserPoint, currentUserPoint, timeStampRatio, timestamp);
            let distance = GeoCalculator.calcDistance(guessedUserPoint, currentUserPoint);
            // how do we want to calculate the score?
            
        }
    }
}

module.exports = Matcher;