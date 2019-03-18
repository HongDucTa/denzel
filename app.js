const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;


const CONNECTION_URL = "mongodb+srv://denzel:abc@hongducta-movies-eevor.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "denzel";

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}




var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243'; // id of Denzel. Do not change

const fs = require('fs');

async function fetchFilmography(actor) {
  try {
    console.log(`📽️  fetching filmography of ${actor}...`);
    const movies = await imdb(actor);
    const awesome = movies.filter(movie => movie.metascore >= 70);

    fs.writeFileSync('filmography.json', JSON.stringify(awesome, null, 2));
    console.log("Done !");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

//fetchFilmography(DENZEL_IMDB_ID);

app.listen(9292, () => {
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
      throw error;
    }
    const database = client.db(DATABASE_NAME);
    console.log("CONNECTED TO " + DATABASE_NAME + " !");
    client.close();
  });
});

app.get('/movies/populate', function (req, res) {
  const file = fs.readFileSync("filmography.json");
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
      throw error;
    }
    const database = client.db(DATABASE_NAME);
    const collection = database.collection("imdb");
    collection.insertMany(JSON.parse(String(file)),(error,result) => {
      if (error)
      {
        return res.status(500).send(error);
      }
    });
    client.close();
  });
  res.send("Data inserted to database !");
  console.log("Data inserted to database !");
})

app.get('/movies', function (req, res) {
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
      throw error;
    }
    const database = client.db(DATABASE_NAME);
    const collection = database.collection("imdb");
    const result = collection.find().toArray(function (error,results){
      if (error)
      {
        res.send(error);
      }
      else
      {
        const len = results.length;
        const index = randomIntFromInterval(0,len - 1);
        res.send(results[index]);
      }
    });
    client.close();
  });
})

app.get('/movies/search', function (req, res) {
  
})

app.get('/movies/:id', function (req, res) {
  const id = req.params.id
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
      throw error;
    }
    const database = client.db(DATABASE_NAME);
    const collection = database.collection("imdb");
    collection.findOne({id: id}, function(err,result){
      if (err)
      {
        res.send(err);
      }
      res.send(result);
    })
    client.close();
  });
})

app.post('/movies/:id', function (req, res) {
  res.send(req.params.id + '\n' + String(req.query));
})
