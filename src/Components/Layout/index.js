import React, { Component } from 'react';
import Navbar from '../Navbar/index';
import Sidebar from '../Sidebar';
function Layout({content : Component, ...rest}) {
  return (
    <div>
      <Navbar />
      <div className='row'>
        <div className=''> <Sidebar /></div>
        <div className=''> <Component/></div>
      </div>
       
       
    </div>
  );
}

export default Layout;