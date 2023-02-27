import React from 'react';

import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ProductReviewService } from '../../APIs/Services/ProductReviewService';

function ProductReviewList() {


    // ==================
    // States 
    // ==================
    const [reviews, setReviews] = React.useState([]);

    const [currentPage, setCurrentPage] = React.useState(1);

    // ==================
    // Funcitons 
    // ==================


    //Reject
    const RejectReview = (id) => {
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
                ProductReviewService.reject(id).then((res) => {
                    if (res.status == 204) {
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        );
                        getAllReviews();
                    }

                }).catch((e) => {
                    Swal.fire(
                        'Errror!',
                        'Something Went Wrong',
                        'error'
                    );
                });

            }
        });

    };

    //Approve
    const ApproveReview = (id) => {
        ProductReviewService.approve(id).then((res) => {
            console.log(res)
            if (res.status == 200) {
                Swal.fire(
                    'Approved!',
                    'User Review has been Approved.',
                    'success'
                );
                getAllReviews();
            }

        }).catch((e) => {
            Swal.fire(
                'Errror!',
                'Something Went Wrong',
                'error'
            );
        });




    };

    //Pagination
    const handlePageChange = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
    };
    const itemsPerPage = 4;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const reviewsToDisplay = reviews.slice(startIndex, endIndex);

    let order = startIndex + 1;


    const getStars = (rate) => {
        let content = [];
        for (let i = 0; i < 5; i++) {
            if (i >= rate)
                content.push(<i key={i} className="zmdi zmdi-star-outline text-primary "></i>);
            else
                content.push(<i key={i} className="zmdi zmdi-star text-primary "></i>);

        }
        return content;
    };



    // ==================
    // hooks 
    // ==================
    const getAllReviews = React.useCallback(() => {
        ProductReviewService.getAll().then(response => {
            setReviews(response?.data);
        });
    }, []);

    React.useEffect(() => {
        getAllReviews();
    }, []);



    return (
        <div className='overflow-auto'>

            <table className='table table-light '>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Product</th>
                        <th>Username </th>
                        <th>Email/Phone </th>
                        <th>Review </th>
                        <th>Rate </th>

                        <th className='text-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        reviewsToDisplay.map(review => (

                            <tr  key={review.id}>
                                <td>{order++}</td>
                                <td> <a href={review.link} className="fw-bold text-decoration-none fs-6 text-dark ">{review.product?.name}</a> </td>
                                <td>{review.appUser?.userName}</td>
                                <td>{review.appUser?.email} /{review.appUser?.phoneNumber}  </td>
                                <td>{review.text}</td>
                                <td className='text-nowrap'>
                                    <div className='stars'>
                                        {getStars(review.rate)}

                                    </div>
                                </td>
                                <td className='d-flex justify-content-end float-none'>
                                    {review.isApproved == false ? (
                                        <button  onClick={() => ApproveReview(review.id)} className='btn btn-info mx-2 ' ><i className='zmdi zmdi-edit'></i></button>
                                    ) : (<></>)}
                                    <button onClick={() => RejectReview(review.id)} className='btn btn-danger ' ><i className='zmdi zmdi-delete'></i></button>
                                </td>
                            </tr>


                        ))
                    }

                </tbody>
            </table>



            <br></br>
            {Math.ceil(reviews.length / itemsPerPage) !== 1 ? (<div>
                <ReactPaginate
                    pageCount={Math.ceil(reviews.length / itemsPerPage)}
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
export default ProductReviewList;