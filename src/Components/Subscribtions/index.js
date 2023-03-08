import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button } from 'react-bootstrap';
import { SubscriptionService } from '../../APIs/Services/SubscriptionService';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSquarePlus } from '@fortawesome/free-solid-svg-icons';


function SubscribtionList() {


    // ==================
    // States 
    // ==================
    const [subscribes, setSubscribes] = React.useState([]);

    const [currentPage, setCurrentPage] = React.useState(1);

    // ==================
    // Funcitons 
    // ==================


    //Delete
    const deleteSubscribe = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                SubscriptionService.deleteSubscribe(id).then(() => {
                    getAllSubscribes();
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    );
                }).catch(err => {
                    let { errors } = err.response.data;

                    console.log(errors);
                    Swal.fire(
                        'Error!',
                        'Something Went Wrong',
                        'error'
                    );
                });

            }
        });

    };

    //Pagination
    const handlePageChange = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
    };
    const itemsPerPage = 2;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const SubscribesToDisplay = subscribes.slice(startIndex, endIndex);

    let order = startIndex + 1;

    // ==================
    // hooks 
    // ==================
    const getAllSubscribes = React.useCallback(() => {
        SubscriptionService.getAll().then(response => {

            setSubscribes(response?.data);
        });
    }, []);

    React.useEffect(() => {
        getAllSubscribes();
    }, []);


    return (
        <div className='d-flex justify-content-center flex-column '>

            <table className='table table-light '>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Last Sent At</th>
                        <th >Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        SubscribesToDisplay.map(item => (

                            <tr className='text-nowrap' key={item.id}>
                                <td>{order++}</td>
                                <td>{item.email}</td>
                                <td>{new Date(item.lastSentAt).toLocaleString('en-US', { timeZone: 'Asia/Baku' })}</td>
                                <td >
                                    <button onClick={() => deleteSubscribe(item.id)} className='btn btn-danger ' ><i className='zmdi zmdi-delete'></i></button>
                                </td>
                            </tr>


                        ))
                    }

                </tbody>
            </table>

            {/* Pagination */}

            <br></br>
            {Math.ceil(subscribes.length / itemsPerPage) !== 1 ? (<div>
                <ReactPaginate
                    pageCount={Math.ceil(subscribes.length / itemsPerPage)}
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

export default SubscribtionList;