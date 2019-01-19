'use strict';
const PAGE_ACCESS_TOKEN = "EAACmipyPSr0BAKJP5FTgmpucFodSZBNdlY4g8q5amMEjZAxFitFUmxjsq6qcqSxGDC2Tlzk7kQaEKHkT46UtYFJWbXdapkcCCZAygtw54kY52cwaODzpNF4qmexxQgQv6G7UHSwOSxaWqKNDSkSAeAtdsrq2ATQpYdD4QZBEwZBjOsZAmF2Kqr"

var log4js = require('log4js');
log4js.configure('config/log4js.json');
var logger = require('log4js').getLogger("gamepush");

const request = require('request');
// Imports dependencies and set up http server
const
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json()); // creates express http server


var Mysql = require('./bombGameInfo');
let ss_mysql = new Mysql();
let gameinfo = new ss_mysql.UserGameInfoMysql();
let fbinfo = new ss_mysql.UserInfoMysql();

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

var redis = require('redis');
var client = redis.createClient(4510,'10.148.0.2');


//sendCallbackUser(1990710367711069,2003951882985887);


function PushGameToUser(result) {
    let time = Math.round(new Date() / 1000)-86400;
     for (var i = 0; i < result.length; i++)
     {
        if (result[i].updatetime < time) {

            let keys = "f_"+result[i].player_id;
            let player_id = result[i].player_id;
            let senderid = result[i].senderid;
            client.hgetall(keys, function(err, object) {
               if (object != null) {
                    if (object.count < 3 && object.time < time) {
                      addPushCount(keys, object.count+1);
                      sendCallbackUser(senderid, player_id);
                    }  else {
                         //console.log("%d %s",i,keys);
                    }
                } else {
                    addPushCount(keys,1);
                    sendCallbackUser(senderid,player_id);
                }
            })
        }
     }
    //process.exit();
}


function addPushCount(keys, count) {
    let time = Math.round(new Date() / 1000);
    client.hmset(keys, {'count': count, 'time': time});
    client.expire(keys, 10*86400)
}



function sendCallbackUser(senderid, player_id) {

    let response;
    let img_url = "https://bit.ly/2RZsm0B";
    let index = myRandomFunction() % 3;
    if (index == 1) {
        img_url = "https://bit.ly/2FE48lI";
    } else if (index == 2) {
        img_url = "https://bit.ly/2QR8l7L";
    }
    let face = "https://www.facebook.com/imMinesweeperZone/?ref=br_tf&epa=SEARCH_BOX";
    response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Warning！New mission is coming!!",
                    "subtitle": "minesweeperZone.",
                    "image_url": img_url,
                    "buttons": [
                        {
                          "type": "web_url",
                          "url": face,
                          "title": "fanpage",
                        },
                        {
                        "type": "game_play",
                        "title": "Play Now!",
                        "payload":"",
                        "game_metadata": {
                            "player_id": player_id,
                            }
                        }],
                }]
            }
        }
    }
    let str = JSON.stringify(response);
    //console.log("%s", str);
    logger.debug(str);
    //callSendAPI(senderid, response);
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

   // let str = JSON.stringify(request_body);
   // console.log(str);
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

function run(){
    let time = Math.round(new Date() / 1000)-86400;
    gameinfo.selectUsertoPush(time, PushGameToUser);  
}

//logger.info('start gamepush.....................');
setInterval(run, 1000*10800);
//setInterval(run, 1000);

//sendCallbackUser(1990710367711069, 2003951882985887);