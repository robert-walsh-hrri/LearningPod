const path = require('path');
const { connection, getUserInfo } = require('../database/index.js');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const port = 3000;

app.use(bodyparser());
app.use('/', express.static(path.join(__dirname, '..', '/public/')));

app.get('/user/userType:userType&firstName:firstName&lastName:lastName', (req, res) => {
  console.log(req.params);
  res.send(req.params);
  // db controller ready to add
});

app.listen(port, () => {
  console.log(`LearningPod listening on port ${port}`);
});