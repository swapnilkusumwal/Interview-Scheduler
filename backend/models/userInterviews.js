const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userInterviewSchema=new Schema({
  email:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'users',
    unique:false
  },
  interview:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'interviews',
    unique:false
  },
  role:Boolean
},{
  timestamps:true
});

const UserInterviews=mongoose.model('userinterviews',userInterviewSchema);
module.exports=UserInterviews;