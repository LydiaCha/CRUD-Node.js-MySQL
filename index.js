const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const { query } = require('express');

const app = express();

//all queries go here
const SELECT_ALL_ARTICLES_QUERY = 'SELECT * FROM articles';


//create connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'DidiLydiBibi96',
    database: 'myTherapy'
});

connection.connect(err => {
    if(err) {
        return err;
    }
});
//end of creating connection

app.use(cors());

app.get('/', (req, res) => {
    res.send('go to /articles to see articles')
});

//routes
app.get('/articles/add', (req, res) => {
const { title, content } = req.query; //fields from db
const INSERT_ARTICLES_QUERY = `INSERT INTO articles (title, content) VALUES(?, ?)`;
connection.query(INSERT_ARTICLES_QUERY, [title, content], (err, results) => {
    if(err) {
        return res.send(err)
    }
    else {
        return res.send('successfully added article')
    }
});
});

app.get('/articles', (req, res) => {
    connection.query(SELECT_ALL_ARTICLES_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
            });
});

app.listen(4000, () => {
    console.log('Articles server listening on port 4000')
});