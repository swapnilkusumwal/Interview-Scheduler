var express = require('express');
const Interviews = require('../models/interviews');
var router = express.Router();
const UserInterviews=require('../models/userInterviews');
/* GET users listing. */
var smtp=require('../smtp');

let mailOptions = {
  from: mailerConfig.auth.user,
  subject: 'Interview Schedule'
};
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
    .catch(err=>{
      let err1=new Error();
      err1.message="Could not fetch interviews";
      err1.statusCode=400;
      res.send(err1);
    })
  })
})

router.post('/', function(req, res, next) {
  console.log("STILL HERE")
  if(req.body.selectedCandidates.length<2){
    let err=new Error();
    err.message="Select atleast 2 candidates";
    err.statusCode=400;
    res.setHeader('Content-Type','application/json');
    res.status(400).json({
      status: 'error',
      error: 'select 2 candidates atleast.',
    });
    res.end();
    return;
  }
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
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.send({error:"Conflicting interviews"});
              res.end();
              return -1;
            }
          }
          return 1;
        }
        else{
          return 1;
        }
      },(err)=>next(err))
      .catch((err)=>next(err))
    }
    else{
      return 1;
    }
  })
  .then(data=>{
    if(data===1){
      Interviews.create({startTime:req.body.startTime,endTime:req.body.endTime})
      .then(data=>{
        return data._id;
      })
      .then(id=>{
        let insertionArray=[];
        let selectedCandidates=req.body.selectedCandidates,selectedInterviewers=req.body.selectedInterviewers;
        // console.log(req.body.selectedCandidates,"ASDSADASDAS");
        let selectedCandidatesEmail=req.body.selectedCandidatesEmail;
        
        for(let i=0;i<selectedCandidates.length;i++){
          let obj={email:selectedCandidates[i],interview:id};
          mailOptions.to=selectedCandidatesEmail[i];
          mailOptions.html=`<body>`+`<p>Your interview is scheduled from ${req.body.startTime} to ${req.body.endTime}
          </p>`+`</body>`;
          console.log(mailOptions);
          smtp.temp(mailOptions);
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
          res.end();
        },(err)=>next(err))
        .catch((err)=>next(err))
      },(err)=>next(err))
      .catch((err)=>next(err))
    }
    else{
      let err=new Error();
      err.statusCode=400;
      err.message="No such interview exists";
      res.statusCode=400;
      res.setHeader('Content-Type', 'application/json');
      res.send(err);
      res.end();
    }
  },(err)=>next(err))
  .catch((err)=>next(err))
});
router.post('/:currentid', function(req, res, next) {
  console.log(req.body);
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
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              let err=new Error();
              err.message="Clashing interviews";
              err.status=400;
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
        let selectedCandidatesEmail=req.body.selectedCandidatesEmail;
        // console.log(req.body.selectedCandidates,"ASDSADASDAS");
        for(let i=0;i<selectedCandidates.length;i++){
          mailOptions.to=selectedCandidatesEmail[i];
          mailOptions.html=`<body>`+`<p>Your interview is scheduled from ${req.body.startTime} to ${req.body.endTime}
          </p>`+`</body>`;
          console.log(mailOptions);
          smtp.temp(mailOptions);
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
            res.send({fine:"fine"});
            return;
          })
        })
      })
    }
    else{
      let err=new Error();
      err.message="No such interview exists";
      err.statusCode=400;
      res.statusCode=400;
      res.setHeader('Content-Type', 'application/json');
      res.send(err);
      return;
    }
  })
});




module.exports=router;