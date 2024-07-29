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
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
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
        connection.query('UPDATE `users` SET `coin` = `coin` + 1 WHERE `user_id` = ?', [user_id], (insertError, insertResults, insertFields) => {
            if (insertError) {
                console.error('Error inserting user:', insertError);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Coin inserted:', coin);
        });
        res.json({ username: req.session.username, id: req.session.user_id });
    } else {
        res.send('No session data found');
    }
});

route.get('/api/useEnergy/:coin', (req, res) => {
    const coin = req.params.coin;
    if (req.session.username && req.session.user_id) {
        var user_id = req.session.user_id;
        connection.query('UPDATE `users` SET `energy` = `energy` - 1 WHERE `user_id` = ?', [ user_id], (insertError, insertResults, insertFields) => {
            if (insertError) {
                console.error('Error inserting user:', insertError);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Coin inserted:', coin);
        });
        res.json({ username: req.session.username, id: req.session.user_id });
    } else {
        res.send('No session data found');
    }
});

route.get('/api/getTask', (req, res) => {
    if (req.session.username && req.session.user_id) {
        const user_id = req.session.user_id;
        connection.query('SELECT * FROM `task` WHERE `is_active` = 1 ORDER BY `created_at` DESC', (error, results) => {
            if (error) {
                console.error('Error fetching tasks:', error);
                return res.status(500).send('Internal Server Error');
            }

            let data = [];
            results.forEach(element => {
                let users;
                if (element.users) {
                    users = element.users;
                } else {
                    users = [];
                }

                // Ensure users is an array before using includes
                if (Array.isArray(users) && users.includes(user_id)) {
                    element.seen = true;
                } else {
                    element.seen = false;
                }

                data.push(element);
            });

            res.json(data);
        });
    } else {
        res.status(401).send('No session data found');
    }
});

route.get('/api/donTask/:id', (req, res) => {
    const id = req.params.id;
    if (req.session.username && req.session.user_id) {
        var user_id = req.session.user_id;

        connection.query('SELECT * FROM `task` WHERE `id` = ?', [id], (fetchError, results) => {
            if (fetchError) {
                console.error('Error fetching task:', fetchError);
                return res.status(500).send('Error fetching task');
            }

            if (results.length === 0) {
                return res.status(404).send('Task not found');
            }

            let task = results[0];
            let users;

            // Parse the users array
            try {
                users = task.users || [];
            } catch (parseError) {
                users = [];
            }

            // Add user_id to the users array if not already present
            if (!users.includes(user_id)) {
                users.push(user_id);

                // Update the task with the new users array
                connection.query('UPDATE `task` SET `users` = ? WHERE `id` = ?', [JSON.stringify(users), id], (updateError, updateResults) => {
                    if (updateError) {
                        console.error('Error updating task:', updateError);
                        return res.status(500).send('Error updating task');
                    }

                    // add user coin

                    const coin = task.coin; // Assuming task.coin contains the coin value to be added
                    connection.query('UPDATE `users` SET `coin` = coin + ? WHERE `user_id` = ?', [coin, user_id], (coinUpdateError, coinUpdateResults) => {
                        if (coinUpdateError) {
                            console.error('Error updating user coins:', coinUpdateError);
                            return res.status(500).send('Error updating user coins');
                        }

                        return res.json({ username: req.session.username, id: user_id, coins: coin });
                    });


                    // update wallet
                    connection.query('INSERT INTO `wallet`(`user_id`, `coin`, `type`, `title`) VALUES (? , ? , ? , ?)', [user_id , coin , 'Task Complete' , task.id], (coinUpdateError, coinUpdateResults) => {
                        if (coinUpdateError) {
                            console.error('Error updating user coins:', coinUpdateError);
                            return res.status(500).send('Error updating user coins');
                        }
                    });


                });
            } else {
                // User already in the users array
                return res.json({ username: req.session.username, id: user_id });
            }
        });


    } else {
        res.send('No session data found');
    }
});


route.get('/api/getTopReferral', (req, res) => {
    if (req.session.username && req.session.user_id) {
        const user_id = req.session.user_id;
        // connection.query(`SELECT wallet.user_id, COUNT(*) AS referral_count, SUM(wallet.coin) AS total_coin, MAX(users.username) AS username FROM wallet JOIN users ON wallet.user_id = users.user_id WHERE wallet.type = 'Referral' GROUP BY wallet.user_id ORDER BY referral_count DESC`, (error, results) => {
        //     if (error) {
        //         console.error('Error fetching tasks:', error);
        //         return res.status(500).send('Internal Server Error');
        //     }
        
        //     res.json(results);
        // });
        
        connection.query(`SELECT * FROM wallet JOIN users ON wallet.title = users.user_id WHERE wallet.type = 'Referral' AND wallet.user_id = ?`, [user_id] ,(error, results) => {
            if (error) {
                console.error('Error fetching tasks:', error);
                return res.status(500).send('Internal Server Error');
            }
        
            res.json(results);
        });
        
    } else {
        res.status(401).send('No session data found');
    }
});

route.get('/api/leaderboard', (req, res) => {
    connection.query('SELECT * FROM users ORDER BY `coin` DESC LIMIT 10',(error, results, fields) => {
        if (results) {
            res.json(results);
        }
    });
});

module.exports = route;