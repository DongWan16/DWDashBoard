'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
console.log("account log");
/*
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE { "username": "test", "password": "test"}
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAME EXISTS
*/

router.post('/signup', function (req, res) {
    console.log(req.body);
    // CHECK USERNAME FORMAT
    var usernameRegex = /^[a-z0-9]+$/;

    if (!usernameRegex.test(req.body.username)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    // CHECK PASSWORD LENGTH
    if (req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    // CHECK USER EXISTANCE
    _account2.default.findOne({ username: req.body.username }, function (err, exists) {
        if (err) throw err;
        if (exists) {
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 3
            });
        }
        // CREATE ACCOUNT
        var account = new _account2.default({
            username: req.body.username,
            password: req.body.password,
            admin: req.body.admin
        });

        account.password = account.generateHash(account.password);

        // SAVE IN THE DATABASE
        account.save(function (err) {
            if (err) throw err;
            return res.json({ success: true });
        });
    });
});

exports.default = router;