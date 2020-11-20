var express = require("express");
const Interviews = require("../models/interviews");
var router = express.Router();
const UserInterviews = require("../models/userInterviews");
var smtp = require("../smtp");
var ics=require('ics');

// function to send mails to all recipient
function createEmail(start_time,hour,minute,attendees_list,sendTo){
  const event = {
  start: [start_time.getFullYear(),start_time.getMonth()+1,start_time.getDate(),start_time.getHours(),start_time.getMinutes()],
  duration:{hours:hour,minutes:minute},
  title: "Interview Scheduled",
  description: "An interview has been scheduled",
  location: 'Google Meet',
  status: 'CONFIRMED',
  organizer: { name: 'Swapnil Kusumwal', email: 'support@datainn.in' },
  attendees: attendees_list
};

  ics.createEvent(event, (error, value) => {
  if (error) {
    console.log(error)
    return;
  }

  let mailOptions = {
    from: mailerConfig.auth.user,
    to: sendTo,
    subject: "Interview Scheduled",
    text: "Your interview has been scheduled",
    icalEvent: {
      filename: 'invitation.ics',
      method: 'request',
      content: value.toString()
    }
  };
  smtp.temp(mailOptions);

  })
}

// retreives all upcoming interviews along with user details
router.get("/", (req, res) => {
  Interviews.find({startTime:{$gt:new Date()}}).then((data) => {
    let result = data.map((a) => a._id.toString());
    UserInterviews.find({ interview: { $in: result } })
      .populate("email")
      .populate("interview")
      .then((result) => {
        let reply = [];
        let hash_map = {};
        let k = 0;
        for (let i = 0; i < result.length; i++) {
          if (hash_map[result[i].interview._id] === undefined) {
            hash_map[result[i].interview._id] = k;
            k++;
            reply.push({
              _id: result[i].interview._id,
              startTime: result[i].interview.startTime,
              endTime: result[i].interview.endTime,
              interviewer: [],
              interviewee: [],
            });
          }

          if (result[i].role) {
            reply[hash_map[result[i].interview._id]].interviewer.push(
              result[i].email
            );
          } else {
            reply[hash_map[result[i].interview._id]].interviewee.push(
              result[i].email
            );
          }
        }
        reply.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({interviews:reply});
        res.end();
      })
      .catch((err) => {
        res.statusCode=400;
        res.setHeader("Content-Type", "application/json");
        res.json("Failed to fetch interview list.");
        res.end();
      });
  });
});

// To create a fresh interview
router.post("/", async function (req, res, next) {
  console.log("STILL HERE");
  if (req.body.selectedCandidates.length < 2) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 400;
    res.json("Select atleast 2 candidates.")
    res.end();
    return;
  }
  else if(req.body.startTime>req.body.endTime){
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 400;
    res.json("Please select appropriate time")
    res.end();
    return;
  }
  let startTime = req.body.startTime;
  let endTime = req.body.endTime;
  let interviews=await Interviews.find({
    $or: [
      {
        $and: [
          { startTime: { $gte: startTime } },
          { startTime: { $lte: endTime } },
        ],
      },
      {
        $and: [
          { startTime: { $lte: startTime } },
          { endTime: { $gte: endTime } },
        ],
      },
      {
        $and: [
          { endTime: { $gte: startTime } },
          { endTime: { $lte: endTime } },
        ],
      },
    ],
  }).catch(err=>{
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.json("Cannot create interviews right now. Please try again later.");
    res.end();
  })
  let createInterview=async()=>{
    return await Interviews.create({
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    }).catch(err=>{
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json("Cannot create interviews right now. Please try again later.");
      res.end();
    })
  }
  let user_interviews=[];
  if (interviews.length) {
    let result = [];
    result = await interviews.map((a) => a._id.toString());
    user_interviews=await UserInterviews.find({
      $and: [
        { interview: { $in: result } },
        { email: { $in: req.body.selectedCandidates } },
      ],
    }).catch(err=>{
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json("Cannot create interviews right now. Please try again later.");
      res.end();
    })
  }
  
  if (user_interviews.length > 0) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.json("Conflicting Interviews");
    res.end();
  } else {
    let id=await createInterview();
    
    let insertionArray = [];
    let selectedCandidates = req.body.selectedCandidates,
    selectedInterviewers = req.body.selectedInterviewers;
    let selectedCandidatesEmail = req.body.selectedCandidatesEmail;
    let attendees_list=[];
    let sendTo = "";
    for (let i = 0; i < selectedCandidates.length; i++) {
      let obj = {
        email: selectedCandidates[i],
        interview: id,
      };
      if (selectedInterviewers.indexOf(selectedCandidates[i]) === -1) {
        obj.role = false;
      } else obj.role = true;
      insertionArray.push(obj);
      attendees_list.push({email:selectedCandidatesEmail[i]})
      sendTo += selectedCandidatesEmail[i];
      if(i+1<selectedCandidates.length){
          sendTo += ','
      }
    }

    let created_user_interviews=await UserInterviews.create(insertionArray).catch(err=>{
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.json("Cannot create interviews right now. Please try again later.");
    res.end();
  })
  
  let start_time=new Date(startTime);
  let end_time= new Date(endTime);
  let time_difference=(end_time-start_time)/1000;
  let hour=parseInt(time_difference/3600);
  let minute=Math.ceil((time_difference%3600)/60);
  // console.log(time_difference,hour);
  await createEmail(start_time,hour,minute,attendees_list,sendTo);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json("Interview Scheduled");
  res.end();
        
  }
})

