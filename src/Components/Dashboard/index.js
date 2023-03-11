import React from 'react';
import { Line, Doughnut, Circle } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { DashboardService } from '../../APIs/Services/DashboardService';

function Dashboard() {

    const [topCategories, setTopCategories] = React.useState([]);
    const [topProducts, setTopProducts] = React.useState([]);
    const [topDoctors, setTopDoctors] = React.useState([]);
    const [reviews, setReviews] = React.useState([]);
    const [sales, setSales] = React.useState([]);
    const [salesSummary, setSalesSummary] = React.useState([]);
    const [appointmentPayments, setAppointmentPayments] = React.useState([]);



    // productsPerCategorie 
    const getTopCategoires = React.useCallback(() => {
        DashboardService.GetTopSoldCategories().then((res) => {
            console.log("Categoires", res.data);
            setTopCategories(res.data);
        });
    });


    // products
    const getTopProducts = React.useCallback(() => {
        DashboardService.GetTopSoldProducts().then((res) => {
            console.log("Products", res.data);
            setTopProducts(res.data);
        });
    });

    // Reviews
    const getReviews = React.useCallback(() => {
        DashboardService.GetReviews().then((res) => {
            console.log("Reviews", res.data);
            setReviews(res.data);
        });
    });

    // Sales
    const getSales = React.useCallback(() => {
        DashboardService.GetSales().then((res) => {
            console.log("Sales", res.data);
            setSales(res.data);
        });
    });

    // Appointment Payments
    const getAppointmentPayments = React.useCallback(() => {
        DashboardService.GetAppointmentPayments().then((res) => {
            console.log("AppoitmentPayments", res.data);
            setAppointmentPayments(res.data);
        });
    });

    // Top Doctors
    const getTopDoctors = React.useCallback(()=>{
        DashboardService.GetTopDoctors().then((res) => {
            console.log("Doctors", res.data);
            setTopDoctors(res.data);
        });
    })

    // Sales Summary

    const getSalesSummary = React.useCallback(()=>{
        DashboardService.GetSalesSummary().then((res) => {
            console.log("SalesSummary", res.data);
            setSalesSummary(res.data);
        });
    })

    React.useEffect(() => {
        getAppointmentPayments();
        getTopCategoires();
        getTopProducts();
        getSalesSummary();
        getTopDoctors();
        getReviews();
        getSales();
    }, []);





    //=====================
    // ProductsPerCategorie 
    //=====================

    const productsPerCategorieData = {
        labels: topCategories.map(item => item.categoryName),
        datasets: [{
            data: topCategories.map(item => item.totalRevenue),
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(105, 205, 86)',
            ],
            hoverOffset: 10
        }]
    };


    //=====================
    // Reviews
    //=====================

    const reviewsData = {
        labels: Object.keys(reviews?.allReviews ?? {}),
        datasets: [
            {
                label: 'Approved',
                data: Object.values(reviews?.approved ?? {}),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                tension: 0.4,
                fill: true
            },
            {
                label: 'Rejected',
                data: Object.values(reviews?.rejected ?? {}),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                tension: 0.4,
                fill: true
            }
        ]
    };
    const appointemtnsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        tooltips: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#333',
            titleFontColor: '#fff',
            bodyFontColor: '#fff',
            footerFontColor: '#fff',
            titleFontSize: 16,
            bodyFontSize: 14,
            footerFontSize: 12,
            bodySpacing: 10,
            xPadding: 12,
            yPadding: 12,
            cornerRadius: 4,
            displayColors: false,
        },

    };


    //=====================
    // General statistics
    //=====================
    const generalStatistics = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Sales',
                data: Object.values(sales),
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2
            },
            {
                label: 'Appointment Payment',
                data: Object.values(appointmentPayments),
                backgroundColor: 'rgba(51, 255, 147, 0.2)',
                borderColor: 'rgba(51, 255, 147, 1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2
            }
        ]
    };
    const progressLineOptions = {
        animation: {
            duration: 2000, // in milliseconds
            easing: 'easeInOutQuad' // animation easing function
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },

        tooltips: {
            enabled: false
        },
        hover: {
            mode: null
        },
        elements: {
            line: {
                tension: 0.4,
                borderWidth: 3,
                borderColor: '#3e3e3e',
                backgroundColor: 'transparent',
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 10,
                backgroundColor: '#3e3e3e',
                hoverBackgroundColor: '#3e3e3e'
            }
        }
    };



    return (
        <div className='container-fluid'>
            <div className="row">
                {/* productsPerCategorie */}
                <div className="col-lg-4 mt-3 mt-lg-0  ">
                    <div className="div card p-2 h-100">

                        <div className="col-lg-6 col-md-8  m-auto">

                            <Doughnut data={productsPerCategorieData} className="w-full"  />
                        </div>
                    </div>
                </div>

                {/* Doctor Appointments */}
                <div className="col-lg-4 mt-3 mt-lg-0  ">
                    <div className="card p-2 h-100">
                        <Line options={appointemtnsOptions} data={reviewsData}  />

                    </div>
                </div>
                {/* Sales Summary */}
                <div className="col-lg-4 mt-3 mt-lg-0   ">
                    <div className="card p-2 h-100">

                        <div className="card-body">
                            <h5 className="card-title">Sales Summary</h5>
                            <ul className="list-group">
                                <li className="list-group-item  border-0 d-flex justify-content-between align-items-center">
                                    <span className='fw-semibold'>Total Sales</span>
                                    <span className="badge bg-primary badge-pill ">${salesSummary.totalSale}</span>
                                </li>
                                <li className="list-group-item border-0 d-flex justify-content-between align-items-center">
                                    <span className='fw-semibold'> Total Revenue</span>
                                    <span className="badge bg-success badge-pill">${salesSummary.totalRevenue}</span>
                                </li>
                                <li className="list-group-item border-0 d-flex justify-content-between align-items-center">
                                    <span className='fw-semibold'>Average Order Value</span>

                                    <span className="badge bg-info badge-pill">${salesSummary.averageOrder}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>




            </div>

            <div className="row mt-lg-4">
                <div className="col-xl-3">
                    <div className="card p-3 mt-4">
                        <div className="card-title">
                            <h5>Popular Products</h5>
                        </div>

                        <table className='table card-body'>
                            <thead>
                                <tr>

                                    <th>Product</th>
                                    <th>Count</th>
                                    <th className='text-end'>Total</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    topProducts.map((product, i) => (
                                        <tr key={i}>
                                            <td className='product-name fw-semibold text-primary'>{product.product?.name}</td>
                                            <td className='product-totalPrice text-muted small text-end'>{product.countOfOrders}x</td>
                                            <td className='product-totalPrice text-muted small text-end'>${product.totalIncome}</td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-xl-6 ">

                    <Line options={progressLineOptions} data={generalStatistics} className='h-100' />
                </div>
                <div className="col-xl-3">
                    <div className="card mt-4 p-3">
                        <div className="card-title">
                            <h5>Most Appointed Doctors</h5>
                        </div>
                        <table className='table card-body'>
                            <thead>
                                <tr>

                                    <th>Doctor</th>
                                    <th>Count</th>
                                    <th className='text-end'>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                            {topDoctors.map(doctor=>(
                                 <tr key={doctor.id}>
                                    <td className='Doctor-name fw-semibold text-primary'>{doctor.name}</td>
                                    <td className=' text-muted small text-end'>{doctor.countOfAppointments}x</td>
                                    <td className=' text-muted small text-end'>${doctor.totalPaid}</td>
                                </tr>
                            ))}
                               

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;