import { HttpClient } from "../HttpClient/httpClient";

class dashboardService extends HttpClient{
constructor() {
    super(`https://localhost:44317/api`);
}



async GetTopSoldCategories(){
    return await this.get(`Dashboard/TopProductCategories`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}


async GetTopSoldProducts(){
    return await this.get(`Dashboard/TopProducts`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async GetReviews(){
    return await this.get(`Dashboard/ReviewsByMonth`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async GetSales(){
    return await this.get(`Dashboard/SalesByMonth`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async GetAppointmentPayments(){
    return await this.get(`Dashboard/AppointmentPaymentsByMonth`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async GetTopDoctors(){
    return await this.get(`Dashboard/TopDoctors`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}
async GetSalesSummary(){
    return await this.get(`Dashboard/SalesSummary`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}


}


export const DashboardService = new dashboardService();