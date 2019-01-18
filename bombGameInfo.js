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

        this.addGameInfoToMysql = function(sender_psid, game_id, player_id) {
            this.selectSenderId(sender_psid, game_id, player_id, this.addSenderId, this.updateSenderId);
        };

        this.selectSenderId = function(sender_psid, game_id, player_id, addSenderId, updateSenderId) {
            let sql = 'SELECT * FROM gameinfo where senderid=' + sender_psid + ' and game_id=' + game_id + ' and player_id=' + player_id + ' limit 1';
            let flag = false;
            connection.query(sql, function(err, result, fields) {
                if (err) {
                    console.log("err:-", err.message);
                } else {
                    console.log("selectSenderId success: ", result);
                    if (result.length == 0) {
                        addSenderId(sender_psid, game_id, player_id);
                    } else {
                        updateSenderId(sender_psid, game_id, player_id);
                    }
                }
            });
        };

        this.addSenderId = function(sender_psid, game_id, player_id) {
            let time = Math.round(new Date() / 1000);

            let addsql = 'INSERT INTO gameinfo(senderid,game_id,player_id,updatetime) VALUES(?,?,?,?)';
            var add_params = [sender_psid, game_id, player_id, time];
            connection.query(addsql, add_params, function(err, result) {
                if (err) {
                    console.log("err:-", err.message);
                } else {
                    console.log("addSenderId success: ", result);
                }
            });
        };
        this.updateSenderId = function(sender_psid, game_id, player_id) {
            let time = Math.round(new Date() / 1000);

            let updatesql = 'UPDATE gameinfo SET game_id=?, player_id=?, updatetime=? WHERE senderid=?';
            let update_params = [game_id, player_id, time, sender_psid];

            connection.query(updatesql, update_params, function(err, result) {
                if (err) {
                    console.log("err:-", err.message);
                } else {
                    console.log("updateSenderId success: ", result.affectedRows);
                }
            });
        }
    }
    this.UserInfoMysql = function UserInfoMysql() {
        this.addDataToMysql = function(sender_psid) {
            this.selectSenderId(sender_psid, this.addSenderId, this.updateSenderId);
        };

        this.selectSenderId = function(sender_psid, addSenderId, updateSenderId) {
            let sql = 'SELECT * FROM fbinfo where senderid=' + sender_psid + ' limit 1';
            connection.query(sql, function(err, result, fields) {
                if (err) {
                    console.log("err:-", err.message);
                } else {
                   if (result.length == 0) {
                        addSenderId(sender_psid);
                   } else {
                        updateSenderId(sender_psid);
                   }
                }
            });
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