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

