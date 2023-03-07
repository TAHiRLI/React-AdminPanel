import { HttpClient } from "../HttpClient/httpClient";

class userService extends HttpClient{
constructor() {
    super(`https://localhost:44317/api`);
}



async getAll(){
    return await this.get(`Users/all`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async createAdmin(body){
    return await this.post('Users/Admin' , body, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }} )
}

async edit(id, body){
    return await this.put(`Users/Admin` , id,body,
    {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async getAllAdmins(){
    return await this.get(`Users/Admins/all`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}
async getById(id){
    return  await this.get(`Users/${id}`,{
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }} )
}



}


export const UserService = new userService();