var express = require('express');
const Users = require('../models/users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  Users.find()
  .then(data=>{
    var reply={};
    reply.users=data;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(reply);
  })
  .catch(err=>console.log(err))
});

module.exports = router;
