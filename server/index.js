const path = require('path');
const { connection, getUserInfo, deleteClass } = require('../database/index.js');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const port = 3000;

app.use(bodyparser());
app.use('/', express.static(path.join(__dirname, '..', '/public/')));

app.get('/user/userType:userType&firstName:firstName&lastName:lastName', (req, res) => {
  const { firstName, lastName } = req.params;
  let { userType } = req.params;
  userType = userType.slice(1);
  getUserInfo(userType, firstName, lastName, res);
});

app.post('/user/', (req, res) => {
  const { deleteThisClass, childFirstName, childLastName } = req.body;
  deleteClass(deleteThisClass, childFirstName, childLastName, res);
});

app.listen(port, () => {
  console.log(`LearningPod listening on port ${port}`);
});