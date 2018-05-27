const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', (req, res, next)=>{
    const user = {
        username: 'admin',
        password: 'admin'
    };
    if(req.body.username === user.username && req.body.password === user.password){
        jwt.sign({}, 'secretkey', {expiresIn: '30s'}, (err, token) => {
            res.json({
                message: 'loged',
                token: token
            })
        });
    } else {
        res.status(401).json({
            success: 'false',
            errorMessage: 'Login error'
        })
    }
});

// Format of token
// Authentication: Bearer <access_token>

// Verify token

function verifyToken(req, res, next){
    // Get header value
    const bearerHeader = req.header['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader != 'undefined') {
        const bearer = bearerHeader.split(' ')
    } else {
        // Forbidden
        res.sendStatus();
    }
}

module.exports = router;