import { ROUTES } from "../../Consts/Routes";
import { HttpClient } from "../HttpClient/httpClient";

class categoryService extends HttpClient{
constructor() {
    super(`https://localhost:7057/admin/api`);
}



async getAll(){
    return await this.get(`categories/all`, {
        headers:{
            authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    })
}

async getById(id){
    return  await this.get(`categories/${id}`,{
        headers:{
            authorization: `Bearer ${sessionStorage.getItem("token")}`
        }} )
}

async edit(id, body){
    return await this.put(`Categories` , id,body,
    {
        headers:{
            authorization: `Bearer ${sessionStorage.getItem("token")}`,
            
        }
    })
}

async create(body){
    return await this.post('Categories' , body, {
        headers:{
            authorization: `Bearer ${sessionStorage.getItem("token")}`
        }} )
}
async deleteCategory (id){
    return await this.delete("Categories",id, {
        headers:{
            authorization: `Bearer ${sessionStorage.getItem("token")}`
        }});
}

}


export const CategoryService = new categoryService();