const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
  name:String,
  email:{
    type:String,
    unique:true
  }
},{
  timestamps:true
});

const Users=mongoose.model('users',userSchema);
module.exports=Users;