class Point{
    constructor(lat, lon, timestamp, latRad, lonRad){
        this.lat = lat;
        this.lon = lon;
        if (latRad && lonRad){
            this.latRad = latRad;
            this.lonRad = lonRad;
        } else {
            this.latRad = calcRad(lat);
            this.lonRad = calcRad(lon);
        }
        this.timestamp = timestamp;
    }

    static calcRad(degrees){
        return degrees * (Math.PI/180);
    }
}

module.exports = Point;