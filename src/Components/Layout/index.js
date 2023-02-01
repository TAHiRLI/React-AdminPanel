import React from 'react';
import Navbar from '../Navbar/index';
import Sidebar from '../Sidebar';
function Layout({ content: Component, ...rest }) {
  return (
    <div>
      <Navbar />
      <div className="container-fluid " >

        <div className='row flex-nowrap '>
          <div className='col-auto col-md-3 col-xl-2 p-0 bg-dark sidebar' id='sidebar'> <Sidebar /></div>
          <div className='col p-3'> <Component /></div>
        </div>
      </div>


    </div>
  );
}

export default Layout;