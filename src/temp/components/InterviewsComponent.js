import React, { Component } from 'react';
import { baseUrl } from '../baseUrl';

export default class Interviews extends Component {

  constructor(props) {
    super(props);
    this.state={
      interviews:[{from:"Loading...",to:"Loading",
      interviewers:["Loading..."],interviewees:["Loading..."]}],
    }
  }
  
  componentDidMount(){
    console.log(this.props.location)
    fetch(baseUrl+'interviews',{
      headers:{
        'Content-Type': 'application/json'
      },
      credentials:'same-origin'
    })
    .then(response => {
      if (response.ok) {
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
    .then(response => response.json())
    .then(response => {
      this.setState({
        interviews:response.interviews
      })
      console.log(response);
    })
    .catch(error=>{console.log('Get Interviews ',error.message)
      alert('Interviews could not be fetched \n'+error.message)})
  }

  render() {
    return (
      <div>
        <h4 className="text-center">Upcoming interviews</h4>
        <table className="table table-sm table-dark" style={{color:'white'}}>
          <thead>
            <tr>
              <th scope="col">Start Time</th>
              <th scope="col">End Time</th>
              <th scope="col">Interviewers</th>
              <th scope="col">Interviewees</th>
              <th scope="col">Click to edit</th>
            </tr>
          </thead>
          <tbody>
            {this.state.interviews.map((interview)=>{
              return (
                <tr>
                  <td>{(interview.startTime)}</td>
                  <td>{(interview.endTime)}</td>
                  <td>
                      {interview.interviewees.map((interviewee)=>{
                        return(
                        <li>
                         <p> {interviewee.name}</p>
                          <ul><li>
                          <p>{interviewee.email}</p></li></ul>
                        </li>
                        )
                      })}
                  </td>
                  <td>
                      {interview.interviewers.map((interviewer)=>{
                        return(
                        <li>
                          <p>{interviewer.name}</p>
                          <ul><li>
                          <p>{interviewer.email}</p></li></ul>
                          </li>
                        )
                      })}
                  </td>

                <td><a href={"/scheduler/"+(interview._id)}><button className="btn btn-primary">Edit</button></a></td>
                </tr> 
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
