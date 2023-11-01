//use .env
require('dotenv').config();
const mongodbPassword = process.env.MONGODB;

//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use(express.json());
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

//connect to DB
const { Database } = require("quickmongo");
const db = new Database(mongodbPassword);
db.on("ready", () => {
    console.log("Connected to the database");
});
db.connect();

//Listen for individual clients/users to connect
io.sockets.on('connection', function (socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for a message named 'msg' from this client
    socket.on('msg', function (data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'msg' event");
        console.log(data);

        //Send a response to all clients, including this one
        io.sockets.emit('msg', data);

    });

    //Listen for this client to disconnect
    socket.on('disconnect', function () {
        console.log("A client has disconnected: " + socket.id);
    })
})

//post data to server
app.post('/flicks', (req, res) => {
    console.log(req.body);

    //limit date() to show only dates
    let currentDate = new Date();
    let time = currentDate.toDateString().slice(0, 15);
    let obj = {
        date: time,
        name: req.body.name,
        rate: req.body.rate
    }

    //add values to the DB
    db.push("flicks", obj);

    // flicks.push(obj);
    // console.log(flicks);
    res.json({ task: "success" });
})

//fetch data from server
app.get('/data', (req, res) => {

    //fetch from the DB
    db.get("flicks").then(flicks => {
        let obj = { data: flicks };
        res.json(obj);
    })

    // let obj = { data: flicks };
    // res.json(obj);
})

