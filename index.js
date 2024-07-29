const express = require('express');
var session = require('cookie-session');
const app = express();
const route = require('./router/route');
const path = require('path');
const { Telegraf } = require('telegraf');
const connection = require('./db/connection');
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

app.use('/', route);

const token = "7222442007:AAHgTzuLS8O1Dgei8krt7yJ19Ii21DG_yI8";
const web_link = "https://telegram-rp37.onrender.com/auth/";
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
                    if (error) {
                        console.error('Error fetching user:', error);
                        return res.status(500).send('Internal Server Error');
                    }

                    if (results.length === 0) {
                        connection.query('INSERT INTO reffers (`user_id`, `reffer_id`) VALUES (?, ?)', [user_id, reffer_id], (insertError, insertResults, insertFields) => {
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

app.listen(port, () => {
    console.log(`App is Started at http://127.0.0.1:${port}/`)
});