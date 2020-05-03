const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const errorHanlder = require('errorhandler');
const apiRouter = require('./api/api');
const app = express();
const PORT = process.env.PORT||4000;

app.use(bodyParser.json());
app.use(errorHanlder());
app.use(cors());
app.use(morgan('dev'));
app.use('/api',apiRouter);

app.listen(PORT,()=>{
    console.log('Listening on port '+PORT);
})
module.exports = app;