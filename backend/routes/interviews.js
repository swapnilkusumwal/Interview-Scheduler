var express = require('express');
const Interviews = require('../models/interviews');
var router = express.Router();
const UserInterviews=require('../models/userInterviews');
/* GET users listing. */

router.get('/',(req,res,next)=>{
  Interviews.find()
  .then(data=>{
    let result = data.map(a => a._id.toString());
    UserInterviews.find({interview:{$in:result}})
    .populate('email')
    .populate('interview')
    .then(result=>{
      console.log(result);
      var reply=[];
      let hash_map={};
      let k=0;
      for(let i=0;i<result.length;i++){
        if(hash_map[result[i].interview._id]===undefined){
          hash_map[result[i].interview._id]=k;
          k++;
          reply.push({
              _id:result[i].interview._id,
              startTime:result[i].interview.startTime,
              endTime:result[i].interview.endTime,
              interviewer:[],
              interviewee:[]
          })
        }
        
        if(result[i].role){
          reply[hash_map[result[i].interview._id]].interviewer.push(result[i].email);
          // console.log(reply,"THIS");
        }
        else{
          // console.log("THERE");
          reply[hash_map[result[i].interview._id]].interviewee.push(result[i].email);
          // console.log(reply,"That");

        }
      }
      // console.log(result);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.send({interviews:reply});
    })
  })
})

router.post('/', function(req, res, next) {
  
  let startTime=req.body.startTime;
  let endTime=req.body.endTime;
  Interviews.find({$or:[
    {$and:[{startTime:{$gte:startTime}},{startTime:{$lte:endTime}}]},
    {$and:[{startTime:{$lte:startTime}},{endTime:{$lte:endTime}},{endTime:{$gte:startTime}}]},
    {$and:[{endTime:{$gte:startTime}},{endTime:{$lte:endTime}}]}
  ]})
  .then(data=>{
    let result=[];
    if(data.length){
      result = data.map(a => a._id.toString());
      console.log(result);
      UserInterviews.find({interview:{$in:result}})
      .then(data=>{
        if(data.length>0){
          result = data.map(a => a.email.toString());
          for(let i=0;i<req.body.selectedCandidates.length;i++){
            console.log(result.indexOf(req.body.selectedCandidates[i]),"yoyoy");
            if(result.indexOf(req.body.selectedCandidates[i])!==-1){
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              let err=new Error();
              err.message="Clashing interviews";
              err.status=401;
              next(err);
              res.send("Failed");
              return -1;
            }
          }
          return 1;
        }
        else{
          return 1;
        }
      })
    }
    else{
      return 1;
    }
  })
  .then(data=>{
    if(data===1){
      Interviews.create({startTime:req.body.startTime,endTime:req.body.endTime})
      .then(data=>{
        console.log("??");
        return data._id;
      })
      .then(id=>{
        let insertionArray=[];
        let selectedCandidates=req.body.selectedCandidates,selectedInterviewers=req.body.selectedInterviewers;
        console.log(req.body.selectedCandidates,"ASDSADASDAS");
        for(let i=0;i<selectedCandidates.length;i++){
          let obj={email:selectedCandidates[i],interview:id};
          if(selectedInterviewers.indexOf(selectedCandidates[i])===-1){
            obj.role=false;
          }
          else
          obj.role=true;
          insertionArray.push(obj);
        }
        UserInterviews.create(insertionArray)
        .then(data=>{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(data);
        })
      })
    }
    else{
      res.statusCode=401;
      res.setHeader('Content-Type', 'application/json');
      res.send("");
    }
  })


  
});
router.post('/:currentid', function(req, res, next) {
  // res.send("ASDASDAS");
  let startTime=req.body.startTime;
  let endTime=req.body.endTime;
  Interviews.find({$and:[{$or:[
    {$and:[{startTime:{$gte:startTime}},{startTime:{$lte:endTime}}]},
    {$and:[{startTime:{$lte:startTime}},{endTime:{$lte:endTime}},{endTime:{$gte:startTime}}]},
    {$and:[{endTime:{$gte:startTime}},{endTime:{$lte:endTime}}]}
  ]},{_id:{$ne:req.body.id}}]})
  .then(data=>{
    let result=[];
    if(data.length){
      result = data.map(a => a._id.toString());
      console.log(result);
      UserInterviews.find({interview:{$in:result}})
      .then(data=>{
        if(data.length>0){
          result = data.map(a => a.email.toString());
          for(let i=0;i<req.body.selectedCandidates.length;i++){
            console.log(result.indexOf(req.body.selectedCandidates[i]),"yoyoy");
            if(result.indexOf(req.body.selectedCandidates[i])!==-1){
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              let err=new Error();
              err.message="Clashing interviews";
              err.status=401;
              next(err);
              res.send("Failed");
              return -1;
            }
          }
          return 1;
        }
        else{
          return 1;
        }
      })
    }
    else{
      return 1;
    }
  })
  .then(data=>{
    if(data===1){
      Interviews.findByIdAndUpdate(req.body.id,{startTime:req.body.startTime,endTime:req.body.endTime},{upsert:true})
      .then(data=>{
        return data._id;
      })
      .then(id=>{
        let insertionArray=[];
        let selectedCandidates=req.body.selectedCandidates,selectedInterviewers=req.body.selectedInterviewers;
        // console.log(req.body.selectedCandidates,"ASDSADASDAS");
        for(let i=0;i<selectedCandidates.length;i++){
          let obj={email:selectedCandidates[i],interview:id};
          if(selectedInterviewers.indexOf(selectedCandidates[i])===-1){
            obj.role=false;
          }
          else
          obj.role=true;
          insertionArray.push(obj);
        }
        UserInterviews.deleteMany({interview:id})
        .then(()=>{
          UserInterviews.create(insertionArray)
          .then(()=>{
            res.statusCode=200;
            res.setHeader('Content-Type', 'application/json');
            res.send("");
          })
        })
      })
    }
    else{
      res.statusCode=401;
      res.setHeader('Content-Type', 'application/json');
      res.send("");
    }
  })
});




module.exports=router;