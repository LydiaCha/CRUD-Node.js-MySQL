const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const { query } = require('express');

const multer = require('multer');
const upload = multer({dest: 'public/images'}); // uploaded article image here

const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

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

//ROUTES

//Add new article
app.use('/image', express.static('public/images'));
app.get('/articles/add', upload.single('image'), (req, res) => {

const { title, content, image } = req.query; //fields from db
const INSERT_ARTICLES_QUERY = `INSERT INTO articles (title, content, image) VALUES(?, ?, ?)`;
connection.query(INSERT_ARTICLES_QUERY, [title, content, image], (err, results) => {
    if(err) {
        return res.send(err)
    }
    else {
        return res.send('successfully added article')
    }
});
});

//View all articles
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


// Cloudinary for images
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET
//     });
//     const storage = cloudinaryStorage({
//     cloudinary: cloudinary,
//     folder: "demo",
//     allowedFormats: ["jpg", "png"],
//     transformation: [{ width: 500, height: 500, crop: "limit" }]
//     });
//     const parser = multer({ storage: storage });

//     // POST route for Cloudinary
//     app.post('/api/images', parser.single("image"), (req, res) => {
//         console.log(req.file) // to see what is returned to you
//         const image = {};
//         image.url = req.file.url;
//         image.id = req.file.public_id;
//         Image.create(image) // save image information in database
//           .then(newImage => res.json(newImage))
//           .catch(err => console.log(err));
//       });


app.listen(4000, () => {
    console.log('Articles server listening on port 4000')
});