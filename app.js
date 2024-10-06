const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const songRouter = require('./routes/router');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads'))); 

app.use('/', songRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
