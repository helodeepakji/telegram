const express = require('express');
const connection = require('../db/connection');
const path = require('path');
const route = express.Router();

route.get('/auth/:username/:id', async (req, res) => {
    const username = req.params.username;
    const id = req.params.id;
    req.session.username = username;
    req.session.user_id = id;

    connection.query('SELECT * FROM users WHERE `user_id` = ?', [id], (error, results, fields) => {
        if (error) {
            console.error('Error fetching user:', error);
            return res.status(500).send('Internal Server Error');
        }
        
        if (results.length === 0) {
            connection.query('INSERT INTO users (`user_id`, `username`) VALUES (?, ?)', [id, username], (insertError, insertResults, insertFields) => {
                if (insertError) {
                    console.error('Error inserting user:', insertError);
                    return res.status(500).send('Internal Server Error');
                }
                console.log('User inserted:', username);
                req.session.coin = 0;
            });
        } else {
            console.log('User exists:', results[0].username);
            req.session.coin = results[0].coin;
        }
    });

    res.redirect('/home');
});

route.get('/home', (req, res) => {
    res.sendFile(path.join(process.cwd(),'build', 'index.html'));
});

route.get('/username', (req, res) => {
    if (req.session.username && req.session.user_id) {
        connection.query('SELECT * FROM users WHERE `user_id` = ?', [req.session.user_id], (error, results, fields) => {
            if (results) {
                res.json(results[0]);
            }
        });
    } else {
        res.send('No session data found');
    }
});

route.get('/api/addCoin/:coin', (req, res) => {
    const coin = req.params.coin;
    if (req.session.username && req.session.user_id) {
        var user_id = req.session.user_id;
        connection.query('UPDATE `users` SET `coin` = ? WHERE `user_id` = ?', [coin, user_id], (insertError, insertResults, insertFields) => {
            if (insertError) {
                console.error('Error inserting user:', insertError);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Coin inserted:', coin);
        });
        res.json({username : req.session.username , id : req.session.user_id});
    } else {
        res.send('No session data found');
    }
});

route.get('/api/useEnergy/:coin', (req, res) => {
    const coin = req.params.coin;
    if (req.session.username && req.session.user_id) {
        var user_id = req.session.user_id;
        connection.query('UPDATE `users` SET `energy` = ? WHERE `user_id` = ?', [coin, user_id], (insertError, insertResults, insertFields) => {
            if (insertError) {
                console.error('Error inserting user:', insertError);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Coin inserted:', coin);
        });
        res.json({username : req.session.username , id : req.session.user_id});
    } else {
        res.send('No session data found');
    }
});

module.exports = route;