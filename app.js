const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

/* local database
const CONNECTION_URL = "mongodb://localhost:27017";
const DATABASE_NAME = "denzel";
*/

const uri = "mongodb+srv://hongducta:<password>@hongducta-movies-eevor.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

var app = Express();

const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243'; // id of Denzel. Do not change

const fs = require('fs');

async function fetchFilmography (actor) {
  try {
    console.log(`📽️  fetching filmography of ${actor}...`);
    const movies = await imdb(actor);
    const awesome = movies.filter(movie => movie.metascore >= 70);

    fs.writeFileSync('filmography.json',JSON.stringify(awesome,null,2));
    console.log("Done !");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

/* BOUT DE CODE POUR MongoDB CONNECT
MongoClient.connect(CONNECTION_URL,function(err,client){
  console.log("Connection success");
  const db = client.db(DATABASE_NAME);
  client.close();
});
*/

//fetchFilmography(DENZEL_IMDB_ID);



// BOUT DE CODE POUR API
/*
app.listen(9292, () => {
    console.log("Hello !");
});

app.get('/movies/populate', function(req,res){
    res.send('Populate the database with all the Denzel\'s movies from IMDb.');
})

app.get('/movies', function(req,res){
    res.send('Fetch a random must-watch movie.');
})

app.get('/movies/search', function(req,res){
    res.send('Get movies search');
})

app.get('/movies/:id', function(req,res){
    res.send('Fetch a specific movie.' + req.params.id);
})

app.post('/movies/:id', function(req,res){
    res.send(req.params.id + '\n' + String(req.query));
})
*/