import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../Consts/Routes';

import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { OrderService } from '../../APIs/Services/OrderService';
import { __RouterContext } from 'react-router';


function OrderList() {


  // ==================
  // States 
  // ==================
  const [orders, setOrders] = React.useState([]);

  const [currentPage, setCurrentPage] = React.useState(1);

  // ==================
  // Funcitons 
  // ==================



  //Pagination
  const handlePageChange = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const ordersToDisplay = orders.slice(startIndex, endIndex);

  let order = startIndex + 1;

  // ==================
  // hooks 
  // ==================
  const getAllOrders = React.useCallback(() => {
    OrderService.getAll().then(response => {
      setOrders(response?.data);
    });
  }, []);

  React.useEffect(() => {
    getAllOrders();
  }, []);










  // Data validation rules
  let Name_maxlength = 30;


  return (
    <div className='d-flex justify-content-center flex-column '>
      <div className='text-end'>
      </div>
      <table className='table table-light overflow-scroll'>
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Email</th>
            <th>Address</th>
            <th>Zip Code</th>
            <th>Item Count</th>
            <th>Order Status</th>
            <th className='text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            ordersToDisplay.map(item => (

              <tr className='text-nowrap' key={item.id}>
                <td>{order++}</td>
                <td>{item.appUser?.userName ?? "non-user"}</td>
                <td>{item.email}</td>
                <td>{item.address1}</td>
                <td>{item.zipCode}</td>
                <td>{item.orderItems?.length}</td>
                <td>{item.orderStatus== true ?(<div className='badge bg-success'>Approved</div>):item.orderStatus== false ?(<div className='badge bg-danger'>Rejected</div>):(<div className='badge bg-warning'>Pending</div>)}</td>
                <td className='d-flex justify-content-center'>
                <Link to={{
                    pathname: ROUTES.ORDER_DETAILS,
                    state: {id:item.id}
                }}  className="nav-link align-middle px-0 ">
                        <i className="fs-4 zmdi zmdi-edit  "></i>
                    </Link>
                </td>
              </tr>

              
            ))
          }

        </tbody>
      </table>

      {/* Pagination */}

      <br></br>
      {Math.ceil(orders.length / itemsPerPage) !== 1 ? (<div>
        <ReactPaginate
          pageCount={Math.ceil(orders.length / itemsPerPage)}
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

export default OrderList;