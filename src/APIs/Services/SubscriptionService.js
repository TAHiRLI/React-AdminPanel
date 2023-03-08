import { HttpClient } from "../HttpClient/httpClient";

class subscriptionService extends HttpClient{
constructor() {
    super(`https://localhost:44317/api`);
}



async getAll(){
    return await this.get(`Subscriptions/all`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async deleteSubscribe (id){
    return await this.delete("Subscriptions",id, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }});
}

}


export const SubscriptionService = new subscriptionService();