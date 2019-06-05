const MongoClient = require('mongodb').MongoClient;
const EventEmitter = require('events');

class DBConnector extends EventEmitter {
    constructor(collectionName) {
        super();
        this.setMaxListeners(50);
        this.uri = "mongodb+srv://milab-app:1234@milab-project-cluster-02wm4.mongodb.net/test?retryWrites=true";
        this.mongoClient = new MongoClient(this.uri, { useNewUrlParser: true });
        this.mongoClient.connect(function(err, client){
            if (err) {throw err;}
            this.mongoClient = client;
            this.dbo = client.db("milab-project-db");
            this.collection = this.dbo.collection(collectionName);
            this.emit('client connected');
        }.bind(this));
        this.emit('ready');
    }

    handleNotConnected(data){
        this.on('client connected', function(data){
            this.saveDataToDb(data);
        }.bind(this, data))
    }

    saveDataToDb(data) {
        console.log(data);
        if (!this.collection){
            this.handleNotConnected(data);
        } else if (data) {
            this.collection.insertOne(data, function(err, res) {
                if (err) throw err;
                console.log(`1 document inserted: ${data}`);
            });
        }
    }

    find(findParams, cb){
        this.collection.find(findParams).sort({'timestamp': 1}).toArray(function(err, documents) {
            if(err){
                //DO SOMETHING
            }
            cb(documents);
        });
    }
}

module.exports = DBConnector;

