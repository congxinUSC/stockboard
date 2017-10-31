import express from 'express';
// use request instead of http because it handles redirection automatically
import request from 'request';
import bodyParser from 'body-parser';
import { parseString } from 'xml2js';
import { Alpha } from './alphaAPI';

let app = express();

let alpha =new Alpha();

let messages = [
  {text: 'some text', owner: 'Congxin'},
  {text: 'other text', owner: 'superman'}];

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
  next();
});


let api = express.Router();

// get stock symbols for auto complete from Market on Demand
api.get('/lookup/:shortcut', (req, res) => {
  const base = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=';
  request.get(base + req.params.shortcut, respJSON(res));
});

// get stock information (price, volume, indicators) from Alpha Vantage.
// Approach 1 deal with the functions separately:
api.get('/alpha/:symbol/PV', alpha.getPV());
api.get('/alpha/:symbol/SMA', alpha.getSMA());
api.get('/alpha/:symbol/EMA', alpha.getEMA());
api.get('/alpha/:symbol/RSI', alpha.getRSI());
api.get('/alpha/:symbol/ADX', alpha.getADX());
api.get('/alpha/:symbol/CCI', alpha.getCCI());
api.get('/alpha/:symbol/BBANDS', alpha.getBBANDS());
api.get('/alpha/:symbol/MACD', alpha.getMACD());
api.get('/alpha/:symbol/STOCH', alpha.getSTOCH());

// Approach 2 wait for all messages and package them into one JSON (deprecated)
/*
// TODO: deal with wait-for-multiple-async-function problem
api.get('/alpha/:symbol', (req, res) => {
  const base = 'http://www.alphavantage.co/query?';
  let params =
    '&symbol=' + req.params.symbol +
    '&apikey=W6U249N3KNYWN2TB'; // should be constant

  const PV = '&function=TIME_SERIES_DAILY$outputsize=full';
  const SHAREDPM =
    '&interval=daily'+
    '&time_period=10'+
    '&series_type=close';
  const SMA = '&function=SMA' + SHAREDPM;
  const EMA = '&function=EMA' + SHAREDPM;
  const RSI = '&function=RSI' + SHAREDPM;
  const ADX = '&function=ADX' + SHAREDPM;
  const CCI = '&function=CCI' + SHAREDPM;
  const BBANDS = '&function=BBANDS' + SHAREDPM;
  const STOCH = '&function=STOCH&interval=daily';


  request.get(base + params + PV, respJSON(res));
  // TODO: duplicate this ^ function for all parameters
});
*/

// get stock news from Seeking Alpha News
api.get('/news/:symbol', (req, res) => {
  const base = "https://seekingalpha.com/api/sa/combined/";
  request.get(base + req.params.symbol, (err, resp, body) => {
    parseString(body, (err, result) => {
      res.json(result);
    });
  });
});

// get brief stock information from Market on Demand
api.get('/short/:symbol', (req, res) => {
  const base = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=';
  request.get(base + req.params.symbol, respJSON(res));
});

// helper function for the api
let respJSON = function (res) {
  return (err, resp, body) => {
    // TODO: deal with the error
    // TODO: deal with the resp header?
    res.json(JSON.parse(body));
  };
};


api.get('/messages', (req, res) => {
  res.json(messages);
});

api.get('/messages/:user', (req, res) => {
  let user = req.params.user;
  let result = messages.filter(message => message.owner === user);
  res.json(result);
});

api.post('/messages', (req, res) => {
  messages.push(req.body);
  res.json(req.body);
});

app.use('/api', api);

app.listen(4201);