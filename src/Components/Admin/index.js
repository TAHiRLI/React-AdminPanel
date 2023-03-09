import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSquarePlus, faPencil } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../APIs/Services/UserService';


function AdminList() {
    const { register, handleSubmit, formState: { errors }, setValue, control, setError, clearErrors } = useForm();


    // ==================
    // States 
    // ==================
    const [users, setUsers] = React.useState([]);

    const [isEditShow, invokeEditModal] = React.useState(false);
    const [editModel, setEditModel] = React.useState({});

    const [isCreateShow, invokeCreateModal] = React.useState(false);

    const [currentPage, setCurrentPage] = React.useState(1);

    // ==================
    // Funcitons 
    // ==================
    //Create

    const initCreateModal = () => {
        clearErrors();
        setValue("Id", "");
        setValue("Fullname", "");
        setValue("email", "");
        setValue("username", "");
        setValue("PhoneNumber", "");
        return invokeCreateModal(!isCreateShow);
    };

    const create_OnSubmit = (data) => {
        clearErrors();
        let openModal = false;
        console.log(data);

        const formData = new FormData();
        formData.append("Fullname", data.Fullname);
        formData.append("Email", data.email);
        formData.append("Username", data.username);
        formData.append("Role", data.role);
        formData.append("PhoneNumber", data.PhoneNumber);
        formData.append("Image", data.image[0]);


        UserService.createAdmin(formData).then(response => {
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
                getAllUsers();
            });
    };


    // Edit
    const initEditModal = () => {
        return invokeEditModal(!isEditShow);
    };
    const openEditModal = async (id) => {
        clearErrors();

        invokeEditModal(true);
        let admin = await UserService.getById(id);
        console.log(admin.data)
        setEditModel(admin.data);

    };
    const edit_OnSubmit = (data) => {
        let openModal = false;
        clearErrors();
        console.log(data);

        const formData = new FormData();
        formData.append("Fullname", data.Fullname);
        formData.append("Email", data.email);
        formData.append("Username", data.username);
        formData.append("Role", data.role);
        formData.append("PhoneNumber", data.PhoneNumber);

        if (data.image[0] !== undefined) {
            formData.append("Image", data.image[0]);
        }
        else {
            formData.append("Image", null);
        }

        UserService.edit(editModel.id, formData).then(response => {
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
                getAllUsers();
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
    const usersToDisplay = users.slice(startIndex, endIndex);

    let order = startIndex + 1;

    // ==================
    // hooks 
    // ==================
    const getAllUsers = React.useCallback(() => {
        UserService.getAllAdmins().then(response => {
            setUsers(response?.data);
        });
    }, []);

    React.useEffect(() => {
        getAllUsers();
    }, []);

    React.useEffect(() => {
        if (isEditShow) {
            setValue("Id", editModel.id);
            setValue("Fullname", editModel.fullName);
            setValue("email", editModel.email);
            setValue("username", editModel.userName);
            setValue("role", editModel.role);
            setValue("PhoneNumber", editModel.phoneNumber);
        }

    }, [editModel, isEditShow]);


    // Data validation rules
    let Name_maxlength = 30;
    let Email_maxLength = 50;
    let Phone_maxlength = 20;

    return (
        <div className='d-flex justify-content-center flex-column '>
            <div className='text-end'>
                <Button onClick={initCreateModal}><FontAwesomeIcon icon={faSquarePlus} /></Button>
            </div>
            <table className='table table-light overflow-scroll'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Image</th>
                        <th>UserName</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        usersToDisplay.map(user => (

                            <tr className='text-nowrap' key={user.id}>
                                <td>{order++}</td>
                                <td><img src={user.imageUrl} width='70' height='70' className='rounded-circle' /></td>
                                <td>{user.userName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber ?? "Not defined"}</td>
                                <td>

                                    <button onClick={() => openEditModal(user.id)} className="btn btn-primary   m-1 fw-semibold"><FontAwesomeIcon icon={faPencil} /></button>

                                </td>

                            </tr>
                        ))
                    }

                </tbody>
            </table>

            {/* Pagination */}

            <br></br>
            {Math.ceil(users.length / itemsPerPage) !== 1 ? (<div>
                <ReactPaginate
                    pageCount={Math.ceil(users.length / itemsPerPage)}
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
                    <form id='editCategory' onSubmit={handleSubmit(edit_OnSubmit)} >

                        <input type="hidden" {...register("Id", { required: false })} />

                        {/* Fullname */}
                        <div className="my-3">
                            <input
                                placeholder=" Fullname"
                                className='form-control'
                                aria-invalid={errors.Fullname ? "true" : "false"}
                                {...register("Fullname", { required: "Fullname field is required", maxLength: Name_maxlength })}
                            />
                            {errors.Fullname && <small className='text-danger' >{errors?.Fullname?.message}</small>}
                        </div>
                        {/* Usernamee */}
                        <div className="my-3">
                            <input
                                placeholder=" UserName"
                                className='form-control'
                                aria-invalid={errors.userName ? "true" : "false"}
                                {...register("username", { required: "UserName field is required", maxLength: Name_maxlength })}
                            />
                            {errors.username && <small className='text-danger' >{errors?.username?.message}</small>}
                        </div>

                        {/* Phone Number */}
                        <div className="my-3">
                            <input
                                placeholder=" Phone"
                                className='form-control'
                                aria-invalid={errors.PhoneNumber ? "true" : "false"}
                                {...register("PhoneNumber", { required: "PhoneNumber field is required", maxLength: Phone_maxlength })}
                            />
                            {errors.PhoneNumber && <small className='text-danger' >{errors?.PhoneNumber?.message}</small>}
                        </div>







                        {/* Email */}
                        <div className="my-3">
                            <input
                                placeholder=" Email"
                                type="Email"
                                className='form-control'
                                aria-invalid={errors.email ? "true" : "false"}
                                {...register("email", { required: "Email field is required", maxLength: Email_maxLength })}
                            />
                            {errors.email && <small className='text-danger' >{errors?.email?.message}</small>}
                        </div>




                        {/* Role */}
                        <div className="my-3">
                            <label htmlFor="">Role</label>
                            <select className='form-control'  {...register("role", { required: "Role field is required" })}>
                                <option value='SuperAdmin' >Super Admin</option>
                                <option value='Admin' >Admin</option>
                            </select>
                            {errors.role && <small className='text-danger' >{errors.role.message}</small>}
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
                                {errors.image && <small className='text-danger' >{errors?.image?.message}</small>}

                            </div>

                            <div className="col">
                                <img src={editModel.imageUrl} width="100" height="100" className='object-fit-cover' />
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

                        {/* Fullname */}
                        <div className="my-3">
                            <input
                                placeholder=" Fullname"
                                className='form-control'
                                aria-invalid={errors.Fullname ? "true" : "false"}
                                {...register("Fullname", { required: "Fullname field is required", maxLength: Name_maxlength })}
                            />
                            {errors.Fullname && <small className='text-danger' >{errors?.Fullname?.message}</small>}
                        </div>
                        {/* Usernamee */}
                        <div className="my-3">
                            <input
                                placeholder=" UserName"
                                className='form-control'
                                aria-invalid={errors.userName ? "true" : "false"}
                                {...register("username", { required: "UserName field is required", maxLength: Name_maxlength })}
                            />
                            {errors.username && <small className='text-danger' >{errors?.username?.message}</small>}
                        </div>

                        {/* Phone Number */}
                        <div className="my-3">
                            <input
                                placeholder=" Phone"
                                className='form-control'
                                aria-invalid={errors.PhoneNumber ? "true" : "false"}
                                {...register("PhoneNumber", { required: "PhoneNumber field is required", maxLength: Phone_maxlength })}
                            />
                            {errors.PhoneNumber && <small className='text-danger' >{errors?.PhoneNumber?.message}</small>}
                        </div>







                        {/* Email */}
                        <div className="my-3">
                            <input
                                placeholder=" Email"
                                type="Email"
                                className='form-control'
                                aria-invalid={errors.email ? "true" : "false"}
                                {...register("email", { required: "Email field is required", maxLength: Email_maxLength })}
                            />
                            {errors.email && <small className='text-danger' >{errors?.email?.message}</small>}
                        </div>




                        {/* Role */}
                        <div className="my-3">
                            <label htmlFor="">Role</label>
                            <select className='form-control'  {...register("role", { required: "Role field is required" })}>
                                <option value='SuperAdmin' >Super Admin</option>
                                <option value='Admin' >Admin</option>
                            </select>
                            {errors.role && <small className='text-danger' >{errors.role.message}</small>}
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
                                {errors.image && <small className='text-danger' >{errors?.image?.message}</small>}

                            </div>

                            <div className="col">
                                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL6WWzOmMEHgtjp2kTkkRhsusHBmNAVVFsfqwfSqAh&s' width="100" height="100" className='object-fit-cover' />
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

export default AdminList;