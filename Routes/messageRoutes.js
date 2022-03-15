const express = require('express');
const Messages = require('../Models/Messages.js');
const router = express.Router();

//Return all messages
router.get('/', function(req, res, next) {
      Messages.find({}, function(err, result) {
      if (err) {
        res.send(err);
        return;
      } else {
        res.send(result);
        return;
      }
    })
});

router.post('/', function(req, res, next) {
    console.log(req.body);
    let schema = Object.keys(req.body);
    if (schema.includes("Body")){
        let message = {
            User: req.body.User,
            Body: req.body.Body
        }
        let newMessage = new Messages(message);
        newMessage.save(function(err, data) {
            if (err) throw err;
        });
        res.status(201).send(message);
        return;
    }
    else{
        res.status(400).send();
        return;
    }
});

router.delete('/', function(req, res, next) {
    console.log('hi');
    Messages.deleteMany({}, function(err, result) {
        if (err) {
          res.send(err);
          return;
        } else {
          res.send(result);
          return;
        }
    });
});


module.exports = router;