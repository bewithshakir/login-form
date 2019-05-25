var express = require('express');
var app = express();
var axios = require('axios');
const WebSocket = require("ws");
var path = require('path');
const http = require('http'); 

// var Protocol = require('azure-iot-device-mqtt').Mqtt;
// Uncomment one of these transports and then change it in fromConnectionString to test other transports
// var Protocol = require('azure-iot-device-amqp').AmqpWs;
// var Protocol = require('azure-iot-device-http').Http;
// var Protocol = require('azure-iot-device-amqp').Amqp;
var Protocol = require('azure-iot-device-mqtt').MqttWs;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;


app.use(express.static(path.join(__dirname, "public")));
app.use(function(req, res /*, next*/) {
  res.redirect("/");
}); 


// const server = http.createServer(app); 
 const server = http.createServer(app).listen(8080);
 

const wss = new WebSocket.Server({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  console.log('----', data)
wss.clients.forEach(function each(client) {
  if (client.readyState === WebSocket.OPEN) {
    try {
    console.log("sending data " + data);
    client.send(data);
    } catch (e) {
    console.error(e);
    }
  }
});
}; 




// app.get('/azure', function (req, res) { 
//     // console.log('--/azure--', req.body)
//     // console.log('--/azure--', res.body)
//     res.render('index', { title: 'Hey', message: 'Hello there!'}); 
// }); 

// var port = 5000;

// app.listen(port, function() {
//     console.log('Server listening: http://localhost:' + port);
// });


// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
var connectionString = 'HostName=demotest123.azure-devices.net;DeviceId=shakirTest;SharedAccessKey=AfyAVGO276oRyWDMsk3PDGAkfI2MJJ0kfZbIwNhqNtA=';

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol);

var connectCallback = function (err, data) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Client connected');
    var myData;
    client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + JSON.stringify(msg));
      console.log('Id: ' + msg.messageId + ' properties: ' + JSON.stringify(msg.properties.propertyList));
      var abc = msg.data;
      // Broadcast to all.
      var obj = {
        body: msg.data,
        properties: msg.properties.propertyList
      }
      
      wss.broadcast(JSON.stringify(obj));
      // wss.broadcast(msg.data);




    // fetch('http://localhost:5000/azure').then( function() {
    //     console.log('-- top-- then')
    //     return resp.json();
    // }).then(function(data){
    //     console.log('--data--')
    // }).catch(ex => {
    //     console.error(ex);
    // })
      // When using MQTT the following line is a no-op.
      client.complete(msg, printResultFor('completed'));
      // The AMQP and HTTP transports also have the notion of completing, rejecting or abandoning the message.
      // When completing a message, the service that sent the C2D message is notified that the message has been processed.
      // When rejecting a message, the service that sent the C2D message is notified that the message won't be processed by the device. the method to use is client.reject(msg, callback).
      // When abandoning the message, IoT Hub will immediately try to resend it. The method to use is client.abandon(msg, callback).
      // MQTT is simpler: it accepts the message by default, and doesn't support rejecting or abandoning a message.
    });

    // Create a message and send it to the IoT Hub every two seconds
    var sendInterval = setInterval(function () {
      var windSpeed = 10 + (Math.random() * 4); // range: [10, 14]
      var temperature = 20 + (Math.random() * 10); // range: [20, 30]
      var humidity = 60 + (Math.random() * 20); // range: [60, 80]
      var data = JSON.stringify({ deviceId: 'shakirTest', windSpeed: windSpeed, temperature: temperature, humidity: humidity });
      var message = new Message(data);
      message.properties.add('temperatureAlert', (temperature > 28) ? 'true' : 'false');
    //   console.log('Sending message: ' + message.getData());
    //   client.sendEvent(message, printResultFor('send'));
    }, 2000);

    client.on('error', function (err) {
      console.error(err.message);
    });

    client.on('disconnect', function () {
      clearInterval(sendInterval);
      client.removeAllListeners();
      client.open(connectCallback);
    });
  }
};

client.open(connectCallback);

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

