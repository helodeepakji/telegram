const express = require('express');
var session = require('cookie-session');
const app = express();
const route = require('./router/route');
const path = require('path');
const { Telegraf } = require('telegraf');
const connection = require('./db/connection');
const { Server } = require('socket.io');
const http = require('http');
const port = process.env.PORT || 8000;


const viewPath = path.join(__dirname, "/../views");
const staticPath = path.join(__dirname, "/../static");

app.set('views', viewPath);
app.set('view engine', 'ejs');
app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

app.use(session({
    name: 'session',
    keys: ['helodeepakji'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use((req, res, next) => {
    res.locals.authenticated = req.session.userId ? true : false;
    next();
});
let users = {};
app.get('/api/online', (req, res) => {
    const uniqueUsers = [];
    const seenUserIds = new Set();

    for (const socketId in users) {
        const user = users[socketId];
        if (!seenUserIds.has(user.userId)) {
            seenUserIds.add(user.userId);
            uniqueUsers.push(user);
        }
    }
    res.json(uniqueUsers);
});

app.use('/', route);

const token = "7222442007:AAHgTzuLS8O1Dgei8krt7yJ19Ii21DG_yI8";
const web_link = "https://telegram.softairtechnology.com/auth/";
let bot = new Telegraf(token);

bot.start((ctx) => {
    const startPayload = ctx.startPayload;
    var username = ctx.message.from.username;
    var user_id = ctx.message.from.id;
    var url = web_link + username + '/' + user_id;
    console.log(url);
    console.log(startPayload);
    if (startPayload && startPayload != user_id) {
        reffer_id = startPayload;

        connection.query('SELECT * FROM users WHERE `user_id` = ?', [user_id], (error, results, fields) => {
            if (results.length === 0) {
                connection.query('SELECT * FROM reffers WHERE `user_id` = ? AND `reffer_id`', [user_id, reffer_id], (error, results, fields) => {
                    // if (error) {
                    //     console.error('Error fetching user:', error);
                    //     return res.status(500).send('Internal Server Error');
                    // }

                    if (results.length === 0) {
                        connection.query('INSERT INTO reffers (`user_id`, `reffer_id`) VALUES (?, ?)', [user_id, reffer_id], (insertError, insertResults, insertFields) => {
                            // if (insertError) {
                            //     console.error('Error inserting user:', insertError);
                            //     return res.status(500).send('Internal Server Error');
                            // }

                            connection.query('UPDATE `users` SET `coin` = coin + ? WHERE `user_id` = ?', [200, reffer_id], (coinUpdateError, coinUpdateResults) => {
                                // if (coinUpdateError) {
                                //     console.error('Error updating user coins:', coinUpdateError);
                                //     return res.status(500).send('Error updating user coins');
                                // }
                            });


                            // update wallet
                            connection.query('INSERT INTO `wallet`(`user_id`, `coin`, `type`, `title`) VALUES (? , ? , ? , ?)', [reffer_id, 200, 'Referral', user_id], (coinUpdateError, coinUpdateResults) => {
                                // if (coinUpdateError) {
                                //     console.error('Error updating user coins:', coinUpdateError);
                                //     return res.status(500).send('Error updating user coins');
                                // }
                            });
                        });
                    } else {
                        console.log('User exists:', results[0].username);
                    }
                });
            }
        });
    }
    ctx.reply(`Welcome, @${username}`, {
        reply_markup: {
            keyboard: [[{ text: "Click For Play", web_app: { url: url } }]]
        }
    });
});

bot.launch();

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Store the user information
    socket.on('userLogin', ({ userId, username }) => {
        users[socket.id] = { userId, username, isReady: false }; // Add isReady to track readiness
        io.emit('updateUsers', Object.values(users));
        console.log('User logged in:', userId);
    });

    // Handle joining a room
    socket.on('joinFightRoom', (roomName) => {
        const user = users[socket.id];
        if (roomName) {
            socket.join(roomName);
            socket.roomName = roomName;
            console.log(`${user.userId} joined room: ${roomName}`);
        } else {
            console.log(`${user.userId} tried to join an undefined room.`);
        }
    });

    // Handle readiness
    socket.on('userReady', (room) => {
        if (users[socket.id]) {
            users[socket.id].isReady = true;
            console.log(`${users[socket.id].userId} is ready in room ${room}`);
            
            // Notify the other user in the room that this user is ready
            socket.to(room).emit('opponentReady');
        }
    });

    // Handle fighter movement within a room
    socket.on('moveFighter2', ({ room, newTop }) => {
        const user = users[socket.id];
        io.to(room).emit('moveFighter2', { userid: user.userId, newTop });
        console.log(`Fighter2 moved to: ${newTop} in room: ${room}`);
    });

    // Handle adding effects within a room
    socket.on('addFighterEffect', ({ room, effect }) => {
        const user = users[socket.id];
        io.to(room).emit('addFighterEffect', { userid: user.userId, effect });
        console.log(`Effect added in room ${room}:`, effect);
    });

    // Handle sending a message to a room
    socket.on('sendMessage', ({ room, message }) => {
        io.to(room).emit('receiveMessage', { message, sender: users[socket.id] || socket.id });
        console.log(`Message sent to room ${room} from ${users[socket.id]}: ${message}`);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', users[socket.id]);
        delete users[socket.id];
        io.emit('updateUsers', Object.values(users));
        console.log('Connected users:', users);
    });
});

server.listen(port, () => {
    console.log(`App is Started at http://127.0.0.1:${port}/`);
});
