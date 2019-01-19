'use strict';

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '******',
    database: 'bomb'
});

connection.connect();

function Mysql() {

    this.UserGameInfoMysql = function UserGameInfoMysql() {

        this.addGameInfoToMysql = function(sender_psid,  player_id) {
            let time = Math.round(new Date() / 1000);
            let addsql = "INSERT INTO  gameinfo(senderid,player_id,updatetime) VALUES(?,?,?) ON duplicate key update updatetime=" + time;
            var add_params = [sender_psid,  player_id, time];
            connection.query(addsql, add_params, function(err, result) {
                if (err) {
                    console.log("err:-", err.message);
                } else {
                    console.log("addSenderId success: ", result);
                }
            });
        };

      
        this.addSenderId = function(sender_psid,  player_id) {
            let time = Math.round(new Date() / 1000);

            let addsql = 'INSERT INTO gameinfo(senderid,player_id,updatetime) VALUES(?,?,?)';
            var add_params = [sender_psid,  player_id, time];
            connection.query(addsql, add_params, function(err, result) {
                if (err) {
                    console.log("err:-", err.message);
                } else {
                    console.log("addSenderId success: ", result);
                }
            });
        };
        this.updateSenderId = function(sender_psid,  player_id) {
            let time = Math.round(new Date() / 1000);

            let updatesql = 'UPDATE gameinfo SET senderid=?, updatetime=? WHERE player_id=?';
            let update_params = [sender_psid, time, player_id];

            connection.query(updatesql, update_params, function(err, result) {
                if (err) {
                    console.log("err:-", err.message);
                } else {
                    console.log("updateSenderId success: ", result.affectedRows);
                }
            });
        }

        this.selectUsertoPush = function(time, callback) {
   
            let sql = 'SELECT senderid, player_id,updatetime FROM gameinfo where updatetime < ' + time + ' ORDER BY updatetime ASC';
            connection.query(sql, function(err, result, fields) {
                if (err) {
                    console.log("err:-", err.message);
                } else {
                    callback(result);
                }
            });
        }
    }

    this.UserInfoMysql = function UserInfoMysql() {
        this.addDataToMysql = function(sender_psid) {
            let time = Math.round(new Date() / 1000);
            let addsql = "INSERT INTO  fbinfo(senderid,updatetime) VALUES(?,?) ON duplicate key update updatetime=" + time;
            var add_params = [sender_psid, time];
            connection.query(addsql, add_params, function(err, result) {
                if (err) {
                    console.log("err:-", err.message);
                    return false;
                } else {
                    console.log("success: ", result);
                    return true;
                }
            });
            //this.selectSenderId(sender_psid, this.addSenderId, this.updateSenderId);
        };


        this.addSenderId = function(sender_psid) {
            let time = Math.round(new Date() / 1000);

            let addsql = 'INSERT INTO fbinfo(senderid,updatetime) VALUES(?,?)';
            var add_params = [sender_psid, time];
            connection.query(addsql, add_params, function(err, result) {
                if (err) {
                    console.log("err:-", err.message);
                    return false;
                } else {
                    console.log("success: ", result);
                    return true;
                }
            });
        };
        this.updateSenderId = function(sender_psid) {
            let time = Math.round(new Date() / 1000);

            let updatesql = 'UPDATE fbinfo SET updatetime= ? WHERE senderid=?';
            let update_params = [time, sender_psid];

            connection.query(updatesql, update_params, function(err, result) {
                if (err) {
                    console.log("err:-", err.message);
                    return false;
                } else {
                    console.log("success: ", result.affectedRows);
                    return true;
                }
            });
        }
    }
}
module.exports = Mysql;