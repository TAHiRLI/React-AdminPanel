import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button } from 'react-bootstrap';
import { ServicesService } from '../../APIs/Services/ServicesService';
import ReactPaginate from 'react-paginate';

// Ck Editor 
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Swal from 'sweetalert2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSquarePlus, faPencil, faTrashCan, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';


function ServiceList() {

    const { register, handleSubmit, formState: { errors }, setValue, setError, clearErrors } = useForm();

    // ==================
    // States 
    // ==================
    const [services, setServices] = React.useState([]);

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
        setImageSrc("");

        setValue("DetailedDesc", "");
        setValue("Description", "");
        setValue("name", "");
        setValue("icon", "");
        setValue("isFeatured", false);
        setValue("Image", []);

        return invokeCreateModal(!isCreateShow);
    };

    const create_OnSubmit = (data) => {
        clearErrors();
        let openModal = false;
        clearErrors();
        console.log(data);


        const formData = new FormData();
        formData.append("name", data.Description);
        formData.append("icon", data.Description);
        formData.append("DetailedDesc", data.DetailedDesc);
        formData.append("Description", data.Description);
        formData.append("Image", data.image[0]);
        formData.append("isFeatured", data.isFeatured);

        ServicesService.create(formData).then(response => {
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
                getAllServices();

                setValue("image", []);
                setImageSrc("");
            });
    };


    // Edit

    const initEditModal = () => {
        setImageSrc("");
        return invokeEditModal(!isEditShow);
    };
    const openEditModal = async (id) => {
        clearErrors();

        invokeEditModal(true);
        let service = await ServicesService.getById(id);
        setEditModel(service.data);

    };
    const edit_OnSubmit = (data) => {
        let openModal = false;
        clearErrors();
        console.log(data);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("icon", data.icon);
        formData.append("isFeatured", data.isFeatured);
        formData.append("DetailedDesc", data.DetailedDesc);
        formData.append("description", data.Description);

        if (data.image[0] !== undefined) {
            formData.append("Image", data.image[0]);
        }
        else {
            formData.append("Image", null);
        }

        if (data.isFeatrued == undefined)
            formData.append("isFeatured", false);
        else
            formData.append("isFeatured", data.isFeatrued);

        ServicesService.edit(editModel.id, formData).then()
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
                getAllServices();
                setValue("image", []);
                setImageSrc("");
            });
    };


    //Delete
    const deleteService = (id) => {
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
                ServicesService.deleteService(id).then(() => {
                    getAllServices();
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
    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const servicesToDisplay = services.slice(startIndex, endIndex);


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
    const getAllServices = React.useCallback(() => {
        ServicesService.getAll().then(response => {

            setServices(response?.data);
        });
    }, []);


    React.useEffect(() => {
        getAllServices();

    }, []);

    React.useEffect(() => {
        if (editModel) {
            console.log(editModel);
            setValue("DetailedDesc", editModel.detailedDesc);
            setValue("Description", editModel.description);
            setValue("name", editModel.name);
            setValue("icon", editModel.icon);
            setValue("isFeatured", editModel.isFeatured);
            setValue("Image", editModel.image);
        }
    }, [editModel, isEditShow]);

    // Data validation rules
    let Name_maxlength = 50;
    let Icon_maxlength = 100;
    let Desc_maxlength = 500;
    let DetailedDesc_maxlength = 1000;

    return (
        <div className='d-flex justify-content-center flex-column '>
            <div className='text-end'>
                <Button onClick={initCreateModal}><FontAwesomeIcon icon={faSquarePlus} /></Button>
            </div>
            <div className="products row mt-2 gy-4">

                {
                    servicesToDisplay.map(service => (
                        <div key={service.id} className=" col-lg-4 p-3 " >

                            <div className='card h-100'>
                                <img src={service.imageUrl} className="product card-img-top" alt="..." />

                                <div className="card-body d-flex flex-column justify-content-between">
                                    <p className="card-title  text-decoration-none text-dark fw-semibold h5">{service.name}</p>
                                    <div className="card-text">

                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td>Icon</td>
                                                    <td>{service.icon}</td>
                                                </tr>
                                                <tr>
                                                    <td>Is Special</td>
                                                    <td>{service.isFeatured == true ? "Special" : "Ordinary"}</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                        <span >{service.Description}</span>
                                    </div>
                                    <div className='d-flex mt-4 justify-content-end'>

                                        <button onClick={() => openEditModal(service.id)} className="btn btn-primary   m-1 fw-semibold"><FontAwesomeIcon icon={faPencil} /></button>
                                        <button onClick={() => deleteService(service.id)} className="btn btn-danger m-1 fw-semibold"><FontAwesomeIcon icon={faTrashCan} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))

                }


            </div>

            {/* Pagination */}

            <br></br>
            {Math.ceil(services.length / itemsPerPage) !== 1 ? (<div>
                <ReactPaginate
                    pageCount={Math.ceil(services.length / itemsPerPage)}
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

            <Modal show={isEditShow}>
                <Modal.Header closeButton onClick={initEditModal}>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='editCategory' className='row' onSubmit={handleSubmit(edit_OnSubmit)} >


                        {/* name */}
                        <div className="my-3">
                            <label htmlFor="" className='form-label'>Name</label>
                            <input
                                placeholder=" Name"
                                className='form-control'
                                aria-invalid={errors.name ? "true" : "false"}
                                {...register("name", { required: "fullname field is required", maxLength: Name_maxlength })}
                            />
                            {errors.name && <small className='text-danger' role="alert">{errors?.name?.message}</small>}
                        </div>

                        {/* Icon */}
                        <div className="my-3">
                            <label htmlFor="" className='form-label'>Icon</label>

                            <input
                                placeholder=" Icon"
                                className='form-control'
                                aria-invalid={errors.icon ? "true" : "false"}
                                {...register("icon", { required: "Icon field is required", maxLength: Icon_maxlength })}
                            />
                            {errors.icon && <small className='text-danger' role="alert">{errors?.icon?.message}</small>}
                        </div>


                        {/* Desc */}
                        <div className="my-3">
                            <label htmlFor="" className='form-label'>Description</label>

                            <input
                                placeholder="Description"
                                className='form-control'
                                aria-invalid={errors.Description ? "true" : "false"}
                                {...register("Description", { required: "Description field is required", maxLength: Desc_maxlength })}
                            />
                            {errors.Description && <small className='text-danger' role="alert">{errors?.Description?.message}</small>}
                        </div>

                        {/* DetailedDesc */}
                        <div className="my-3">
                            <input type="hidden"
                                {...register("DetailedDesc", { required: "DetailedDesc field is required", maxLength: { DetailedDesc_maxlength } })}
                            />
                            <label className='form-label'>Detailed description</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={editModel.detailedDesc}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setValue("DetailedDesc", data);
                                }}

                            />
                            {errors.DetailedDesc && <small className='text-danger' role="alert">{errors.DetailedDesc.message}</small>}

                        </div>

                        {/* is featured */}
                        <div className="my-3">
                            <label htmlFor="" className='form-label d-block' >Is Special</label>
                            <input
                                type='checkbox'
                                aria-invalid={errors.isFeatured ? "true" : "false"}
                                {...register("isFeatured", { required: false })}
                            />
                            {errors.isFeatured && <small className='text-danger' role="alert">{errors?.isFeatured?.message}</small>}
                        </div>


                        {/*  Image */}
                        <div className="my-2 row align-items-center ">
                            <div className="col-6 mx-2">

                                <label htmlFor="" className='form-check-label'>Image</label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    className='form-control mt-2'
                                    aria-invalid={errors.image ? "true" : "false"}
                                    {...register("image", { required: false, onChange: (e) => { handleFileSelect(e); }, })}
                                />
                                {errors.image && <small className='text-danger' role="alert">{errors?.image?.message}</small>}

                            </div>

                            <div className="col">
                                {imageSrc.length > 0 ? (<>
                                    <img src={imageSrc} width="100" height="100" className='object-fit-cover' />
                                </>) : (<>
                                    <img src={editModel.imageUrl} width="100" height="100" className='object-fit-cover' />
                                </>)} </div>
                        </div>

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
                    <form id='createCategory' className='row' onSubmit={handleSubmit(create_OnSubmit)}  >


                        {/* name */}
                        <div className="my-3">
                            <input
                                placeholder=" Name"
                                className='form-control'
                                aria-invalid={errors.name ? "true" : "false"}
                                {...register("name", { required: "fullname field is required", maxLength: Name_maxlength })}
                            />
                            {errors.name && <small className='text-danger' role="alert">{errors?.name?.message}</small>}
                        </div>

                        {/* Icon */}
                        <div className="my-3">
                            <input
                                placeholder=" Icon"
                                className='form-control'
                                aria-invalid={errors.icon ? "true" : "false"}
                                {...register("icon", { required: "Icon field is required", maxLength: Icon_maxlength })}
                            />
                            {errors.icon && <small className='text-danger' role="alert">{errors?.icon?.message}</small>}
                        </div>


                        {/* Desc */}
                        <div className="my-3">
                            <input
                                placeholder="Desc"
                                className='form-control'
                                aria-invalid={errors.Description ? "true" : "false"}
                                {...register("Description", { required: "Desc field is required", maxLength: Desc_maxlength })}
                            />
                            {errors.Description && <small className='text-danger' role="alert">{errors?.Description?.message}</small>}
                        </div>

                        {/* DetailedDesc */}
                        <div className="my-3">
                            <input type="hidden"
                                {...register("DetailedDesc", { required: "DetailedDesc field is required", maxLength: { DetailedDesc_maxlength } })}
                            />
                            <label className='form-label'>Detailed description</label>
                            <CKEditor
                                editor={ClassicEditor}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setValue("DetailedDesc", data);
                                }}

                            />
                            {errors.DetailedDesc && <small className='text-danger' role="alert">{errors.DetailedDesc.message}</small>}

                        </div>

                        {/* is featured */}
                        <div className="my-3">
                            <label htmlFor="" className='form-label d-block' >Is Special</label>
                            <input
                                type='checkbox'
                                aria-invalid={errors.isFeatured ? "true" : "false"}
                                {...register("isFeatured", { required: false })}
                            />
                            {errors.isFeatured && <small className='text-danger' role="alert">{errors?.isFeatured?.message}</small>}
                        </div>


                        {/*  Image */}
                        <div className="my-2 row align-items-center ">
                            <div className="col-6 mx-2">

                                <label htmlFor="" className='form-check-label'>Image</label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    className='form-control mt-2'
                                    aria-invalid={errors.image ? "true" : "false"}
                                    {...register("image", { required: false, onChange: (e) => { handleFileSelect(e); }, })}
                                />
                                {errors.image && <small className='text-danger' role="alert">{errors?.image?.message}</small>}

                            </div>

                            <div className="col">
                                {imageSrc.length > 0 ? (<>
                                    <img src={imageSrc} width="100" height="100" className='object-fit-cover' />
                                </>) : (<></>)} </div>
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
export default ServiceList;