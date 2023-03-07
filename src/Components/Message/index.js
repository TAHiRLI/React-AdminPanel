import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button } from 'react-bootstrap';
import { MessageService } from '../../APIs/Services/MessageService';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faMailReply } from '@fortawesome/free-solid-svg-icons';


function MessageList() {

    const { register, handleSubmit, formState: { errors }, setValue, control, setError, clearErrors , reset} = useForm();

    // ==================
    // States 
    // ==================
    const [messages, setMessages] = React.useState([]);

    const [isEditShow, invokeEditModal] = React.useState(false);
    const [editModel, setEditModel] = React.useState({});


    const [currentPage, setCurrentPage] = React.useState(1);

    // ==================
    // Funcitons 
    // ==================




    // Edit

    const initEditModal = () => {
        return invokeEditModal(!isEditShow);
    };
    const openEditModal = async (id) => {
        clearErrors();

        invokeEditModal(true);
        let category = await MessageService.getById(id);
        setEditModel(category.data);

    };
    const edit_OnSubmit = (data) => {
        console.log("reply", data);
    
        let stayOpened = false;
        let formData = new FormData();
    
        formData.append("subject", data.subject);
        formData.append("text", data.text);
    
        MessageService.reply(data.id, formData).then(response => {
            Swal.fire(
                'Sent!',
                'Your Message has been sent',
                'success'
              );
        })
          .catch(err => {
    
            stayOpened = true;
            let { errors } = err.response.data;
    
            console.log(errors);
            for (const key in errors) {
              if (Object.hasOwnProperty.call(errors, key)) {
                const element = errors[key];
                setError(key, { type: 'custom', message: element.join(", ") });
              }
            }
          })
          .finally(() => {
            getAllMessages  ();
            invokeEditModal(stayOpened);
    
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
    const departmentsToDisplay = messages.slice(startIndex, endIndex);

    let order = startIndex + 1;

    // ==================
    // hooks 
    // ==================
    const getAllMessages = React.useCallback(() => {
        MessageService.getAll().then(response => {
            setMessages(response?.data);
        });
    }, []);

    React.useEffect(() => {
        getAllMessages();
    }, []);

    React.useEffect(() => {
        if (editModel) {
            setValue("id", editModel.id);
        }
    }, [editModel, isEditShow]);








    // Data validation rules
    let Subject_maxlength = 50;
    let Text_maxlength = 500;


    return (
        <div className='d-flex justify-content-center flex-column '>

            <table className='table table-light overflow-scroll'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Username</th>
                        <th>Phone</th>
                        <th className='text-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        departmentsToDisplay.map(item => (

                            <tr className='text-nowrap' key={item.id}>
                                <td>{order++}</td>
                                <td>{item.fullName}</td>
                                <td>{item.email}</td>
                                <td>{item.message}</td>
                                <td>{item.appUser?.userName ?? "Non-user"}</td>
                                <td>{item.phoneNumber}</td>
                                <td>
                                {!item.isReplied? (<>
                                    <button onClick={() => openEditModal(item.id)} className='btn btn-info mx-2 ' ><FontAwesomeIcon icon={faMailReply}/></button>
                                </>):(<></>)}
                                </td>
                            </tr>


                        ))
                    }

                </tbody>
            </table>

            {/* Pagination */}

            <br></br>
            {Math.ceil(messages.length / itemsPerPage) !== 1 ? (<div>
                <ReactPaginate
                    pageCount={Math.ceil(messages.length / itemsPerPage)}
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
                    <Modal.Title>Reply</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='reply' onSubmit={handleSubmit(edit_OnSubmit)} >
                        <input type="hidden"
                            {...register("id")}
                        />

                        {/* Subject */}
                        <div className="my-3">
                            <input
                                placeholder=" Subject"
                                className='form-control'
                                aria-invalid={errors.subject ? "true" : "false"}
                                {...register("subject", { required: "Email field is required", maxLength: Subject_maxlength })}
                            />
                            {errors.subject && <small className='text-danger' role="alert">{errors?.subject?.message}</small>}
                        </div>
                        {/* Text */}
                        <div className="my-3">
                            <input
                                placeholder=" Message"
                                className='form-control'
                                aria-invalid={errors.text ? "true" : "false"}
                                {...register("text", { required: "text field is required", maxLength: Text_maxlength })}
                            />
                            {errors.text && <small className='text-danger' role="alert">{errors?.text?.message}</small>}
                        </div>


                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={initEditModal}>
                        Cancel
                    </Button>
                    <Button variant="success" type='submit' form='reply' >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>






        </div>
    );
}

export default MessageList;