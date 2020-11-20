(this["webpackJsonpinterview-scheduler"]=this["webpackJsonpinterview-scheduler"]||[]).push([[0],{47:function(e,t,n){},48:function(e,t,n){},83:function(e,t,n){"use strict";n.r(t);var c=n(2),i=n(1),s=n.n(i),r=n(25),a=n.n(r),l=(n(47),n(48),n(14)),o=n(15),d=n(18),j=n(17),h=n(40),b=n(85),u=n(86),O=n(87),m=n(11);function x(){var e=Object(i.useState)(!1),t=Object(h.a)(e,2);t[0],t[1];return Object(c.jsxs)(b.a,{dark:!0,expand:"md header",children:[Object(c.jsx)("div",{className:"col-6",children:Object(c.jsx)(u.a,{children:Object(c.jsx)(O.a,{children:Object(c.jsx)(m.b,{className:"nav-link",to:"/",children:Object(c.jsx)("h2",{children:"Inteview Scheduler"})})})})}),Object(c.jsx)("div",{className:"col-6",style:{display:"flex",justifyContent:"flex-end"},children:Object(c.jsxs)(u.a,{navbar:!0,children:[Object(c.jsx)(O.a,{children:Object(c.jsxs)(m.b,{className:"nav-link",to:"/scheduler",children:[Object(c.jsx)("span",{className:"fa fa-info fa-lg"}),"Scheduler"]})}),Object(c.jsx)(O.a,{children:Object(c.jsxs)(m.b,{className:"nav-link",to:"/interviews",children:[Object(c.jsx)("span",{className:"fa fa-list fa-lg"}),"Interviews"]})})]})})]})}var p=n(19),f="http://localhost:3000/",v=n(33),g=n.n(v),w=[],T=[],C=[],S=function(e){Object(d.a)(n,e);var t=Object(j.a)(n);function n(e){var c;return Object(l.a)(this,n),(c=t.call(this,e)).handleChangeSelect=function(e,t){var n=w.indexOf(e);-1===n?(w.push(e),C.push(t)):(w.splice(n,1),C.splice(n,1)),console.log(w.length)},c.handleChangeInterviewer=function(e){var t=T.indexOf(e);-1===t?T.push(e):T.splice(t,1)},c.handleSubmit=function(){if(c.state.startTime>c.state.endTime)alert("Please select appropriate time values.");else{var e={startTime:c.state.startTime,endTime:c.state.endTime,selectedCandidates:w,selectedInterviewers:T,selectedCandidatesEmail:C};""!==c.state.currentId&&"undefined"!=c.state.currentId&&(e.id=c.state.currentId);var t=""===c.state.currentId?"":c.state.currentId;console.log(e),fetch(f+"interview/"+t,{method:"POST",body:JSON.stringify(e),headers:{"Content-Type":"application/json"},credentials:"same-origin"}).then((function(e){return e.ok?(console.log(e),alert("Interview schduled!"),e):e.json().then((function(e){throw e}))})).then((function(e){return e.json()})).catch((function(e){console.log("Submit interview details ",e),alert("Interview Schedule error \n"+e)}))}},c.fetchCandidateList=function(){fetch(f+"users",{headers:{"Content-Type":"application/json"},credentials:"same-origin"}).then((function(e){if(e.ok)return e;var t=new Error("Error "+e.status+": "+e.statusText);throw t.response=e,t}),(function(e){throw new Error(e.message)})).then((function(e){return e.json()})).then((function(e){c.setState({users:e.users})})).catch((function(e){console.log("Get Candidates ",e.message),alert("Candidates could not be fetched \nError: "+e.message)}))},c.state={users:[{name:"Loading...",email:"Loading..."}],startTime:new Date,endTime:"",currentId:"",nope:!1},c.fetchCandidateList=c.fetchCandidateList.bind(Object(p.a)(c)),c.handleChangeSelect=c.handleChangeSelect.bind(Object(p.a)(c)),c.handleSubmit=c.handleSubmit.bind(Object(p.a)(c)),c}return Object(o.a)(n,[{key:"componentDidMount",value:function(){w=[],C=[],T=[];var e=window.location.href.substring(32);""!==e&&this.setState({currentId:e}),this.fetchCandidateList()}},{key:"render",value:function(){var e=this;return Object(c.jsxs)("div",{className:"row m-auto ml-0 background",style:{paddingTop:10},children:[Object(c.jsxs)("div",{className:"col-12",children:[Object(c.jsx)("h4",{className:"text-center",children:"SCHEDULE INTERVIEW"}),Object(c.jsxs)("table",{className:"table table-sm table-dark",children:[Object(c.jsx)("thead",{children:Object(c.jsxs)("tr",{children:[Object(c.jsx)("th",{scope:"col",children:"Name"}),Object(c.jsx)("th",{scope:"col",children:"Email"}),Object(c.jsx)("th",{scope:"col",children:"Interviewer"}),Object(c.jsx)("th",{scope:"col",children:"Select"})]})}),Object(c.jsx)("tbody",{children:this.state.users.map((function(t){return Object(c.jsxs)("tr",{children:[Object(c.jsx)("td",{children:t.name}),Object(c.jsx)("td",{children:t.email}),Object(c.jsx)("td",{children:Object(c.jsx)("input",{type:"checkbox",onClick:function(){return e.handleChangeInterviewer(t._id)},value:-1!==w.indexOf(t._id)})}),Object(c.jsx)("td",{children:Object(c.jsx)("input",{type:"checkbox",onClick:function(){return e.handleChangeSelect(t._id,t.email)},value:-1!==T.indexOf(t._id)})})]},t.email)}))})]})]}),Object(c.jsx)("div",{className:"col-sm-5 col-4"}),Object(c.jsxs)("div",{className:"col-12 col-sm-2 center columnWise",children:[Object(c.jsx)("h4",{children:"SELECT TIME: "}),Object(c.jsx)("p",{children:"From : "}),Object(c.jsx)(g.a,{value:this.state.startTime,minDate:new Date,hourPlaceholder:"Hour",minutePlaceholder:"Min",onChange:function(t){e.setState({startTime:t})}}),Object(c.jsx)("p",{children:"To : "}),Object(c.jsx)(g.a,{hourPlaceholder:"Hour",minutePlaceholder:"Min",minDate:this.state.startTime,value:this.state.endTime,onChange:function(t){e.setState({endTime:t})}})]}),Object(c.jsx)("div",{className:"col-6"}),Object(c.jsx)("div",{className:"col-12",style:{display:"flex",justifyContent:"center",paddingTop:30},children:Object(c.jsx)("div",{className:"btn btn-primary center",style:{borderRadius:35},onClick:function(){return e.handleSubmit()},children:"Submit"})})]})}}]),n}(i.Component),y=function(e){Object(d.a)(n,e);var t=Object(j.a)(n);function n(e){var c;return Object(l.a)(this,n),(c=t.call(this,e)).state={interviews:[{startTime:"Loading...",endTime:"Loading",interviewer:["Loading..."],interviewee:["Loading..."]}]},c}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;console.log(this.props.location),fetch(f+"interview",{headers:{"Content-Type":"application/json"},credentials:"same-origin"}).then((function(e){if(e.ok)return e;var t=new Error("Error "+e.status+": "+e.statusText);throw t.response=e,t}),(function(e){throw new Error(e.message)})).then((function(e){return e.json()})).then((function(t){e.setState({interviews:t.interviews}),console.log(t.interviews)})).catch((function(e){console.log("Get Interviews ",e.message),alert("Interviews could not be fetched \n"+e.message)}))}},{key:"render",value:function(){return Object(c.jsxs)("div",{className:!0,children:[Object(c.jsx)("h4",{className:"text-center",children:"Upcoming interviews"}),Object(c.jsxs)("table",{className:"table table-sm table-dark",style:{color:"white"},children:[Object(c.jsx)("thead",{children:Object(c.jsxs)("tr",{children:[Object(c.jsx)("th",{scope:"col",children:"Start Time"}),Object(c.jsx)("th",{scope:"col",children:"End Time"}),Object(c.jsx)("th",{scope:"col",children:"Interviewers"}),Object(c.jsx)("th",{scope:"col",children:"Interviewees"}),Object(c.jsx)("th",{scope:"col",children:"Click to edit"})]})}),Object(c.jsx)("tbody",{children:this.state.interviews.map((function(e){return Object(c.jsxs)("tr",{children:[Object(c.jsxs)("td",{children:[Object(c.jsx)("p",{children:new Date(e.startTime).toLocaleTimeString()}),Object(c.jsx)("p",{children:new Date(e.startTime).toLocaleDateString()})]}),Object(c.jsxs)("td",{children:[Object(c.jsxs)("p",{children:[new Date(e.endTime).toLocaleTimeString()," "]}),Object(c.jsx)("p",{children:new Date(e.endTime).toLocaleDateString()})]}),Object(c.jsx)("td",{children:e.interviewer.map((function(e){return Object(c.jsxs)("li",{children:[Object(c.jsxs)("p",{children:[" ",e.name]}),Object(c.jsx)("ul",{children:Object(c.jsx)("li",{children:Object(c.jsx)("p",{children:e.email})})})]})}))}),Object(c.jsx)("td",{children:e.interviewee.map((function(e){return Object(c.jsxs)("li",{children:[Object(c.jsx)("p",{children:e.name}),Object(c.jsx)("ul",{children:Object(c.jsx)("li",{children:Object(c.jsx)("p",{children:e.email})})})]})}))}),Object(c.jsx)("td",{children:Object(c.jsx)(O.a,{children:Object(c.jsx)(m.b,{to:"/scheduler/"+e._id,children:Object(c.jsx)("button",{className:"btn btn-primary",children:"Edit"})})})})]},e._id)}))})]})]})}}]),n}(i.Component),I=n(5),k=function(e){Object(d.a)(n,e);var t=Object(j.a)(n);function n(e){return Object(l.a)(this,n),t.call(this,e)}return Object(o.a)(n,[{key:"render",value:function(){return Object(c.jsxs)(c.Fragment,{children:[Object(c.jsx)(x,{}),Object(c.jsxs)(I.d,{location:this.props.location,children:[Object(c.jsx)(I.b,{path:"/scheduler",component:S}),Object(c.jsx)(I.b,{path:"/scheduler/:id",component:S}),Object(c.jsx)(I.b,{path:"/interviews",component:y}),Object(c.jsx)(I.a,{to:"/scheduler"})]})]})}}]),n}(i.Component),N=Object(I.g)(k);n(81);var E=function(){return Object(c.jsx)(m.a,{children:Object(c.jsx)("div",{children:Object(c.jsx)(N,{})})})},L=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,88)).then((function(t){var n=t.getCLS,c=t.getFID,i=t.getFCP,s=t.getLCP,r=t.getTTFB;n(e),c(e),i(e),s(e),r(e)}))};a.a.render(Object(c.jsx)(s.a.StrictMode,{children:Object(c.jsx)(E,{})}),document.getElementById("root")),L()}},[[83,1,2]]]);
//# sourceMappingURL=main.a69ca724.chunk.js.map