//to edit an existing interview
router.post("/:currentid",async function (req, res) {

  console.log(req.params.currentid);
  if (req.body.selectedCandidates.length < 2) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode=400;
    res.json("Select atleast 2 candidates.");
    res.end();
    return;
  }
  else if(req.body.startTime>req.body.endTime){
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 400;
    res.json("Please select appropriate time")
    res.end();
    return;
  }
  let startTime = req.body.startTime;
  let endTime = req.body.endTime;
  let interviews=await Interviews.find({
    $and: [
      {
        $or: [
          {
            $and: [
              { startTime: { $gte: startTime } },
              { startTime: { $lte: endTime } },
            ],
          },
          {
            $and: [
              { startTime: { $lte: startTime } },
              { endTime: { $gte: endTime } },
            ],
          },
          {
            $and: [
              { endTime: { $gte: startTime } },
              { endTime: { $lte: endTime } },
            ],
          },
        ],
      },
      { _id: { $ne: req.body.id } },
    ],
    }).catch(err=>{
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json("Cannot edit interviews right now. Please try again later.");
      res.end();
    })
    let user_interviews=[];
    
    if (interviews.length) {
      let result = [];
      result = interviews.map((a) => a._id.toString());
      user_interviews=await UserInterviews.find({
        $and: [
          { interview: { $in: result } },
          { email: { $in: req.body.selectedCandidates } },
        ],
      }).catch(err=>{
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json("Cannot create interviews right now. Please try again later.");
        res.end();
      })
    }
    if (user_interviews.length > 0) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json("Clashing Interviews");
      res.end();
      return;
    } 
    
    let current_interview=await Interviews.findByIdAndUpdate(req.body.id,{ startTime: req.body.startTime, endTime: req.body.endTime },
      { upsert: true }).catch(err=>{
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json("Cannot edit interviews right now. Please try again later.");
        res.end();
      })
    
    let id=current_interview._id;
    let insertionArray = [];
    let selectedCandidates = req.body.selectedCandidates,
    selectedInterviewers = req.body.selectedInterviewers;
    let selectedCandidatesEmail = req.body.selectedCandidatesEmail;
    let attendees_list=[];
    let sendTo="";

    for (let i = 0; i < selectedCandidates.length; i++) {
      let obj = { email: selectedCandidates[i], interview: id };
      if (selectedInterviewers.indexOf(selectedCandidates[i]) === -1) {
        obj.role = false;
      } else obj.role = true;
      insertionArray.push(obj);
      attendees_list.push({email:selectedCandidatesEmail[i]})
      sendTo += selectedCandidatesEmail[i];
      if(i+1<selectedCandidatesEmail.length){
          sendTo += ','
      }
    }
    let create_interview=await UserInterviews.deleteMany({ interview: id }).catch(err=>{
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json("Cannot create interviews right now. Please try again later.");
      res.end();
    })
    create_interview=await UserInterviews.create(insertionArray).catch(err=>{
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json("Cannot create interviews right now. Please try again later.");
      res.end();
    })
    let start_time=new Date(startTime);
    let end_time= new Date(endTime);
    let time_difference=(end_time-start_time)/1000;
    let hour=parseInt(time_difference/3600);
    let minute=Math.ceil((time_difference%3600)/60);
    console.log(time_difference,hour);
    await createEmail(start_time,hour,minute,attendees_list,sendTo);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json("Interview Scheduled");
    res.end();
});

module.exports = router;
