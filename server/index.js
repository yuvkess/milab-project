const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const uri = "mongodb+srv://milab-app:1234@milab-project-cluster-02wm4.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
const app = express();
app.use(bodyParser.json());
let dbo;
let collection;

client.connect(err => {
  dbo = client.db("milab-project-db");
  collection = dbo.collection("gps-data");
});

// app.get('/gps_data', (req, res) => {
//   let dataExample = { userid:"yuval-test", longitude: "test1", latitude: "test2" };
//   collection.insertOne(dataExample, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//   });
//   res.writeHead(200);
//  	res.end("The data is saved in the DB");
// });


app.post('/gps_data',(req, res) => {
  let object = req.body;
  console.log(object);
  collection.insertOne(object, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
    });
  res.writeHead(200);
  res.end("yo");
});


app.listen(3000, () => {
 console.log('Listening on port 3000!');
});



//  client.close();
