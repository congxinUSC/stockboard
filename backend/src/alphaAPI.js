import request from 'request';
import moment from 'moment-timezone';

export class Alpha {
  base = 'http://www.alphavantage.co/query?';

  getPV () {
    return (req, res) => {
      let params =
        'function=' + 'TIME_SERIES_DAILY' +
        '&symbol=' + req.params.symbol +
        '&outputsize=full' +
        '&apikey=W6U249N3KNYWN2TB'; // should be constant

      function helper (url, tryCount = 5, callback = () => {} ) {
        if(tryCount <= 0) return;
        setTimeout(()=>{
          request.get(url, (err, resp, body) => {
            // deal with the error
            if (err) {
              console.error(error);
              res.json({error: 'Server side error in requesting alphavantage data.'});
            } else {
              try{
                let inJSON = JSON.parse(body);
                // deal with the json came from alphavantage and then turn it into
                if (!inJSON) {
                  console.log('json empty, tries left:' + tryCount);
                  helper(url, tryCount - 1);
                } else if (Object.keys(inJSON)[0] === 'Error Message'){
                  res.json({error: 'Invalid API call'});
                } else if (Object.keys(inJSON)[0] === 'Information'){
                  setTimeout(helper(url, tryCount-1), 5000);
                } else {
                  let _keys = Object.keys(inJSON);
                  let meta_data = inJSON[_keys[0]];
                  let main_data = inJSON[_keys[1]];
                  let data_keys = Object.keys(main_data);
                  let _open = Number(main_data[data_keys[0]]['1. open']).toFixed(2);
                  let _high = Number(main_data[data_keys[0]]['2. high']).toFixed(2);
                  let _low = Number(main_data[data_keys[0]]['3. low']).toFixed(2);
                  let _close = Number(main_data[data_keys[0]]['4. close']).toFixed(2);
                  let _volume = Number(main_data[data_keys[0]]['5. volume']);
                  let _previous_close = Number(main_data[data_keys[1]]['4. close']).toFixed(2);
                  let _change_val = (_close - _previous_close).toFixed(2);
                  let _change_percent = (_change_val / _previous_close * 100).toFixed(2).toString() + '%';
                  let _change_img = _change_val >= 0 ?
                    'http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png' :
                    'http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png';

                  let _HSdata = [];
                  let _HCcategories = [];
                  let _HCprice = [];
                  let _HCvolume = [];
                  let _latest = new Date(data_keys[0]).getTime();
                  for (let i = 0; i < data_keys.length; i++) {
                    let date = new Date(data_keys[i]).getTime();
                    _HSdata.push([date, Number(main_data[data_keys[i]]['4. close'])]);
                    if (_latest - date <= 180 * 24 * 3600 * 1000) {
                      _HCcategories.push(moment(data_keys[i]).format('MM/DD'));
                      _HCprice.push(Number(main_data[data_keys[i]]['4. close']));
                      _HCvolume.push(Number(main_data[data_keys[i]]['5. volume']));
                    }
                  }
                  let tzfix = moment.tz(meta_data['3. Last Refreshed'], 'America/New_York').format('z');
                  let tabTS = meta_data['3. Last Refreshed'].length>10
                    ? meta_data['3. Last Refreshed']
                    : meta_data['3. Last Refreshed']+' 16:00:00';
                  tabTS += ' ' + tzfix;
                  _HCcategories.reverse();
                  _HCprice.reverse();
                  _HCvolume.reverse();
                  _HSdata.reverse();
                  let retJSON = {
                    TABobj: {
                      symbol: req.params.symbol,
                      close: _close,
                      open: _open,
                      previous_close: _previous_close,
                      change_val: _change_val,
                      change_img: _change_img,
                      change_percent: _change_percent,
                      high: _high,
                      low: _low,
                      volume: _volume,
                      timestamp: tabTS
                    },
                    HCobj: {      // highcharts object
                      chart: {
                        zoomType: 'x'
                      },
                      title: {
                        text: req.params.symbol + ' Stock Price and Volume'
                      },
                      subtitle: {
                        text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>',
                        useHTML: true
                      },
                      yAxis: [
                        {
                          title: {
                            text: 'Stock Price'
                          }
                        },
                        {
                          title: {
                            text: 'Volume'
                          },
                          opposite: true
                        }
                      ],
                      xAxis: {
                        tickInterval: 5,
                        categories: _HCcategories
                      },
                      series: [
                        {
                          name: req.params.symbol,
                          type: 'area',
                          lineColor: '#0000FF',
                          fillOpacity: 0.5,
                          tooltip: {
                            valueDecimals: 2
                          },
                          yAxis: 0,
                          data: _HCprice //to be filled
                        },
                        {
                          name: req.params.symbol + ' Volume',
                          type: 'column',
                          color: '#FF0000',
                          borderColor: 'RGBA(255,0,0,0)',
                          yAxis: 1,
                          data: _HCvolume //to be filled
                        }
                      ]
                    },
                    HSobj: {      // highstocks object
                      title: {
                        text: req.params.symbol + ' Stock Value'
                      },
                      subtitle: {
                        text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>',
                        useHTML: true
                      },
                      rangeSelector: {
                        selected: 1
                      },
                      series: [
                        {
                          name: req.params.symbol,
                          data: _HSdata, // to be filled
                          type: 'area',
                          threshold: null,
                        }
                      ],
                      tooltip: {
                        split: false,
                        valueDecimals: 2,
                      }
                    }
                  };
                  res.json(retJSON);
                }
              } catch (e){
                console.error(e);
                res.json({error: 'unexpected response from alphavantage'});
              }
            }
            callback();
          });
        } , Math.random()*1000);
      }

      helper(this.base + params);
    }
  }
  getSMA () {
    return (req, res) => {
      let params =
        'function=' + 'SMA' +
        '&symbol=' + req.params.symbol +
        '&interval=daily' +
        '&time_period=10' +
        '&series_type=close' +
        '&apikey=W6U249N3KNYWN2TB'; // should be constant

      function helper (url, tryCount = 5, callback = () => {} ) {
        if (tryCount <= 0) return;
        setTimeout(() => {
          request.get(url, (err, resp, body) => {
            // deal with the error
            if (err) {
              console.error(error);
              res.json({error: 'Server side error in requesting alphavantage data.'});
            } else {
              try {
                let inJSON = JSON.parse(body);
                // deal with the json came from alphavantage and then turn it into
                if (!inJSON) {
                  console.log('json empty, tries left:' + tryCount);
                  helper(url, tryCount - 1);
                } else if (Object.keys(inJSON)[0] === 'Error Message'){
                  res.json({error: 'Invalid API call'});
                } else if (Object.keys(inJSON)[0] === 'Information'){
                  setTimeout(helper(url, tryCount-1), 5000);
                } else {
                  let _keys = Object.keys(inJSON);
                  let main_data = inJSON[_keys[1]];
                  let data_keys = Object.keys(main_data);

                  let _HCcategories = [];
                  let _HCSMA = [];
                  let _latest = new Date(data_keys[0]).getTime();
                  for(let i=0; i<data_keys.length; i++){
                    let date = new Date(data_keys[i]).getTime();
                    if(_latest-date <= 180 * 24 * 3600 * 1000) {
                      _HCcategories.push(moment(data_keys[i]).format('MM/DD'));
                      _HCSMA.push(Number(main_data[data_keys[i]]['SMA']));
                    }
                  }
                  _HCcategories.reverse();
                  _HCSMA.reverse();
                  let retJSON = {
                    HCobj: {      // highcharts object
                      chart: {
                        zoomType: 'x'
                      },
                      title: {
                        text: 'Simple Moving Average (SMA)'
                      },
                      subtitle: {
                        text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>',
                        useHTML: true
                      },
                      yAxis: {
                        title: {
                          text: 'SMA'
                        }
                      },
                      xAxis: {
                        tickInterval: 5,
                        categories: _HCcategories
                      },
                      series: [
                        {
                          name: req.params.symbol,
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCSMA //to be filled
                        },
                      ]
                    },
                  };
                  res.json(retJSON);
                }
              } catch (e){
                console.error(e);
                res.json({error: 'unexpected response from alphavantage'});
              }
            }
            callback();
          })
        }, Math.random() * 1000);
      }
      helper(this.base + params);
    }
  }
  getEMA () {
    return (req, res) => {
      let params =
        'function=' + 'EMA' +
        '&symbol=' + req.params.symbol +
        '&interval=daily' +
        '&time_period=10' +
        '&series_type=close' +
        '&apikey=W6U249N3KNYWN2TB'; // should be constant

      function helper (url, tryCount = 5, callback = () => {} ) {
        if (tryCount <= 0) return;
        setTimeout(() => {
          request.get(url, (err, resp, body) => {
            // deal with the error
            if (err) {
              console.error(error);
              res.json({error: 'Server side error in requesting alphavantage data.'});
            } else {
              try {
                let inJSON = JSON.parse(body);
                // deal with the json came from alphavantage and then turn it into
                if (!inJSON) {
                  console.log('json empty, tries left:' + tryCount);
                  helper(url, tryCount - 1);
                } else if (Object.keys(inJSON)[0] === 'Error Message'){
                  res.json({error: 'Invalid API call'});
                } else if (Object.keys(inJSON)[0] === 'Information'){
                  setTimeout(helper(url, tryCount-1), 5000);
                } else {
                  let _keys = Object.keys(inJSON);
                  let main_data = inJSON[_keys[1]];
                  let data_keys = Object.keys(main_data);

                  let _HCcategories = [];
                  let _HCEMA = [];
                  let _latest = new Date(data_keys[0]).getTime();
                  for(let i=0; i<data_keys.length; i++){
                    let date = new Date(data_keys[i]).getTime();
                    if(_latest-date <= 180 * 24 * 3600 * 1000) {
                      _HCcategories.push(moment(data_keys[i]).format('MM/DD'));
                      _HCEMA.push(Number(main_data[data_keys[i]]['EMA']));
                    }
                  }
                  _HCcategories.reverse();
                  _HCEMA.reverse();
                  let retJSON = {
                    HCobj: {      // highcharts object
                      chart: {
                        zoomType: 'x'
                      },
                      title: {
                        text: 'Exponential Moving Average (EMA)'
                      },
                      subtitle: {
                        text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>',
                        useHTML: true
                      },
                      yAxis: {
                        title: {
                          text: 'EMA'
                        }
                      },
                      xAxis: {
                        tickInterval: 5,
                        categories: _HCcategories
                      },
                      series: [
                        {
                          name: req.params.symbol,
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCEMA //to be filled
                        },
                      ]
                    },
                  };
                  res.json(retJSON);
                }
              } catch (e){
                console.error(e);
                res.json({error: 'unexpected response from alphavantage'});
              }
            }
            callback();
          })
        }, Math.random() * 1000);
      }
      helper(this.base + params);
    }
  }
  getRSI () {
    return (req, res) => {
      let params =
        'function=' + 'RSI' +
        '&symbol=' + req.params.symbol +
        '&interval=daily' +
        '&time_period=10' +
        '&series_type=close' +
        '&apikey=W6U249N3KNYWN2TB'; // should be constant

      function helper (url, tryCount = 5, callback = () => {} ) {
        if (tryCount <= 0) return;
        setTimeout(() => {
          request.get(url, (err, resp, body) => {
            // deal with the error
            if (err) {
              console.error(error);
              res.json({error: 'Server side error in requesting alphavantage data.'});
            } else {
              try {
                let inJSON = JSON.parse(body);
                // deal with the json came from alphavantage and then turn it into
                if (!inJSON) {
                  console.log('json empty, tries left:' + tryCount);
                  helper(url, tryCount - 1);
                } else if (Object.keys(inJSON)[0] === 'Error Message'){
                  res.json({error: 'Invalid API call'});
                } else if (Object.keys(inJSON)[0] === 'Information'){
                  setTimeout(helper(url, tryCount-1), 5000);
                } else {
                  let _keys = Object.keys(inJSON);
                  let main_data = inJSON[_keys[1]];
                  let data_keys = Object.keys(main_data);

                  let _HCcategories = [];
                  let _HCRSI = [];
                  let _latest = new Date(data_keys[0]).getTime();
                  for(let i=0; i<data_keys.length; i++){
                    let date = new Date(data_keys[i]).getTime();
                    if(_latest-date <= 180 * 24 * 3600 * 1000) {
                      _HCcategories.push(moment(data_keys[i]).format('MM/DD'));
                      _HCRSI.push(Number(main_data[data_keys[i]]['RSI']));
                    }
                  }
                  _HCcategories.reverse();
                  _HCRSI.reverse();
                  let retJSON = {
                    HCobj: {      // highcharts object
                      chart: {
                        zoomType: 'x'
                      },
                      title: {
                        text: 'Relative Strength Index (RSI)'
                      },
                      subtitle: {
                        text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>',
                        useHTML: true
                      },
                      yAxis: {
                        title: {
                          text: 'RSI'
                        }
                      },
                      xAxis: {
                        tickInterval: 5,
                        categories: _HCcategories
                      },
                      series: [
                        {
                          name: req.params.symbol,
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCRSI //to be filled
                        },
                      ]
                    },
                  };
                  res.json(retJSON);
                }
              } catch (e){
                console.error(e);
                res.json({error: 'unexpected response from alphavantage'});
              }
            }
            callback();
          })
        }, Math.random() * 1000);
      }
      helper(this.base + params);
    }
  }
  getADX () {
    return (req, res) => {
      let params =
        'function=' + 'ADX' +
        '&symbol=' + req.params.symbol +
        '&interval=daily' +
        '&time_period=10' +
        '&series_type=close' +
        '&apikey=W6U249N3KNYWN2TB'; // should be constant

      function helper (url, tryCount = 5, callback = () => {} ) {
        if (tryCount <= 0) return;
        setTimeout(() => {
          request.get(url, (err, resp, body) => {
            // deal with the error
            if (err) {
              console.error(error);
              res.json({error: 'Server side error in requesting alphavantage data.'});
            } else {
              try {
                let inJSON = JSON.parse(body);
                // deal with the json came from alphavantage and then turn it into
                if (!inJSON) {
                  console.log('json empty, tries left:' + tryCount);
                  helper(url, tryCount - 1);
                } else if (Object.keys(inJSON)[0] === 'Error Message'){
                  res.json({error: 'Invalid API call'});
                } else if (Object.keys(inJSON)[0] === 'Information'){
                  setTimeout(helper(url, tryCount-1), 5000);
                } else {
                  let _keys = Object.keys(inJSON);
                  let main_data = inJSON[_keys[1]];
                  let data_keys = Object.keys(main_data);

                  let _HCcategories = [];
                  let _HCADX = [];
                  let _latest = new Date(data_keys[0]).getTime();
                  for(let i=0; i<data_keys.length; i++){
                    let date = new Date(data_keys[i]).getTime();
                    if(_latest-date <= 180 * 24 * 3600 * 1000) {
                      _HCcategories.push(moment(data_keys[i]).format('MM/DD'));
                      _HCADX.push(Number(main_data[data_keys[i]]['ADX']));
                    }
                  }
                  _HCcategories.reverse();
                  _HCADX.reverse();
                  let retJSON = {
                    HCobj: {      // highcharts object
                      chart: {
                        zoomType: 'x'
                      },
                      title: {
                        text: 'Average Directional movement indeX (ADX)'
                      },
                      subtitle: {
                        text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>',
                        useHTML: true
                      },
                      yAxis: {
                        title: {
                          text: 'ADX'
                        }
                      },
                      xAxis: {
                        tickInterval: 5,
                        categories: _HCcategories
                      },
                      series: [
                        {
                          name: req.params.symbol,
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCADX //to be filled
                        },
                      ]
                    },
                  };
                  res.json(retJSON);
                }
              } catch (e){
                console.error(e);
                res.json({error: 'unexpected response from alphavantage'});
              }
            }
            callback();
          })
        }, Math.random() * 1000);
      }
      helper(this.base + params);
    }
  }
  getCCI () {
    return (req, res) => {
      let params =
        'function=' + 'CCI' +
        '&symbol=' + req.params.symbol +
        '&interval=daily' +
        '&time_period=10' +
        '&series_type=close' +
        '&apikey=W6U249N3KNYWN2TB'; // should be constant
      function helper (url, tryCount = 5, callback = () => {} ) {
        if (tryCount <= 0) return;
        setTimeout(() => {
          request.get(url, (err, resp, body) => {
            // deal with the error
            if (err) {
              console.error(error);
              res.json({error: 'Server side error in requesting alphavantage data.'});
            } else {
              try {
                let inJSON = JSON.parse(body);
                // deal with the json came from alphavantage and then turn it into
                if (!inJSON) {
                  console.log('json empty, tries left:' + tryCount);
                  helper(url, tryCount - 1);
                } else if (Object.keys(inJSON)[0] === 'Error Message'){
                  res.json({error: 'Invalid API call'});
                } else if (Object.keys(inJSON)[0] === 'Information'){
                  setTimeout(helper(url, tryCount-1), 5000);
                } else {
                  let _keys = Object.keys(inJSON);
                  let main_data = inJSON[_keys[1]];
                  let data_keys = Object.keys(main_data);

                  let _HCcategories = [];
                  let _HCCCI = [];
                  let _latest = new Date(data_keys[0]).getTime();
                  for(let i=0; i<data_keys.length; i++){
                    let date = new Date(data_keys[i]).getTime();
                    if(_latest-date <= 180 * 24 * 3600 * 1000) {
                      _HCcategories.push(moment(data_keys[i]).format('MM/DD'));
                      _HCCCI.push(Number(main_data[data_keys[i]]['CCI']));
                    }
                  }
                  _HCcategories.reverse();
                  _HCCCI.reverse();
                  let retJSON = {
                    HCobj: {      // highcharts object
                      chart: {
                        zoomType: 'x'
                      },
                      title: {
                        text: 'Commodity Channel Index (CCI)'
                      },
                      subtitle: {
                        text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>',
                        useHTML: true
                      },
                      yAxis: {
                        title: {
                          text: 'CCI'
                        }
                      },
                      xAxis: {
                        tickInterval: 5,
                        categories: _HCcategories
                      },
                      series: [
                        {
                          name: req.params.symbol,
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCCCI //to be filled
                        },
                      ]
                    },
                  };
                  res.json(retJSON);
                }
              } catch (e){
                console.error(e);
                res.json({error: 'unexpected response from alphavantage'});
              }
            }
            callback();
          })
        }, Math.random() * 1000);
      }
      helper(this.base + params);
    }
  }
  getBBANDS () {
    return (req, res) => {
      let params =
        'function=' + 'BBANDS' +
        '&symbol=' + req.params.symbol +
        '&interval=daily' +
        '&time_period=10' +
        '&series_type=close' +
        '&apikey=W6U249N3KNYWN2TB'; // should be constant

      function helper (url, tryCount = 5, callback = () => {} ) {
        if (tryCount <= 0) return;
        setTimeout(() => {
          request.get(url, (err, resp, body) => {
            // deal with the error
            if (err) {
              console.error(error);
              res.json({error: 'Server side error in requesting alphavantage data.'});
            } else {
              try {
                let inJSON = JSON.parse(body);
                // deal with the json came from alphavantage and then turn it into
                if (!inJSON) {
                  console.log('json empty, tries left:' + tryCount);
                  helper(url, tryCount - 1);
                } else if (Object.keys(inJSON)[0] === 'Error Message'){
                  res.json({error: 'Invalid API call'});
                } else if (Object.keys(inJSON)[0] === 'Information'){
                  setTimeout(helper(url, tryCount-1), 5000);
                } else {
                  let _keys = Object.keys(inJSON);
                  let main_data = inJSON[_keys[1]];
                  let data_keys = Object.keys(main_data);

                  let _HCcategories = [];
                  let _HCBBANDS_M = [];
                  let _HCBBANDS_U = [];
                  let _HCBBANDS_L = [];
                  let _latest = new Date(data_keys[0]).getTime();
                  for(let i=0; i<data_keys.length; i++){
                    let date = new Date(data_keys[i]).getTime();
                    if(_latest-date <= 180 * 24 * 3600 * 1000) {
                      _HCcategories.push(moment(data_keys[i]).format('MM/DD'));
                      _HCBBANDS_M.push(Number(main_data[data_keys[i]]['Real Middle Band']));
                      _HCBBANDS_U.push(Number(main_data[data_keys[i]]['Real Upper Band']));
                      _HCBBANDS_L.push(Number(main_data[data_keys[i]]['Real Lower Band']));
                    }
                  }
                  _HCcategories.reverse();
                  _HCBBANDS_M.reverse();
                  _HCBBANDS_U.reverse();
                  _HCBBANDS_L.reverse();
                  let retJSON = {
                    HCobj: {      // highcharts object
                      chart: {
                        zoomType: 'x'
                      },
                      title: {
                        text: 'Bollinger Bands (BBANDS)'
                      },
                      subtitle: {
                        text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>',
                        useHTML: true
                      },
                      yAxis: {
                        title: {
                          text: 'BBANDS'
                        }
                      },
                      xAxis: {
                        tickInterval: 5,
                        categories: _HCcategories
                      },
                      series: [
                        {
                          name: req.params.symbol + ' Real Middle Band',
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCBBANDS_M //to be filled
                        },
                        {
                          name: req.params.symbol + ' Real Upper Band',
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCBBANDS_U //to be filled
                        },
                        {
                          name: req.params.symbol + ' Real Lower Band',
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCBBANDS_L //to be filled
                        },
                      ]
                    },
                  };
                  res.json(retJSON);
                }
              } catch (e){
                console.error(e);
                res.json({error: 'unexpected response from alphavantage'});
              }
            }
            callback();
          })
        }, Math.random() * 1000);
      }
      helper(this.base + params);
    }
  }
  getMACD () {
    return (req, res) => {
      let params =
        'function=' + 'MACD' +
        '&symbol=' + req.params.symbol +
        '&interval=daily' +
        '&series_type=close' +
        '&apikey=W6U249N3KNYWN2TB'; // should be constant

      function helper (url, tryCount = 5, callback = () => {} ) {
        if (tryCount <= 0) return;
        setTimeout(() => {
          request.get(url, (err, resp, body) => {
            // deal with the error
            if (err) {
              console.error(error);
              res.json({error: 'Server side error in requesting alphavantage data.'});
            } else {
              try {
                let inJSON = JSON.parse(body);
                // deal with the json came from alphavantage and then turn it into
                if (!inJSON) {
                  console.log('json empty, tries left:' + tryCount);
                  helper(url, tryCount - 1);
                } else if (Object.keys(inJSON)[0] === 'Error Message'){
                  res.json({error: 'Invalid API call'});
                } else if (Object.keys(inJSON)[0] === 'Information'){
                  setTimeout(helper(url, tryCount-1), 5000);
                } else {
                  let _keys = Object.keys(inJSON);
                  let main_data = inJSON[_keys[1]];
                  let data_keys = Object.keys(main_data);

                  let _HCcategories = [];
                  let _HCMACD_V = [];
                  let _HCMACD_H = [];
                  let _HCMACD_S = [];
                  let _latest = new Date(data_keys[0]).getTime();
                  for(let i=0; i<data_keys.length; i++){
                    let date = new Date(data_keys[i]).getTime();
                    if(_latest-date <= 180 * 24 * 3600 * 1000) {
                      _HCcategories.push(moment(data_keys[i]).format('MM/DD'));
                      _HCMACD_V.push(Number(main_data[data_keys[i]]['MACD']));
                      _HCMACD_H.push(Number(main_data[data_keys[i]]['MACD_Hist']));
                      _HCMACD_S.push(Number(main_data[data_keys[i]]['MACD_Signal']));
                    }
                  }
                  _HCcategories.reverse();
                  _HCMACD_V.reverse();
                  _HCMACD_H.reverse();
                  _HCMACD_S.reverse();
                  let retJSON = {
                    HCobj: {      // highcharts object
                      chart: {
                        zoomType: 'x'
                      },
                      title: {
                        text: 'Moving Average Convergence/Divergence (MACD)'
                      },
                      subtitle: {
                        text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>',
                        useHTML: true
                      },
                      yAxis: {
                        title: {
                          text: 'MACD'
                        }
                      },
                      xAxis: {
                        tickInterval: 5,
                        categories: _HCcategories
                      },
                      series: [
                        {
                          name: req.params.symbol,
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCMACD_V //to be filled
                        },
                        {
                          name: req.params.symbol + ' Hist',
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCMACD_H //to be filled
                        },
                        {
                          name: req.params.symbol + ' Signal',
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCMACD_S //to be filled
                        },
                      ]
                    },
                  };
                  res.json(retJSON);
                }
              } catch (e){
                console.error(e);
                res.json({error: 'unexpected response from alphavantage'});
              }
            }
            callback();
          })
        }, Math.random() * 1000);
      }
      helper(this.base + params);
    }
  }
  getSTOCH () {
    return (req, res) => {
      let params =
        'function=' + 'STOCH' +
        '&symbol=' + req.params.symbol +
        '&interval=daily' +
        '&apikey=W6U249N3KNYWN2TB'; // should be constant

      function helper (url, tryCount = 5, callback = () => {} ) {
        if (tryCount <= 0) return;
        setTimeout(() => {
          request.get(url, (err, resp, body) => {
            // deal with the error
            if (err) {
              console.error(error);
              res.json({error: 'Server side error in requesting alphavantage data.'});
            } else {
              try {
                let inJSON = JSON.parse(body);
                // deal with the json came from alphavantage and then turn it into
                if (!inJSON) {
                  console.log('json empty, tries left:' + tryCount);
                  helper(url, tryCount - 1);
                } else if (Object.keys(inJSON)[0] === 'Error Message'){
                  res.json({error: 'Invalid API call'});
                } else if (Object.keys(inJSON)[0] === 'Information'){
                  setTimeout(helper(url, tryCount-1), 5000);
                } else {
                  let _keys = Object.keys(inJSON);
                  let main_data = inJSON[_keys[1]];
                  let data_keys = Object.keys(main_data);

                  let _HCcategories = [];
                  let _HCSTOCH_K = [];
                  let _HCSTOCH_D = [];
                  let _latest = new Date(data_keys[0]).getTime();
                  for(let i=0; i<data_keys.length; i++){
                    let dtobj=new Date(data_keys[i]);
                    let date = dtobj.getTime();
                    if(_latest-date <= 180 * 24 * 3600 * 1000) {
                      _HCcategories.push(moment(data_keys[i]).format('MM/DD'));
                      _HCSTOCH_K.push(Number(main_data[data_keys[i]]['SlowK']));
                      _HCSTOCH_D.push(Number(main_data[data_keys[i]]['SlowD']));
                    }
                  }
                  _HCcategories.reverse();
                  _HCSTOCH_K.reverse();
                  _HCSTOCH_D.reverse();
                  let retJSON = {
                    HCobj: {      // highcharts object
                      chart: {
                        zoomType: 'x'
                      },
                      title: {
                        text: 'Stochastic Osciliator (STOCH)'
                      },
                      subtitle: {
                        text: '<a href="https://www.alphavantage.co/" target="_blank">Source: Alpha Vantage</a>',
                        useHTML: true
                      },
                      yAxis: {
                        title: {
                          text: 'STOCH'
                        }
                      },
                      xAxis: {
                        tickInterval: 5,
                        categories: _HCcategories
                      },
                      series: [
                        {
                          name: req.params.symbol + ' SlowK',
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCSTOCH_K //to be filled
                        },
                        {
                          name: req.params.symbol + ' SlowD',
                          type: 'line',
                          tooltip: {
                            valueDecimals: 2
                          },
                          data: _HCSTOCH_D //to be filled
                        },
                      ]
                    },
                  };
                  res.json(retJSON);
                }
              } catch (e){
                console.error(e);
                res.json({error: 'unexpected response from alphavantage'});
              }
            }
            callback();
          })
        }, Math.random() * 1000);
      }
      helper(this.base + params);
    }
  }
}