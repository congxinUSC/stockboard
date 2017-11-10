import express from 'express';
// use request instead of http because it handles redirection automatically
import request from 'request';
import bodyParser from 'body-parser';
import { parseString } from 'xml2js';
import { Alpha } from './alphaAPI';
import moment from 'moment-timezone';

let app = express();

let alpha =new Alpha();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
  next();
});


let api = express.Router();

// get stock symbols for auto complete from Market on Demand
// response as fast as possible
api.get('/lookup/:shortcut', (req, res) => {
  const base = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=';
  request.get(base + req.params.shortcut, (err,resp,body)=>{
    // deal with the error
    if(err){
      console.error(err);
      res.json([]);
    } else {
      try{
        let ret=JSON.parse(body);
        res.json(ret);
      } catch (e) {
        console.error(e);
        res.json([]);
      }
    }
  });
});

// get brief stock information from Market on Demand
api.get('/short/:symbol', (req, res) => {
  const base = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=';
  request.get(base + req.params.symbol, (err,resp,body)=>{
    // deal with the error
    if(err){
      console.error(err);
      res.json({error: 'Failed to get information from marketondemand'});
    } else {
      try{
        let ret=JSON.parse(body);
        res.json(ret);
      } catch (e) {
        console.error(e);
        res.json({error:'Request blocked by marketondemand.'});
      }
    }
  });
});

// get stock information (price, volume, indicators) from Alpha Vantage.

api.get('/alpha/:symbol/Price', alpha.getPV());
api.get('/alpha/:symbol/SMA', alpha.getSMA());
api.get('/alpha/:symbol/EMA', alpha.getEMA());
api.get('/alpha/:symbol/RSI', alpha.getRSI());
api.get('/alpha/:symbol/ADX', alpha.getADX());
api.get('/alpha/:symbol/CCI', alpha.getCCI());
api.get('/alpha/:symbol/BBANDS', alpha.getBBANDS());
api.get('/alpha/:symbol/MACD', alpha.getMACD());
api.get('/alpha/:symbol/STOCH', alpha.getSTOCH());

api.post('/chart', (req, res)=>{
  const exportURL = 'http://export.highcharts.com/';
  request.post({
    headers:{},
    url: exportURL,
    form: req.body
    },(err, resp, body)=>{
      if(err){
        console.error(err);
        res.send('');
        throw err;
      } else {
        res.send(exportURL+body);
      }
    });
});

// get stock news from Seeking Alpha News
api.get('/news/:symbol', (req, res) => {
  const base = "https://seekingalpha.com/api/sa/combined/";
  function helper(url, tryCount=5, callback=()=>{}){
    if(tryCount<=0) return;
    setTimeout(()=>{
      request.get(url, (err, resp, body) => {
        if(err){
          console.error(error);
          res.json({error: 'Server side error in requesting news feed.'});
          throw error;
        } else {
          parseString(body, (err, result) => {
            if(err){
              console.error(error);
              res.json({error: 'Server side error in parsing news xml'});
              throw error;
            } else {
              if(!result){
                helper(url, tryCount-1);
              } else {
                let list = result.rss.channel[0].item;
                let retJSON =[];
                for(let i=0, count=0;i<list.length && count<5;i++) {
                  if(list[i].link[0].indexOf('/article/') !== -1){
                    let tmp = {
                      title: list[i].title[0],
                      link: list[i].link[0],
                      author: list[i]['sa:author_name'][0],
                      pubDate: list[i].pubDate[0].substr(0,list[i].pubDate[0].length-5)+
                      moment.tz(list[i].pubDate[0], 'America/New_York').format('z')
                    };
                    retJSON.push(tmp);
                    count++;
                  }
                }
                res.json(retJSON);
              }
            }
          });
        }
        callback();
      });
    }, Math.random()*200);
  }
  helper(base + req.params.symbol);
});

app.use('/api', api);

let server = app.listen(8081, ()=>
{
  let host=server.address().address;
  let port=server.address().port;

  console.log('Node listening at http://%s:%s', host, port);
});