const JSONdb = require('simple-json-db');
const users = new JSONdb('db/users.json');
const udb = require('./db/users.json')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


function saveUser(id, name, pass) {
  var uI = {
    "username" : name,
    "password" : pass
  }

  users.set(id.toString(), uI);
}


function getUser(id, info) {
  if (udb.hasOwnProperty(id)) {
    if (info == "name") {
      var out = {
        "username" : udb[id]["username"]
      }
    } else if ( info == "pass") {
      var out = {
        "password" : udb[id]["password"]
      }
    } else {
      var out = {
        "Error" :"What the hell are you trying to do with this function?"
      }
    }
    return JSON.stringify(out)
  }
  return 'User not found'
}

// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
const ads = {'title': 'ask openai what you were doing'}

app.use(helmet()); // adding Helmet to enhance your Rest API's security
app.use(bodyParser.json()); // using bodyParser to parse JSON bodies into JS objects
app.use(cors()); // enabling CORS for all requests
app.use(morgan('combined')); // adding morgan to log HTTP requests

app.get('/', (req, res) => {
  res.send(ads);
});

app.get('/user/:id', function (req, res) { 
  res.send(getUser(req.params.id), "name")
})

app.get('/pswrd/:id', function (req, res) { 
  if (req.hostname == 'hlonipoole692@gmail.com') {
    res.send({"Error" : "Invalid Credentials"})
  } else {
    res.send(getUser(req.params.id, "pass"))
  }
})

console.log(udb.values())

app.post('/db', (req, res) => {
  const va = req.body
  console.log(req.body)
  if (va.auth != "gg") {
    console.log(req.body.auth)
    res.send({"Error" : "Invalid"})
  } else {
    try {

      if (udb.hasOwnProperty(va.user.id) ) {
        res.send({"Error" : "ID already exists and is in use."})
      } else {
        if ( !va.user.id || !va.user.username || va.user.password) {
          res.send({"Error" : "Something is invalid or null"})
        } else {
          res.send({"Success" : "Success, your code works YetnT!"})
        }
      }
      
    } catch (err) {
      
      res.send({"Error" : "k"})
      
    }
  }
})

/*
{
  "auth" : "p",
  "user" : {
    "id" : "",
    "username" : "Username",
    "password" : "pass"
  }
}

*/
// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});


/* 
END OF SERVeR SIDE
*/


var rand = Math.floor(Math.random() * 999999999999) + 1;

// saveUser(rand, "Han", "PASSWORD!")

/*
console.log(udb["342691365464"].username)
console.log(udb["342691365464"].password)
*/
