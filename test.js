'use strict';


var Mysql = require('./bombGameInfo');

let ss_mysql = new Mysql();
let gameinfo = new ss_mysql.UserGameInfoMysql();
let fbinfo = new ss_mysql.UserInfoMysql();
 //fbinfo.addDataToMysql(111);
//gameinfo.addGameInfoToMysql(111,555);

//gameinfo.addGameInfoToMysql(2036803036437285, 2143775379015463);
//let fb = new ss.UserInfoMysql();
//fb.addDataToMysql(1111);
//
//
// let attachment_url = received_message.attachments[0].payload.url;

/*let time = Math.round(new Date() / 1000);

gameinfo.selectUsertoPush(time, PushGameToUser);

function PushGameToUser(result) {
     for (var i = 0; i < result.length; i++)
     {
        console.log("%s\t%s\t%s",result[i].senderid, result[i].player_id, result[i].updatetime);
     }

}*/
  console.log("111111111....");