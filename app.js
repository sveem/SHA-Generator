const express = require('express');
const bodyParser = require('body-parser');
const engines = require('consolidate');
const crypto = require('crypto');
const secret = 'soxap';
const app = express();
let msg, hashedMsg;

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
  res.render('index'); 	
});

app.post('/messages', (req, res) => {
  msg = req.body.message;
  
  if (!msg) {
    res.render('error', {error: 'Enter a valid message!'});
  } else {
    hashedMsg = crypto.createHmac('sha256', secret)
    .update(msg)
    .digest('hex');
    res.render('message_hashed', {hashedMsg: hashedMsg}); 
  }
});

app.get('/messages/:message', (req, res) => {
  let message = req.params.message;

  if (message === hashedMsg) {
    res.render('message_original', {msg: msg});
  } else {
    res.render('error', {error: 'Message not found!'});
  }
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');	
});