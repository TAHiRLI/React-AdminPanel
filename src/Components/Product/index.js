import React from 'react';
import { ProductService } from '../../APIs/Services/ProductService';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function ProductList() {

  const { register, handleSubmit, formState: { errors } } = useForm();

  // ==================
  // States 
  // ==================
  const [products, setProducts] = React.useState([]);

  const [isEditShow, invokeEditModal] = React.useState(false);
  const [editModel, setEditModel] = React.useState({});

  const [isCreateShow, invokeCreateModal] = React.useState(false);
  // ==================
  // Funcitons 
  // ==================


  //Create

  const initCreateModal = () => {
    return invokeCreateModal(!isCreateShow);
  };

  const create_OnSubmit = (data) => {
    let closeModal = false;
    // let body = {
    //   Name: data.name,
    //   costPrice: data.CostPrice,
    //   salePrice:data.SalePrice,
    //   discountPercent:data.DiscountPercent,
    //   imageFile:data.ImageFile[0],
    //   categoryId: data.CategoryId,
    //   stockStatus: data.StockStatus
    // };

    const formData = new FormData()
    formData.append("ImageFile", data.ImageFile[0]);
    formData.append("name", data.name)
    formData.append("costPrice", data.CostPrice)
    formData.append("salePrice", data.SalePrice)
    formData.append("discountPercent", data.DiscountPercent)
    formData.append("categoryId", data.CategoryId)
    formData.append("stockStatus", data.StockStatus)
    console.log(formData);
    ProductService.create(formData).then(response => {
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
        getAllProducts();
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
    ProductService.edit(editModel?.id, body).then(response => {
      console.log(response);
    })
      .catch(err => {
        alert(err);
        console.log(err);
      })
      .finally(() => {
        getAllProducts();
      });
  };


  //Delete
  const deleteProduct = (e) => {
    alert("are You Sure");
    let itemId = e.target.getAttribute("deleteid");
    ProductService.deleteProduct(itemId).then(() => {
      getAllProducts();
    });
  };





  // ==================
  // hooks 
  // ==================
  const getAllProducts = React.useCallback(() => {
    ProductService.getAll().then(response => {

      setProducts(response?.data);
    });
  }, []);

  React.useEffect(() => {
    getAllProducts();
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
            <th>category İd</th>
            <th>Cost Price</th>
            <th>sale Price</th>
            <th>discoutn Percent</th>
            <th>Stock Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            products.map(item => (

              <tr key={item.id}>
                <td>#</td>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.categoryId}</td>
                <td>{item.costPrice}</td>
                <td>{item.salePrice}</td>
                <td>{item.discountPercent}</td>
                <td>{item.stockStatus ? (<div className='badge bg-success'>true</div>) : (<div className='badge bg-danger'>false</div>)}</td>
                <td>
                  <button onClick={openEditModal} className='badge bg-info mx-2 ' editid={item.id} edititem={item.name}>edit</button>
                  <button onClick={deleteProduct} className='badge bg-danger ' deleteid={item.id}>delete</button>
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
              className='form-control mt-2'
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
          <form id='createProduct' onSubmit={handleSubmit(create_OnSubmit)}  >

            {/* Name Input */}
            <input
              placeholder="Product Name"
              className='form-control mt-2'
              aria-invalid={errors.name ? "true" : "false"}
              {...register("name", { required: "this field is required", maxLength: Name_maxlength })}
            />
            {errors.name && errors.name.type === "required" && <small className='text-danger' role="alert">{errors?.name?.message}</small>}
            {errors.name && errors.name.type === "maxLength" && <small className='text-danger' role="alert">Max length must be {Name_maxlength} characters</small>}

            {/* Cost Price Input */}
            <input
              type="number"
              placeholder="cost Price"
              className='form-control mt-2'
              aria-invalid={errors.CostPrice ? "true" : "false"}
              {...register("CostPrice", { required: "this field is required", min: 0 })}
            />

            {/* Sale Price Input */}
            <input
              type="number"
              placeholder="sale Price"
              className='form-control mt-2'
              aria-invalid={errors.SalePrice ? "true" : "false"}
              {...register("SalePrice", { required: "this field is required", min: 0 })}
            />

            {/* discount Percent Input */}
            <input
              type="number"
              placeholder="Discount percent"
              className='form-control mt-2'
              aria-invalid={errors.DiscountPercent ? "true" : "false"}
              {...register("DiscountPercent", { required: "this field is required", min: 0, max: 100 })}
            />

            {/* Stock status */}
            <input
              type="checkbox"
              placeholder="StockStatus"
              className=''
              aria-invalid={errors.StockStatus ? "true" : "false"}
              {...register("StockStatus", { required: "this field is required", })}
            />

            {/* image */}
            <input
              type="file"
              className='form-control mt-2'
              aria-invalid={errors.ImageFile ? "true" : "false"}
              {...register("ImageFile", { required: false  })}
            />

            <input
              type="number"
              placeholder="CategoryId"
              className='form-control mt-2'
              aria-invalid={errors.CategoryId ? "true" : "false"}
              {...register("CategoryId", { required: "this field is required", })}
            />

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={initCreateModal}>
            Cancel
          </Button>
          <Button variant="success" type='submit' form='createProduct' >
            Save
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
}

export default ProductList;