import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button } from 'react-bootstrap';
import { AmenityImageService } from '../../APIs/Services/AmenityImageService';
import ReactPaginate from 'react-paginate';

import Swal from 'sweetalert2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSquarePlus, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';


function AmenityImageList() {

    const { register, handleSubmit, formState: { errors }, setValue, control, setError, clearErrors } = useForm();

    // ==================
    // States 
    // ==================
    const [amenityImages, setAmenityImages] = React.useState([]);

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
        formData.append("Image", data.Image[0]);
        AmenityImageService.create(formData).then(response => {
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
                getAllAmenityImages();
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
        let image = await AmenityImageService.getById(id);
        setEditModel(image.data);

    };
    const edit_OnSubmit = (data) => {
        let openModal = false;
        clearErrors();
        console.log(data);

        const formData = new FormData();
        if (data.Image[0] !== undefined) {
            formData.append("Image", data.Image[0]);
        }
        else {
            formData.append("Image", null);
        }


        AmenityImageService.edit(editModel.id, formData).then(response => {
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
                getAllAmenityImages();
            });
    };


    //Delete
    const deleteAmenityImage = (id) => {
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
                AmenityImageService.deleteAmenityImage(id).then(() => {
                    getAllAmenityImages();
                });
                Swal.fire(
                    'Deleted!',
                    'Image has been deleted.',
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
    const amenityImagesToDisplay = amenityImages.slice(startIndex, endIndex);
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
    const getAllAmenityImages = React.useCallback(() => {
        AmenityImageService.getAll().then(response => {
            setAmenityImages(response?.data);
        });
    }, []);


    React.useEffect(() => {
        getAllAmenityImages();
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        amenityImagesToDisplay.map(amenityImage => (

                            <tr key={amenityImage.id}>
                                <td>{order++}</td>
                                <td><img src={amenityImage.imageUrl} width='100' height='70' /></td>
                                <td className='text-nowrap'>
                                    <button onClick={() => openEditModal(amenityImage.id)} className="btn btn-primary   m-1 fw-semibold"><FontAwesomeIcon icon={faPencil} /></button>
                                    <button onClick={() => deleteAmenityImage(amenityImage.id)} className="btn btn-danger   m-1 fw-semibold"><FontAwesomeIcon icon={faTrashCan} /></button>

                                </td>

                            </tr>
                        ))
                    }

                </tbody>
            </table>

            {/* Pagination */}

            <br></br>
            {Math.ceil(amenityImages.length / itemsPerPage) !== 1 ? (<div>
                <ReactPaginate
                    pageCount={Math.ceil(amenityImages.length / itemsPerPage)}
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

            <Modal  show={isEditShow}>
                <Modal.Header closeButton onClick={initEditModal}>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='editOrder' className='row' onSubmit={handleSubmit(edit_OnSubmit)} >
                        {/*  Image */}
                        <div className="my-2 row align-items-center ">
                            <div className="col-6 mx-2">

                                <label htmlFor="" className='form-check-label'>Image</label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    className='form-control mt-2'
                                    aria-invalid={errors.Image ? "true" : "false"}
                                    {...register("Image", { required: false,onChange: (e) => {handleFileSelect(e)}, })}
                                />
                                {errors.Image && <small className='text-danger' role="alert">{errors?.Image?.message}</small>}

                            </div>

                            <div className="col">
                                {imageSrc.length > 0 ? (<>
                                    <img src={imageSrc} width="100" height="100" className='object-fit-cover' />
                                </>) : (<>
                                <img src={editModel.imageUrl} width="100" height="100" className='object-fit-cover' />
                                </>)}
                            </div>
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
            <Modal show={isCreateShow}>
                <Modal.Header closeButton onClick={initCreateModal}>
                    <Modal.Title>Create</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='createCategory' className='row' onSubmit={handleSubmit(create_OnSubmit)}  >
                        {/*  Image */}
                        <div className="my-2 row align-items-center ">
                            <div className="col-6 mx-2">

                                <label htmlFor="" className='form-check-label'>Image</label>
                                <input
                                    type="file"
                                    
                                    accept="image/png, image/jpeg"
                                    className="form-control mt-2 "
                                     aria-invalid={errors.Image ? "true" : "false"}
                                     {...register("Image", { required: true,onChange: (e) => {handleFileSelect(e)},})}
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
export default AmenityImageList;