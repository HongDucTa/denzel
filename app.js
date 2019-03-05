const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://hongducta:<GuS*x/3#v'R7u/xc'RUq>@hongducta-movies-eevor.mongodb.net/test?retryWrites=true"
const DATABASE_NAME = "hongducta";

var app = Express();

const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';

const fs = require('fs');

async function fetchFilmography (actor) {
  try {
    console.log(`📽️  fetching filmography of ${actor}...`);
    const movies = await imdb(actor);
    const awesome = movies.filter(movie => movie.metascore >= 70);

    const file = fs.writeFileSync('filmography.json',JSON.stringify(awesome,null,2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

app.listen(9292, () => {
    console.log("Hello !");
});

app.get('/movies/populate', function(req,res){
    res.send('Populate the database with all the Denzel\'s movies from IMDb.');
})

app.get('/movies', function(req,res){
    res.send('Fetch a random must-watch movie.');
})

app.get('/movies/:id', function(req,res){
    res.send('Fetch a specific movie.');
})

app.get('/movies/search', function(req,res){
    res.send('Get movies search');
})

app.post('/movies/:id', function(req,res){
    res.send('Save a watched date and review')
})