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
  .catch(err=>res.send(err))
});

router.post('/',async function(req, res) {
  console.log(req.body);
  await Users.find({email:req.body.email})
  .then(async (data)=>{
    if(data.length==0){
      await Users.create(req.body)
      .then((data)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({user:data});
        res.end();
      })
      .catch((err) => {

        console.log("HERER EXISTS");
        res.statusCode=400;
        res.setHeader("Content-Type", "application/json");
        res.json("Failed to add user.");
        res.end();
      });
    }
    else{

      console.log("HERER ELSE");
      res.statusCode=400;
      res.setHeader("Content-Type", "application/json");
      res.json("Failed to add user.");
      res.end();
    }
  })
  .catch((err) => {
    console.log("HERER");
    res.statusCode=400;
    res.setHeader("Content-Type", "application/json");
    res.json("Failed to add user.");
    res.end();
  });
})

module.exports = router;
