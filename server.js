const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 5000;
const { exec } = require('child_process');
const request = require('request');

app.use(cors());

const lastFreeDb = {};
const numbersDb = ['16822131240'];
const peopleToNumber = {
   'c7d986e8-f760-4df4-8366-1239fafbd110': 0,
   '9b91a8e8-9027-4576-ab75-7f8205b4b68e': 0
}

const enableTexts = false;

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

const sendText = (number, message) => {
   // we have trial account, so this is the only number that we can use
   if (!enableTexts || number != "16822131240") return;

   exec(`curl 'https://api.twilio.com/2010-04-01/Accounts/AC00c64de50527ef8bc8db6ef5dfcf35e9/Messages.json' -X POST \
         --data-urlencode 'To=+${number}' \
         --data-urlencode 'From=+12029373228' \
         --data-urlencode 'Body=${message}' \
         -u AC00c64de50527ef8bc8db6ef5dfcf35e9:${process.env["TWILIO_KEY"]}`, (err, stdout, stderr) => {
            if (err) console.error(err)
            if (stderr) console.log(stderr)
            console.log(stdout)
         })
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

app.get('/remind', (req, res) => {
   request.post('http://localhost:5001/identify', {}, (err, res, body) => {
      console.log(body);
      const number = peopleToNumber[body.id];
      sendText(number, `Dont forget your laundry! Someone is waiting for the machine.`);
   });
   res.end();
});

app.listen(PORT, () => {
   console.log(`Listening on ${PORT}`);
});

if (enableTexts) {
   let lastText = 0;
   setInterval(() => {
      getFireStatus((status) => {
         if (status && (new Date() - lastText) > 2 * 60 * 1000) {
            lastText = new Date();
            for (number of numbersDb) {
               sendText(number, 'Smoke in the laundry room!');
            }
         }
      })
   }, 5000);
}
