import Point from './Point';
import GeoCalculator from './GeoCalculator';

// https://www.movable-type.co.uk/scripts/latlong.html
class Matcher {
    static scoreBoundry;
    
    constructor(startPointUser, sessionId){
      this.startPointUser = startPointUser;
      this.currentScore = 0;
      // we need to have different sessions for different journeys so we can ask for the right Point from db;
      this.sessionId = sessionId;
    }

    guessMatchingPoint(){
      
    }
}

module.exports = Matcher;