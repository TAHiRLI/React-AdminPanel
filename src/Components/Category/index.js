import React from 'react';
import { CategoryService } from '../../APIs/Services/CategoryService';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function CategoryList() {

    const { register, handleSubmit, formState: { errors } } = useForm();

    // ==================
    // States 
    // ==================
    const [categories, setCategories] = React.useState([]);

    const [isEditShow, invokeEditModal] = React.useState(false);
    const [editModel, setEditModel] = React.useState({});

    const [isCreateShow, invokeCreateModal] = React.useState(false);
    const [createModel, setCreateModel] = React.useState({});
    // ==================
    // Funcitons 
    // ==================


    //Create

    const initCreateModal = () => {
        return invokeCreateModal(!isCreateShow);
    };

    const create_OnSubmit = (data) => {
        let closeModal = false;
        console.log(data);
        let body = {
            name: data.name
        };
        CategoryService.create(body).then(response => {
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
    const openEditModal = (e) => {
        let name = e.target.getAttribute("edititem");
        let id = e.target.getAttribute("editid");
        initEditModal();
        setEditModel(
            {
                id: id,
                body: {
                    name: name
                }
            });
    };
    const edit_OnSubmit = (data) => {

        invokeEditModal(false);
        console.log("editdata", data);
        let body = {
            name: data.name
        };
        CategoryService.edit(editModel?.id, body).then(response => {
            console.log(response);
        })
            .catch(err => {
                alert(err);
                console.log(err);
            })
            .finally(() => {
                getAllCategories();
            });
    };


    //Delete
    const deleteCategory = (e) => {
        alert("are You Sure")
        let itemId = e.target.getAttribute("deleteid");
        CategoryService.deleteCategory(itemId).then(()=>{
            getAllCategories();
        });
    };





    // ==================
    // hooks 
    // ==================
    const getAllCategories = React.useCallback(() => {
        CategoryService.getAll().then(response => {

            setCategories(response?.data);
        });
    }, []);

    React.useEffect(() => {
        getAllCategories();
    }, []);



    // Data validation rules
    let Name_maxlength = 20;

    return (
        <div className='d-flex justify-content-center '>
            <div className='text-end'>
                <Button onClick={initCreateModal}>Create</Button>
            </div>
            <table className='table table-light'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.map(item => (

                            <tr key={item.id}>
                                <td>#</td>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>
                                    <button onClick={openEditModal} className='badge bg-info mx-2 ' editid={item.id} edititem={item.name}>edit</button>
                                    <button onClick={deleteCategory} className='badge bg-danger ' deleteid={item.id}>delete</button>
                                </td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>


            {/* edit */}

            <Modal show={isEditShow}>
                <Modal.Header closeButton onClick={initEditModal}>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='editCategory' onSubmit={handleSubmit(edit_OnSubmit)} >
                        <input type="hidden"
                            {...register("id")}
                            defaultValue={editModel?.id}
                        />
                        <input
                            defaultValue={editModel?.body?.name}
                            placeholder="Category Name"
                            className='form-control'
                            aria-invalid={errors.name ? "true" : "false"}
                            {...register("name", { required: "this field is required", maxLength: Name_maxlength })}
                        />
                        {errors.name && errors.name.type === "required" && <small className='text-danger' role="alert">{errors?.name?.message}</small>}
                        {errors.name && errors.name.type === "maxLength" && <small className='text-danger' role="alert">Max length must be {Name_maxlength} characters</small>}



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
                        {errors.name && errors.name.type === "required" && <small className='text-danger' role="alert">{errors?.name?.message}</small>}
                        {errors.name && errors.name.type === "maxLength" && <small className='text-danger' role="alert">Max length must be {Name_maxlength} characters</small>}



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

export default CategoryList;