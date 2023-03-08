import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button } from 'react-bootstrap';
import { ValueService } from '../../APIs/Services/ValueService';
import ReactPaginate from 'react-paginate';


import Swal from 'sweetalert2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSquarePlus, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';


function ValueList() {

    const { register, handleSubmit, formState: { errors }, setValue, control, setError, clearErrors } = useForm();

    // ==================
    // States 
    // ==================
    const [values, setValues] = React.useState([]);

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
        setValue("desc", "");
        setValue("icon", "");
        setValue("IsFeatured", false);
        clearErrors();
        return invokeCreateModal(!isCreateShow);
    };

    const create_OnSubmit = (data) => {
        clearErrors();
        let openModal = false;
        console.log(data);


        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("desc", data.desc);
        formData.append("icon", data.icon);
        formData.append("isFeatured", data.IsFeatured);


        ValueService.create(formData).then(response => {
        })
            .catch(err => {
                openModal = true;
                let { errors } = err.response?.data;

                console.log(errors);
                for (const key in errors) {
                    if (Object.hasOwnProperty.call(errors, key)) {
                        const element = errors[key];
                        setError(key, { type: 'custom', message: element.join(", ") });
                    }
                }
            })
            .finally(() => {
                invokeCreateModal(openModal);
                getAllValues();
            });
    };


    // Edit

    const initEditModal = () => {
        return invokeEditModal(!isEditShow);
    };
    const openEditModal = async (id) => {
        clearErrors();

        invokeEditModal(true);
        let value = await ValueService.getById(id);
        setEditModel(value.data);

    };
    const edit_OnSubmit = (data) => {
        let openModal = false;
        clearErrors();
        console.log(data);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("desc", data.desc);
        formData.append("icon", data.icon);
        formData.append("isFeatured", data.IsFeatured);

        ValueService.edit(editModel.id, formData).then(response => {
            console.log(response);
        })
            .catch(err => {
                openModal = true;
                let { errors } = err.response?.data;

                console.log(errors);
                for (const key in errors) {
                    if (Object.hasOwnProperty.call(errors, key)) {
                        const element = errors[key];
                        setError(key, { type: 'custom', message: element.join(", ") });
                    }
                }
            })
            .finally(() => {
                invokeEditModal(openModal);
                getAllValues();
            });
    };


    //Delete
    const deleteSlider = (id) => {
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
                ValueService.deleteValue(id).then(() => {
                    getAllValues();
                });
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                );
            }
        }).catch(err => {
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
        });


    };

    //Pagination
    const handlePageChange = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
    };
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const valuesToDisplay = values.slice(startIndex, endIndex);
    let order = startIndex + 1;

    // ==================
    // hooks 
    // ==================
    const getAllValues = React.useCallback(() => {
        ValueService.getAll().then(response => {
            setValues(response?.data);
        });
    }, []);


    React.useEffect(() => {
        getAllValues();
    }, []);

    React.useEffect(() => {
        if (editModel) {
            setValue("name", editModel.name);
            setValue("desc", editModel.desc);
            setValue("icon", editModel.icon);
            setValue("IsFeatured", editModel.isFeatured);
        }
    }, [editModel, isEditShow]);

    // Data validation rules
    let Name_maxlength = 30;
    let Desc_maxLength = 200;
    let Icon_maxLength = 50;

    return (
        <div className='d-flex justify-content-center flex-column  overflow-auto'>
            <div className='text-end'>
                <Button onClick={initCreateModal}><FontAwesomeIcon icon={faSquarePlus} /></Button>
            </div>
            <table className='table table-light overflow-scroll'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Icon</th>
                        <th>Is Special</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        valuesToDisplay.map(value => (

                            <tr key={value.id}>
                                <td>{order++}</td>
                                <td>{value.name}</td>
                                <td>{value.desc}</td>
                                <td>{value.icon}</td>
                                <td>{value.isFeatured ? (<div className='badge bg-success'>Special</div>) : (<div className='badge bg-danger'>Ordianry</div>)}</td>

                                <td className='text-nowrap'>
                                    <button onClick={() => openEditModal(value.id)} className="btn btn-primary   m-1 fw-semibold"><FontAwesomeIcon icon={faPencil} /></button>
                                    <button onClick={() => deleteSlider(value.id)} className="btn btn-danger   m-1 fw-semibold"><FontAwesomeIcon icon={faTrashCan} /></button>

                                </td>

                            </tr>
                        ))
                    }

                </tbody>
            </table>

            {/* Pagination */}

            <br></br>
            {Math.ceil(values.length / itemsPerPage) !== 1 ? (<div>
                <ReactPaginate
                    pageCount={Math.ceil(values.length / itemsPerPage)}
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

            <Modal show={isEditShow}>
                <Modal.Header closeButton onClick={initEditModal}>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='editOrder' className='row' onSubmit={handleSubmit(edit_OnSubmit)} >


                        {/* Name */}
                        <div className="my-3">
                            <input
                                placeholder="Name"
                                className='form-control'
                                aria-invalid={errors.name ? "true" : "false"}
                                {...register("name", { required: "title field is required", maxLength: Name_maxlength })}
                            />
                            {errors.name && <small className='text-danger' role="alert">{errors?.name?.message}</small>}
                        </div>

                        {/* Desc */}
                        <div className="my-3">
                            <input
                                placeholder=" Description"
                                className='form-control'
                                aria-invalid={errors.desc ? "true" : "false"}
                                {...register("desc", { required: "description field is required", maxLength: Desc_maxLength })}
                            />
                            {errors.desc && <small className='text-danger' role="alert">{errors?.desc?.message}</small>}
                        </div>
                        {/* Icon */}
                        <div className="my-3">
                            <input
                                placeholder="Icon"
                                className='form-control'
                                aria-invalid={errors.icon ? "true" : "false"}
                                {...register("icon", { required: "icon field is required", maxLength: Icon_maxLength })}
                            />
                            {errors.icon && <small className='text-danger' role="alert">{errors?.icon?.message}</small>}
                        </div>

                        {/* Is Featured */}
                        <div className="my-2">
                            <label htmlFor="" className='form-check-label'>Is Special ?</label>

                            <input
                                type="checkbox"
                                className='d-block'
                                aria-invalid={errors.IsFeatured ? "true" : "false"}
                                {...register("IsFeatured", { required: false })}
                            />
                            {errors.IsFeatured && <small className='text-danger' role="alert">{errors.IsFeatured.message}</small>}

                        </div>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={initEditModal}>
                        Cancel
                    </Button>
                    <Button variant="success" type='submit' form='editOrder' >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* create  modal  */}
            <Modal  show={isCreateShow}>
                <Modal.Header closeButton onClick={initCreateModal}>
                    <Modal.Title>Create</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='createCategory' className='row' onSubmit={handleSubmit(create_OnSubmit)}  >

                        {/* Name */}
                        <div className="my-3">
                            <input
                                placeholder="Name"
                                className='form-control'
                                aria-invalid={errors.name ? "true" : "false"}
                                {...register("name", { required: "title field is required", maxLength: Name_maxlength })}
                            />
                            {errors.name && <small className='text-danger' role="alert">{errors?.name?.message}</small>}
                        </div>

                        {/* Desc */}
                        <div className="my-3">
                            <input
                                placeholder=" Description"
                                className='form-control'
                                aria-invalid={errors.desc ? "true" : "false"}
                                {...register("desc", { required: "description field is required", maxLength: Desc_maxLength })}
                            />
                            {errors.desc && <small className='text-danger' role="alert">{errors?.desc?.message}</small>}
                        </div>
                        {/* Icon */}
                        <div className="my-3">
                            <input
                                placeholder="Icon"
                                className='form-control'
                                aria-invalid={errors.icon ? "true" : "false"}
                                {...register("icon", { required: "icon field is required", maxLength: Icon_maxLength })}
                            />
                            {errors.icon && <small className='text-danger' role="alert">{errors?.icon?.message}</small>}
                        </div>

                        {/* Is Featured */}
                        <div className="my-2">
                            <label htmlFor="" className='form-check-label'>Is Special ?</label>

                            <input
                                type="checkbox"
                                className='d-block'
                                aria-invalid={errors.IsFeatured ? "true" : "false"}
                                {...register("IsFeatured", { required: false })}
                            />
                            {errors.IsFeatured && <small className='text-danger' role="alert">{errors.IsFeatured.message}</small>}

                        </div>


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
export default ValueList;