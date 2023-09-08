"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
// run on docker mysql container
//ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'bd'
const connection = mysql2_1.default.createConnection({
    host: '172.18.0.3',
    user: 'root',
    password: 'shopperdb',
    database: 'shopper'
});
exports.default = connection;
