const MongoClient = require('mongodb').MongoClient;

class DBConnector {
    constructor(collectionName) {
        this.uri = "mongodb+srv://milab-app:1234@milab-project-cluster-02wm4.mongodb.net/test?retryWrites=true";
        this.mongoClient = new MongoClient(this.uri, { useNewUrlParser: true });
        this.mongoClient.connect(function(err, client){
            if (err) {throw err;}
            this.dbo = client.db("milab-project-db");
            this.collection = this.dbo.collection(collectionName);
        }.bind(this));
    }

    saveDataToDb(data) {
        console.log(data);
        if (data) {
            this.collection.insertOne({
                timestamp: data.timestamp,
                userid: data.userId,
                loc : { type: "Point", coordinates: [ data.longitude, data.latitude ] }
            }, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
            });
        }
    }
}

module.exports = DBConnector;

