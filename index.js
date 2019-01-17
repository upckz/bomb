'use strict';
const PAGE_ACCESS_TOKEN = "EAACmipyPSr0BAKJP5FTgmpucFodSZBNdlY4g8q5amMEjZAxFitFUmxjsq6qcqSxGDC2Tlzk7kQaEKHkT46UtYFJWbXdapkcCCZAygtw54kY52cwaODzpNF4qmexxQgQv6G7UHSwOSxaWqKNDSkSAeAtdsrq2ATQpYdD4QZBEwZBjOsZAmF2Kqr"

var log4js = require('log4js');
log4js.configure('config/log4js.json');
var logger = require('log4js').getLogger("webhook");

const request = require('request');
// Imports dependencies and set up http server
const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); // creates express http server


Math.seed = function(s) {
    var m_w = s;
    var m_z = 987654321;
    var mask = 0xffffffff;

    return function() {
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;

        var result = ((m_z << 16) + m_w) & mask;
        result /= 4294967296;

        return result + 0.5;
    }
}

var myRandomFunction = Math.seed(1234);


connection = connectMysql();

//app.use(log4js.connectLogger(log4js.getLogger("webhook"), { level: 'debug' }));

// Sets server port and logs message on success
//app.listen(1336, 'localhost', () => logger.info('webhook is listening'));
app.listen(1337, 'localhost', () => logger.info('webhook is listening'));


// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {

    let body = req.body;

    let str = JSON.stringify(body);

    logger.info('message sent!  '+str)
    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];

            // Get the sender PSID
            if ( webhook_event.sender) {
                let sender_psid = webhook_event.sender.id;
                logger.info('Sender PSID: ' + sender_psid);
                if (webhook_event.game_play) {
                    logger.info('GamePlay: ', + sender_psid);
                }

                if (webhook_event.message) {
                    handleMessage(sender_psid, webhook_event.message);
                } else if (webhook_event.postback) {
                    handlePostback(sender_psid, webhook_event.postback);
                }
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "^*hfUIJHG"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            logger.debug('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Handles messages events
function handleMessage(sender_psid, received_message) {

    let response;

    // Check if the message contains text
    /*if (received_message.text) {

        // Create the payload for a basic text message
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    } else if (received_message.attachments) {

        var img_url = "https://bit.ly/2RZsm0B";
        var index =  myRandomFunction()%3;
        if (index  == 1) {
          img_url = "https://bit.ly/2FE48lI";
        } else if (index == 2)  {
           img_url = "https://bit.ly/2QR8l7L";
        }

        // Gets the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "A new mission has come!",
                        "subtitle": "minesweeperzone",
                        "image_url": img_url,
                        "buttons": [{
                               "type":"game_play",
                                "title":"Play",
                                "payload":"{test}",
                                "game_metadata": { // Only one of the below
                                  "player_id": sender_psid,
                                }
                            },
                        ],
                    }]
                }
            }
        }
    }*/

    var img_url = "https://bit.ly/2RZsm0B";
    var index = myRandomFunction() % 3;
    if (index == 1) {
        img_url = "https://bit.ly/2FE48lI";
    } else if (index == 2) {
        img_url = "https://bit.ly/2QR8l7L";
    }

    // Gets the URL of the message attachment
    //let attachment_url = received_message.attachments[0].payload.url;
    response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Try the game play button!",
                "buttons": [{
                    "type": "game_play",
                    "title": "Play",
                    "payload": "SERIALIZED_JSON_PAYLOAD",
                    "game_metadata": {
                        "player_id": "4590736473645"
                    }
                }]
            }
        }
    }

    // logger.info(response);
    // Sends the response message
    callSendAPI(sender_psid, response);

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            logger.info('message sent!')
        } else {
            logger.error("Unable to send message:" + err);
        }
    });

}

function connectMysql()
{
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '******',
    database : 'bomb'
  });
   
  connection.connect();
  return connection;
}

function addDataToMysql(sender_psid) {
  let time = Date.now();
  let sql = 'SELECT * FROM userinfo where senderid'


  var  addSql = 'UPDATE  userinfo(senderid) VALUES(?)';
  
}