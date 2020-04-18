const express = require('express');
const app = express();
const PORT = 6000;

const getMachineStatus = (callback) => {
   callback(Math.random() > 0.5);
}

const getFireStatus = (callback) => {
   callback(Math.random() > 0.5);
}

app.get('/status/machine', (req, res) => {
   getMachineStatus((status) => {
      res.json({
         free: status
      });
   });
});

app.get('/status/fire', (req, res) => {
   getFireStatus((status) => {
      res.json({
         fire: status
      });
   });
});

app.listen(PORT, () => {
   console.log(`Listening on ${PORT}`);
});
