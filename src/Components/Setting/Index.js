import React from 'react';
import { SettingService } from '../../APIs/Services/SettingService';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function SettingList() {

    const { register, handleSubmit, formState: { errors }, setValue,setError, clearErrors } = useForm();

    // ==================
    // States 
    // ==================
    const [settings, setSettings] = React.useState([]);

    const [isEditShow, invokeEditModal] = React.useState(false);
    const [editModel, setEditModel] = React.useState({});

    // ==================
    // Funcitons 
    // ==================


   


    // Edit

    const initEditModal = () => {
        return invokeEditModal(!isEditShow);
    };
    const openEditModal = async (id) => {
        clearErrors()
    
        invokeEditModal(true);
        let setting = await SettingService.getById(id);
        console.log(setting.data)
        setEditModel(setting.data);
    
      };
    const edit_OnSubmit = (data) => {

        invokeEditModal(false);
        console.log("editdata", data);
        let body = {
             value: data.value
         };
         SettingService.edit(editModel.id, body).then(response => {
             console.log(response);
         })
             .catch(err => {
                 alert(err);
                 console.log(err);
             })
             .finally(() => {
                 getAllSettings();
             });
    };


   




    // ==================
    // hooks 
    // ==================
    const getAllSettings = React.useCallback(() => {
        SettingService.getAll().then(response => {
            setSettings(response?.data);
        });
    }, []);

    React.useEffect(() => {
        getAllSettings();
    }, []);

    React.useEffect(() => {
        if (editModel) {
          setValue("id", editModel.id);
          setValue("value", editModel.value);
    
        }
        else if (!editModel){
            setValue("id", "");
            setValue("value", "");
        }
      }, [editModel, isEditShow]);
    



    // Data validation rules
    let Value_maxLength = 1000;

    return (
        <div className='d-flex justify-content-center '>
            <div className='text-end'>
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
                        settings.map(item => (

                            <tr key={item.id}>
                                <td>#</td>
                                <td>{item.key}</td>
                                <td>{item.value}</td>
                                <td>
                                    <button onClick={()=>{openEditModal(item.id)}} className='badge bg-info mx-2 ' >edit</button>
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
                    <form id='editValue' onSubmit={handleSubmit(edit_OnSubmit)} >
                        <input type="hidden"
                            {...register("id")}
                            defaultValue={editModel?.id}
                        />
                        <input
                            defaultValue={editModel?.value}
                            placeholder="Value"
                            className='form-control'
                            aria-invalid={errors.value ? "true" : "false"}
                            {...register("value", { required: "this field is required", maxLength: Value_maxLength })}
                        />
                        {errors.value && errors.value.type === "required" && <small className='text-danger' role="alert">{errors?.value?.message}</small>}
                        {errors.value && errors.value.type === "maxLength" && <small className='text-danger' role="alert">Max length must be {Value_maxLength} characters</small>}



                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={initEditModal}>
                        Cancel
                    </Button>
                    <Button variant="success" type='submit' form='editValue' >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    );
}

export default SettingList;