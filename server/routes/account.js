import express from 'express';
import Account from '../models/account';

const router = express.Router();
console.log("account log");
/*
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE { "username": "test", "password": "test"}
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAME EXISTS
*/

router.post('/signup', (req, res) => {
    console.log(req.body);
    // CHECK USERNAME FORMAT
    let usernameRegex = /^[a-z0-9]+$/;

    if(!usernameRegex.test(req.body.username)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    // CHECK PASSWORD LENGTH
    if(req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    // CHECK USER EXISTANCE
    Account.findOne({ username: req.body.username }, (err, exists) => {
        if(err) throw err;
        if(exists) {
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 3
            });
        }
        // CREATE ACCOUNT
        let account = new Account({
            username: req.body.username,
            password: req.body.password,
            admin: req.body.admin
        });

        account.password = account.generateHash(account.password);

        // SAVE IN THE DATABASE
        account.save( err=> {
            if(err) throw err;
            return res.json({ success: true });
        });

    });
});

export default router;