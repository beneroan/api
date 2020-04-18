const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 5000;

app.use(cors());

const lastFreeDb = {};

const getMachineStatus = (id, callback) => {
   if (!id || id == 'A100Laundry Machine 1') {
      callback((Math.floor((new Date()) / 5000) % 2) == 0);
   } else {
      callback(false);
   }
}

const getFireStatus = (callback) => {
   callback((Math.floor((new Date()) / 5000) % 2) == 0);
}

app.get('/status/machine', (req, res) => {
   const id = req.query.wing + req.query.machine;
   getMachineStatus(id, (status) => {
      if (status) {
         lastFreeDb[id] = (new Date())
      }
      res.json({
         free: status,
         lastFree: lastFreeDb[id]
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
