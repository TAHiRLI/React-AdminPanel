import { HttpClient } from "../HttpClient/httpClient";

class productService extends HttpClient{
constructor() {
    super(`https://localhost:44317/api`);
}



async getAll(){
    return await this.get(`Products/all`, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async getById(id){
    return  await this.get(`Products/${id}`,{
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }} )
}

async edit(id, body){
    return await this.put(`Products` , id,body,
    {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }
    })
}

async create(body){
    return await this.post('Products' , body, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }} )
}
async delete (id){
    return await this.delete("Products",id, {
        headers:{
            authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token")) }`
        }});
}

}


export const ProductService = new productService();