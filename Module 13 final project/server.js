const express = require('express');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const cors = require('cors');
const PORT = process.env.PORT||4000;
const apiRouter = require('./api/api');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(errorhandler());

app.use('/api',apiRouter);

app.listen(PORT,()=>{
    console.log('Listening on port '+PORT);
})

module.exports = app;
