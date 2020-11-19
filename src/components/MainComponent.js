import React, { Component } from 'react';
import Header from './HeaderComponent';
import Scheduler from './SchedulerComponent';
import Interviews from './InterviewsComponent';
import {Switch , Route, Redirect , withRouter} from 'react-router-dom';
class MainComponent extends Component{
  constructor(props) {
    super(props);
    
  }
  
  render(){
    return (
      <>
      <Header/>
        <Switch location={this.props.location}>
          <Route path='/scheduler' component={Scheduler} />
          <Route path='/interviews' component={Interviews} />
          <Redirect to="/scheduler" />
        </Switch>
      </>
    );
    }
}

export default withRouter(MainComponent);

{/* <Switch location={this.props.location}>
    <Route path='/home' component={HomePage} />
    <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
    <Route path='/menu/:dishId' component={DishWithId}/>
    <PrivateRoute exact path="/favorites" component={() => <Favorite favorites={this.props.favorites} deleteFavorite={this.props.deleteFavorite} />} />
    <Route exact path='/contactus' component={()=><Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback}/>} />
    <Route path='/aboutus' component={Leader}/>
    <Redirect to="/home" />
</Switch> */}