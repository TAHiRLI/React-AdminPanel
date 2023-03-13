import React from 'react';
import { ProductService } from '../../APIs/Services/ProductService';
import { Modal, Button } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';

// Ck Editor 
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Swal from 'sweetalert2';


import "./product.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSquarePlus, faTrashCan, faPencil, faXmarkCircle, faRoadCircleXmark, faUnderline } from '@fortawesome/free-solid-svg-icons';
import { ProductCategoryService } from '../../APIs/Services/ProductCategoryService';


function ProductList() {
  const { register, handleSubmit, formState: { errors }, setValue, control, setError, clearErrors, reset } = useForm();

  // ==================
  // States 
  // ==================
  const [products, setProducts] = React.useState([]);
  const [productCategories, setProductCategories] = React.useState([]);

  const [isEditShow, invokeEditModal] = React.useState(false);
  const [editModel, setEditModel] = React.useState({});
  const [isCreateShow, invokeCreateModal] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);

  const [imageSrc, setImageSrc] = React.useState("");
  const [multiImageSrc, setMultiImageSrc] = React.useState([]);


  // ==================
  // Funcitons 
  // ==================


  //Create

  const initCreateModal = () => {
    setMultiImageSrc([])
    setImageSrc("");
    setValue("Id", "");
    setValue("Name", "");
    setValue("Desc", "");
    setValue("DiscountPercent", "");
    setValue("CostPrice", "");
    setValue("SalePrice", "");
    setValue("productCategoryId", "");

    return invokeCreateModal(!isCreateShow);
  };

  const create_OnSubmit = (data) => {
    let openModal = false;
    clearErrors();
    const formData = new FormData();
    formData.append("name", data.Name);
    formData.append("desc", data.Desc);
    formData.append("productCategoryId", data.productCategoryId);
    formData.append("costPrice", data.CostPrice);
    formData.append("salePrice", data.SalePrice);
    formData.append("discountPercent", data.DiscountPercent);
    formData.append("PosterImage", data.PosterImage[0]);
    formData.append("stockStatus", data.IsStocked);
    formData.append("isFeatured", data.IsFeatured);
    formData.append("isSoldIndividual", data.IsSoldIndividual);

    let imageCount = data.OtherImages?.length ?? 0;
    for (let i = 0; i < imageCount; i++) {
      formData.append("OtherImages", data.OtherImages[i]);
    }



    ProductService.create(formData).then(response => {
    })
      .catch(err => {
        openModal = true;
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
        invokeCreateModal(openModal);
        getAllProducts();
        setValue("PosterImage",[]);
        setImageSrc("")
        setValue("OtherImages",[])
      });
  };


  // Edit

  const initEditModal = () => {
    setMultiImageSrc([])
    setImageSrc("");
    if (isEditShow == true) {
      reset();
    }
    return invokeEditModal(!isEditShow);
  };
  const openEditModal = async (id) => {
    clearErrors();

    invokeEditModal(true);
    let product = await ProductService.getById(id);
    setEditModel(product.data);

  };
  const edit_OnSubmit = (data) => {
    console.log("Edit", data);

    let stayOpened = false;
    let formData = new FormData();

    formData.append("id", data.Id);
    formData.append("name", data.Name);
    formData.append("desc", data.Desc);
    formData.append("productCategoryId", data.productCategoryId);
    formData.append("costPrice", data.CostPrice);
    formData.append("salePrice", data.SalePrice);
    formData.append("discountPercent", data.DiscountPercent);
    formData.append("stockStatus", data.StockStatus);
    formData.append("isFeatured", data.IsFeaturedEdit);
    formData.append("isSoldIndividual", data.IsSoldIndividual);

    if (data.PosterImage[0] !== undefined) {
      formData.append("PosterImage", data.PosterImage[0]);
    }
    else {
      formData.append("PosterImage", null);
    }

    let imageCount = data.OtherImages?.length ?? 0;
    for (let i = 0; i < imageCount; i++) {
      formData.append("OtherImages", data.OtherImages[i]);
    }

    ProductService.edit(data.Id, formData).then(response => {
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
        reset();
        getAllProducts();
        invokeEditModal(stayOpened);
        setValue("PosterImage",[]);
        setImageSrc("")
        setValue("OtherImages",[])
      });
  };


  //Delete
  const deleteProduct = (id) => {
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
        ProductService.deleteProduct(id).then(() => {
          getAllCategories();
          getAllProducts();
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

  // Delete image
  const deleteImage = React.useCallback((id) => {
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
        $(`#image-${id}`).parent().addClass("d-none");
        ProductService.deleteImage(id).then(() => {
          getAllCategories();
          getAllProducts();
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
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


      }
    });
  }, []);


  // get stars
  const getStars = (rate) => {
    let content = [];
    for (let i = 0; i < 5; i++) {
      if (i >= rate)
        content.push(<i key={i} className="zmdi zmdi-star-outline text-primary "></i>);
      else
        content.push(<i key={i} className="zmdi zmdi-star text-primary "></i>);
    }
    return content;
  };







  //Pagination
  const handlePageChange = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToDisplay = products.slice(startIndex, endIndex);


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

  const handleMultiFileSelect = (event) => {
    setMultiImageSrc([])
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      const readers = Array.from(selectedFiles).map((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMultiImageSrc((prevImageSrcs) => [...prevImageSrcs, reader.result]);
        };
        reader.readAsDataURL(file);
        return reader;
      });
    }
  };

  // ==================
  // hooks 
  // ==================
  const getAllProducts = React.useCallback(() => {
    ProductService.getAll().then(response => {
      setProducts(response?.data);
    });
  }, []);

  const getAllCategories = React.useCallback(() => {
    ProductCategoryService.getAll().then(response => {

      setProductCategories(response?.data);
    });
  }, []);

  React.useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  React.useEffect(() => {
    if (isEditShow) {
      setValue("Id", editModel.id);
      setValue("Name", editModel.name);
      setValue("Desc", editModel.desc);
      setValue("DiscountPercent", editModel.discoutPercent);
      setValue("CostPrice", editModel.costPrice);
      setValue("SalePrice", editModel.salePrice);
      setValue("StockStatus", editModel.stockStatus);
      setValue("productCategoryId", editModel.productCategoryId);
      setValue("IsSoldIndividual", editModel.isSoldIndividual);
      setValue("IsFeatured", editModel.isFetaured);
      if (editModel.stockStatus == undefined) {
        setValue("StockStatus", false);
      }
      if (editModel.isFetaured == undefined) {
        setValue("IsFeatured", false);
      }
      if (editModel.isSoldIndividual == undefined) {
        setValue("IsSoldIndividual", false);
      }
    }

  }, [editModel, isEditShow]);

  // Data validation rules
  let Name_maxlength = 30;
  let Desc_maxLength = 300;




  return (
    <div className='d-flex justify-content-center flex-column container'>
      <div className='text-end mb-3'>
        <button onClick={initCreateModal} className='btn btn-primary text-light '><FontAwesomeIcon icon={faSquarePlus} /></button>
      </div>
      <div className="products row  gy-4">

        {
          productsToDisplay.map(product => (
            <div key={product.id} className=" col-lg-4 p-3 " >

              <div className='card h-100'>
                <a href={product.link}>   <img src={product.imageUrl} className="product card-img-top" alt="..." /></a>

                <div className="card-body d-flex flex-column justify-content-between">
                  <a href={product.link} className="card-title  text-decoration-none text-dark fw-semibold h5">{product.name}</a>
                  <div className="card-text">

                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Sale Price </td>
                          <td>${product.salePrice}</td>
                        </tr>
                        <tr>
                          <td>Cost Price</td>
                          <td>${product.costPrice}</td>
                        </tr>
                        <tr>
                          <td>Discount Percent</td>
                          <td>{product.discoutPercent}%</td>
                        </tr>
                        <tr>
                          <td>Rating</td>
                          <td className='text-nowrap'>
                            <div className='stars'>
                              {getStars(product.avgRating)}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>


                    <span dangerouslySetInnerHTML={{ __html: product.desc }}></span>
                  </div>
                  <div className='d-flex mt-4 justify-content-end'>

                    <button onClick={() => openEditModal(product.id)} className="btn btn-primary   m-1 fw-semibold"><FontAwesomeIcon icon={faPencil} /></button>
                    <button onClick={() => deleteProduct(product.id)} className="btn btn-danger m-1 fw-semibold"><FontAwesomeIcon icon={faTrashCan} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))

        }






      </div>

      {/* Pagination */}

      <br></br>
      {Math.ceil(products.length / itemsPerPage) !== 1 ? (<div>
        <ReactPaginate
          pageCount={Math.ceil(products.length / itemsPerPage)}
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

            {/* Name Input */}
            <div className="my-2">
              <label htmlFor="" className='form-label'>Name</label>
              <input
                placeholder="Name"
                className='form-control '
                aria-invalid={errors.Name ? "true" : "false"}
                {...register("Name", { required: "Name field is required", maxLength: Name_maxlength })}
              />
              {errors.Name && <small className='text-danger' role="alert">{errors.Name.message}</small>}

            </div>

            {/* Description */}
            <div className="my-2">
              <input type="hidden"
                {...register("Desc", { required: "Desc field is required", maxLength: { Desc_maxLength } })}
              />
              <label className='form-label'>Description</label>
              <CKEditor
                editor={ClassicEditor}
                data={editModel?.desc?.trim()}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setValue("Desc", data);
                }}

              />
              {errors.Desc && <small className='text-danger' role="alert">{errors.Desc.message}</small>}

            </div>

            {/* Prices  */}
            <div className="row my-2">
              {/* Cost Price Input */}
              <div className="col-4 px-1">

                <input
                  type="number"
                  placeholder="Cost Price"
                  className='form-control mt-2'
                  aria-invalid={errors.CostPrice ? "true" : "false"}
                  {...register("CostPrice", { required: "CostPrice field is required", min: 0 })}
                />
                {errors.CostPrice && <small className='text-danger' role="alert">{errors.CostPrice.message}</small>}

              </div>

              {/* Sale Price Input */}

              <div className="col-4 px-1">

                <input
                  type="number"
                  placeholder="Sale Price"
                  className='form-control mt-2'
                  aria-invalid={errors.SalePrice ? "true" : "false"}
                  {...register("SalePrice", { required: "SalePrice field is required", min: 0 })}
                />
                {errors.SalePrice && <small className='text-danger' role="alert">{errors.SalePrice.message}</small>}

              </div>

              {/* discount Percent Input */}
              <div className="col-4 px-1">


                <input
                  type="number"
                  placeholder="Discount Percent"
                  className='form-control mt-2'
                  aria-invalid={errors.DiscountPercent ? "true" : "false"}
                  {...register("DiscountPercent", { required: "DiscountPercent field is required", min: 0, max: 100 })}
                />
                {errors.DiscountPercent && <small className='text-danger' role="alert">{errors.DiscountPercent.message}</small>}

              </div>

            </div>

            {/* CategoryId */}
            <div className="my-2">
              <label htmlFor="" className='form-label'>Category</label>
              <select className='form-control'  {...register("productCategoryId", { required: "productCategoryId field is required" })}>
                {productCategories?.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {errors.productCategoryId && <small className='text-danger' role="alert">{errors.productCategoryId.message}</small>}

            </div>

            {/* Stock status */}
            <div className="my-2">
              <label htmlFor="" className='form-check-label'>Stock Status</label>

              <input
                type="checkbox"
                placeholder="StockStatus"
                className='d-block'
                aria-invalid={errors.StockStatus ? "true" : "false"}
                {...register("StockStatus", { required: false })}
              />

            </div>

            {/* Is Featured */}
            <div className="my-2">
              <label htmlFor="" className='form-check-label'>Is Special ?</label>

              <input
                type="checkbox"
                className='d-block'
                aria-invalid={errors.IsFeaturedEdit ? "true" : "false"}
                {...register("IsFeaturedEdit", { required: false })}
              />
              {errors.IsFeaturedEdit && errors.IsFeaturedEdit.type === "custom" && <small className='text-danger' role="alert">{errors.IsFeaturedEdit.message}</small>}

            </div>

            {/* Is Sold Individual */}
            <div className="my-2">
              <label htmlFor="" className='form-check-label'>Is Sold Individual ?</label>

              <input
                type="checkbox"
                placeholder="IsSoldIndividual"
                className='d-block'
                aria-invalid={errors.IsSoldIndividual ? "true" : "false"}
                {...register("IsSoldIndividual", { required: false })}
              />

            </div>

            {/* Poster Image */}
            <div className="my-2 row align-items-center ">
              <div className="col-3 mx-2">

                <label htmlFor="" className='form-check-label'>Main Image</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className='form-control mt-2'
                  aria-invalid={errors.PosterImage ? "true" : "false"}
                  {...register("PosterImage", { required: false, onChange: (e) => { handleFileSelect(e); },  })}
                />
              </div>
              <div className="col">
              {imageSrc.length > 0 ? (<>
                  <img src={imageSrc} width="100" height="100" className='object-fit-cover' />
                </>) : (<>  <img src={editModel?.productImages?.find(x => x?.isMain == true)?.imageUrl} width="100" height="100" className='object-fit-cover' /></>)} 
              </div>
            </div>

            {/* Other Images */}
            <div className="my-4 row align-items-center ">
              <div className="col-3">

                <label htmlFor="" className='form-check-label'>Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  className='form-control mt-2'
                  aria-invalid={errors.OtherImages ? "true" : "false"}
                  {...register("OtherImages", { required: false, onChange: (e) => { handleMultiFileSelect(e); }, })}
                />
              </div>
              <div className="col d-flex  overflow-auto flex-wrap">
                {editModel?.productImages?.map((item) =>

                (item.isMain == false ?
                  (<div key={item.id} className='mx-2 pos-relative p-3'>
                    <button onClick={() => deleteImage(item.id)} type='button' id={"image-" + item.id} className='pointer pos-absolute top-0 right-0 delete-image  border-0 ' >
                      <FontAwesomeIcon icon={faXmarkCircle} className='text-danger pointer-event-none' />

                    </button>
                    <img src={item?.imageUrl} width="100" height="100" className='object-fit-cover' />
                  </div>
                  ) : (<></>)
                )

                )
                }

                 {multiImageSrc.map((src, i)=>(
                <div className='mx-2' key={i}>
                <div  className='mx-2 pos-relative p-3'>
                    <img src={src} width="100" height="100" className='object-fit-cover' />
                  </div>
                </div>
              ))}
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
      <Modal dialogClassName="modal-width modal-xl" show={isCreateShow}>
        <Modal.Header closeButton onClick={initCreateModal}>
          <Modal.Title>Create</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id='createProduct' onSubmit={handleSubmit(create_OnSubmit)}  >

            {/* Name Input */}
            <div className="my-2">
              <label htmlFor="" className='form-label'>Name</label>
              <input
                placeholder="Name"
                className='form-control '
                aria-invalid={errors.Name ? "true" : "false"}
                {...register("Name", { required: "Name field is required", maxLength: Name_maxlength })}
              />
              {errors.Name && <small className='text-danger' role="alert">{errors.Name.message}</small>}

            </div>



            {/* Description */}
            <div className="my-2">
              <input type="hidden"
                {...register("Desc", { required: "Desc field is required", maxLength: { Desc_maxLengts: Desc_maxLength } })}
              />
              <label className='form-label'>Description</label>
              <CKEditor
                editor={ClassicEditor}
                // data={products[0]?.name}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setValue("Desc", data);
                }}

              />
              {errors.Desc && <small className='text-danger' role="alert">{errors.Desc.message}</small>}

            </div>

            {/* Prices  */}
            <div className="row my-2">
              {/* Cost Price Input */}
              <div className="col-4 px-1">

                <input
                  type="number"
                  placeholder="Cost Price"
                  className='form-control mt-2'
                  aria-invalid={errors.CostPrice ? "true" : "false"}
                  {...register("CostPrice", { required: "CostPrice field is required", min: 0 })}
                />
                {errors.CostPrice  && <small className='text-danger' role="alert">{errors.CostPrice.message}</small>}

              </div>

              {/* Sale Price Input */}

              <div className="col-4 px-1">

                <input
                  type="number"
                  placeholder="Sale Price"
                  className='form-control mt-2'
                  aria-invalid={errors.SalePrice ? "true" : "false"}
                  {...register("SalePrice", { required: "SalePrice field is required", min: 0 })}
                />
                {errors.SalePrice &&<small className='text-danger' role="alert">{errors.SalePrice.message}</small>}

              </div>

              {/* discount Percent Input */}
              <div className="col-4 px-1">


                <input
                  type="number"
                  placeholder="Discount Percent"
                  className='form-control mt-2'
                  aria-invalid={errors.DiscountPercent ? "true" : "false"}
                  {...register("DiscountPercent", { required: "DiscountPercent field is required", min: 0, max: 100 })}
                />
                {errors.DiscountPercent && <small className='text-danger' role="alert">{errors.DiscountPercent.message}</small>}

              </div>

            </div>

            {/* CategoryId */}
            <div className="my-2">
              <label htmlFor="" className='form-label'>Category</label>

              <select className='form-control'  {...register("productCategoryId", { required: "productCategoryId field is required" })}>
                {productCategories?.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {errors.productCategoryId && <small className='text-danger' role="alert">{errors.productCategoryId.message}</small>}

            </div>

            {/* Stock status */}
            <div className="my-2">
              <label htmlFor="" className='form-check-label'>Stock Status12</label>

              <input
                type="checkbox"
                placeholder="IsStocked"
                className='d-block'
                aria-invalid={errors.IsStocked ? "true" : "false"}
                {...register("IsStocked", { required: false, })}
              />
              {errors.IsStocked && <small className='text-danger' role="alert">{errors.IsStocked.message}</small>}

            </div>

            {/* Is Featured */}
            <div className="my-2">
              <label htmlFor="" className='form-check-label'>Is Special ?</label>

              <input
                type="checkbox"
                placeholder="IsFeatured"
                className='d-block'
                aria-invalid={errors.IsFeatured ? "true" : "false"}
                {...register("IsFeatured", { required: false, })}
              />
              {errors.IsFeatured &&  <small className='text-danger' role="alert">{errors.IsFeatured.message}</small>}

            </div>

            {/* Is Sold Individual */}
            <div className="my-2">
              <label htmlFor="" className='form-check-label'>Is Sold Individual ?</label>

              <input
                type="checkbox"
                placeholder="IsSoldIndividual"
                className='d-block'
                aria-invalid={errors.IsSoldIndividual ? "true" : "false"}
                {...register("IsSoldIndividual", { required: false, })}
              />

            </div>


            {/* Poster Image */}
            <div className="my-2 row align-items-center ">
              <div className="col-3 mx-2">

                <label htmlFor="" className='form-check-label'>Poster Image</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className='form-control mt-2'
                  aria-invalid={errors.PosterImage ? "true" : "false"}
                  {...register("PosterImage", { required: true, onChange: (e) => { handleFileSelect(e); }, })}
                />
              </div>
              <div className="col">
                {imageSrc.length > 0 ? (<>
                  <img src={imageSrc} width="100" height="100" className='object-fit-cover' />
                </>) : (<></>)} 
                </div>
              {errors.PosterImage && <small className='text-danger' role="alert">{errors.PosterImage.message}</small>}
            </div>

            {/* Other Images */}
            <div className="my-4 row align-items-center ">
              <div className="col-3">

                <label htmlFor="" className='form-check-label'>Stock Status</label>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  className='form-control mt-2'
                  aria-invalid={errors.OtherImages ? "true" : "false"}
                  {...register("OtherImages", { required: false, onChange: (e) => { handleMultiFileSelect(e); }, })}
                />
                {errors.OtherImages && <small className='text-danger' role="alert">{errors.OtherImages.message}</small>}

              </div>
              <div className="col d-flex ">
              {multiImageSrc.map((src,i)=>(
                <div key={i} className='mx-2'>
                  <img src={src} width="100" height="100" className='object-fit-cover' />
                </div>
              ))}
              </div>
            </div>

          
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