import React, { Component } from 'react';
import {baseUrl} from '../baseUrl.js'
import DateTimePicker from 'react-datetime-picker';


var selectedCandidates=[],selectedInterviewers=[];
export default class Scheduler extends Component {
  constructor(props) {
    super(props);
    this.state={
      users:[{name:"Loading...",email:"Loading..."}],
      startTime:new Date(),
      endTime:'',
      currentId:'',
      nope:false
    }

    this.fetchCandidateList = this.fetchCandidateList.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChangeSelect=(id)=>{
    let index=selectedCandidates.indexOf(id);
    if(index===-1){
      selectedCandidates.push(id);
    }
    else{
      selectedCandidates.splice(index,1);
    }
    console.log(selectedCandidates.length);
  }
  handleChangeInterviewer=(id)=>{
    let index=selectedInterviewers.indexOf(id);
    if(index===-1){
      selectedInterviewers.push(id);
    }
    else{
      selectedInterviewers.splice(index,1);
    }
  }
  handleSubmit=()=>{

    if(selectedCandidates.length<2){
      alert("Please select atleast 2 candidates.");
    }
    if(this.state.startTime>this.state.endTime){
      alert("Please select appropriate time values.");
    }
    else{
    let obj={
      startTime:this.state.startTime,
      endTime:this.state.endTime,
      selectedCandidates,
      selectedInterviewers
    }
    if(this.state.currentId!=='' && this.state.currentId!='undefined')
    obj.id=this.state.currentId;
    let subId=this.state.currentId===''?'':this.state.currentId;
    console.log(obj);
    fetch(baseUrl+'interviews/'+subId,{
      method:'POST',
      body:JSON.stringify(obj),
      headers:{
        'Content-Type': 'application/json'
      },
      credentials:'same-origin'
    })
    .then(response => {
      if (response.ok) {
        console.log(response);
        alert('Interview schduled!');
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          var errmess = new Error(error.message);
          throw errmess;
    })
    .catch(error=>{console.log('Submit interview details ',error.message)
      alert('Interview could not be scheduled due to clash \n'+error.message)})
    }
  }

  fetchCandidateList=()=>{

    fetch(baseUrl+'users',{
      headers:{
        'Content-Type': 'application/json'
      },
      credentials:'same-origin'
    })
    .then(response => {
      if (response.ok) {
        // console.log(response);
        return response;
      } else {
        // console.log(response);
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          var errmess = new Error(error.message);
          throw errmess;
    })
    .then(response => response.json())
    .then(response => {
      // console.log(response);
      this.setState({
        users:response.users
      })
    })
    .catch(error=>{console.log('Get Candidates ',error.message)
      alert('Candidates could not be fetched \nError: '+error.message)})
  }
  componentDidMount(){
    let currId=window.location.href.substr(32);
    if(currId!==''){
      this.setState({currentId:currId});
    }
    this.fetchCandidateList();
  }

  render() {
    return (
      <div className="row m-auto ml-0" style={{paddingTop:10}}>
        
        <div className="col-12">
          <h4 className="text-center">SCHEDULE INTERVIEW</h4>
          <table className="table table-sm table-dark">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Interviewer</th>
                <th scope="col">Select</th>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map((user)=>{
                return (
                  <tr key={user.email} >
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><input type="checkbox" onClick={()=>this.handleChangeInterviewer(user._id)} /></td>
                    <td><input type="checkbox" onClick={()=>this.handleChangeSelect(user._id)} /></td>
                  </tr> 
                )
              })}
            </tbody>
          </table>
        </div>
        
        <div className="col-sm-5 col-4"></div>
        <div className="col-12 col-sm-2 center columnWise" >
          <h4>SELECT TIME: </h4>
          
            <p>From : </p>
            <DateTimePicker
            disableClock={false}
            value={this.state.startTime}
            minDate={this.state.startTime===''?new Date():this.state.startTime}
            hourPlaceholder="Hour"
            minutePlaceholder="Min"
            onChange={(value)=>{this.setState({startTime:value})}}
            />
            <p>To : </p>
            <DateTimePicker
            disableClock={false}
            hourPlaceholder="Hour"
            minutePlaceholder="Min"
            minDate={this.state.startTime}
            value={this.state.endTime}
            onChange={(value)=>{this.setState({endTime:value})}}
            />
        </div>
        <div className="col-6"></div>
        <div className="col-12" style={{display:'flex',justifyContent:'center',paddingTop:30}}>
          <div className="btn btn-primary center" style={{borderRadius:35}} onClick={()=>this.handleSubmit()}>Submit</div>
        </div>
      </div>
    );
  }
}
