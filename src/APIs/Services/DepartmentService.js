import { HttpClient } from "../HttpClient/httpClient";

class departmentService extends HttpClient{
constructor() {
    super(`https://localhost:44317/api`);
}



async getAll(){
    return await this.get(`Departments/all`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async getById(id){
    return  await this.get(`Departments/${id}`,{
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }} )
}

async edit(id, body){
    return await this.put(`Departments` , id,body,
    {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async create(body){
    return await this.post('Departments' , body, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }} )
}
async deleteDepartment(id){
    return await this.delete("Departments",id, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }});
}

}


export const DepartmentService = new departmentService();