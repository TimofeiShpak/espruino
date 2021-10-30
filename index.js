const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const monk = require('monk');
const { addAbortSignal } = require('stream');
const jsonParser = express.json();
require('dotenv').config();

const db = monk(process.env.MONGODB_URI || 'mongodb+srv://admin:Hora1234@cluster0.ouwqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
const users = db.get('users');

const app = express();
app.enable('trust proxy');

app.use(helmet());
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('./public'));

const notFoundPath = path.join(__dirname, 'public/index.html');
let postData = {};

function handlePOST(req, res) {
    var data = "";
    req.on('data', function(d) { data += d; });
    req.on('end', function() {
        postData = {};
        data.split("&").forEach(function(el) {
        var els = el.split("=");
        postData[els[0]] = decodeURIComponent(els[1]);
        });
    });
}

app.post("/d", async (req, res) => {
    try {
        if(!req.body) return res.status(404).sendFile(notFoundPath);
        console.log(postData)
        return res.send(postData.code);
    } catch (error) {
        return res.status(404).sendFile(notFoundPath);
    }
});

app.post("/", async (req, res) => {
    try {
        if(!req.body) return res.status(404).sendFile(notFoundPath);
        handlePOST(req, res)
        res.status(200).sendFile(notFoundPath);
    } catch (error) {
        return res.status(404).sendFile(notFoundPath);
    }
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});