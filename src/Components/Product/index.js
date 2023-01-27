import React from 'react';
import { ProductService } from '../../APIs/Services/ProductService';
import { Modal, Button } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';

function ProductList() {
  const { register, handleSubmit, formState: { errors }, setValue, control , setError, clearErrors} = useForm({
    defaultValues: {
      StockStatus: false
    }
  });
  // const { register, handleSubmit, errors } = useController();
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
    setValue("name", "");
    setValue("CostPrice", "");
    setValue("SalePrice", "");
    setValue("DiscountPercent", "");
    setValue("CategoryId", "");
    setValue("id", "");
    setValue("StockStatus", "");

    return invokeCreateModal(!isCreateShow);
  };

  const create_OnSubmit = (data) => {
    let closeModal = false;
    const formData = new FormData();
    formData.append("ImageFile", data.ImageFile[0]);
    formData.append("name", data.name);
    formData.append("costPrice", data.CostPrice);
    formData.append("salePrice", data.SalePrice);
    formData.append("discountPercent", data.DiscountPercent);
    formData.append("categoryId", data.CategoryId);
    formData.append("stockStatus", data.StockStatus);


    ProductService.create(formData).then(response => {
    })
      .catch(err => {
    // clearErrors() need to invoked manually to remove that custom error 

        closeModal = true;
        let errors = err?.response?.data?.errors?.Name;
        errors?.forEach(element => {
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
  const openEditModal = async (id) => {
    clearErrors()

    invokeEditModal(true);
    let product = await ProductService.getById(id);

    setEditModel(product.data[0]);

  };
  const edit_OnSubmit = (data) => {
    let stayOpened= false;

    let formData = new FormData();
    if (data.ImageFile[0] !== undefined) {
      formData.append("ImageFile", data.ImageFile[0]);
    }
    else {
      formData.append("ImageFile", null);
    }
    formData.append("id", data.name);
    formData.append("name", data.name);
    formData.append("costPrice", data.CostPrice);
    formData.append("salePrice", data.SalePrice);
    formData.append("discountPercent", data.DiscountPercent);
    formData.append("categoryId", data.CategoryId);
    formData.append("stockStatus", data.StockStatus);

    ProductService.edit(data.id, formData).then(response => {
    })
      .catch(err => {
        setError("name", { type: "custom" }, { shouldFocus: true });
        stayOpened= true
        alert(err);
        console.log(err);
      })
      .finally(() => {
        getAllProducts();
       invokeEditModal(stayOpened);

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

  React.useEffect(() => {
    if (editModel) {
      setValue("id", editModel.id);
      setValue("name", editModel.name);
      setValue("CostPrice", editModel.costPrice);
      setValue("SalePrice", editModel.salePrice);
      setValue("DiscountPercent", editModel.discountPercent);
      setValue("StockStatus", editModel.stockStatus);
      setValue("CategoryId", editModel.categoryId);

    }
  }, [editModel, isEditShow]);



  //



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
                  <button onClick={() => openEditModal(item.id)} className='badge bg-info mx-2 '>edit</button>
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
            />

            <input
              placeholder="Product Name"
              className='form-control mt-2'
              aria-invalid={errors.name ? "true" : "false"}
              {...register("name", { required: "this field is required", maxLength: Name_maxlength })}
            />

            {errors.name && <p>{errors.name.message} and some</p>}

            {errors.name && errors.name.type === "custom" && <small className='text-danger' role="alert">{errors?.name?.message}</small>}
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
            {errors?.CostPrice && <div>Problem</div>}


            {/* Sale Price Input */}
            <input
              type="number"
              placeholder="sale Price"
              className='form-control mt-2'
              aria-invalid={errors.SalePrice ? "true" : "false"}
              {...register("SalePrice", { required: "this field is required", min: 0 })}
            />
            {errors?.SalePrice && <div>Problem</div>}


            {/* discount Percent Input */}
            <input
              type="number"
              placeholder="Discount percent"
              className='form-control mt-2'
              aria-invalid={errors.DiscountPercent ? "true" : "false"}
              {...register("DiscountPercent", { required: "this field is required", min: 0, max: 100 })}
            />
            {errors?.DiscountPercent && <div>Problem</div>}

            {/* Stock status */}
            <input
              type="checkbox"
              placeholder="StockStatus"
              {...register("StockStatus", {required:false})}

            />
            {errors?.StockStatus && <div>Problem</div>}
      
            {/* image */}
            <input
              type="file"
              className='form-control mt-2'
              aria-invalid={errors.ImageFile ? "true" : "false"}
              {...register("ImageFile", { required: false })}
            />
            {errors?.ImageFile && <div>Problem</div>}

            <input
              type="number"
              placeholder="CategoryId"
              className='form-control mt-2'
              aria-invalid={errors.CategoryId ? "true" : "false"}
              {...register("CategoryId", { required: "this field is required", })}
            />
            {errors?.CategoryId && <div>Problem</div>}

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
              {...register("StockStatus", { required: false, })}
            />

            {/* image */}
            <input
              type="file"
              className='form-control mt-2'
              aria-invalid={errors.ImageFile ? "true" : "false"}
              {...register("ImageFile", { required: false })}
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