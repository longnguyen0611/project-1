//blog-website/server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const BlogModel = require('./models/blog');
const router = require('./controller/controller');

const app = express();
const port = 3000;

app.use(express.static('view'));
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'view', 'index.html');
    res.sendFile(indexPath);
});

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/blog-website', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/',router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
