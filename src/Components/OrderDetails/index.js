import React from 'react';
import { useLocation } from 'react-router-dom';
import { OrderService } from '../../APIs/Services/OrderService';
import Swal from 'sweetalert2';

import { useDispatch, useSelector } from 'react-redux';
import Loading from '../Loading';


function OrderDetails() {
    const { isLoading } = useSelector(state => state);
    const myDispatch = useDispatch();

    const location = useLocation();
    let id = location.state.id;

    const [order, setOrder] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const getOrder = React.useCallback((id) => {
        OrderService.getById(id).then(response => {
            console.log(response.data);
            setOrder(response?.data);
        });
    }, []);

    const approveOrder = React.useCallback(async (orderId) => {

        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                setLoading(true);
                await OrderService.approveOrder(orderId);
                getOrder(id);
                Swal.fire(
                    'Approved!',
                    'Order has been Approved.',
                    'success'
                );
            }
        } catch (err) {
            Swal.fire(
                'Error!',
                'Something went wrong',
                'error'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const rejectOrder = React.useCallback(async (orderId) => {

        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                setLoading(true);
                await OrderService.rejectOrder(orderId);
                getOrder(id);
                Swal.fire(
                    'Rejected!',
                    'Order has been Rejected.',
                    'success'
                );
            }
        } catch (err) {
            Swal.fire(
                'Error!',
                'Something went wrong',
                'error'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        getOrder(id);
    }, []);


    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-md-8">
                    <table className='table table-light overflow-scroll'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Cost Price</th>
                                <th>Sale Price</th>
                                <th>Discount Percent</th>
                                <th>Count</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                order.orderItems?.map((item, i) => (

                                    <tr className='text-nowrap ' key={item.id}>
                                        <td className='align-middle'>{i + 1}</td>
                                        <td>
                                            <img src={item.product?.imageUrl} width="70" height="70"></img>
                                        </td>
                                        <td className='align-middle'><a href={item.product?.link}>{item.product?.name}</a></td>
                                        <td className='align-middle'>${item.costPrice?.toFixed(2)}</td>
                                        <td className='align-middle'>${item.salePrice?.toFixed(2)}</td>
                                        <td className='align-middle'>{item.discountPercent?.toFixed(2)}%</td>
                                        <td className='align-middle'>{item.count} x</td>

                                    </tr>


                                ))
                            }

                        </tbody>
                    </table>
                </div>
                <div className="col-md-4 bg-success p-2 rounded">
                    <div className="card">
                        <div className="card-header">
                            <p className="card-title text-center h3">Order Info</p>
                        </div>
                        <div className="card-body">
                            <table className="table">
                                <tbody>
                                    {/* Fullname */}
                                    <tr>
                                        <td>Fullname</td>
                                        <td className='text-end'>{order.fullname}</td>
                                    </tr>
                                    {/* Email */}
                                    <tr>
                                        <td>Email</td>
                                        <td className='text-end'>{order.email}</td>
                                    </tr>
                                    {/* Phone */}
                                    <tr>
                                        <td>Phone</td>
                                        <td className='text-end'>{order.phoneNumber}</td>
                                    </tr>
                                    {/* Address 1 */}
                                    <tr>
                                        <td>Address 1</td>
                                        <td className='text-end'>{order.address1}</td>
                                    </tr>
                                    {/* Address 2 */}
                                    <tr>
                                        <td>Address 2</td>
                                        <td className='text-end'>{order.address2}</td>
                                    </tr>
                                    {/* Zip Code */}
                                    <tr>
                                        <td>Zip Code</td>
                                        <td className='text-end'>{order.zipCode}</td>
                                    </tr>
                                    {/* Order Status */}
                                    <tr>
                                        <td>Order Status</td>
                                        <td className='d-flex justify-content-end'>{order.orderStatus == true ? (<div className='badge bg-success'>Approved</div>) : order.orderStatus == false ? (<div className='badge bg-danger'>Rejected</div>) : (<div className='badge bg-warning'>Pending</div>)}</td>

                                    </tr>
                                </tbody>
                            </table>
                            <p className='px-2'>
                                <strong>Note:</strong>
                                {order.note}
                            </p>
                        </div>

                        {order.orderStatus == null ? (<><div className="d-flex justify-content-end card-footer ">
                            <button onClick={() => rejectOrder(order.id)} className='mx-2 btn btn-danger'>Reject</button>
                            <button onClick={() => approveOrder(order.id)} className='mx-2 btn btn-success'>Approve</button>
                        </div></>) : (<></>)}

                    </div>
                </div>
            </div>

            {loading ? (<><Loading /></>) : (<></>)}

        </div>
    );
}

export default OrderDetails;