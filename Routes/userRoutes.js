const express = require('express');
const User = require('../Models/User.js');
const router = express.Router();

router.get('/', function(req, res, next) {
    //Define search
    let search = req.query.search;
    //Search function 
    if (search != undefined){
      //Define a regular expression for searching
      //Find films matching regex in title or body
      User.find({Name: 'Brandon'},
      function(err, user){
          if (err) {
            res.status(404).send(err);
            return;
          } 
          if(user) {
            //If film is found, return films
            res.status(201).send(user);
            return;
          }
          else {
            //If films not found, return 404
            res.status(404).send();
            return;
          }
      });
    }else {
      //If search is undefined, return all films
      User.find({}, function(err, result) {
      if (err) {
        res.send(err);
        return;
      } else {
        res.send(result);
        return;
      }
    })
  };  
});

module.exports = router;