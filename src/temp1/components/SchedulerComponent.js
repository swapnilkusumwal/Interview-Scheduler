import React, { Component } from 'react';
import {baseUrl} from '../baseUrl.js'
import DateTimePicker from 'react-datetime-picker';


var selectedCandidates=[];
export default class Scheduler extends Component {
  constructor(props) {
    super(props);
    this.state={
      interviewers:[{name:"Loading...",email:"Loading..."}],
      interviewees:[{name:"Loading...",email:"Loading..."}],
      timeFrom:'',
      timeTo:'',
      currentId:''
    }

    this.fetchCandidateList = this.fetchCandidateList.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChangeSelect=(email)=>{
    let index=selectedCandidates.indexOf(email);
    if(index===-1){
      selectedCandidates.push(email);
    }
    else{
      selectedCandidates.splice(index,1);
    }
    // console.log(selectedCandidates.length);
  }
  handleSubmit=()=>{
    let obj={
      timeFrom:new Date(this.state.timeFrom),
      timeTo:new Date(this.state.timeTo),
      selectedCandidates
    }
    if(this.state.currentId!=='')
    obj.id=this.state.currentId;

    console.log(obj);
    fetch(baseUrl+'users',{
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

  fetchCandidateList=()=>{
    fetch(baseUrl+'users',{
      headers:{
        'Content-Type': 'application/json'
      },
      credentials:'same-origin'
    })
    .then(response => {
      if (response.ok) {
        console.log(response);
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
      console.log(response);
      // this.setState({
      //   users:data.users
      // })
      this.setState({
        interviewees:response.interviewees,
        interviewers:response.interviewers
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
        
        <div className="col-sm-6 col-12">
          <h4 className="text-center">INTERVIEWER</h4>
          <table className="table table-sm table-dark">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Select</th>
              </tr>
            </thead>
            <tbody>
              {this.state.interviewers.map((interviewer)=>{
                return (
                  <tr key={interviewer.email} >
                    <td>{interviewer.name}</td>
                    <td>{interviewer.email}</td>
                    <td><input type="checkbox" onClick={()=>this.handleChangeSelect(interviewer.email)} /></td>
                  </tr> 
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="col-12 col-sm-6">

          <h4 className="text-center">INTERVIEWEE</h4>
          <table className="table table-sm table-warning" style={{color:'black'}}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Select</th>
              </tr>
            </thead>
            <tbody>
              {this.state.interviewees.map((interviewee)=>{
                return (
                  <tr key={interviewee.email}>
                    <td>{interviewee.name}</td>
                    <td>{interviewee.email}</td>
                    <td><input type="checkbox" onClick={()=>this.handleChangeSelect(interviewee.email)} /></td>
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
            disableClock="false"
            value={this.state.timeFrom}
            hourPlaceholder="Hour"
            minutePlaceholder="Min"
            onChange={(value)=>{this.setState({timeFrom:value})}}
            />
            <p>To : </p>
            <DateTimePicker
            disableClock="false"
            hourPlaceholder="Hour"
            minutePlaceholder="Min"
            value={this.state.timeTo}
            onChange={(value)=>{this.setState({timeTo:value})}}
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
