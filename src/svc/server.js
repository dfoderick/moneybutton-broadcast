const express = require('express');
let sseExpress = require('sse-express')
const port = 3000;
const app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })
app.listen(port, function () {
    console.log("Server is running on "+ port +" port");
})

let globalId = 1;
let connections = [];
let onHand = 3
let price = .01

  function getMoneyButtonConfig() {
      return { 
        amount: price,
        quantityOnHand: onHand
    }
  }

  function broadcast(msg) {
    connections.forEach(function(connection) {
        connection.sse('message', msg);
    })
  }

    //admin posts a product update
    app.post('/update', function(req, res) {
        onHand = parseInt(req.body.quantityOnHand);
        price = parseFloat(req.body.price);
        //broadcast new config to all listeners
        let mb = getMoneyButtonConfig()
        logit('update', mb)
        broadcast(mb)
    })

    //customer buys a product
    app.post('/buy', function(req, res) {
        onHand = Math.max(0, onHand - parseInt(req.body.quantity))
        console.log(`bought ${req.body.quantity}, remaining ${onHand}`)
        broadcast(getMoneyButtonConfig())
    })

    //client calls this to get current money button config
    //this is a request/reply synchronous api
    app.get('/config', function (req, res) {
            const mb = getMoneyButtonConfig()
            res.json(mb)
            logit('config', mb)
    })

    function logit(proc, det) {
        console.log(`${proc}> con:${connections.length}> ${JSON.stringify(det)}`)
    }

    //client subscribes to moneybuttonupdate to get notified of changes
    app.get('/moneybuttonupdate', sseExpress, function(req, res) {
        connections.push(res);
        res.sse('connected', {
          id: globalId
        });
        console.log(`Hello, ${globalId}! Connected to MoneyButton Broadcast`);
        globalId++;
    
        req.on("close", function() {
          //_.remove(connections, res);
          connections = connections.filter(function(item) { 
            return item !== req
        })

          console.log('clients: ' + connections.length);
        });
    })

