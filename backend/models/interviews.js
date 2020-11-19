const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const interviewSchema=new Schema({
  startTime:Date,
  endTime:Date
},{
  timestamps:true
});

const Interviews=mongoose.model('interviews',interviewSchema);
module.exports=Interviews;