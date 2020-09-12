const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const port = 3000;

app.use(bodyparser());
app.use('/', express.static(path.join(__dirname, '..', '/public/')));


app.listen(port, () => {
  console.log(`LearningPod listening on port ${port}`);
});