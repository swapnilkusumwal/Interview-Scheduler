import React, { useState } from 'react';

import { Nav,NavItem,Navbar} from 'reactstrap';
import { NavLink } from 'react-router-dom';
export default function Header() {
    const [isNavOpen,setNav]=useState(false);
    return (
      <Navbar dark expand="md header">
        <div className="col-6">
          <Nav>
          <NavItem>
              <NavLink className="nav-link" to="/">
                <h2>Inteview Scheduler</h2>
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <div className="col-6" style={{display:'flex',justifyContent:'flex-end'}}>
          <Nav navbar>
              <NavItem>
                  <NavLink className="nav-link" to="/scheduler">
                      <span className="fa fa-info fa-lg"></span>Scheduler
                  </NavLink>
              </NavItem>
              <NavItem>
                  <NavLink className="nav-link" to="/interviews">
                      <span className="fa fa-list fa-lg"></span>Interviews
                  </NavLink>
              </NavItem>
          </Nav>
        </div>
        </Navbar>
    );
}
