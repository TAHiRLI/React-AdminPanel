import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button } from 'react-bootstrap';
import { BlogCategoryService } from '../../APIs/Services/BlogCategoryService';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSquarePlus } from '@fortawesome/free-solid-svg-icons';


function BlogCategoryList() {

    const { register, handleSubmit, formState: { errors }, setValue, control, setError, clearErrors } = useForm();

    // ==================
    // States 
    // ==================
    const [blogCategories, setBlogCategories] = React.useState([]);

    const [isEditShow, invokeEditModal] = React.useState(false);
    const [editModel, setEditModel] = React.useState({});

    const [isCreateShow, invokeCreateModal] = React.useState(false);

    const [currentPage, setCurrentPage] = React.useState(1);

    // ==================
    // Funcitons 
    // ==================


    //Create

    const initCreateModal = () => {
        setValue("name", "");
        return invokeCreateModal(!isCreateShow);
    };

    const create_OnSubmit = (data) => {
        let closeModal = false;
        console.log(data);
        let body = {
            name: data.name
        };
        BlogCategoryService.create(body).then(response => {
            console.log("response", response);
        })
            .catch(err => {
                closeModal = true;
                let errors = err?.response?.data?.errors?.Name;
                errors.forEach(element => {
                    console.log(element);
                });
                alert(errors[0]);
            })
            .finally(() => {
                getAllCategories();
                invokeCreateModal(closeModal);
            });
    };


    // Edit

    const initEditModal = () => {
        return invokeEditModal(!isEditShow);
    };
    const openEditModal = async (id) => {
        clearErrors();

        invokeEditModal(true);
        let category = await BlogCategoryService.getById(id);
        console.log(category.data);
        setEditModel(category.data);

    };
    const edit_OnSubmit = (data) => {

        invokeEditModal(false);
        console.log("editdata", data);
        let body = {
            name: data.name
        };
        BlogCategoryService.edit(editModel.id, body).then(response => {
            console.log(response);
        })
            .catch(err => {
                let { errors } = err.response.data;

                console.log(errors);
                Swal.fire(
                    'Error!',
                    'Something Went Wrong',
                    'error'
                );
                for (const key in errors) {
                    if (Object.hasOwnProperty.call(errors, key)) {
                        const element = errors[key];
                        setError(key, { type: 'custom', message: element.join(", ") });
                    }
                }
            })
            .finally(() => {
                getAllCategories();
            });
    };


    //Delete
    const deleteCategory = (id) => {
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
                BlogCategoryService.deleteCategory(id).then(() => {
                    getAllCategories();
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
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const categoriesToDisplay = blogCategories.slice(startIndex, endIndex);

    let order = startIndex + 1;

    // ==================
    // hooks 
    // ==================
    const getAllCategories = React.useCallback(() => {
        BlogCategoryService.getAll().then(response => {

            setBlogCategories(response?.data);
        });
    }, []);

    React.useEffect(() => {
        getAllCategories();
    }, []);

    React.useEffect(() => {
        if (editModel) {
            setValue("id", editModel.id);
            setValue("name", editModel.name);
        }
    }, [editModel, isEditShow]);








    // Data validation rules
    let Name_maxlength = 30;


    return (
        <div className='d-flex justify-content-center flex-column '>
            <div className='text-end'>
                <Button onClick={initCreateModal}><FontAwesomeIcon icon={faSquarePlus} /></Button>
            </div>
            <table className='table table-light '>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th className='text-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categoriesToDisplay.map(item => (

                            <tr className='text-nowrap' key={item.id}>
                                <td>{order++}</td>
                                <td>{item.name}</td>
                                <td className='d-flex justify-content-center'>
                                    <button onClick={() => openEditModal(item.id)} className='btn btn-info mx-2 ' ><i className='zmdi zmdi-edit'></i></button>
                                    <button onClick={() => deleteCategory(item.id)} className='btn btn-danger ' ><i className='zmdi zmdi-delete'></i></button>
                                </td>
                            </tr>


                        ))
                    }

                </tbody>
            </table>

            {/* Pagination */}

            <br></br>
            {Math.ceil(blogCategories.length / itemsPerPage) !== 1 ? (<div>
                <ReactPaginate
                    pageCount={Math.ceil(blogCategories.length / itemsPerPage)}
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


            {/* Edit Modal*/}

            <Modal show={isEditShow}>
                <Modal.Header closeButton onClick={initEditModal}>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='editCategory' onSubmit={handleSubmit(edit_OnSubmit)} >
                        <input type="hidden"
                            {...register("id")}
                        />

                        <input
                            placeholder="Product Name"
                            className='form-control mt-2'
                            aria-invalid={errors.name ? "true" : "false"}
                            {...register("name", { required: "this field is required", maxLength: Name_maxlength })}
                        />
                        {errors.name && <small className='text-danger' role="alert">{errors?.name?.message}</small>}

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={initEditModal}>
                        Cancel
                    </Button>
                    <Button variant="success" type='submit' form='editCategory' >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* create  modal  */}
            <Modal show={isCreateShow}>
                <Modal.Header closeButton onClick={initCreateModal}>
                    <Modal.Title>Create</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='createCategory' onSubmit={handleSubmit(create_OnSubmit)}  >
                        <input
                            placeholder="Category Name"
                            className='form-control'
                            aria-invalid={errors.name ? "true" : "false"}
                            {...register("name", { required: "this field is required", maxLength: Name_maxlength })}
                        />
                        {errors.name && <small className='text-danger' role="alert">{errors?.name?.message}</small>}

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={initCreateModal}>
                        Cancel
                    </Button>
                    <Button variant="success" type='submit' form='createCategory' >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>





        </div>
    );
}

export default BlogCategoryList;