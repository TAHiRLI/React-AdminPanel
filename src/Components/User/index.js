import React from 'react';
import { useForm } from 'react-hook-form';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../APIs/Services/UserService';
import { ROUTES } from '../../Consts/Routes';
import $ from "jquery"
// Signalr 
import { HubConnectionBuilder } from '@microsoft/signalr';

function UserList() {

  // ==================
  // States 
  // ==================
  const [users, setUsers] = React.useState([]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [connection, setConnection] = React.useState(null);
  // ==================
  // Funcitons 
  // ==================


  //Pagination
  const handlePageChange = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };
  const itemsPerPage = 4;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usersToDisplay = users.slice(startIndex, endIndex);

  let order = startIndex + 1;

  // ==================
  // hooks 
  // ==================
  const getAllUsers = React.useCallback(() => {
    UserService.getAll().then(response => {
      console.log(response.data);
      setUsers(response?.data);
    });
  }, []);
  React.useEffect(() => {
     const newConnection = new HubConnectionBuilder()
      .withUrl(ROUTES.HUBS.MEETING_HUB)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  React.useEffect(() => {
    if (connection) {
      connection.start()
          .then(result => {
              console.log('Connected!');
            connection.on("setAsOnline",(id)=>{
              $(`#user-${id}`).addClass("bg-success");
              $(`#user-${id}`).removeClass("bg-secondary");
            })

            connection.on("setAsOffline",(id)=>{
              $(`#user-${id}`).removeClass("bg-success");
              $(`#user-${id}`).addClass("bg-secondary");
            })

          })}
  }, [connection]);

  React.useEffect(() => {
    getAllUsers();
  }, []);




  return (
    <div className='d-flex justify-content-center flex-column '>
      <div className='text-end'>
      </div>
      <table className='table table-light overflow-scroll'>
        <thead>
          <tr>
            <th>No</th>
            <th>Image</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            usersToDisplay.map(user => (

              <tr className='text-nowrap' key={user.id}>
                <td>{order++}</td>
                <td><img src={user.imageUrl} width='70' height='70' className='rounded-circle' /></td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber ?? "Not defined"}</td>
                <td>{user.isAdmin == null ? "Doctor" : user.isAdmin == "False" ? "User" : "Admin"}</td>
                <td><div id={`user-${user.id}`} className={`badge bg-${user.connectionId!=null?"success":"secondary"}`}>{user.connectionId!=null?"Online":"Offline"}</div></td>

              </tr>


            ))
          }

        </tbody>
      </table>

      {/* Pagination */}

      <br></br>
      {Math.ceil(users.length / itemsPerPage) !== 1 ? (<div>
        <ReactPaginate
          pageCount={Math.ceil(users.length / itemsPerPage)}
          onPageChange={handlePageChange}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="active"
          previousClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          disabledClassName="disabled d-none"
          breakLabel={'...'}
          marginPagesDisplayed={0}
          pageRangeDisplayed={5}
          breakClassName={'page-link'}
          disableInitialCallback={true}
          previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
          nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
        />
      </div>) : (<></>)}




    </div>
  );
}

export default UserList;