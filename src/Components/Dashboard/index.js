import React from 'react';
import { Line, Doughnut, Circle } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function Dashboard() {


    //=====================
    // productsPerCategorie 
    //=====================

    const productsPerCategorieData = {
        labels: [
            'Red',
            'Blue',
            'Yellow'
        ],
        datasets: [{
            data: [300, 50, 100],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    };

    //=====================
    // Appointments
    //=====================

    const appointemtnsData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Sales',
                data: [5000, 8000, 6000, 7000, 9000, 8500],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                tension: 0.4,
                fill: true
            },
            {
                label: 'Expenses',
                data: [3000, 5000, 4000, 6000, 5500, 7000],
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
        scales: {
            xAxes: [
                {
                    gridLines: {
                        drawBorder: false,
                        display: false,
                    },
                    ticks: {
                        fontColor: '#666',
                        fontSize: 14,
                        fontStyle: 'bold',
                        maxRotation: 0,
                        minRotation: 0,
                    },
                },
            ],
            yAxes: [
                {
                    gridLines: {
                        drawBorder: false,
                        color: '#eee',
                        zeroLineColor: '#eee',
                        borderDash: [2],
                        borderDashOffset: [2],
                    },
                    ticks: {
                        fontColor: '#666',
                        fontSize: 14,
                        fontStyle: 'bold',
                        beginAtZero: true,
                        padding: 15,
                    },
                },
            ],
        },
    };


    //=====================
    // main Line
    //=====================
    const data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10'],
        datasets: [
            {
                label: 'Visitors',
                data: [150, 120, 45, 115, 190, 115, 280, 260, 285, 210],
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2
            },
            {
                label: 'Visitors',
                data: [10, 20, 45, 15, 90, 15, 80, 60, 285, 10],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
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
        scales: {
            xAxes: [{
                display: false,
                gridLines: {
                    display: false,
                }
            }],
            yAxes: [{
                display: false,
                ticks: {
                    beginAtZero: true,
                    max: 100,
                    stepSize: 20,
                    display: false,
                },
                gridLines: {
                    display: false,
                },
            }]
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
        <div className='container'>
            <div className="row">
                {/* productsPerCategorie */}
                <div className="col-lg-4 mt-3 mt-lg-0  ">
                    <div className="div card p-2 h-100">

                        <div className="col-lg-6 m-auto">

                            <Doughnut data={productsPerCategorieData} />
                        </div>
                    </div>
                </div>

                {/* Doctor Appointments */}
                <div className="col-lg-4 mt-3 mt-lg-0  ">
                    <div className="card p-2">
                        <Line options={appointemtnsOptions} data={appointemtnsData} />

                    </div>
                </div>
                {/* Sales Summary */}
                <div className="col-lg-4 mt-3 mt-lg-0   ">
                    <div className="card p-2 h-100">

                        <div class="card-body">
                            <h5 class="card-title">Sales Summary</h5>
                            <ul class="list-group">
                                <li class="list-group-item  border-0 d-flex justify-content-between align-items-center">
                                    <span className='fw-semibold'>Total Sales</span>
                                    <span class="badge bg-primary badge-pill ">$1000</span>
                                </li>
                                <li class="list-group-item border-0 d-flex justify-content-between align-items-center">
                                    <span className='fw-semibold'> Total Revenue</span>
                                    <span class="badge bg-success badge-pill">$50,000</span>
                                </li>
                                <li class="list-group-item border-0 d-flex justify-content-between align-items-center">
                                    <span className='fw-semibold'>Average Order Value</span>

                                    <span class="badge bg-info badge-pill">$50</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>




            </div>

            <div className="row mt-lg-4">
                <div className="col-lg-3">
                    <div className="card p-3 mt-4">
                        <div className="card-title">
                            <h5>Popular Products</h5>
                        </div>

                        <table className='table card-body'>
                            <thead>
                                <th>Product</th>
                                <th className='text-end'>Total</th>
                            </thead>
                            <tbody>
                                {/* Item */}
                                <tr>
                                    <td className='product-name fw-semibold text-primary'>Product name</td>
                                    <td className='product-totalPrice text-muted small text-end'>$800</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='product-name fw-semibold text-primary'>Product name</td>
                                    <td className='product-totalPrice text-muted small text-end'>$800</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='product-name fw-semibold text-primary'>Product name</td>
                                    <td className='product-totalPrice text-muted small text-end'>$800</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='product-name fw-semibold text-primary'>Product name</td>
                                    <td className='product-totalPrice text-muted small text-end'>$800</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='product-name fw-semibold text-primary'>Product name</td>
                                    <td className='product-totalPrice text-muted small text-end'>$800</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='product-name fw-semibold text-primary'>Product name</td>
                                    <td className='product-totalPrice text-muted small text-end'>$800</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='product-name fw-semibold text-primary'>Product name</td>
                                    <td className='product-totalPrice text-muted small text-end'>$800</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-lg-6 ">

                    <Line options={progressLineOptions} data={data} className='h-100' />
                </div>
                <div className="col-lg-3">
                    <div className="card mt-4 p-3">
                        <div className="card-title">
                            <h5>Most Appointed Doctors</h5>
                        </div>
                        <table className='table card-body'>
                            <thead>
                                <th>Doctor</th>
                                <th className='text-end'>Total</th>
                            </thead>
                            <tbody>
                                {/* Item */}
                                <tr>
                                    <td className='Doctor-name fw-semibold text-primary'>Doctor name</td>
                                    <td className=' text-muted small text-end'>15</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='Doctor-name fw-semibold text-primary'>Doctor name</td>
                                    <td className=' text-muted small text-end'>15</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='Doctor-name fw-semibold text-primary'>Doctor name</td>
                                    <td className=' text-muted small text-end'>15</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='Doctor-name fw-semibold text-primary'>Doctor name</td>
                                    <td className=' text-muted small text-end'>15</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='Doctor-name fw-semibold text-primary'>Doctor name</td>
                                    <td className=' text-muted small text-end'>15</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='Doctor-name fw-semibold text-primary'>Doctor name</td>
                                    <td className=' text-muted small text-end'>15</td>
                                </tr>
                                {/* Item */}
                                <tr>
                                    <td className='Doctor-name fw-semibold text-primary'>Doctor name</td>
                                    <td className=' text-muted small text-end'>15</td>
                                </tr>

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;