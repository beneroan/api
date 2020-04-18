const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 5000;

app.use(cors());

const getMachineStatus = (callback) => {
   callback((Math.floor((new Date()) / 5000) % 2) == 0);
}

const getFireStatus = (callback) => {
   callback((Math.floor((new Date()) / 5000) % 2) == 0);
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
