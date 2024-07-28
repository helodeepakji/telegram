const express = require('express');
var session = require('cookie-session');
const app = express();
const route = require('./router/route');
const path = require('path');
const {Telegraf} = require('telegraf');
const port = process.env.PORT || 8000;

const viewPath = path.join(__dirname,"/../views");
const staticPath = path.join(__dirname,"/../static");

app.set('views',viewPath);
app.set('view engine','ejs');
app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
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

app.use('/',route);

const token = "7222442007:AAHgTzuLS8O1Dgei8krt7yJ19Ii21DG_yI8";
const web_link = "https://telegame.onrender.com/auth/";
const bot = new Telegraf(token);

bot.start((ctx) => {
    var username = ctx.message.from.username;
    var user_id = ctx.message.from.id;
    var url =  web_link+username+'/'+user_id;
    console.log(url);
    ctx.reply(`Welcome, @${username}`, {
        reply_markup: {
            keyboard: [[{ text: "Click For Play", web_app: { url: url } }]]
        }
    });
});

bot.launch();

app.listen(port,() => {
    console.log(`App is Started at http://127.0.0.1:${port}/`)
});