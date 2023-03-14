import React from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserService } from '../../APIs/Services/UserService';
import { ServicesService } from '../../APIs/Services/ServicesService';
import Swal from 'sweetalert2';
import { Modal, Button } from 'react-bootstrap';

import Loading from '../Loading';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faFileArrowDown, faXmark, faFileArrowUp, faPencil } from '@fortawesome/free-solid-svg-icons';


function UserExaminationList() {

    const location = useLocation();
    let userId = location.state.id;

    const { register, handleSubmit, formState: { errors }, setValue, control, setError, clearErrors } = useForm();

    //======================
    // States
    //======================

    const [exams, setExams] = React.useState([]);
    const [services, setServices] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [isCreateShow, invokeCreateModal] = React.useState(false);

    const [isEditShow, invokeEditModal] = React.useState(false);
    const [editModel, setEditModel] = React.useState({});


    //======================
    // Functions
    //======================

    //Create

    const initCreateModal = () => {
        setValue("File", [])
        setValue("serviceId", "");

        return invokeCreateModal(!isCreateShow);
    };

    const create_OnSubmit = (data) => {
        clearErrors();
        let openModal = false;
        clearErrors();
        console.log(data);

        const formData = new FormData();
        formData.append("ServiceId", data.serviceId);
        formData.append("AppUserId", userId);
        formData.append("File", data.File[0]);

        UserService.createExamination(formData).then()
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
                getAllExams(userId);
                getAllServices();
            });
    };


    // Edit

    const initEditModal = () => {
        setValue("File", [])
        return invokeEditModal(!isEditShow);
    };
    const openEditModal = async (id) => {
        clearErrors();

        invokeEditModal(true);
        let examination = await UserService.getExaminationById(id);
        setEditModel(examination.data);

    };
    const edit_OnSubmit = (data) => {
        let openModal = false;

        console.log(data);
        const formData = new FormData();
        formData.append("File", data.File[0]);
        formData.append("Serviceid", data.serviceId)
        UserService.editExamination(editModel.id, formData).then()
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
                getAllExams(userId);
                getAllServices();

            });
    };

    //Delete
    const rejectExamination = (id) => {
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
                UserService.rejectExamination(id).then(() => {
                    getAllExams(userId);
                    getAllServices();

                });
                Swal.fire(
                    'Rejected!',
                    'Examination Result Rejected',
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


    //File download
    const handleFileDownload = React.useCallback((id) => {
        UserService.downloadFile(id);
    });


    // get exams
    const getAllExams = React.useCallback((id) => {
        UserService.getExaminations(id).then(response => {
            console.log(response.data);
            setExams(response?.data);
        });
    }, []);

    const getAllServices = React.useCallback(() => {
        ServicesService.getAll().then(response => {
            setServices(response?.data);
        });
    }, []);
    //======================
    // Hooks
    //======================

    React.useEffect(() => {
        getAllExams(userId);
        getAllServices();
    }, []);


    React.useEffect(() => {
        if (editModel) {
            console.log(editModel);
            setValue("ServiceId", editModel.serviceId);
        }
    }, [editModel, isEditShow]);

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-xl-8">
            <div className="d-flex justify-content-end">
                <Button onClick={initCreateModal}  ><FontAwesomeIcon icon={faSquarePlus} /></Button>
            </div>
                    <table className='table table-light overflow-scroll'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th className='text-end'>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                exams.map((item, i) => (

                                    <tr className='text-nowrap ' key={item.id}>
                                        <td className='align-middle'>{i + 1}</td>

                                        <td className='align-middle'>{item.service?.name}</td>
                                        <td className='align-middle'>{item.createdAt}</td>
                                        {item.status != false ? (
                                            <td className='align-middle text-end'>

                                                {item.resultFileName?.length > 0 ? (<>
                                                    <Button onClick={() => handleFileDownload(item.id)} className='bg-success  btn text-light'  ><FontAwesomeIcon icon={faFileArrowDown} /></Button>
                                                </>) : (<>
                                                    <Button onClick={() => openEditModal(item.id)}   ><FontAwesomeIcon icon={faPencil} /></Button>
                                                </>)}
                                                <button onClick={() => rejectExamination(item.id)} className=' btn bg-danger mx-2  btn text-light'  ><FontAwesomeIcon icon={faXmark} /></button>
                                            </td>) : (<td></td>)}


                                    </tr>


                                ))
                            }

                        </tbody>
                    </table>
                </div>
                <div className="col-xl-4 p-2 rounded">
                    <div className="card overflow-auto">
                        <div className="card-header">
                            <p className="card-title text-center h3">User Info</p>
                        </div>
                        <div className="card-body">
                            <table className="table">
                                <tbody>
                                    {/* Email */}
                                    <tr>
                                        <td>UserName</td>
                                        <td className='text-end'>{exams[0]?.appUser?.userName}</td>
                                    </tr>
                                    {/* Fullname */}
                                    <tr>
                                        <td>Fullname</td>
                                        <td className='text-end'>{exams[0]?.appUser?.fullname}</td>
                                    </tr>

                                    {/* UserName */}
                                    <tr>
                                        <td>Email</td>
                                        <td className='text-end'>{exams[0]?.appUser?.email}</td>
                                    </tr>

                                </tbody>
                            </table>

                        </div>

                    </div>
                </div>
            </div>

            {loading ? (<><Loading /></>) : (<></>)}

            {/* Edit Modal*/}

            <Modal show={isEditShow}>
                <Modal.Header closeButton onClick={initEditModal}>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='editCategory' onSubmit={handleSubmit(edit_OnSubmit)} >

                      {/* ServiceId */}
                      <div className="my-3">
                            <select className='form-control'  {...register("serviceId", { required: "ServiceId field is required" })}>
                                {services?.map(service => (
                                    <option key={service.id} value={service.id}>{service.name}</option>
                                ))}
                            </select>
                            {errors.serviceId && <small className='text-danger' role="alert">{errors.serviceId.message}</small>}
                        </div>

                        {/* File */}
                        <div className="my-3">

                        <label htmlFor="" className='form-label'>File</label>
                        <input
                            type="file"
                            className='form-control mt-2'
                            aria-invalid={errors.File ? "true" : "false"}
                            {...register("File", { required: false})}
                        />
                        {errors.File && <small className='text-danger' role="alert">{errors?.File?.message}</small>}
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

                      
                        {/* ServiceId */}
                        <div className="my-3">
                            <select className='form-control'  {...register("serviceId", { required: "ServiceId field is required" })}>
                                {services?.map(service => (
                                    <option key={service.id} value={service.id}>{service.name}</option>
                                ))}
                            </select>
                            {errors.serviceId && <small className='text-danger' role="alert">{errors.serviceId.message}</small>}
                        </div>

                        {/* File */}
                        <div className="my-3">

                            <label htmlFor="" className='form-label'>File</label>
                            <input
                                type="file"
                                className='form-control mt-2'
                                aria-invalid={errors.File ? "true" : "false"}
                                {...register("File", { required: false})}
                            />
                            {errors.File && <small className='text-danger' role="alert">{errors?.File?.message}</small>}
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

export default UserExaminationList;