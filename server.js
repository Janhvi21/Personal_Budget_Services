const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const ofirebase = require("./firebase/setData");

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const admin = require('./firebase-admin/admin');
app.use(cors());

const budget = require('./budgetData.json');
console.log(budget);


app.get('/budget', (req, res) => {
  res.json(budget);
});

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});


app.post("/createNewUser/", function (req, res) {
  let token = "";
  admin.auth().createUser({
      email: req.body.email,
      emailVerified: false,
      password: req.body.password,
      displayName: req.body.username,
      disabled: false,
    }).then((userRecord) => {
      admin.auth().createCustomToken(userRecord.uid)
        .then((customToken) => {
          token = customToken;
          ofirebase.createNewUser(userRecord);
          res.send({
            "tokenID": token
          });
        })
        .catch((error) => {
          console.log("Token Error:", error);
        })
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
    })

})
app.get("/verifyUser/", verifyToken, function (req, res) {
  res.send({
    "message": "OK"
  });
});

app.get("/getUserInfo/", function (req, res) {
  ofirebase.getUserInfo(req.params, function (err, data) {
    res.send(data);
  })
});



async function verifyToken(req, res, next) {
  const idToken = req.query.token;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken) {
      req.body.uid = decodedToken;
      console.log(decodedToken)
      return next();

    } else {
      return res.status(401).send("You are not authorized!");
    }
  } catch (e) {
    return res.status(401).send("You are not authorized!");
  }
}