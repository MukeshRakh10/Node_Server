//Its used to devlop the rest API's.
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
app.use(cors());
app.use(express.json());


let uri = "mongodb+srv://mukesh-10:mukesh-10@cluster0.6uqlv.mongodb.net/redux_middleware?retryWrites=true&w=majority";
let client = null;
let collection = null;
let loginDb = null;

async function main() {
  client = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    collection = await client.db("redux_middleware").collection("products");
    loginDb = await client.db("redux_middleware").collection("login_details");
    
    console.log("successfully connect to mongo cluster");
    // Make the appropriate DB calls
    // await listDatabases(client);
  } catch (e) {
    console.error(e);
  } finally {
    // await client.close();
  }
}
main().catch(console.error);

//middleware
const token_middleware = (req, res, next) => {
  const headers = req.headers;
  if (headers.token === "dumyToken") {
    next(); // possitive response 
    // if match then it call the login
  }
  else {
    res.send({ "auth": "Authentication failed.." });
  }
}

//save
app.post("/signUpSave", (req, res) => {
  console.log("In login method...");
  collection.insertOne({
    "fullname": req.body.fullname,
    "email": req.body.email,
    "password": req.body.password
  })
    .then(item => {
      res.send(item);
    })
    .catch(err => {
      res.send(err);
    });
});

//validate login credintials
app.post("/validateLogin", (req, res) => {
  console.log("In validateLogin Node JS email ",req.body.email+" "+req.body.password);
  loginDb.find({
    "email": req.body.email,
    "password": req.body.password
  })
    .toArray()
    .then((array) => {
      console.log("Server Response  ",array);
      if (array.length > 0) {
        res.send({ "login": "success" });
      } else {
        res.send({ "login": "failed" });
      }
    })
});

//get product list
app.get("/products", (req, res) => {
  collection.find().toArray()
    .then(result => {
      res.send(result);
    })
});

app.listen(8080, () => {
  console.log("Server listening port no 8080 ");
})


