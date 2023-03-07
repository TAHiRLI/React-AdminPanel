import React from 'react';

import './blog.scss';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { BlogService } from '../../APIs/Services/BlogService';


function BlogList() {


  // ==================
  // States 
  // ==================
  const [blogs, setBlogs] = React.useState([]);

  const [currentPage, setCurrentPage] = React.useState(1);

  // ==================
  // Funcitons 
  // ==================


  //Delete
  const deleteBlog = (id) => {
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
        BlogService.delete(id).then(() => {
          getAllBlogs();
        });
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
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
  const blogsToDisplay = blogs.slice(startIndex, endIndex);

  let order = startIndex + 1;

  // ==================
  // hooks 
  // ==================
  const getAllBlogs = React.useCallback(() => {
    BlogService.getAll().then(response => {
      setBlogs(response?.data);
    });
  }, []);

  React.useEffect(() => {
    getAllBlogs();
  }, []);










  // Data validation rules
  let Name_maxlength = 30;


  return (
    <div className='d-flex justify-content-center flex-column container'>
      <div className='text-end'>
      </div>
      <div className="blogs row  gy-4">

        {
          blogsToDisplay.map(blog => (
            <div className=" col-lg-3 p-3 " >

              <div className='card h-100'>
                <a href={blog.link}>   <img src={blog.imageUrl} className="blog card-img-top" alt="..." /></a>

                <div className="card-body d-flex flex-column justify-content-between">
                  <a href={blog.link} className="blog card-title text-dark text-decoration-none fw-semibold h5">{blog.title}</a>
                  <div className="card-text">
                    <p className="fw-semibold">{blog.doctor?.fullname}</p>

                    {blog.prevText}
                  </div>
                  <button onClick={() => deleteBlog(blog.id)} className="btn btn-danger d-block mt-4 fw-semibold">Remove this Blog</button>
                </div>
              </div>
            </div>
          ))

        }




      </div>

      {/* Pagination */}

      <br></br>
      {Math.ceil(blogs.length / itemsPerPage) !== 1 ? (<div>
        <ReactPaginate
          pageCount={Math.ceil(blogs.length / itemsPerPage)}
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

export default BlogList;