const Point = require('./Point');
const radius =  6371e3;

// https://www.movable-type.co.uk/scripts/latlong.html

class GeoCalculator{
    static intermediatePointTo(start, end, fraction, timestamp) {
        var latDifference = end.latRad - start.latRad;
        var lonDifference = end.lonRad - start.lonRad;
        var a = Math.sin(latDifference/2) * Math.sin(latDifference/2)
            + Math.cos(start.latRad) * Math.cos(end.latRad) * Math.sin(lonDifference/2) * Math.sin(lonDifference/2);
        var δ = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var A = Math.sin((1-fraction)*δ) / Math.sin(δ);
        var B = Math.sin(fraction*δ) / Math.sin(δ);

        var x = A * Math.cos(start.latRad) * Math.cos(start.lonRad) + B * Math.cos(end.latRad) * Math.cos(end.lonRad);
        var y = A * Math.cos(start.latRad) * Math.sin(start.lonRad) + B * Math.cos(end.latRad) * Math.sin(end.lonRad);
        var z = A * Math.sin(start.latRad) + B * Math.sin(end.latRad);

        var newLatRad = Math.atan2(z, Math.sqrt(x*x + y*y));
        var newLonRad = Math.atan2(y, x);

        var lat = toDeg(newLatRad);
        var lon = toDeg(newLonRad);

        return new Point(lat, lon, timestamp, newLatRad, newLonRad);
    }

    // in meters
    static calcDistance(p1, p2) {
        var differenceLatRad = toRad(p2.lat-p1.lat);
        var differenceLonRad = toRad(p2.lon-p1.lon);

        var a = Math.sin(differenceLatRad/2) * Math.sin(differenceLatRad/2) +
        Math.cos(p1.latRad) * Math.cos(p2.latRad) *
        Math.sin(differenceLonRad/2) * Math.sin(differenceLonRad/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return radius * c;
    }

    static toRad(degrees){
        return degrees * (Math.PI/180);
    }

    static toDeg(rad){
        return rad * 180 / Math.PI
    }
}

module.exports = GeoCalculator;