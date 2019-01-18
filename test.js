'use strict';


var Mysql = require('./bombGameInfo');

let ss_mysql = new Mysql();
let gameinfo = new ss_mysql.UserGameInfoMysql();

//game.addGameInfoToMysql(12334556, 11, 555);

gameinfo.addGameInfoToMysql(2036803036437285, 183114262334141, 2143775379015463);
//let fb = new ss.UserInfoMysql();
//fb.addDataToMysql(1111);
//
//
// let attachment_url = received_message.attachments[0].payload.url;
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
    }