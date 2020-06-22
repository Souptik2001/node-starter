const express = require('express');
// const {readFile} = require('fs');
const { readFile } = require('fs').promises;
const bodyParser = require('body-parser');

const app = express();


// app.use(bodyParser.text());

// USING CALLBACKS
// app.get('/', (request, response)=>{
//     readFile('./home.html', 'utf8', (err, html)=>{
//         if(err){
//             response.status(500).send('sorry some fatal error occured');
//         }
//         response.send(html);
//         console.log(response.statusCode);
//     });
// });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use((req, res, next) => {
    console.log("I happen all the time");
    next();
});
// USING PROMISES
app.get('/', (request, response) => {
    readFile('./home.html', 'utf8')
        .then((html) => {
            console.log("Yo home page");
            response.send(html);
        })
        .catch(() => { response.status(500).send('sorry some fatal error occured'); });
});
app.get('/test', (req, res) => {
    res.json({ username: 'Flavio' });
});
app.get('/getData', (req, res) => {
    console.log(req.query);
    console.log(req.body);
    res.send("Yo");
});
app.post('/sayHello/', (request, response) => {
    console.log(request.query);
    response.send("Hello " + request.query.name + " " + request.query.title);
});
app.post('/sayHola/:name&:title', (request, response) => {
    console.log(request.params);
    response.send("Hola " + request.params.name + " " + request.params.title);
});

app.post('/sayBonjure/', (request, response) => {
    console.log(request.body);
    response.redirect('/');
});

app.post('/sayYo/', (req, res) => {
    console.log(req.headers['content-type']);
    // console.log(req.body);
    console.log(req.url);
    res.redirect('/');
});
app.all('/amAll', (req, res, next) => {
    console.log("Call me with any method");
    // res.redirect('/');
    next();
}, (req, res) => {
    console.log("I am next middleware");
    res.redirect('/');
});
app.get('/iAmJson', (req, res) => {
    // res.json({ name: 'Souptik' });
    // res.set('Content-Type', 'application/json');
    res.send({ name: "souptik" });
});
// app.get('/sayHello/' +: myName, (request, response, myName) => {
//     response.send("<h1>Hello" + myName + "</h1>");
// });

// USING ASYNC-AWAIT
// app.get('/',async (request, response)=>{
//     response.send(await readFile('./home.html', 'utf8'));
// });

// DATABASE PART


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodedb'
});
connection.connect((err) => {
    if (err) { console.log(err); } else { console.log("Connected to Database Succesfully..."); }
});
app.get('/createDb', (req, res) => {
    if (req.query.dbName == undefined) {
        console.log("After the path pass query parameters like /?dbName=yourChoiceName");
        res.send("DB creation failed reason in console");
    } else {
        let query = 'CREATE DATABASE ' + (req.query.dbName);
        connection.query(query, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
        res.send("Created DB");
    }
});

app.get('/createPost', (req, res) => {
    var post = { name: "Souptik", email: "hello@gmail.com" };
    // var post = ('Souptik', 'hello@gmail.com'); //WRONG
    var q = "INSERT INTO logins SET ?";
    // var q = "INSERT INTO logins (name, email) VALUES ?";
    connection.query(q, post, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Some err occured");
        } else {
            res.send("User created");
        }
    });

});

app.get('/getPost', (req, res) => {
    if (req.query.id == undefined) {
        res.send("Put the id after the path as query parameters");
    } else {
        connection.query("SELECT * FROM logins", (err, results) => {
            res.send(results[0].name);
        });
    }

});

app.listen(process.env.PORT || 3000, () => { console.log("App available on http://localhost:3000"); });