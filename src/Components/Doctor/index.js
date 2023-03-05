import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button } from 'react-bootstrap';
import { DoctorService } from '../../APIs/Services/DoctorService';
import { DepartmentService } from '../../APIs/Services/DepartmentService';
import ReactPaginate from 'react-paginate';

// Ck Editor 
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Swal from 'sweetalert2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSquarePlus, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';


function DoctorList() {

    const { register, handleSubmit, formState: { errors }, setValue, control, setError, clearErrors } = useForm();

    // ==================
    // States 
    // ==================
    const [doctors, setDoctors] = React.useState([]);
    const [departments, setDepartments] = React.useState([]);

    const [isEditShow, invokeEditModal] = React.useState(false);
    const [editModel, setEditModel] = React.useState({});

    const [isCreateShow, invokeCreateModal] = React.useState(false);

    const [currentPage, setCurrentPage] = React.useState(1);

    // ==================
    // Funcitons 
    // ==================


    //Create

    const initCreateModal = () => {
        return invokeCreateModal(!isCreateShow);
    };

    const create_OnSubmit = (data) => {
        clearErrors();
        let openModal = false;
        clearErrors();
        console.log(data);


        const formData = new FormData();
        formData.append("fullname", data.fullname);
        formData.append("positon", data.positon);
        formData.append("office", data.office);
        formData.append("salary", data.salary);
        formData.append("meetingPrice", data.meetingPrice);
        formData.append("detailedDesc", data.detailedDesc);
        formData.append("email", data.email);
        formData.append("desc", data.desc);
        formData.append("instagram", data.instagram);
        formData.append("facebook", data.facebook);
        formData.append("twitter", data.twitter);
        formData.append("departmentId", data.departmentId);
        formData.append("Image", data.image[0]);

        if(data.isFeatrued == undefined)
        formData.append("isFeatured", false);
        else
        formData.append("isFeatured", data.isFeatrued);

        DoctorService.create(formData).then(response => {
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
                getAllDoctors();
                getAllDepartments();
            });
    };


    // Edit

    const initEditModal = () => {
        return invokeEditModal(!isEditShow);
    };
    const openEditModal = async (id) => {
        clearErrors();

        invokeEditModal(true);
        let doctor = await DoctorService.getById(id);
        setEditModel(doctor.data);

    };
    const edit_OnSubmit = (data) => {
        let openModal = false;
        clearErrors();
        console.log(data);

        const formData = new FormData();
        formData.append("fullname", data.fullname);
        formData.append("positon", data.positon);
        formData.append("office", data.office);
        formData.append("salary", data.salary);
        formData.append("meetingPrice", data.meetingPrice);
        formData.append("detailedDesc", data.detailedDesc);
        formData.append("email", data.email);
        formData.append("desc", data.desc);
        formData.append("isFeatured", data.isFeatured);
        formData.append("instagram", data.instagram);
        formData.append("facebook", data.facebook);
        formData.append("twitter", data.twitter);
        formData.append("departmentId", data.departmentId);

        if (data.image[0] !== undefined) {
            formData.append("Image", data.image[0]);
        }
        else {
            formData.append("Image", null);
        }


        DoctorService.edit(editModel.id, formData).then(response => {
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
                getAllDoctors();
                getAllDepartments();
            });
    };


    //Delete
    const deleteDoctor = (id) => {
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
                DoctorService.deleteDoctor(id).then(() => {
                    getAllDoctors();
                    getAllDepartments();
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
    const doctorsToDisplay = doctors.slice(startIndex, endIndex);

    // ==================
    // hooks 
    // ==================
    const getAllDoctors = React.useCallback(() => {
        DoctorService.getAll().then(response => {

            setDoctors(response?.data);
        });
    }, []);
    const getAllDepartments = React.useCallback(() => {
        DepartmentService.getAll().then(response => {
            setDepartments(response?.data);
        });
    }, []);

    React.useEffect(() => {
        getAllDoctors();
        getAllDepartments();
    }, []);

    React.useEffect(() => {
        if (editModel) {
            console.log(editModel);
            setValue("fullname", editModel.fullname);
            setValue("positon", editModel.positon);
            setValue("office", editModel.office);
            setValue("salary", editModel.salary);
            setValue("meetingPrice", editModel.meetingPrice);
            setValue("detailedDesc", editModel.detailedDesc);
            setValue("email", editModel.email);
            setValue("desc", editModel.desc);
            setValue("instagram", editModel.instagram);
            setValue("facebook", editModel.facebook);
            setValue("twitter", editModel.twitter);
            setValue("departmentId", editModel.departmentId);
            setValue("Image", editModel.image);


        }
    }, [editModel, isEditShow]);

    // Data validation rules
    let Name_maxlength = 30;
    let Positon_maxLength = 50;
    let Office_maxLength = 100;
    let Desc_maxlength = 200;
    let DetailedDesc_maxlength = 1000;
    let Email_maxLength = 50;
    let Instagram_maxLength = 100;
    let Facebook_maxLength = 100;
    let Twitter_maxLength = 100;

    return (
        <div className='d-flex justify-content-center flex-column '>
            <div className='text-end'>
                <Button onClick={initCreateModal}><FontAwesomeIcon icon={faSquarePlus} /></Button>
            </div>
            <div className="products row mt-2 gy-4">

                {
                    doctorsToDisplay.map(doctor => (
                        <div key={doctor.id} className=" col-lg-3 p-3 " >

                            <div className='card h-100'>
                                <a href={doctor.link}>   <img src={doctor.imageUrl} className="product card-img-top" alt="..." /></a>

                                <div className="card-body d-flex flex-column justify-content-between">
                                    <a href={doctor.link} className="card-title  text-decoration-none text-dark fw-semibold h5">{doctor.fullname}</a>
                                    <div className="card-text">

                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td>Department </td>
                                                    <td>{doctor.department?.name}</td>
                                                </tr>
                                                <tr>
                                                    <td>Position</td>
                                                    <td>{doctor.positon}</td>
                                                </tr>
                                                <tr>
                                                    <td>Office</td>
                                                    <td>{doctor.office}</td>
                                                </tr>

                                                <tr>
                                                    <td>Meeting Price </td>
                                                    <td>${doctor.meetingPrice}</td>
                                                </tr>

                                                <tr>
                                                    <td>Gender</td>
                                                    <td>{doctor.gender ? (<span>Male</span>) : (<>Female</>)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Count Of Blogs </td>
                                                    <td>{doctor.blogsCount}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <span >{doctor.desc}</span>
                                    </div>
                                    <div className='d-flex mt-4 justify-content-end'>

                                        <button onClick={() => openEditModal(doctor.id)} className="btn btn-primary   m-1 fw-semibold"><FontAwesomeIcon icon={faPencil} /></button>
                                        <button onClick={() => deleteProduct(doctor.id)} className="btn btn-danger m-1 fw-semibold"><FontAwesomeIcon icon={faTrashCan} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))

                }


            </div>

            {/* Pagination */}

            <br></br>
            {Math.ceil(doctors.length / itemsPerPage) !== 1 ? (<div>
                <ReactPaginate
                    pageCount={Math.ceil(doctors.length / itemsPerPage)}
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

            <Modal dialogClassName="modal-width modal-xl" show={isEditShow}>
                <Modal.Header closeButton onClick={initEditModal}>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='editCategory' className='row' onSubmit={handleSubmit(edit_OnSubmit)} >

                        <div className="col-md-6">

                            {/* Fullname */}
                            <div className="my-3">
                                <input
                                    placeholder=" Fullname"
                                    className='form-control'
                                    aria-invalid={errors.Fullname ? "true" : "false"}
                                    {...register("fullname", { required: "fullname field is required", maxLength: Name_maxlength })}
                                />
                                {errors.fullname && <small className='text-danger' role="alert">{errors?.fullname?.message}</small>}
                            </div>

                            {/* Position */}
                            <div className="my-3">
                                <input
                                    placeholder=" Positon"
                                    className='form-control'
                                    aria-invalid={errors.positon ? "true" : "false"}
                                    {...register("positon", { required: "Position field is required", maxLength: Positon_maxLength })}
                                />
                                {errors.positon && <small className='text-danger' role="alert">{errors?.positon?.message}</small>}
                            </div>

                            {/* office */}
                            <div className="my-3">
                                <input
                                    placeholder="Office"
                                    className='form-control'
                                    aria-invalid={errors.office ? "true" : "false"}
                                    {...register("office", { required: "Position field is required", maxLength: Office_maxLength })}
                                />
                                {errors.office && <small className='text-danger' role="alert">{errors?.office?.message}</small>}
                            </div>

                            {/* Desc */}
                            <div className="my-3">
                                <input
                                    placeholder="Desc"
                                    className='form-control'
                                    aria-invalid={errors.desc ? "true" : "false"}
                                    {...register("desc", { required: "Desc field is required", maxLength: Desc_maxlength })}
                                />
                                {errors.desc && <small className='text-danger' role="alert">{errors?.desc?.message}</small>}
                            </div>

                            {/* Salary */}
                            <div className="my-3">
                                <input
                                    placeholder="Salary"
                                    type="number"
                                    className='form-control'
                                    aria-invalid={errors.salary ? "true" : "false"}
                                    {...register("salary", { required: "Salary field is required" })}
                                />
                                {errors.salary && <small className='text-danger' role="alert">{errors?.salary?.message}</small>}
                            </div>

                            {/* MeetingPrice */}
                            <div className="my-3">
                                <input
                                    placeholder="MeetingPrice"
                                    type="number"
                                    className='form-control'
                                    aria-invalid={errors.meetingPrice ? "true" : "false"}
                                    {...register("meetingPrice", { required: "MeetingPrice field is required" })}
                                />
                                {errors.meetingPrice && <small className='text-danger' role="alert">{errors?.meetingPrice?.message}</small>}
                            </div>




                            {/* DetailedDesc */}
                            <div className="my-3">
                                <input type="hidden"
                                    {...register("detailedDesc", { required: "DetailedDesc field is required", maxLength: { DetailedDesc_maxlength } })}
                                />
                                <label className='form-label'>Detailed description</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={editModel.detailedDesc}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setValue("detailedDesc", data);
                                    }}

                                />
                                {errors.detailedDesc && <small className='text-danger' role="alert">{errors.detailedDesc.message}</small>}

                            </div>






                        </div>
                        <div className="col-md-6">




                            {/* Email */}
                            <div className="my-3">
                                <input
                                    placeholder=" Email"
                                    className='form-control'
                                    aria-invalid={errors.email ? "true" : "false"}
                                    {...register("email", { required: "Email field is required", maxLength: Email_maxLength })}
                                />
                                {errors.email && <small className='text-danger' role="alert">{errors?.email?.message}</small>}
                            </div>

                            {/* Instagram */}
                            <div className="my-3">
                                <input
                                    placeholder=" Instagram"
                                    className='form-control'
                                    aria-invalid={errors.instagram ? "true" : "false"}
                                    {...register("instagram", { required: false, maxLength: Instagram_maxLength })}
                                />
                                {errors.instagram && <small className='text-danger' role="alert">{errors?.instagram?.message}</small>}
                            </div>


                            {/* Facebook */}
                            <div className="my-3">
                                <input
                                    placeholder=" Facebook"
                                    className='form-control'
                                    aria-invalid={errors.facebook ? "true" : "false"}
                                    {...register("facebook", { required: false, maxLength: Facebook_maxLength })}
                                />
                                {errors.facebook && <small className='text-danger' role="alert">{errors?.facebook?.message}</small>}
                            </div>
                            {/* Twitter */}
                            <div className="my-3">
                                <input
                                    placeholder=" Twitter"
                                    className='form-control'
                                    aria-invalid={errors.twitter ? "true" : "false"}
                                    {...register("twitter", { required: false, maxLength: Twitter_maxLength })}
                                />
                                {errors.twitter && <small className='text-danger' role="alert">{errors?.twitter?.message}</small>}
                            </div>

                            {/* DepartmentId */}
                            <div className="my-3">
                                <select className='form-control'  {...register("departmentId", { required: "DepartmentId field is required" })}>
                                    {departments?.map(department => (
                                        <option key={department.id} value={department.id}>{department.name}</option>
                                    ))}
                                </select>
                                {errors.departmentId && <small className='text-danger' role="alert">{errors.departmentId.message}</small>}
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
                                        {...register("image", { required: false })}
                                    />
                                    {errors.image && <small className='text-danger' role="alert">{errors?.image?.message}</small>}

                                </div>

                                <div className="col">
                                    <img src={editModel.imageUrl} width="100" height="100" className='object-fit-cover' />
                                </div>
                            </div>





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
            <Modal dialogClassName='modal-xl' show={isCreateShow}>
                <Modal.Header closeButton onClick={initCreateModal}>
                    <Modal.Title>Create</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='createCategory' className='row' onSubmit={handleSubmit(create_OnSubmit)}  >
                        <div className="col-md-6">

                            {/* Fullname */}
                            <div className="my-3">
                                <input
                                    placeholder=" Fullname"
                                    className='form-control'
                                    aria-invalid={errors.Fullname ? "true" : "false"}
                                    {...register("fullname", { required: "fullname field is required", maxLength: Name_maxlength })}
                                />
                                {errors.fullname && <small className='text-danger' role="alert">{errors?.fullname?.message}</small>}
                            </div>

                            {/* Position */}
                            <div className="my-3">
                                <input
                                    placeholder=" Positon"
                                    className='form-control'
                                    aria-invalid={errors.positon ? "true" : "false"}
                                    {...register("positon", { required: "Position field is required", maxLength: Positon_maxLength })}
                                />
                                {errors.positon && <small className='text-danger' role="alert">{errors?.positon?.message}</small>}
                            </div>

                            {/* office */}
                            <div className="my-3">
                                <input
                                    placeholder="Office"
                                    className='form-control'
                                    aria-invalid={errors.office ? "true" : "false"}
                                    {...register("office", { required: "Position field is required", maxLength: Office_maxLength })}
                                />
                                {errors.office && <small className='text-danger' role="alert">{errors?.office?.message}</small>}
                            </div>

                            {/* Desc */}
                            <div className="my-3">
                                <input
                                    placeholder="Desc"
                                    className='form-control'
                                    aria-invalid={errors.desc ? "true" : "false"}
                                    {...register("desc", { required: "Desc field is required", maxLength: Desc_maxlength })}
                                />
                                {errors.desc && <small className='text-danger' role="alert">{errors?.desc?.message}</small>}
                            </div>

                            {/* Salary */}
                            <div className="my-3">
                                <input
                                    placeholder="Salary"
                                    type="number"
                                    className='form-control'
                                    aria-invalid={errors.salary ? "true" : "false"}
                                    {...register("salary", { required: "Salary field is required" })}
                                />
                                {errors.salary && <small className='text-danger' role="alert">{errors?.salary?.message}</small>}
                            </div>

                            {/* MeetingPrice */}
                            <div className="my-3">
                                <input
                                    placeholder="MeetingPrice"
                                    type="number"
                                    className='form-control'
                                    aria-invalid={errors.meetingPrice ? "true" : "false"}
                                    {...register("meetingPrice", { required: "MeetingPrice field is required" })}
                                />
                                {errors.meetingPrice && <small className='text-danger' role="alert">{errors?.meetingPrice?.message}</small>}
                            </div>




                            {/* DetailedDesc */}
                            <div className="my-3">
                                <input type="hidden"
                                    {...register("detailedDesc", { required: "DetailedDesc field is required", maxLength: { DetailedDesc_maxlength } })}
                                />
                                <label className='form-label'>Detailed description</label>
                                <CKEditor
                                    editor={ClassicEditor}

                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setValue("detailedDesc", data);
                                    }}

                                />
                                {errors.detailedDesc && <small className='text-danger' role="alert">{errors.detailedDesc.message}</small>}

                            </div>






                        </div>
                        <div className="col-md-6">




                            {/* Email */}
                            <div className="my-3">
                                <input
                                    placeholder=" Email"
                                    className='form-control'
                                    aria-invalid={errors.email ? "true" : "false"}
                                    {...register("email", { required: "Email field is required", maxLength: Email_maxLength })}
                                />
                                {errors.email && <small className='text-danger' role="alert">{errors?.email?.message}</small>}
                            </div>

                            {/* Instagram */}
                            <div className="my-3">
                                <input
                                    placeholder=" Instagram"
                                    className='form-control'
                                    aria-invalid={errors.instagram ? "true" : "false"}
                                    {...register("instagram", { required: false, maxLength: Instagram_maxLength })}
                                />
                                {errors.instagram && <small className='text-danger' role="alert">{errors?.instagram?.message}</small>}
                            </div>


                            {/* Facebook */}
                            <div className="my-3">
                                <input
                                    placeholder=" Facebook"
                                    className='form-control'
                                    aria-invalid={errors.facebook ? "true" : "false"}
                                    {...register("facebook", { required: false, maxLength: Facebook_maxLength })}
                                />
                                {errors.facebook && <small className='text-danger' role="alert">{errors?.facebook?.message}</small>}
                            </div>
                            {/* Twitter */}
                            <div className="my-3">
                                <input
                                    placeholder=" Twitter"
                                    className='form-control'
                                    aria-invalid={errors.twitter ? "true" : "false"}
                                    {...register("twitter", { required: false, maxLength: Twitter_maxLength })}
                                />
                                {errors.twitter && <small className='text-danger' role="alert">{errors?.twitter?.message}</small>}
                            </div>
                              


                            {/* DepartmentId */}
                            <div className="my-3">
                                <select className='form-control'  {...register("departmentId", { required: "DepartmentId field is required" })}>
                                    {departments?.map(department => (
                                        <option key={department.id} value={department.id}>{department.name}</option>
                                    ))}
                                </select>
                                {errors.departmentId && <small className='text-danger' role="alert">{errors.departmentId.message}</small>}
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
                                        {...register("image", { required: true })}
                                    />
                                    {errors.image && <small className='text-danger' role="alert">{errors?.image?.message}</small>}

                                </div>

                                <div className="col">
                                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL6WWzOmMEHgtjp2kTkkRhsusHBmNAVVFsfqwfSqAh&s' width="100" height="100" className='object-fit-cover' />
                                </div>
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
export default DoctorList;