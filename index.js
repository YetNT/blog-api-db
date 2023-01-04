const JSONdb = require('simple-json-db');
const users = new JSONdb('db/users.json');
const udb = require('./db/users.json')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("hased pass" + hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function verifyPassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

async function saveUser(id, name, pass) {
  const hashedPassword = await hashPassword(pass);
  var uI = {
    "username" : name,
    "password" : hashedPassword
  }

  users.set(id.toString(), uI);
}


function getUser(id) {
  if (udb.hasOwnProperty(id)) {
    var out = {
      "username" : udb[id]["username"]
    }
    return JSON.stringify(out)
  }
  return 'User not found'
}

// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
const ads = {title: 'ask openai what you were doing'}

app.use(helmet()); // adding Helmet to enhance your Rest API's security
app.use(bodyParser.json()); // using bodyParser to parse JSON bodies into JS objects
app.use(cors()); // enabling CORS for all requests
app.use(morgan('combined')); // adding morgan to log HTTP requests

app.get('/', (req, res) => {
  res.send(ads);
});

app.get('/user/:id', function (req, res) { 
  res.send(getUser(req.params.id))
})

app.get('/pswrd/:id', async function (req, res) { 
  if (req.ip != '172.31.128.1') {
    res.send({"Error" : "Invalid Credentials"});
  } else {
    const id = req.params.id;
    const password = req.query.password;

    if (!udb.hasOwnProperty(id)) {
      res.send({"Error" : "User not found"});
    } else {
      const hashedPassword = udb[id]["password"];
      const isMatch = await verifyPassword(password, hashedPassword);

      if (isMatch) {
        res.send({"password" : hashedPassword});
      } else {
        res.send({"Error" : "Incorrect password"});
      }
    }
  }
});

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});


/* 
END OF SERVeR SIDE
*/


var rand = Math.floor(Math.random() * 999999999999) + 1;

saveUser(rand, "Joe", "PASSWORD!")

/*
console.log(udb["342691365464"].username)
console.log(udb["342691365464"].password)
*/
