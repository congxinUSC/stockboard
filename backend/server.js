var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var messages = [
  {text: 'some text', owner: 'Congxin'},
  {text: 'other text', owner: 'superman'}];

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
  next();
})



app.get('/messages', (req, res) => {
  res.json(messages);
})

app.post('/message', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
})

app.listen(4201);