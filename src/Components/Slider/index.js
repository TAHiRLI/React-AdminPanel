import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button } from 'react-bootstrap';
import { SliderService } from '../../APIs/Services/SliderService';
import ReactPaginate from 'react-paginate';


import Swal from 'sweetalert2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSquarePlus, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';


function SliderList() {

    const { register, handleSubmit, formState: { errors }, setValue, control, setError, clearErrors } = useForm();

    // ==================
    // States 
    // ==================
    const [sliders, setSliders] = React.useState([]);

    const [isEditShow, invokeEditModal] = React.useState(false);
    const [editModel, setEditModel] = React.useState({});

    const [isCreateShow, invokeCreateModal] = React.useState(false);

    const [currentPage, setCurrentPage] = React.useState(1);
    const [imageSrc, setImageSrc] = React.useState("");
    // ==================
    // Funcitons 
    // ==================


    //Create

    const initCreateModal = () => {
        setImageSrc("")

        return invokeCreateModal(!isCreateShow);
    };

    const create_OnSubmit = (data) => { 
        clearErrors();
        let openModal = false;
        console.log(data);


        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("desc", data.desc);
        formData.append("btnText", data.btnText);
        formData.append("btnUrl", data.btnUrl);
        formData.append("order", data.order);
        formData.append("Image", data.Image[0]);


        SliderService.create(formData).then(response => {
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
                getAllSliders();
                setValue("Image", []);
                setImageSrc("")
            });
    };


    // Edit

    const initEditModal = () => {
        setImageSrc("")
        return invokeEditModal(!isEditShow);
    };
    const openEditModal = async (id) => {
        clearErrors();

        invokeEditModal(true);
        let slider = await SliderService.getById(id);
        setEditModel(slider.data);

    };
    const edit_OnSubmit = (data) => {
        let openModal = false;
        clearErrors();
        console.log(data);

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("desc", data.desc);
        formData.append("btnText", data.btnText);
        formData.append("btnUrl", data.btnUrl);
        formData.append("order", data.order);
       

        if (data.Image[0] !== undefined) {
            formData.append("Image", data.Image[0]);
        }
        else {
            formData.append("Image", null);
        }


        SliderService.edit(editModel.id, formData).then(response => {
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
                getAllSliders();
                setValue("Image", []);
                setImageSrc("")
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
                SliderService.deleteSlider(id).then(() => {
                    getAllSliders();
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
    const slidersToDisplay = sliders.slice(startIndex, endIndex);
    let order = startIndex + 1;

    // File Reader
    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
     
        if (selectedFile) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageSrc(reader.result);
          };
          reader.readAsDataURL(selectedFile);
        }
      };

    

    // ==================
    // hooks 
    // ==================
    const getAllSliders = React.useCallback(() => {
        SliderService.getAll().then(response => {
            setSliders(response?.data);
        });
    }, []);


    React.useEffect(() => {
        getAllSliders();
    }, []);

    React.useEffect(() => {
        if (editModel) {
            console.log(editModel);
            setValue("title", editModel.title);
            setValue("desc", editModel.desc);
            setValue("btnText", editModel.btnText);
            setValue("btnUrl", editModel.btnUrl);
            setValue("order", editModel.order);


        }
    }, [editModel, isEditShow]);

    // Data validation rules
    let Title_maxlength = 50;
    let Desc_maxLength = 100;
    let BtnText_maxLength = 50;
    let BtnUrl_maxlength = 200;

    return (
        <div className='d-flex justify-content-center flex-column  overflow-auto'>
            <div className='text-end'>
                <Button onClick={initCreateModal}><FontAwesomeIcon icon={faSquarePlus} /></Button>
            </div>
            <table className='table table-light overflow-scroll'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Button Text</th>
                        <th>Button Url</th>
                        <th>Order</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        slidersToDisplay.map(slider => (

                            <tr  key={slider.id}>
                                <td>{order++}</td>
                                <td><img src={slider.imageUrl} width='100' height='70' /></td>
                                <td>{slider.title}</td>
                                <td>{slider.desc}</td>
                                <td>{slider.btnText}</td>
                                <td>{slider.btnUrl}</td>
                                <td>{slider.order}</td>
                                <td className='text-nowrap'>
                                    <button onClick={() => openEditModal(slider.id)} className="btn btn-primary   m-1 fw-semibold"><FontAwesomeIcon icon={faPencil} /></button>
                                    <button onClick={() => deleteSlider(slider.id)} className="btn btn-danger   m-1 fw-semibold"><FontAwesomeIcon icon={faTrashCan} /></button>

                                </td>

                            </tr>
                        ))
                    }

                </tbody>
            </table>

            {/* Pagination */}

            <br></br>
            {Math.ceil(sliders.length / itemsPerPage) !== 1 ? (<div>
                <ReactPaginate
                    pageCount={Math.ceil(sliders.length / itemsPerPage)}
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


            {/* edit */}

            <Modal dialogClassName="modal-width modal-lg" show={isEditShow}>
                <Modal.Header closeButton onClick={initEditModal}>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='editOrder' className='row' onSubmit={handleSubmit(edit_OnSubmit)} >



                        {/* Title */}
                        <div className="my-3">
                            <input
                                placeholder=" Title"
                                className='form-control'
                                aria-invalid={errors.title ? "true" : "false"}
                                {...register("title", { required: "title field is required", maxLength: Title_maxlength })}
                            />
                            {errors.title && <small className='text-danger' role="alert">{errors?.title?.message}</small>}
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
                        {/* BtnText */}
                        <div className="my-3">
                            <input
                                placeholder=" Button Text"
                                className='form-control'
                                aria-invalid={errors.btnText ? "true" : "false"}
                                {...register("btnText", { required: "btnText field is required", maxLength: BtnText_maxLength })}
                            />
                            {errors.btnText && <small className='text-danger' role="alert">{errors?.btnText?.message}</small>}
                        </div>

                        {/* BtnUrl */}
                        <div className="my-3">
                            <input
                                placeholder="Button Link"
                                className='form-control'
                                aria-invalid={errors.btnUrl ? "true" : "false"}
                                {...register("btnUrl", { required: "Button Link field is required", maxLength: BtnUrl_maxlength })}
                            />
                            {errors.btnUrl && <small className='text-danger' role="alert">{errors?.btnUrl?.message}</small>}
                        </div>

                        {/* Order */}
                        <div className="my-3">
                            <input
                                min="0"

                                type="number"
                                placeholder="Order"
                                className='form-control'
                                aria-invalid={errors.order ? "true" : "false"}
                                {...register("order", { required: "Order  field is required",min:0 })}
                            />
                            {errors.order && <small className='text-danger' role="alert">{errors?.order?.message}</small>}
                        </div>


                        {/*  Image */}
                        <div className="my-2 row align-items-center ">
                            <div className="col-6 mx-2">

                                <label htmlFor="" className='form-check-label'>Image</label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    className='form-control mt-2'
                                    aria-invalid={errors.Image ? "true" : "false"}
                                    {...register("Image", { required: false ,onChange: (e) => {handleFileSelect(e)},})}
                                />
                                {errors.Image && <small className='text-danger' role="alert">{errors?.Image?.message}</small>}

                            </div>

                            <div className="col">
                            {imageSrc.length > 0 ? (<>
                                    <img src={imageSrc} width="150" height="100" className='object-fit-cover' />
                                </>) : (<>
                                <img src={editModel.imageUrl} width="150" height="100" className='object-fit-cover' />
                                </>)} </div>
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
            <Modal dialogClassName='modal-lg' show={isCreateShow}>
                <Modal.Header closeButton onClick={initCreateModal}>
                    <Modal.Title>Create</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='createCategory' className='row' onSubmit={handleSubmit(create_OnSubmit)}  >


                        {/* Title */}
                        <div className="my-3">
                            <input
                                placeholder=" Tilte"
                                className='form-control'
                                aria-invalid={errors.title ? "true" : "false"}
                                {...register("title", { required: "title field is required", maxLength: Title_maxlength })}
                            />
                            {errors.title && <small className='text-danger' role="alert">{errors?.title?.message}</small>}
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
                        {/* BtnText */}
                        <div className="my-3">
                            <input
                                placeholder=" Button Text"
                                className='form-control'
                                aria-invalid={errors.btnText ? "true" : "false"}
                                {...register("btnText", { required: "btnText field is required", maxLength: BtnText_maxLength })}
                            />
                            {errors.btnText && <small className='text-danger' role="alert">{errors?.btnText?.message}</small>}
                        </div>

                        {/* BtnUrl */}
                        <div className="my-3">
                            <input
                                placeholder="Button Link"
                                className='form-control'
                                aria-invalid={errors.btnUrl ? "true" : "false"}
                                {...register("btnUrl", { required: "Button Link field is required", maxLength: BtnUrl_maxlength })}
                            />
                            {errors.btnUrl && <small className='text-danger' role="alert">{errors?.btnUrl?.message}</small>}
                        </div>

                        {/* Order */}
                        <div className="my-3">
                            <input
                                min="0"
                                type="number"
                                placeholder="Order"
                                className='form-control'
                                aria-invalid={errors.order ? "true" : "false"}
                                {...register("order", { required: "Order  field is required",min:0  })}
                            />
                            {errors.order && <small className='text-danger' role="alert">{errors?.order?.message}</small>}
                        </div>


                        {/*  Image */}
                        <div className="my-2 row align-items-center ">
                            <div className="col-6 mx-2">

                                <label htmlFor="" className='form-check-label'>Image</label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    className='form-control mt-2'
                                    aria-invalid={errors.Image ? "true" : "false"}
                                    {...register("Image", { required: true,onChange: (e) => {handleFileSelect(e)}, })}
                                />
                                {errors.Image && <small className='text-danger' role="alert">{errors?.Image?.message}</small>}

                            </div>

                            <div className="col">
                            {imageSrc.length > 0 ? (<>
                                    <img src={imageSrc} width="100" height="100" className='object-fit-cover' />
                                </>) : (<></>)}
                            </div>
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
export default SliderList;